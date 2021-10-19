import { flatRollup, groups, rollups, sum, extent } from 'd3-array';

import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { line } from 'd3-shape'
import { Delaunay } from 'd3-delaunay'
import { useRef, useState, useMemo } from 'react';
import {schemeCategory10 } from 'd3-scale-chromatic'
import exportSVG from './exportSVG';
import valueFormatter from './valueFormatter';
const getLineForCountry = (summedByCountryAndYear, xScale, yScale, lineGen, points, colorScale) => (country, options = {}) => {
  const rows = summedByCountryAndYear.filter(d => d[0] === country)
  const linePath = lineGen(rows)
  let strokeWidth = options.showLabel ? 3 : null
  let stroke=colorScale(country)
  const line = <path d={linePath} fill='none' strokeWidth={strokeWidth} stroke={stroke} opacity={0.75} />
  rows.forEach(r => {
    const x = xScale(r[1])
    const y = yScale(r[2])
    points.push([x, y, country])
  })

  let label = null
  if (options.showLabel) {
    const lastPoint = points[points.length - 1]
    // console.log(lastPoint)
    label = <text x={xScale.range()[1]} y={lastPoint[1]}>{country}</text>
  }
  return (
    <g key={country}>
      {line}{
        label
      }
    </g>
  )
}
export default function LineGraph(props) {
  const { data, yMax } = props

  const [hoveredCountry, setHoveredCountry] = useState(null)

  const width = window.innerWidth * 0.7
  const height = width * 0.67
  const margins = {
    top: 20, left: 120, bottom: 20, right: 150,
  }
  const svgWidth = width + margins.left + margins.right
  const svgHeight = height + margins.top + margins.bottom
  const minYear = 2013
  const maxYear = 2020
  const { byCountryAndYear, summedByCountryAndYear, xExtent, yExtent, xScale, yScale, lineGen, countryGroups, delaunay, points, colorScale } = useMemo(() => {
    const byCountryAndYear = groups(data, d => d.country, d => d.year)
    const summedByCountryAndYear = flatRollup(data, rows => sum(rows, d => d.amount), d => d.country, d => d.year)
      .filter(d => d[1] >= minYear)
      .filter(d => d[1] <= maxYear)
    console.log(byCountryAndYear)
    console.log(summedByCountryAndYear)
    const xExtent = extent(summedByCountryAndYear, d => d[1])
    const yExtent = extent(summedByCountryAndYear, d => d[2])
    console.log(xExtent, yExtent)
    summedByCountryAndYear.sort((a, b) => a[1] - b[1])

    const countries = Array.from(new Set(summedByCountryAndYear.map(d => d[0])))
    console.log(countries)

    const xScale = scaleLinear()
      .domain([minYear, xExtent[1]])
      .range([0, width])

    const yScale = scaleLinear()
      .domain([yExtent[0], yMax === '' ? yExtent[1] : Math.min(yExtent[1], yMax)])
      .range([height, 0])

    const colorScale = scaleOrdinal()
      .range(schemeCategory10)

    const lineGen = line()
      .x(d => xScale(d[1]))
      .y(d => yScale(d[2]))

    const points = []

    const countryGroups = countries.map(country => {
      return getLineForCountry(summedByCountryAndYear, xScale, yScale, lineGen, points,colorScale)(country)

    })
    const delaunay = Delaunay.from(points)
    return { byCountryAndYear, summedByCountryAndYear, xExtent, yExtent, xScale, yScale, lineGen, countryGroups, delaunay, points, colorScale }
  }, [data, yMax, width, height])
  const xTicks = xScale.ticks().map(tick => {
    if (tick !== Math.round(tick)) {
      return null
    }
    const x = xScale(tick)
    return (
      <g key={tick} transform={`translate(${x}, ${height})`}>
        <text y={20} textAnchor='middle'>{tick}</text>
        <line y1={3} stroke='black' />
      </g>
    )
  })

  const yTicks = yScale.ticks().map(tick => {
    const y = yScale(tick)
    const label = valueFormatter(tick)
    return (
      <g key={tick} transform={`translate(0, ${y})`}>
        <text x={-10} textAnchor='end'>{label}</text>
        <line x={-5} stroke='black' />
      </g>
    )
  })

  const svgRef = useRef()
  const hoverSvg = (event) => {
    const svgPosition = svgRef.current.getBoundingClientRect()
    const x = event.clientX - svgPosition.left
    const y = event.clientY - svgPosition.top
    const i = delaunay.find(x, y)
    if (i !== -1 && !isNaN(i)) {
      const country = points[i][2]
      setHoveredCountry(country)
    }
  }

  let hoveredLine = null
  if (hoveredCountry) {
    hoveredLine = getLineForCountry(summedByCountryAndYear, xScale, yScale, lineGen, [], colorScale)(hoveredCountry, {showLabel: true})
  }

  const rightClick = () => {
    exportSVG(svgRef.current, 'ocigraph.svg')
  }

  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight} onMouseMove={hoverSvg} onMouseOut={e => setHoveredCountry(null)} onContextMenu={rightClick}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <rect width={width} height={height} fill='transparent' />
          <g>{countryGroups}</g>
          <g>{xTicks}</g>
          <g>{yTicks}</g>
          {hoveredLine}
        </g>
      </svg>

    </div>
  )
}