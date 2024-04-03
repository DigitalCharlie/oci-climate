
import './TopUsageGraph.scss'
import { rollups, groups as d3groups, sum, extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import React, { useState, useRef } from 'react'
import { animated, useSpring, useSprings} from 'react-spring'
import subcategoryColorScale from './subcategoryColorScale'
import ColorLegend from './ColorLegend'
import { finalYear } from 'App'
import { colors } from './'

const typesSorted = ['Fossil Fuel', 'Clean', 'Other']
const rowHeight = 30
// let centeredLabelSize = 80

function AnimatedRow(props) {
  const { groups, groupIndex, xScale, isBank, margins, width, hoverGroup, singleEnergyType, institutionData } = props
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
    const [, amount] = value
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
    const [type] = value
    const valueSetIndex = value.valueSetIndex

    let barHeight = (rowHeight / values.length) * 0.8
    let y = (valueSetIndex * 1.1) * barHeight
    let x = xs[index]
    // if (splitBarGraph) {
    //   barHeight = rowHeight * 0.8
    //   y = 0
    //   if (valueSetIndex === 1) {
    //     x += (width - margins.left - margins.right) / 2 + centeredLabelSize / 2
    //   } else {
    //     x = (width - margins.left - margins.right) / 2 - barWidths[index] - centeredLabelSize / 2 - xs[index]
    //   }
    // }
    const fill = singleEnergyType && (type !== 'Clean' && type !== 'Other') ? subcategoryColorScale(type) : colors[type]
    return (
      // <animated.g key={`${valueSetIndex}-${type}`} transform={valueSprings[index].x.to(x => `translate(${x}, ${y})`)} >
      <animated.g key={`${valueSetIndex}-${type}`} transform={`translate(${x}, ${y})`} >
        <animated.rect width={valueSprings[index].width} height={barHeight} fill={fill} />
      </animated.g>
    )
  })
  let label = name
  const labelX =  -5
  const textAnchor = 'end'
  if (isBank) {
    const nameOverrides = {
      'Islamic Development Bank*': 'IsDB*',
      'Inter-American Development Bank': 'IaDB',
      'Asian Development Bank': 'ADB',
      'African Development Bank': 'AfDB',
    }
    if (nameOverrides[name]) {
      label = nameOverrides[name]
    } else {
      label = name.split(' ').map(word => word.charAt(0)).join('')
      const overrides = {
        EBfRaD: 'EBRD',
        // 'ADB': 'AfDB',
      }
      if (overrides[label]) {
        label = overrides[label]
      }
    }
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
      onMouseOver={hoverGroup(name, flatValues, institutionData)}
      onMouseMove={hoverGroup(name, flatValues, institutionData)}
      onMouseOut={hoverGroup(null)}
      className='dataRow'
      key={name}
      transform={ySpring.y.to(y => `translate(0, ${y})`)}
    >
      <rect x={-margins.left} width={width - margins.right} height={rowHeight} fill='transparent' />
      <text x={labelX} textAnchor={textAnchor} y={rowHeight / 2}>{label}</text>

      {bars}
    </animated.g>
  )
}

export default function TopUsageGraph(props) {
  const { width, data, isBank, selectedEnergyTypes, aggregationType, yearType, customYears } = props
  const splitBarGraph = yearType === 'paris'
  console.log(splitBarGraph, yearType)
  let yearRows = splitBarGraph ? [
    { startYear: 2013, endYear: 2015},
    { startYear: 2016, endYear: finalYear},
  ] : [{ startYear: 2013, endYear: finalYear}]
  if (yearType === 'custom') {
    yearRows = [{ startYear: customYears[0], endYear: customYears[1] }]
  }
  const fixedPositionTooltip = width < 500
  const [hoveredGroup, setHoveredGroup] = useState(null)
  const singleEnergyType = selectedEnergyTypes.length === 1
  let categoryFilteredData = data.filter(d => selectedEnergyTypes.includes(d.category))
  let categoryAccessor = singleEnergyType ? d => d['category detail'] : d => d.category
  const categoryList = Array.from(new Set(categoryFilteredData.map(categoryAccessor))).sort()

  const institutionValues = []
  const groupRows = yearRows.map(({startYear, endYear}) => {

    let filteredData = categoryFilteredData.filter(d => d.year >= startYear && d.year <= endYear)
    const denominator = aggregationType === 'sum' ? 1 : (endYear - startYear + 1)
    const grouped = rollups(filteredData, rows => sum(rows, d => d.amount) / denominator, d => d.institutionGroup, categoryAccessor)
    grouped.forEach(group => {
      group.value = sum(group[1], d => d[1])
      group[1].sort((a, b) => {
        const aIndex = (singleEnergyType ? categoryList : typesSorted).indexOf(a[0])
        const bIndex = (singleEnergyType ? categoryList : typesSorted).indexOf(b[0])
        return aIndex - bIndex
      })
    })

    institutionValues.push(d3groups(filteredData, d => d.institutionGroup).map(([country, values]) =>
      [country, [...new Set(values.map(d => d.institution))].sort()]
    ))

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

  const valueRange = extent(groupRows.flat(), d => d.value)
  const numToShow = Math.min(groupRows[0].length, 15)

  const height = rowHeight * numToShow

  const margins = {
    top: 30, left: isBank ? 45 : 66, right: -10, bottom: 5
  }
  // if (splitBarGraph) {
  //   margins.right = 30
  //   margins.left = margins.right
  // }
  const range = (width - margins.left - margins.right) // 1(splitBarGraph ? 2 : 1)
  const xScale = scaleLinear()
    .domain([0, valueRange[1]])
    .range([0, range])

  const svgHeight = height + margins.top + margins.bottom

  const hoverGroup = (group, values, institutionData) => (event) => {
    if (!group) {
      setHoveredGroup(null)
      return
    }
    let {clientX, clientY} = event
    if (fixedPositionTooltip) {
      const element = event.target.closest('.dataRow')
      const rect = element.getBoundingClientRect()
      clientX = rect.left
      clientY = rect.top + rect.height
    }
    const svgPosition = svgRef.current.getBoundingClientRect()
    let x = clientX - svgPosition.left
    let y = clientY - svgPosition.top
    setHoveredGroup({group, values, x, y, clientX, clientY, institutionData})
  }
  const countriesToShow = groupRows[groupRows.length - 1].map(d => d[0])
  const countryRows = countriesToShow.slice(0, numToShow).map((country, countryIndex) => {
    const groupData = groupRows.map(group => group.find(d => d[0] === country))
    const institutionData = institutionValues.map(group => group.find(d => d[0] === country))
    // console.log(groupData)
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
        institutionData={institutionData}
      />
    )
  })

  const xTicks = xScale.ticks(5).map(tick => {
    let x = xScale(tick)
    let secondTick = null
    // if (splitBarGraph) {
    //   let tickX = x
    //   x += (width - margins.left - margins.right) / 2 + centeredLabelSize / 2
    //   secondTick = (
    //     <g key={`${tick}-2`} transform={`translate(${(width - margins.left - margins.right) / 2 - centeredLabelSize / 2 - tickX}, 0)`}>
    //       <text y={-4} textAnchor='middle'>{valueFormatter(tick)}</text>
    //       <line y2={height} stroke='#4D4D4D' strokeWidth='0.5'/>
    //     </g>

    //   )
    // }
    return (
      <React.Fragment key={tick}>
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
    const { group, values, x, y, clientX, clientY, institutionData } = hoveredGroup
    const offset = 5
    let flipX = clientX > (window.innerWidth - 140)
    let flipY = clientY > window.innerHeight - 300
    // console.log(institutionData)
    const style = { transform:
      `translate(${x + (flipX ? -offset : offset)}px, ${y + (flipY ? - offset : offset)}px)
      ${flipX ? 'translateX(-100%)' : ''}
      ${flipY ? 'translateY(-100%)' : ''}`

    }

    if (fixedPositionTooltip) {
      if (y < window.innerHeight / 2) {
        style.transform = `translate(${x}px, ${y}px)`
      } else {
        style.transform = `translate(${x}px, ${y - 34}px) translateY(-100%)`
      }
    }
    let previousYearLabel = null
    tooltip = (
      <div className='tooltip' style={style}>
        <div className='tooltip-header'>
          {group}
        </div>

        <div className='tooltip-body'>
          <div style={{ marginBottom: '0.4em'}}>
            {aggregationType === 'sum' ? '$ amounts as total sum' : '$ amounts as average annual'}
          </div>
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
                {splitBarGraph ? yearLabelDiv : null}
                <div key={`${valueSetIndex}-${type}`} className='tooltip-row'>
                  <div className='tooltip-row-diamond' style={{backgroundColor}} />
                  <div className='tooltip-row-type'>{type}</div>
                  <div className='tooltip-row-amount'>{valueFormatter(amount)}</div>
                </div>
              </React.Fragment>
            )
          })}
          {institutionData &&  institutionData[0] ? (
            <div className='tooltip-institution-data'>
              <div className='tooltip-institution-data-header'>
                Institutions
              </div>
              {institutionData[0][1].join(', ')}
            </div>
          ) : null}
       </div>

      </div>
    )
  }
  const svgRef = useRef()
  let legendColors = (singleEnergyType ? categoryList : typesSorted).map((category) => {
    const color = singleEnergyType && (category !== 'Clean' && category !== 'Other') ? subcategoryColorScale(category) : colors[category]
    return { category, color}
  }).filter(d => singleEnergyType ? true : selectedEnergyTypes.includes(d.category))


  let yearRowsLegend = null
  if (yearRows.length > 1) {
    let textLabel = isBank ? 'Name of MDB' : 'Country'
    yearRowsLegend = (
      <svg width={width} height={30}>
        <g transform={`translate(${margins.left}, 4)`}>
          {yearRows.map((yearRow, index) => {
            return (
              <g key={index} transform={`translate(${0}, ${index * 14})`}>
                {legendColors.map((color, colorIndex) => {
                  return (
                    <rect
                      fill={color.color}
                      width={(width - margins.left) / (legendColors.length * 2)}
                      height={12}
                      key={color.category}
                      x={colorIndex * (width - margins.left) / (legendColors.length * 2)}
                    />
                  )
                })}
                <text x={legendColors.length * (width - margins.left) / (legendColors.length * 2) + 5} y={10} fontSize={'1.2em'}>
                  {yearRow.startYear} - {yearRow.endYear}
                </text>
              </g>
            )
          })}
          <line y1={-2} y2={28} stroke='#4D4D4D' strokeWidth='0.5'/>
          <text textAnchor='end' y={16} x={-5}>{textLabel}</text>
        </g>
      </svg>
    )
  }

  const legend = <ColorLegend colors={legendColors} />
  return (
    <div className="TopUsageGraph">
      {legend}
      {yearRowsLegend}
      <div className='graphContainer'>
        <svg ref={svgRef} width={width} height={svgHeight}>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            <g>{xTicks}</g>
            <g>{countryRows}</g>
          </g>
        </svg>
        {tooltip}
      </div>
    </div>
  )
}