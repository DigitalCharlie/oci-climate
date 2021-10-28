
import './MiniMap.scss'
import { rollup, sum, extent, groups } from 'd3-array'
import { scaleLinear, scaleLog } from 'd3-scale'
import valueFormatter from 'valueFormatter'
import { useState, useRef, useMemo } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import useMapHook from '../hooks/useMapHook'
import Select from 'Select'
const categories = ['Fossil Fuel', 'Clean', 'Other']
const mapDataKeys = ['Total', ... categories]

const mapColors = {
  'Fossil Fuel': ['#fcf9f9', '#a83c01'],
  'Clean': ['#f7fcfc', '#075a60'],
  Other: ['#f7fbfd', '#005080'],
  'Total': ['#f7fafa', '#000000']
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
          acc[key] += d[key]
        })
        return acc
      },
      mapDataKeys.reduce((acc, key) => {acc[key] = 0; return acc}, {})
    )
    console.log(summedData)
    return summedData
  }, [data])


  const rowHeight = height / 2
  const xScale = scaleLinear()
    .domain([0, summedData.Total])
    .range([0, width])
  let runningX = 0
  const dataRects = mapDataKeys.map((key, i) => {
    const isTotal = key === 'Total'
    const y = isTotal ? 0 : rowHeight
    const x = runningX
    const barWidth = xScale(summedData[key])
    const selected = selectedDataKey === key
    const style = { cursor: 'pointer', opacity: selected ? 1 : 0.5 }
    const textAnchor = isTotal ? 'start' : 'end'
    const textX = isTotal ? 5 : barWidth - 5
    runningX += barWidth
    if (runningX >= width) {
      runningX = 0
    }
    return (
      <g key={key} style={style} transform={`translate(${x}, ${y})`} onClick={e => onChange(key)}>
        <rect fill={mapColors[key][1]} width={barWidth} height={rowHeight} />
        <text dy={rowHeight / 2 + 4} x={textX} textAnchor={textAnchor} fill='#fff'>{key} {valueFormatter(summedData[key])}</text>
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
  const { width, data, isBank } = props

  const collection = useMapHook()
  const height = width * 0.6
  const [countryGrouping, setCountryGrouping] = useState(countryGroupings[0].value)
  const countryAccessor = d => d[countryGrouping]
  const [dataKey, setSelectedDataKey] = useState(mapDataKeys[0])

  // const filteredData = selectedCategory ? data.filter(d => d.category === selectedCategory) : data
  const countryData = groups(data, countryAccessor).map(v => ({country: v[0], values: v[1]})).map(cData => {

    const totalValue = sum(cData.values, d => d.amount)
    const categoryValues = {}
    // console.log(cData)
    categories.forEach(category => {
      categoryValues[category] = sum(cData.values.filter(d => d.category === category), d => d.amount)
    })
    return {
      ...cData,
      Total: totalValue,
      ...categoryValues,
    }
  })

  let tooltip = null

  const { projection, path, pathStrings, centers} = useMemo(() => {
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

  const sorted = [...countryData].sort((a, b) => b[dataKey] - a[dataKey])
  sorted.forEach((d, i) => {
    d.sortedIndex = i
  })
  const colorScale = scaleLog()
    .domain(extent(countryData, d => d[dataKey] ?  d[dataKey] : null))
    .range(mapColors[dataKey])
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const features =  !collection ? null : collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const pathData = pathStrings[feature.id]
    let fill = 'none'

    let matching = countryData.find(d => d.country === feature.properties.name)
    if (matching && matching[dataKey] && isFinite(matching[dataKey])) {
      fill = colorScale(matching[dataKey])
      // console.log(matching)
    } else {
      // console.log('no match')
    }
    return (
      <path key={feature.id} d={pathData} fill={fill} onMouseOver={() => setHoveredFeature(feature.properties.name)} onMouseOut={() => setHoveredFeature(null)} />
    )
  })

  const labels = !collection ? null : collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const center = centers[feature.id]
    let matching = countryData.find(d => d.country === feature.properties.name)
    let value = null
    if (!matching || !matching[dataKey] || !isFinite(matching[dataKey])) {
      return null
    }
    let hidden = matching.sortedIndex > 10 && feature.properties.name !== hoveredFeature
    if (hidden) {
      return null
    }

    value = valueFormatter(matching[dataKey])
    return (
      <g transform={`translate(${center.join(',')})`} key={feature.id}>
        <text style={{  }}  textAnchor='middle'>{feature.properties.name} - {value}</text>
      </g>
    )
  })
  console.log(countryData)
  const svgRef = useRef()
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

      <svg className='map' ref={svgRef} width={width} height={height}>
        <g>{features}</g>
        <g>{labels}</g>
      </svg>
      {tooltip}
    </div>
  )
}