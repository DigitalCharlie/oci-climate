
import { geoMercator, geoPath } from 'd3-geo'
import { useMemo, useRef, useState } from 'react'
import useMapHook from './useMapHook'
import exportSVG from './exportSVG'
import { groups, sum, mean, extent } from 'd3-array'
import { scaleLinear, scaleLog } from 'd3-scale'
import {colors} from './SmallMultiples'
import valueFormatter from './valueFormatter'

const mapColors = {
  'Fossil Fuel': ['#fcf9f9', '#a83c01'],
  'Clean': ['#f7fcfc', '#075a60'],
  Other: ['#f7fbfd', '#005080'],
  'Total': ['#f7fafa', '#000000']
}
function Map(props) {

  const { collection, data, dataKey } = props

  const width = 960
  const height = 480

  const svgRef = useRef()
  const rightClick = () => exportSVG(svgRef.current, `map$-${dataKey}.svg`)

  const { projection, path, pathStrings, centers} = useMemo(() => {
    const projection = geoMercator()
    const path = geoPath(projection)

    const padding = 0
    projection.fitExtent([[padding, padding], [width-padding, height- padding]], collection)

    const pathStrings = {}
    const centers = {}
    collection.features.forEach(feature => {
      if (!feature.id) {
        return null
      }
      const pathData = path(feature)
      pathStrings[feature.id] = pathData
      centers[feature.id] = path.centroid(feature)
    })
    return { projection, path, pathStrings, centers}
  }, [width, height, collection])

  const sorted = [...data].sort((a, b) => b[dataKey] - a[dataKey])
  sorted.forEach((d, i) => {
    d.sortedIndex = i
  })
  const colorScale = scaleLinear()
    .domain(extent(data, d => d[dataKey] ?  d[dataKey] : null))
    .range(mapColors[dataKey])
  console.log(extent(data, d => d[dataKey] ?  d[dataKey] : null))
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const features = collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const pathData = pathStrings[feature.id]
    let fill = 'none'


    let matching = data.find(d => d.country === feature.properties.name)
    if (matching && matching[dataKey] && isFinite(matching[dataKey])) {
      fill = colorScale(matching[dataKey])
      // console.log(matching)
    }
    return (
      <path key={feature.id} d={pathData} fill={fill} onMouseOver={() => setHoveredFeature(feature.properties.name)} onMouseOut={() => setHoveredFeature(null)} />
    )
  })

  const labels = collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const center = centers[feature.id]
    let matching = data.find(d => d.country === feature.properties.name)
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
        <text  textAnchor='middle'>{feature.properties.name} - {value}</text>
      </g>
    )
  })
  return (
    <div>

      <div>{dataKey}</div>
      <svg width={width} height={height} ref={svgRef} onContextMenu={rightClick}>
        <g>{features}</g>
        <g style={{ pointerEvents: 'none'}}>{labels}</g>
      </svg>
    </div>
  )


}

export default function Maps(props) {

  const map = useMapHook()
  const { data } = props
  const [startYear, setStartYear] = useState(2010)
  const [endYear, setEndYear] = useState(2020)
  const [metric, setMetric] = useState('sum')

  const optionStartYear = 2010
  const optionEndYear = 2021
  const yearOptions = []
  for (let i = optionStartYear; i <= optionEndYear; i++) {
    yearOptions.push(<option key={i} value={i}>{i}</option>)
  }

  const categories = ['Fossil Fuel', 'Clean', 'Other']

  const countryData = groups(data.filter(d => d.year >= startYear && d.year <= endYear), d => d.country).map(v => ({country: v[0], values: v[1]})).map(cData => {

    const rollup = metric === 'sum' ? sum : mean
    const totalValue = rollup(cData.values, d => d.amount)
    const categoryValues = {}
    categories.forEach(category => {
      categoryValues[category] = rollup(cData.values.filter(d => d.category === category), d => d.amount)
    })
    return {
      ...cData,
      Total: totalValue,
      ...categoryValues,
    }
  })
  console.log(countryData)
  const mapDataKeys = ['Total', ... categories]
  return (
    <div>
      <p>Showing sum of investments amounts in countries by type, missing countries could be due to names not matching up between datasets</p>
      <p>can filter years</p>
      <div>
        start year: <select value={startYear} onChange={e => setStartYear(e.target.value)}>
          {yearOptions}
        </select>
        end year: <select value={endYear} onChange={e => setEndYear(e.target.value)}>
          {yearOptions}
        </select>
        {/* metric: <select value={metric} onChange={e => setMetric(e.target.value)}>
          <option value='sum'>sum</option>
          <option value='average'>average</option>
        </select> */}

      </div>
      {map ? (
        mapDataKeys.map(dataKey => <Map key={dataKey} dataKey={dataKey} collection={map} data={countryData} />)) : null}
    </div>
  )
}
