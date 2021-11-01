
import './TopUsageGraph.scss'
import { rollups, sum, extent, mean } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import { useState, useRef } from 'react'
import { animated, useSpring, useSprings} from 'react-spring'
import subcategoryColorScale from './subcategoryColorScale'
import ColorLegend from './ColorLegend'

const colors = {
  'Fossil Fuel': '#EFC1A8',
  'Clean': '#99DEE3',
  'Other': '#6ABEF0',
}
const typesSorted = ['Fossil Fuel', 'Clean', 'Other']
const rowHeight = 30
function AnimatedRow(props) {
  const { groups, groupIndex, xScale, isBank, margins, width, hoverGroup, singleEnergyType, splitBarGraph } = props

  const name = groups[0][0]
  const values = groups.map(group => group[1])
  const y = groupIndex * rowHeight
  let barX = 0

  const flatValues = values.flat()
  const valueSprings = useSprings(flatValues.length, flatValues.map(([type, amount]) => {
    const width = xScale(amount)
    const x = barX
    barX += width
    return {x, width}
  }))
  const bars = flatValues.map(([type, amount], index) => {
    // const width = xScale(amount)
    // const x = barX
    // barX += width
    const fill = singleEnergyType ? subcategoryColorScale(type) : colors[type]
    const barHeight = rowHeight * 0.8
    return (
      <animated.g key={type} transform={valueSprings[index].x.to(x => `translate(${x}, 0)`)} >
        <animated.rect width={valueSprings[index].width} height={barHeight} fill={fill} />
      </animated.g>
    )
  })
  let label = name
  if (isBank) {
    label = name.split(' ').map(word => word.charAt(0)).join('')
  } else {
    label = name.split(' ').map((word, wordIndex, words) =>
      <tspan key={wordIndex} x="-15" dy={(wordIndex * 16) - ((words.length - 1) * 4)}>{word}</tspan>
    )
  }
  const ySpring = useSpring({
    to: {
      y,
    },
    config: {
      ease: t => t*t * t,
      duration: 250,
    }
  })
  return (
    <animated.g
      onMouseOver={hoverGroup(name, values)}
      onMouseMove={hoverGroup(name, values)}
      onMouseOut={hoverGroup(null)}
      className='dataRow'
      key={name}
      transform={ySpring.y.to(y => `translate(0, ${y})`)}
    >
      <rect x={-margins.left} width={width + margins.left + margins.right} height={rowHeight} fill='transparent' />
      <text x={-5} textAnchor='end' y={rowHeight / 2}>{label}</text>

      {bars}
    </animated.g>
  )
}

export default function TopUsageGraph(props) {
  const { width, data, isBank, selectedEnergyTypes, aggregationType, barGraphStyle } = props
  const splitBarGraph = barGraphStyle === 'split'

  const yearRows = splitBarGraph ? [
    { startYear: 2013, endYear: 2016},
    { startYear: 2017, endYear: 2020},
  ] : [{ startYear: 2013, endYear: 2020}]

  const [hoveredGroup, setHoveredGroup] = useState(null)
  const singleEnergyType = selectedEnergyTypes.length === 1
  let categoryFilteredData = data.filter(d => selectedEnergyTypes.includes(d.category))
  let categoryAccessor = singleEnergyType ? d => d['category detail'] : d => d.category
  const categoryList = Array.from(new Set(categoryFilteredData.map(categoryAccessor))).sort()

  const groupRows = yearRows.map(({startYear, endYear}) => {

    let filteredData = categoryFilteredData.filter(d => d.year >= startYear && d.year <= endYear)

    const grouped = rollups(filteredData, rows => (aggregationType === 'sum' ? sum : mean)(rows, d => d.amount), d => d.institutionGroup, categoryAccessor)
    grouped.forEach(group => {
      group.value = sum(group[1], d => d[1])
      group[1].sort((a, b) => {
        const aIndex = (singleEnergyType ? categoryList : typesSorted).indexOf(a[0])
        const bIndex = (singleEnergyType ? categoryList : typesSorted).indexOf(b[0])
        return aIndex - bIndex
      })
    })

    grouped.sort((a, b) => {
      let aValue = 0
      let bValue = 0
      if (singleEnergyType) {
        return b.value - a.value
      }
      const aFossil = a[1].find(d => d[0] === selectedEnergyTypes[0])
      const bFossil = b[1].find(d => d[0] === selectedEnergyTypes[0])
      if (aFossil) {
        aValue = aFossil[1]
      }
      if (bFossil) {
        bValue = bFossil[1]
      }
      return bValue - aValue
    })
    return grouped
  })

  console.log(groupRows)
  const valueRange = extent(groupRows.flat(), d => d.value)
  const numToShow = Math.min(groupRows[0].length, 15)

  const height = rowHeight * numToShow

  const margins = {
    top: 30, left: 80, right: 20, bottom: 5
  }
  const xScale = scaleLinear()
    .domain([0, valueRange[1]])
    .range([0, width - margins.left - margins.right])

  const svgHeight = height + margins.top + margins.bottom

  const hoverGroup = (group, values) => (event) => {
    if (!group) {
      setHoveredGroup(null)
      return
    }
    const {clientX, clientY} = event
    const svgPosition = svgRef.current.getBoundingClientRect()
    const x = clientX - svgPosition.left
    const y = clientY - svgPosition.top

    setHoveredGroup({group, values, x, y, clientX, clientY})
  }
  const countriesToShow = groupRows[0].map(d => d[0])

  const countryRows = countriesToShow.slice(0, numToShow).map((country, countryIndex) => {
    const groupData = groupRows.map(group => group.find(d => d[0] === country))
    const group = []
    return (
      <AnimatedRow
        xScale={xScale}
        hoverGroup={hoverGroup}
        width={width}
        margins={margins}
        isBank={isBank}
        groups={groupData}
        key={country}
        groupIndex={countryIndex}
        singleEnergyType={singleEnergyType}
        splitBarGraph={splitBarGraph}
      />
    )
  })

  const xTicks = xScale.ticks(5).map(tick => {
    const x = xScale(tick)
    return (
      <g key={tick} transform={`translate(${x}, 0)`}>
        <text y={-4} textAnchor='middle'>{valueFormatter(tick)}</text>
        <line y2={height} stroke='#4D4D4D' strokeWidth='0.5'/>
      </g>
    )
  })
  let tooltip = null
  if (hoveredGroup) {
    const { group, values, x, y, clientX, clientY } = hoveredGroup
    const offset = 5
    let flipX = clientX > (window.innerWidth - 300)
    let flipY = clientY > window.innerHeight - 300

    const style = { transform:
      `translate(${x + (flipX ? -offset : offset)}px, ${y + (flipY ? - offset : offset)}px)
      ${flipX ? 'translateX(-100%)' : ''}
      ${flipY ? 'translateY(-100%)' : ''}`

    }
    tooltip = (
      <div className='tooltip' style={style}>
        <div className='tooltip-header'>
          {group}
        </div>
        <div className='tooltip-body'>
          {values.map(([type, amount]) => {
            const backgroundColor = singleEnergyType ? subcategoryColorScale(type) : colors[type]
            return (
              <div key={type} className='tooltip-row'>
                <div className='tooltip-row-diamond' style={{backgroundColor}} />
                <div className='tooltip-row-type'>{type}</div>
                <div className='tooltip-row-amount'>{valueFormatter(amount)}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const svgRef = useRef()
  const legend = <ColorLegend colors={(singleEnergyType ? categoryList : typesSorted).map((category) => {
    const color = singleEnergyType ? subcategoryColorScale(category) : colors[category]
    return { category, color}
  })} />
  return (
    <div className="TopUsageGraph">
      {legend}
      <svg ref={svgRef} width={width} height={svgHeight}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <g>{xTicks}</g>
          <g>{countryRows}</g>
        </g>
      </svg>
      {tooltip}
    </div>
  )
}