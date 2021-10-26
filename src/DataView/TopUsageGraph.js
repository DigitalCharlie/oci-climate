
import './TopUsageGraph.scss'
import { rollups, sum, extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import { useState, useRef } from 'react'
const colors = {
  'Fossil Fuel': '#EFC1A8',
  'Clean': '#99DEE3',
  'Other': '#6ABEF0',
}
const typesSorted = ['Fossil Fuel', 'Clean', 'Other']
export default function TopUsageGraph(props) {
  const { width, data, isBank } = props
  const grouped = rollups(data, rows => sum(rows, d => d.amount), d => d.institutionGroup, d => d.category)
  const [hoveredGroup, setHoveredGroup] = useState(null)
  grouped.forEach(group => {
    group.value = sum(group[1], d => d[1])
    group[1].sort((a, b) => {
      const aIndex = typesSorted.indexOf(a[0])
      const bIndex = typesSorted.indexOf(b[0])
      return aIndex - bIndex
    })
  })

  grouped.sort((a, b) => {
    let aValue = 0
    let bValue = 0
    const aFossil = a[1].find(d => d[0] === 'Fossil Fuel')
    const bFossil = b[1].find(d => d[0] === 'Fossil Fuel')
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
  const rowHeight = 30
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
    const name = group[0]
    const values = group[1]
    const y = groupIndex * rowHeight
    let barX = 0
    const bars = values.map(([type, amount]) => {
      const width = xScale(amount)
      const x = barX
      barX += width
      const fill = colors[type]
      const barHeight = rowHeight * 0.8
      return (
        <g key={type} transform={`translate(${x}, 0)`} ><rect width={width} height={barHeight} fill={fill} /></g>
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
    return (
      <g
        onMouseOver={hoverGroup(group[0], values)}
        onMouseMove={hoverGroup(group[0], values)}
        onMouseOut={hoverGroup(null)}
        className='dataRow'
        key={name}
        transform={`translate(0, ${y})`}
      >
        <rect x={-margins.left} width={width + margins.left + margins.right} height={rowHeight} fill='transparent' />
        <text x={-5} textAnchor='end' y={rowHeight / 2}>{label}</text>

        {bars}
      </g>
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
          {values.map(([type, amount]) => (
            <div key={type} className='tooltip-row'>
              <div className='tooltip-row-diamond' style={{backgroundColor: colors[type]}} />
              <div className='tooltip-row-type'>{type}</div>
              <div className='tooltip-row-amount'>{valueFormatter(amount)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const svgRef = useRef()
  return (
    <div className="TopUsageGraph">
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