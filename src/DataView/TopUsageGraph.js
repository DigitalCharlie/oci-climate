
import './TopUsageGraph.scss'
import { rollups, sum, extent, mean } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import React, { useState, useRef } from 'react'
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
let centeredLabelSize = 80

function AnimatedRow(props) {
  const { groups, groupIndex, xScale, isBank, margins, width, hoverGroup, singleEnergyType, splitStyle2 } = props
  // console.log(groups)
  const name = groups[0] ? groups[0][0] : groups[1][0]
  // console.log(groups)

  const values = groups.map(group => group ? group[1] : null)
  const y = groupIndex * rowHeight
  let barXByValueSet = values.map((_) => 0)


  const flatValues = []
  values.forEach((valueSet, valueSetIndex) => {
    if (!valueSet) return
    valueSet.forEach(value => value.valueSetIndex = valueSetIndex)
    flatValues.push(...valueSet)
  })
  // console.log(flatValues)

  let xs = []
  let barWidths = []
  const valueSprings = useSprings(flatValues.length, flatValues.map((value) => {
    const [type, amount] = value
    // console.log(value)
    const valueSetIndex = value.valueSetIndex
    const width = xScale(amount)
    const x = barXByValueSet[valueSetIndex]
    xs.push(x)
    barWidths.push(width)
    barXByValueSet[valueSetIndex] += width
    return {x, width}
  }))

  const bars = flatValues.map((value, index) => {
    const [type, amount] = value
    const valueSetIndex = value.valueSetIndex

    let barHeight = (rowHeight / values.length) * 0.8
    let y = (valueSetIndex * 1.1) * barHeight
    let x = xs[index]
    if (splitStyle2) {
      barHeight = rowHeight * 0.8
      y = 0
      if (valueSetIndex === 1) {
        x += (width - margins.left - margins.right) / 2 + centeredLabelSize / 2
      } else {
        x = (width - margins.left - margins.right) / 2 - barWidths[index] - centeredLabelSize / 2 - xs[index]
      }
    }
    const fill = singleEnergyType && (type !== 'Clean' && type !== 'Other') ? subcategoryColorScale(type) : colors[type]
    return (
      // <animated.g key={`${valueSetIndex}-${type}`} transform={valueSprings[index].x.to(x => `translate(${x}, ${y})`)} >
      <animated.g key={`${valueSetIndex}-${type}`} transform={`translate(${x}, ${y})`} >
        <animated.rect width={valueSprings[index].width} height={barHeight} fill={fill} />
      </animated.g>
    )
  })
  let label = name
  const labelX = splitStyle2 ? (width - margins.left - margins.right) / 2 : -5
  const textAnchor = splitStyle2 ? 'middle' : 'end'
  if (isBank) {
    label = name.split(' ').map(word => word.charAt(0)).join('')
  } else {
    label = name.split(' ').map((word, wordIndex, words) =>
      <tspan key={wordIndex} x={labelX} dy={(wordIndex * 16) - ((words.length - 1) * 4)}>{word}</tspan>
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
      onMouseOver={hoverGroup(name, flatValues)}
      onMouseMove={hoverGroup(name, flatValues)}
      onMouseOut={hoverGroup(null)}
      className='dataRow'
      key={name}
      transform={ySpring.y.to(y => `translate(0, ${y})`)}
    >
      <rect x={-margins.left} width={width + margins.left + margins.right} height={rowHeight} fill='transparent' />
      <text x={labelX} textAnchor={textAnchor} y={rowHeight / 2}>{label}</text>

      {bars}
    </animated.g>
  )
}

export default function TopUsageGraph(props) {
  const { width, data, isBank, selectedEnergyTypes, aggregationType, barGraphStyle } = props
  const splitBarGraph = barGraphStyle === 'split' || barGraphStyle === 'split2'
  const splitStyle2 = barGraphStyle === 'split2'

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

  // console.log(groupRows)
  const valueRange = extent(groupRows.flat(), d => d.value)
  const numToShow = Math.min(groupRows[0].length, 15)

  const height = rowHeight * numToShow

  const margins = {
    top: 30, left: 80, right: 20, bottom: 5
  }
  if (splitStyle2) {
    margins.right = 30
    margins.left = margins.right
  }
  const range = (width - margins.left - margins.right) / (splitStyle2 ? 2 : 1)
  const xScale = scaleLinear()
    .domain([0, valueRange[1]])
    .range([0, range])

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
  const countriesToShow = groupRows[groupRows.length - 1].map(d => d[0])
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
        splitStyle2={splitStyle2}
      />
    )
  })

  const xTicks = xScale.ticks(5).map(tick => {
    let x = xScale(tick)
    let secondTick = null
    if (splitStyle2) {
      let tickX = x
      x += (width - margins.left - margins.right) / 2 + centeredLabelSize / 2
      secondTick = (
        <g key={`${tick}-2`} transform={`translate(${(width - margins.left - margins.right) / 2 - centeredLabelSize / 2 - tickX}, 0)`}>
          <text y={-4} textAnchor='middle'>{valueFormatter(tick)}</text>
          <line y2={height} stroke='#4D4D4D' strokeWidth='0.5'/>
        </g>

      )
    }
    return (
      <React.Fragment>
        <g key={tick} transform={`translate(${x}, 0)`}>
          <text y={-4} textAnchor='middle'>{valueFormatter(tick)}</text>
          <line y2={height} stroke='#4D4D4D' strokeWidth='0.5'/>
        </g>
        {secondTick}


      </React.Fragment>
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
    let previousYearLabel = null
    tooltip = (
      <div className='tooltip' style={style}>
        <div className='tooltip-header'>
          {group}
        </div>
        <div className='tooltip-body'>
          {values.map((value) => {
            const [type, amount] = value
            const valueSetIndex = value.valueSetIndex
            const yearLabel = yearRows[valueSetIndex].startYear + '-' + yearRows[valueSetIndex].endYear
            let yearLabelDiv = null
            const backgroundColor = singleEnergyType && type  && (type !== 'Clean' && type !== 'Other') ? subcategoryColorScale(type) : colors[type]
            if (previousYearLabel !== yearLabel) {
              previousYearLabel = yearLabel
              yearLabelDiv = <div className='tooltip-year-label'>{yearLabel}</div>
            }
            return (
              <React.Fragment key={`${valueSetIndex}-${type}`}>
                {yearLabelDiv}
                <div key={`${valueSetIndex}-${type}`} className='tooltip-row'>
                  <div className='tooltip-row-diamond' style={{backgroundColor}} />
                  <div className='tooltip-row-type'>{type}</div>
                  <div className='tooltip-row-amount'>{valueFormatter(amount)}</div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  const svgRef = useRef()
  let legendColors = (singleEnergyType ? categoryList : typesSorted).map((category) => {
    const color = singleEnergyType && (category !== 'Clean' && category !== 'Other') ? subcategoryColorScale(category) : colors[category]
    return { category, color}
  }).filter(d => singleEnergyType ? true : selectedEnergyTypes.includes(d.category))
  const legend = <ColorLegend colors={legendColors} />
  return (
    <div className="TopUsageGraph">
      {legend}
      {yearRows.map(({startYear, endYear}) => (
        <div style={{ fontWeight: 'bold' }}className='year-label' key={`${startYear}-${endYear}`}>{startYear}-{endYear}</div>
      ))}
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