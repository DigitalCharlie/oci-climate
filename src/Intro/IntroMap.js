
import './IntroMap.scss'
import { sum, groups } from 'd3-array'
import { scaleOrdinal } from 'd3-scale'

import {  useRef, useMemo } from 'react'
import { geoMercator, geoPath } from 'd3-geo'

import { animated, useSpring } from '@react-spring/web'
import { easeCubic } from 'd3-ease'
const colors = {
  'Fossil Fuel': '#F4A77E',
  'Clean':'#63CAD1'
}
const categories = ['Fossil Fuel', 'Clean', 'Other']

function Bars(props) {
  const { maxBarHeight, showBars, barWidth, delay, duration } = props
  const bar1Height = showBars ? maxBarHeight : 0
  const bar2Height = showBars ? maxBarHeight * 0.333 : 0
  const barHeights = useSpring({
    bar1Height, bar2Height,
    delay,
    config: {
      easing: easeCubic,
      duration,
    }
  })
  return (
    <g>
      <animated.rect width={barWidth} height={barHeights.bar1Height} fill={colors['Fossil Fuel']} x={-barWidth} y={barHeights.bar1Height.to(d => maxBarHeight - d)} />
      <animated.rect width={barWidth} height={barHeights.bar2Height} fill={colors['Clean']} x={0} y={barHeights.bar2Height.to(d => maxBarHeight - d)} />
    </g>
  )
}
export default function IntroMap(props) {
  const { width, height, data, collection, showBars, filled, opacity } = props

  const countryGrouping = 'institutionGroup'
  const countryAccessor = d => d[countryGrouping]
  const dataKey = 'Total'
  // const filteredData = selectedCategory ? data.filter(d => d.category === selectedCategory) : data
  const forceYears = [2013, 2020]

  const countryRows = data.filter(d => !d.isBank)
    .filter(d => d.year >= forceYears[0] && d.year <= forceYears[1])
  const denominator = 1
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
  // console.log(countryRows)

  const { path, pathStrings, centers} = useMemo(() => {
    const projection = geoMercator()
    const path = geoPath(projection)

    const paddingTop = -height * 0.1
    const paddingLeft = 0

    projection.fitExtent([[paddingLeft, paddingTop], [width-paddingLeft, height- paddingTop]], collection)

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

  const colorScale = scaleOrdinal()
    .range(['#888', '#777', '#999', '#aaa', '#bbb', '#ccc'])
  const delayScale = scaleOrdinal()
    .range([300,  600,  1000, 1400])
  const durationScale = scaleOrdinal()
    .range([2000, 3000, 4000, 5000])
  const features =  !collection ? null : collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const pathData = pathStrings[feature.id]
    let fill = 'none'
    let stroke = null
    let matching = countryData.find(d => d.country === feature.properties.name)
    if (filled && matching && matching[dataKey] && isFinite(matching[dataKey])) {
      fill = colorScale(matching[dataKey])
      // console.log(matching)
    } else {
      stroke = '#e8e8e8'
      fill = '#eee'
      // console.log('no match')
    }
    return (
      <path key={feature.id} style={{ stroke, fill }} d={pathData} />
    )
  })
  const bars = !collection ? null : collection.features.map(feature => {
    if (!feature.id) {
      return null
    }
    const center = centers[feature.id]
    let matching = countryData.find(d => d.country === feature.properties.name)
    if (!matching || !matching[dataKey] || !isFinite(matching[dataKey])) {
      return null
    }
    // let hidden = matching.sortedIndex > 10 && feature.properties.name !== hoveredFeature
    // if (hidden) {
    //   return null
    // }

    return (
      <g transform={`translate(${center.join(',')})`} key={feature.id}>
        <Bars delay={delayScale(feature.id)} duration={durationScale(feature.id)} barWidth={height * 0.1 * 0.2} maxBarHeight={height * 0.1} showBars={showBars} />
      </g>
    )
  })
  const svgRef = useRef()
  return (
    <div className="IntroMap" style={{ opacity }}>

      <svg className='map' ref={svgRef} width={width} height={height}>
        <g>{features}</g>
        <g>{bars}</g>
      </svg>
    </div>
  )
}