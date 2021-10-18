import { flatRollup, groups, rollups, sum, extent } from 'd3-array';

import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'
import { format } from 'd3-format'
import { Delaunay } from 'd3-delaunay'
import { useRef, useState, useMemo } from 'react';

const valueFormatter = (value) => format('.2s')(value).replace(/G/, 'B')

const getLineForCountry = (summedByCountryAndYear, xScale, yScale, lineGen, points) => (country, options = {}) => {
  const rows = summedByCountryAndYear.filter(d => d[0] === country)
  const linePath = lineGen(rows)
  let strokeWidth = options.showLabel ? 3 : null
  const line = <path d={linePath} fill='none' strokeWidth={strokeWidth} stroke='black' opacity={0.85} />
  rows.forEach(r => {
    const x = xScale(r[1])
    const y = yScale(r[2])
    points.push([x, y, country])
  })

  let label = null
  if (options.showLabel) {
    const lastPoint = points[points.length - 1]
    // console.log(lastPoint)
    label = <text x={lastPoint[0]} y={lastPoint[1]}>{country}</text>
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

  const width = 600
  const height = 450
  const margins = {
    top: 5, left: 120, bottom: 20, right: 150,
  }
  const svgWidth = width + margins.left + margins.right
  const svgHeight = height + margins.top + margins.bottom
  const minYear = 2010
  const { byCountryAndYear, summedByCountryAndYear, xExtent, yExtent, xScale, yScale, lineGen, countryGroups, delaunay, points } = useMemo(() => {
    const byCountryAndYear = groups(data, d => d.country, d => d.year)
    const summedByCountryAndYear = flatRollup(data, rows => sum(rows, d => d.amount), d => d.country, d => d.year)
      .filter(d => d[1] >= minYear)
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
      .domain([yExtent[0], yMax === '' ? yExtent[1] : yMax])
      .range([height, 0])

    const lineGen = line()
      .x(d => xScale(d[1]))
      .y(d => yScale(d[2]))

    const points = []

    const countryGroups = countries.map(country => {
      return getLineForCountry(summedByCountryAndYear, xScale, yScale, lineGen, points)(country)

    })
    const delaunay = Delaunay.from(points)
    return { byCountryAndYear, summedByCountryAndYear, xExtent, yExtent, xScale, yScale, lineGen, countryGroups, delaunay, points }
  }, [data, yMax])
  const xTicks = xScale.ticks().map(tick => {
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
    if (i !== -1) {
      const country = points[i][2]
      setHoveredCountry(country)
    }
  }

  let hoveredLine = null
  if (hoveredCountry) {
    hoveredLine = getLineForCountry(summedByCountryAndYear, xScale, yScale, lineGen, [])(hoveredCountry, {showLabel: true})
  }
  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight} onMouseMove={hoverSvg}>

        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <g>{countryGroups}</g>
          <g>{xTicks}</g>
          <g>{yTicks}</g>
          {hoveredLine}
        </g>
      </svg>

    </div>
  )
}