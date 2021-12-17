
import './MiniMap.scss'
import {  sum, extent, groups } from 'd3-array'
import { scaleLinear,  scaleSequentialLog } from 'd3-scale'
import { interpolateRgb, piecewise } from 'd3-interpolate'
import valueFormatter from 'valueFormatter'
import { useState, useRef, useMemo, useEffect } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import useMapHook from '../hooks/useMapHook'
import Select from 'Select'
import Legend from 'Legend'
const categories = ['Fossil Fuel', 'Clean', 'Other']
const mapDataKeys = ['Total', ...categories]

const mapColors = {
  'Fossil Fuel': ['#fcf9f9', '#efc1a8', '#de622b'],
  'Clean': ['#f7fcfc', '#99dee3', '#44a39b'],
  Other: ['#f7fbfd', '#6abef0', '#5d97c7'],
  // 'Total': ['#f7fafa', '#000000']
}

const countryGroupings = [
  { value: 'institutionGroup', label: 'Institution Group' },
  { value: 'country', label: 'Recipient Country' },
]

function StackedBarSelector(props) {
  const { width, height, data, onChange, selectedDataKey } = props
  const summedData = useMemo(() => {
    const summedData = data.reduce(
      (acc, d) => {
        mapDataKeys.forEach(key => {
          const v = d[key]
          if (isNaN(v)) return
          acc[key] += d[key]
        })
        return acc
      },
      mapDataKeys.reduce((acc, key) => {acc[key] = 0; return acc}, {})
    )
    // console.log(summedData)
    return summedData
  }, [data])


  const rowHeight = height / 2
  const xScale = scaleLinear()
    .domain([0, summedData['Fossil Fuel'] + summedData.Clean + summedData.Other])
    .range([0, width])
  let runningX = 0
  const dataRects = categories.map((key, i) => {
    const isTotal = key === 'Total'
    const y = isTotal ? 0 : rowHeight
    const x = runningX
    const barWidth = isTotal ? width : xScale(summedData[key])
    const selected = selectedDataKey === key
    const style = { cursor: 'pointer', opacity: selected ? 1 : 0.5 }
    const textAnchor = isTotal ? 'start' : 'end'
    const textX = isTotal ? 5 : barWidth - 5
    const splitTextToTwoLines = width < 500
    const formattedValue = valueFormatter(summedData[key])
    let text = <text dy={rowHeight / 2 + 4} x={textX} textAnchor={textAnchor} fill='#fff'>{key} {formattedValue}</text>
    if (splitTextToTwoLines) {
      text = <g>
        <text dy={rowHeight / 2 - 2} x={textX} textAnchor={textAnchor} fill='#fff'>{key}</text>
        <text dy={rowHeight / 2 + 12} x={textX} textAnchor={textAnchor} fill='#fff'>{formattedValue}</text>
      </g>
    }
    runningX += barWidth
    if (runningX >= width) {
      runningX = 0
    }
    const dataTip = selected ? null : `Click and change the map to ${key}`

    return (
      <g key={key} style={style} transform={`translate(${x}, ${y})`} onClick={e => onChange(key)} data-tip={dataTip}>
        <rect fill={mapColors[key][2]} width={barWidth} height={rowHeight} />
        {text}
        {selected ? <polygon
          fill={mapColors[key][2]}
          transform={`translate(${barWidth - 40}, ${rowHeight - 1})`}
          points={`0,0 15,15 30,0`} />
         : null}
      </g>
    )
  })
  return (
    <svg className='StackedBarSelector' style={{ overflow: 'visible'}} width={width} height={height}>
      {dataRects}
    </svg>
  )
}

export default function MiniMap(props) {
  const { width, data, aggregationType, yearType, customYears } = props

  const collection = useMapHook()
  const height = width * 0.6
  const [countryGrouping, setCountryGrouping] = useState(countryGroupings[1].value)
  const countryAccessor = d => d[countryGrouping]
  const [dataKey, setSelectedDataKey] = useState(mapDataKeys[1])
  const countriesToHighlight = {
    'institutionGroup': ['China', 'Canada', 'Germany', 'Brazil'],
    'country': ['Brazil', 'Russian Federation', 'India', 'United States']
  }
  // const filteredData = selectedCategory ? data.filter(d => d.category === selectedCategory) : data
  const forceYears = [2013, 2020]
  if (yearType === 'custom') {
    forceYears[0] = customYears[0]
    forceYears[1] = customYears[1]
  }
  const countryRows = data.filter(d => d.institutionKind !== 'Multilateral')
    .filter(d => d.year >= forceYears[0] && d.year <= forceYears[1])
  const denominator = aggregationType === 'sum' ? 1 : (forceYears[1] - forceYears[0] + 1)
  const countryData = groups(countryRows, countryAccessor).map(v => ({country: v[0], values: v[1]})).map(cData => {

    const totalValue = sum(cData.values, d => d.amount) / denominator
    const categoryValues = {}
    // console.log(cData)
    categories.forEach(category => {
      categoryValues[category] = sum(cData.values.filter(d => d.category === category), d => d.amount) / denominator
    })
    return {
      ...cData,
      Total: totalValue,
      ...categoryValues,
    }
  })

  let tooltip = null

  const { path, pathStrings, centers} = useMemo(() => {
    const projection = geoMercator()
    const path = geoPath(projection)

    const padding = 0
    projection.fitExtent([[padding, padding], [width-padding, height- padding]], collection)

    const pathStrings = {}
    const centers = {}
    if (collection) {
      collection.features.forEach(feature => {
        if (!feature.id) {
          return null
        }
        const pathData = path(feature)
        pathStrings[feature.id] = pathData
        centers[feature.id] = path.centroid(feature)
      })
    }
    return { projection, path, pathStrings, centers}
  }, [width, height, collection])

  const smallWidth = width < 500
  // console.log(sorted)
  const dataExtent = extent(countryData, d => d[dataKey] ?  d[dataKey] : null)
  const fontSizeScale = scaleLinear()
    .domain(dataExtent)
    .range(smallWidth ? [0.75, 1.25] : [1, 2])
  const colorScale = scaleSequentialLog()
    .domain(dataExtent)
    // .range(mapColors[dataKey])
    .interpolator(
      piecewise(interpolateRgb, mapColors[dataKey]))
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const features =  !collection ? null : collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const pathData = pathStrings[feature.id]
    let fill = 'none'
    let stroke = null
    let matching = countryData.find(d => d.country.replace('*', '') === feature.properties.name)
    if (matching && matching[dataKey] && isFinite(matching[dataKey])) {
      fill = colorScale(matching[dataKey])
      // console.log(matching)
    } else {
      stroke = '#e8e8e8'
      // console.log('no match')
    }
    return (
      <path key={feature.id} stroke={stroke} d={pathData} fill={fill} onMouseOver={() => setHoveredFeature(feature.properties.name)} onMouseOut={() => setHoveredFeature(null)} />
    )
  })
  // console.log(hoveredFeature)

  const labels = !collection ? null : collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const center = centers[feature.id]
    let matching = countryData.find(d => d.country.replace('*', '') === feature.properties.name)
    let value = null
    if (!matching || !matching[dataKey] || !isFinite(matching[dataKey])) {
      return null
    }
    let visible = hoveredFeature ? feature.properties.name === hoveredFeature : countriesToHighlight[countryGrouping].includes(feature.properties.name)
    if (!visible) {
      return null
    }

    const fontSize = fontSizeScale(matching[dataKey])

    value = valueFormatter(matching[dataKey])
    return (
      <g style={{ fontSize: `${fontSize}em`}} transform={`translate(${center.join(',')})`} key={feature.id}>
        <text style={{  }}  textAnchor='middle'>{feature.properties.name}</text>
        <text style={{ fontSize: '2em' }} dy='1em'  textAnchor='middle'>{value}</text>
      </g>
    )
  })
  // console.log(countryData)
  const svgRef = useRef()
  const legendRef = useRef()
  useEffect(() => {
    const legend = Legend(colorScale, {
      tickFormat: valueFormatter,
      ticks: 3,
    })
    legendRef.current.append(legend);
    return () => legend.remove();
  })
  return (
    <div className="MiniMap">
      Group By: <Select options={countryGroupings} value={countryGrouping} onChange={setCountryGrouping} />

      <StackedBarSelector
        width={width}
        height={60}
        data={countryData}
        onChange={setSelectedDataKey}
        selectedDataKey={dataKey}
      />

      <div ref={legendRef} />

      <svg className='map' ref={svgRef} width={width} height={height}>
        <g>{features}</g>
        <g>{labels}</g>
      </svg>
      {tooltip}
    </div>
  )
}