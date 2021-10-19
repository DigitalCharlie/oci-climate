import { useMemo, useRef } from "react"

import { flatRollup, extent, sum } from "d3-array"
import { area, stack, stackOrderNone, stackOffsetNone } from "d3-shape"
import { scaleLinear } from "d3-scale"
import valueFormatter from './valueFormatter';
import exportSVG from "./exportSVG";
import './SmallMultiples.scss'
const colors = {
  'Clean': 'green',
  'Fossil Fuel': 'grey',
  'Other': 'lightblue',
}
function Graph(props) {
  const { data, country} = props

  const width = 300
  const height = 200
  const svgRef = useRef()
  const margins = {
    top: 10, left: 60, bottom: 20, right: 20
  }
  console.log(country)

  const categories = useMemo(() =>
    Array.from(new Set(data.map(d => d[2]))).filter(d => d !== '')
  , [data])
  const transposedData = []
  data.forEach(row => {
    const matchingYear = transposedData.find(d => d.year === row[1])
    if (matchingYear) {
      matchingYear[row[2]] = row[3]
    } else {
      transposedData.push({ year: row[1], [row[2]]: row[3]})
    }
  })
  console.log(transposedData)
  const stackedData = stack()
    .keys(categories)
    .value((d, key) => {
      if (d[key]) {
        return d[key]
      }
      return 0
    })
    .order(stackOrderNone)
    .offset(stackOffsetNone)
    (transposedData)
  console.log(categories)
  console.log(data)
  console.log(stackedData)

  const yDomain = extent(stackedData.flat(2))
  const xDomain = extent(transposedData, d => d.year)
  console.log(xDomain, yDomain)

  const xScale = scaleLinear()
    .domain(xDomain)
    .range([0,width])

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([height, 0])


  const areaGen = area()
    .x(d => xScale(d.data.year))

    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2));

  const paths = stackedData.map(stack => {
    const path = areaGen(stack)
    console.log(stack)
    const fill = colors[stack.key]
    return <path d={path} key={stack.key} fill={fill} />
  })

  const yearTicks = xScale.ticks().map(tick => {
    if (tick !== Math.round(tick)) {
      return null
    }
    return (
      <g key={tick} transform={`translate(${xScale(tick)}, ${height})`}>
        <line y2={3} stroke='black' />
        <text textAnchor='middle' y={12}>{tick}</text>
      </g>
    )
  })

  const yTicks = yScale.ticks().map(tick => {
    return (
      <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
        <line x2={-3} stroke='black' />
        <text textAnchor='end' x={-5}>{valueFormatter(tick)}</text>
      </g>
    )
  })
  const rightClick = (event) => {
    exportSVG(svgRef.current, `change-${country}.svg`)
  }
  return (
    <div>
      <div>{country}</div>
      <svg width={width + margins.left + margins.right}
        height={height + margins.top + margins.bottom}
      ref={svgRef}
      fontSize="0.8em"
      onContextMenu={rightClick}
      >
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <g>{paths}</g>
          <g>{yearTicks}</g>
          <g>{yTicks}</g>
        </g>

      </svg>
    </div>
  )
}

export default function SmallMultiples(props) {
  const {data } = props

  const graphs = useMemo(() => {
    const summedByCountryAndYear = flatRollup(data, rows => sum(rows, d => d.amount), d => d.country, d => d.year, d=> d.category)

    console.log(summedByCountryAndYear)
    const xExtent = extent(summedByCountryAndYear, d => d[1])
    const yExtent = extent(summedByCountryAndYear, d => d[2])
    console.log(xExtent, yExtent)
    summedByCountryAndYear.sort((a, b) => a[1] - b[1])

    const countries = Array.from(new Set(summedByCountryAndYear.map(d => d[0]))).sort()
    console.log(countries)
    return countries.map(country => {
        const countryData = summedByCountryAndYear.filter(d => d[0] === country)
        return <Graph key={country} data={countryData} country={country} />
      })

  }, [data])
  return (
    <div>
      <div>
        {Object.keys(colors).map(category => {
          const color = colors[category]
          return (
            <span key={category} style={{ color: color, fill: color, marginRight: '1em', 'display': 'inline-block'}}>
              <span style={{ display: 'inline-block', width: '1em', height: '1em', backgroundColor: color}}></span>
              <span>{category}</span>
            </span>
          )
        })}

      </div>
      <div className='smallMultiples'>
        {graphs}
      </div>
    </div>
  )
}
