
import './YearlyUsageGraph.scss'
import { rollup, sum, extent, group } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import { useState, useRef } from 'react'
import { stack, area } from 'd3-shape'
import { animated, useSpring } from 'react-spring'
import Select from 'Select/'
import subcategoryColorScale from './subcategoryColorScale'
import ColorLegend from './ColorLegend'
import { colors } from './'
const typesSorted = ['Fossil Fuel', 'Clean', 'Other']

const parisYear = 2016

const GraphDot = (props) => {
  const { x, y, fill } = props
  const animatedProps = useSpring({
    transform: `translate(${x}, ${y})`,
  })

  return (
    <animated.g transform={animatedProps.transform}>
      <rect width={10} height={10} transform={`rotate(45) translate(-5, -5)`} fill={fill} />
    </animated.g>
  )
}
const GraphLabel = (props) => {
  const { x, y, value } = props
  const animatedProps = useSpring({
    transform: `translate(${x}, ${y})`,
    value,
  })

  return (
    <animated.g transform={animatedProps.transform} >
      <animated.text y={4} x={12} className='graphLabel'>{animatedProps.value.to(valueFormatter)}</animated.text>
    </animated.g>
  )
}
export default function YearlyAverageUsageGraph(props) {
  const { width, data,  selectedEnergyTypes, yearType, customYears } = props


  const height = width * 0.450
  const margins = {
    top: 10, left: 14, right: 30, bottom: 34
  }
  const [selectedGroup, setSelectedGroup] = useState('')
  const groups = Array.from(new Set(data.map(d => d.institutionGroup)))
    .sort()
    .map(group => ({ value: group, label: group }))


  let filteredData = selectedGroup ? data.filter(d => d.institutionGroup === selectedGroup) : data
  filteredData = filteredData.filter(d => selectedEnergyTypes.includes(d.category))
  const singleEnergyType = selectedEnergyTypes.length === 1
  let categoryAccessor = singleEnergyType ? d => d['category detail'] : d => d.category
  let originalYears = [2013, 2020]
  let forceYears = [...originalYears]
  if (yearType === 'custom') {
    forceYears = customYears
  }
  const filterOutYears = filteredData.filter(d => d.year >= forceYears[0] && d.year <= forceYears[1])
  const grouped = rollup(filterOutYears, rows => sum(rows, d => d.amount), d => d.year, categoryAccessor)
  // console.log(grouped)
  for (let year = forceYears[0]; year <= forceYears[1]; year++) {
    if (grouped.has(year)) continue
    grouped.set(year, new Map())
  }

  const sortedByYear = new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]))
  // console.log(sortedByYear)
  const subcategories = Array.from(new Set(filterOutYears.map(d => d['category detail'])))
  const stackKeys = singleEnergyType ? subcategories : typesSorted
  const stacks = stack()
    .keys(stackKeys)
    .value((d, key) => {
      return d[1].has(key) ? d[1].get(key) : 0
    })(sortedByYear)
    // .map(s => s.map(d => Object.assign(d, {year: d.data[0] })));
  // console.log(stacks)

  const yDomain = extent(stacks.flat(2))
  const xDomain = extent(sortedByYear.keys())

  const xScale = scaleLinear()
    .domain(xDomain)
    .range([0, width - margins.left - margins.right])

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([height, 0])


  const areaGen = area()
    .x((d) => {
      return xScale(d.data[0])
    }).y0(d => {
      return yScale(d[0])
    }).y1(d => {
      return yScale(d[1])
    })
  // console.log(stacks)
  // const stackSprings = useSprings(originalYears[1] - originalYears[0] + 1, stacks.map(stack => ({
  //   path: areaGen(stack)
  // })))
  // console.log(stackSprings)
  const areaGroup = stacks.map((stack, stackIndex) => {
    const path = areaGen(stack)
    // const path = stackSprings[stackIndex].path
    const fill = singleEnergyType && (stack.key !== 'Clean' && stack.key !== 'Other') ? subcategoryColorScale(stack.key) : colors[stack.key]
    // let opacity = stackIndex === 0 ? null : '0.3'
    let opacity = 1
    if (singleEnergyType) {
      // opacity = null
    }
    return (
      <animated.path opacity={opacity} d={path} key={stack.key} fill={fill} />
    )
  })

  const labelData = []
  const points = stacks.map((stack, stackIndex) => {
    return stack.map((d, i) => {
      // console.log(stack, d)
      if (d[1] - d[0] === 0) {
        return null
      }
      const x = xScale(d.data[0])
      let y = yScale(d[1])

      let fill = singleEnergyType && (stack.key !== 'Clean' && stack.key !== 'Other') ? subcategoryColorScale(stack.key) : colors[stack.key]

      labelData.push({
        x, y, value: d[1] - d[0], fill
      })
      return (
        <GraphDot x={x} y={y} key={`${stack.key}-${d.data[0]}`}
          fill={fill}
          value={d[1] - d[0]}
        />
      )
    })
  })

  const labelsByX = Array.from(group(labelData, d => d.x))


  // console.log(labelData)
  const labels = labelsByX.map(([xKey, labelsOfX]) => {
    labelsOfX.sort((a, b) => b.y - a.y)
    let lastY = Number.MAX_VALUE
    return labelsOfX.map(({x,y, value}, index) => {
      const yDelta = lastY - y
      // console.log(x, y, value, yDelta)
      let finalY = y
      if (yDelta < 16) {
        finalY = lastY - 16
      }
      lastY = finalY
      return <GraphLabel x={x} y={finalY} value={value} key={`label-${index}-${x}`} />
    })

  })

  let singleYearLines = null
  if (forceYears[0] === forceYears[1]) {
    // console.log(labelsByX)
    const points = [...labelsByX[0][1]]
    points.sort((a, b) => a.y - b.y)
    singleYearLines = points.map((d, i) => {
      return <rect width={3} fill={d.fill} x={d.x - 1.5} y={d.y} height={height - d.y} key={`line-${i}`} />
    })
  }



  const svgHeight = height + margins.top + margins.bottom

  const tickCount = xScale.domain()[1] - xScale.domain()[0] + 1
  const xTicks = xScale.ticks(tickCount).map(tick => {
    if (tick !== Math.round(tick)) {
      return null
    }
    const x = xScale(tick)
    const isParisYear = tick === parisYear
    const fontWeight = isParisYear ? 'bold' : 'normal'
    const lineStroke = isParisYear ? 'black' : '#fff'
    const parisLabelAnchor = tick === forceYears[0] ? 'start' : (tick === forceYears[1] ? 'end' : 'middle')
    const parisLabel = isParisYear ? (
      <text y={height + 32} textAnchor={parisLabelAnchor}>Year Paris Agreement Adopted</text>
    ) : null
    const strokeDasharray = isParisYear ? '5,5' : null
    return (
      <g key={tick} transform={`translate(${x}, 0)`}>
        <text y={height + 16} textAnchor='middle' fontWeight={fontWeight}>{tick}</text>
        {parisLabel}
        <line y2={height} strokeWidth={2} stroke={lineStroke} strokeDasharray={strokeDasharray}/>
      </g>
    )
  })
  let tooltip = null

  const svgRef = useRef()
  const legendColors = (singleEnergyType ? stacks.map(stack => stack.key) : typesSorted)
    .map(category => ({ category, color: singleEnergyType && (category !== 'Clean' && category !== 'Other') ? subcategoryColorScale(category) : colors[category] }))
    .filter(d => singleEnergyType ? true : selectedEnergyTypes.includes(d.category))
  return (
    <div className="YearlyUsageGraph">
      <Select placeholder='All Countries and Institutions'  value={selectedGroup} onChange={setSelectedGroup} options={groups} />
      <ColorLegend colors={legendColors} />
      <svg ref={svgRef} width={width} height={svgHeight} key={forceYears[1] - forceYears[0]}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          {areaGroup}
          <g>{xTicks}</g>
          {singleYearLines}
          {points}
          {labels}
        </g>
      </svg>
      {tooltip}
    </div>
  )
}