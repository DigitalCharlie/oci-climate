
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
  const { group, groupIndex, xScale, isBank, margins, width, hoverGroup, singleEnergyType } = props
  const name = group[0]
  const values = group[1]
  const y = groupIndex * rowHeight
  let barX = 0

  const valueSprings = useSprings(values.length, values.map(([type, amount]) => {
    const width = xScale(amount)
    const x = barX
    barX += width
    return {x, width}
  }))
  const bars = values.map(([type, amount], index) => {
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
      onMouseOver={hoverGroup(group[0], values)}
      onMouseMove={hoverGroup(group[0], values)}
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
  const { width, data, isBank, selectedEnergyTypes, aggregationType } = props
  const filteredData = data.filter(d => selectedEnergyTypes.includes(d.category))
  const singleEnergyType = selectedEnergyTypes.length === 1
  let categoryAccessor = singleEnergyType ? d => d['category detail'] : d => d.category

  const grouped = rollups(filteredData, rows => (aggregationType === 'sum' ? sum : mean)(rows, d => d.amount), d => d.institutionGroup, categoryAccessor)
  const [hoveredGroup, setHoveredGroup] = useState(null)
  const categoryList = Array.from(new Set(filteredData.map(categoryAccessor))).sort()
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

  const valueRange = extent(grouped, d => d.value)
  const numToShow = Math.min(grouped.length, 10)
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
  const rows = grouped.slice(0, numToShow).map((group, groupIndex) => {
    return (
      <AnimatedRow
        xScale={xScale}
        hoverGroup={hoverGroup}
        width={width}
        margins={margins}
        isBank={isBank}
        group={group}
        key={group[0]}
        groupIndex={groupIndex}
        singleEnergyType={singleEnergyType}
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
          <g>{rows}</g>
        </g>
      </svg>
      {tooltip}
    </div>
  )
}