
import './YearlyUsageGraph.scss'
import { rollup, sum, extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import { useState, useRef } from 'react'
import { stack, area } from 'd3-shape'
import { animated, useSpring, useSprings } from 'react-spring'
import Select from 'Select/'
const colors = {
  'Fossil Fuel': '#EFC1A8',
  'Clean': '#99DEE3',
  'Other': '#6ABEF0',
}
const highlightColors = {
  'Fossil Fuel': '#F4A77E',
  'Clean': '#63CAD1',
  'Other': '#6ABEF0'
}
const typesSorted = ['Fossil Fuel', 'Clean', 'Other']


const GraphLabel = (props) => {
  const { x, y, value, fill } = props
  const animatedProps = useSpring({
    transform: `translate(${x}, ${y})`,
    value,
  })

  return (
    <animated.g transform={animatedProps.transform}>
      <rect width={10} height={10} transform={`rotate(45) translate(-5, -5)`} fill={fill} />
      <animated.text textAnchor='middle' y={-10}>{animatedProps.value.to(valueFormatter)}</animated.text>
    </animated.g>
  )
}
export default function YearlyAverageUsageGraph(props) {
  const { width, data, isBank } = props


  const height = width * 0.6
  const margins = {
    top: 30, left: 20, right: 20, bottom: 20
  }
  const [selectedGroup, setSelectedGroup] = useState('')
  const groups = Array.from(new Set(data.map(d => d.institutionGroup)))
    .sort()
    .map(group => ({ value: group, label: group }))


  const filteredData = selectedGroup ? data.filter(d => d.institutionGroup === selectedGroup) : data
  const grouped = rollup(filteredData, rows => sum(rows, d => d.amount), d => d.year, d => d.category)
  // console.log(grouped)
  const forceYears = [2013, 2020]
  for (let year = forceYears[0]; year <= forceYears[1]; year++) {
    if (grouped.has(year)) continue
    grouped.set(year, new Map())
  }

  const sortedByYear = new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]))
  // console.log(sortedByYear)

  const stacks = stack()
    .keys(typesSorted)
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

  const stackSprings = useSprings(stacks.length, stacks.map(stack => ({
    path: areaGen(stack)
  })))
  // console.log(stackSprings)
  const areaGroup = stacks.map((stack, stackIndex) => {
    // const path = areaGen(stack)
    const path = stackSprings[stackIndex].path
    return (
      <animated.path opacity={stack.key === 'Fossil Fuel' ? null : '0.3'} d={path} key={stack.key} fill={colors[stack.key]} />
    )
  })

  const points = stacks.map(stack => {
    return stack.map((d, i) => {
      // console.log(stack, d)
      if (d[1] - d[0] === 0) {
        return null
      }
      const x = xScale(d.data[0])
      const y = yScale(d[1])
      return (
        <GraphLabel x={x} y={y} key={`${stack.key}-${d.data[0]}`}
          fill={highlightColors[stack.key]}
          value={d[1] - d[0]}
        />
      )
    })
  })


  const svgHeight = height + margins.top + margins.bottom


  const xTicks = xScale.ticks(5).map(tick => {
    const x = xScale(tick)
    return (
      <g key={tick} transform={`translate(${x}, 0)`}>
        <text y={height + 16} textAnchor='middle'>{tick}</text>
        <line y2={height} strokeWidth={2} stroke='#fff'/>
      </g>
    )
  })
  let tooltip = null

  const svgRef = useRef()
  return (
    <div className="YearlyUsageGraph">
      <Select placeholder='Select an Instituion Group'  value={selectedGroup} onChange={setSelectedGroup} options={groups} />
      <svg ref={svgRef} width={width} height={svgHeight}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          {areaGroup}
          <g>{xTicks}</g>
          {points}
        </g>
      </svg>
      {tooltip}
    </div>
  )
}