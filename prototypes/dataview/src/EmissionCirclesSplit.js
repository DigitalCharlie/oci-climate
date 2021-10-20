import { flatGroup, sum, mean , max} from 'd3-array'
import { scaleSqrt } from 'd3-scale'

import React, { useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import exportSVG from './exportSVG'
import valueFormatter from './valueFormatter'
const categories = ['Fossil Fuel', 'Clean', 'Other']

const colors = {
  'Fossil Fuel': '#EFC1A8',
  'Clean': '#99DEE3',
  'Other': '#6ABEF0'
}


function CircleGraphDuo(props) {

  const { country, dataFrames } = props
  const maxValue = max(categories.map(category => max(dataFrames, frame => frame[category])))

  const paddingLeft = 125
  const paddingRight = 125
  const maxRadius = 60
  const svgHeight = 20 + maxRadius * 2
  const svgWidth = maxRadius * 4 + paddingLeft + paddingRight
  const radiusScale = scaleSqrt()
    .domain([0, maxValue])
    .range([0, maxRadius])

  const svgRef = useRef()

  // console.log(maxValue, dataFrames)

  const springValues = {}
  dataFrames.forEach((frame, frameIndex) => {
    categories.forEach(category => {
      const v = frame[category]
      const r = v === 0 ? 0 : radiusScale(v)
      springValues[`${category}-${frameIndex}-value`] = v
      springValues[`${category}-${frameIndex}-r`] = r

    })
  })
  const spring = useSpring(springValues)

  const circleGroups = dataFrames.map((frame, frameIndex) => {


    const sortedCategories = [...categories].sort((a, b) => {
      const aValue = frame[a]
      const bValue = frame[b]
      return bValue - aValue
    })
    const frameCirlces = sortedCategories.map((category, index) => {
      const fill = colors[category]
      const value = frame[category]
      let stroke = index === 0 ? null : 'white'
      return (
        <g key={category}>
          <animated.circle
            cx={paddingLeft + maxRadius + (frameIndex * maxRadius * 2) }
            cy={spring[`${category}-${frameIndex}-r`].to(v => svgHeight - v)}
            fill={fill}
            r={spring[`${category}-${frameIndex}-r`]}
            stroke={stroke}
            strokeWidth={2}
            strokeDasharray='5, 5'
          />
          {
            value !== 0 ? <React.Fragment>
              <animated.text
                dy={4}
                fill='#777'
                textAnchor={frameIndex === 0 ? 'end' : ''}
                y={spring[`${category}-${frameIndex}-r`].to(v => svgHeight - v)}
                x={paddingLeft + (frameIndex === 0 ? - 10 : maxRadius * 4 + 10)}>
                {category}
                <animated.tspan>{spring[`${category}-${frameIndex}-value`].to(v => ` (${valueFormatter(v)})`)}</animated.tspan>
              </animated.text>
              <animated.line
                y1={spring[`${category}-${frameIndex}-r`].to(v => svgHeight - v)}
                y2={spring[`${category}-${frameIndex}-r`].to(v => svgHeight - v)}
                x1={spring[`${category}-${frameIndex}-r`].to(v => paddingLeft + maxRadius + v + (frameIndex === 0 ? -v * 2 : maxRadius * 2))}
                x2={paddingLeft+(frameIndex === 0 ? -10 : maxRadius * 4+10)}
                stroke='#777'
              />
            </React.Fragment> : null
          }
        </g>
      )
    })

    return (
      <g clipPath={`url(#clipPathFrame${frameIndex})`}>
        <text textAnchor='middle' x={(frameIndex * 2 + 1) * maxRadius + paddingLeft} >{frame.startYear} - {frame.endYear}</text>
        {frameCirlces}
      </g>
    )
  })

  const printDataFrames = fs => {
    return fs.map(frame =>
      categories.map(category => `${category}: ${valueFormatter(frame[category])}`)
    ).join('')
  }
  const rightClick = () => {
    exportSVG(svgRef.current, `${country}.svg`)
  }
  return (
    <div
      style={{ marginBottom: '3em'}}
    >
      <div style={{ textAlign: 'center'}}>{country}
      </div>
      <br />
      <svg ref={svgRef} onContextMenu={rightClick} style={{ overflow: 'visible' }} width={svgWidth} height={svgHeight}>
        <defs>

        </defs>
        {circleGroups}

      </svg>
      {/* <div>{printDataFrames(dataFrames)}</div> */}
    </div>
  )
}


function CircleGraph(props) {

  const { country, dataFrames, duo } = props
  const [dataFrameIndex, setDataFrameIndex] = useState(1)
  const maxValue = max(categories.map(category => dataFrames[dataFrameIndex][category]))

  const svgHeight = 200
  const paddingLeft = 10
  const paddingRight = 140
  const maxRadius = 90
  const svgWidth = maxRadius * 2 + paddingLeft + paddingRight
  const radiusScale = scaleSqrt()
    .domain([0, maxValue])
    .range([0, maxRadius])


  const sortedCategories = [...categories].sort((a, b) => {
    const aValue = dataFrames[dataFrameIndex][a]
    const bValue = dataFrames[dataFrameIndex][b]
    return bValue - aValue
  })
  const springValues = {
    startYear: dataFrames[dataFrameIndex].startYear,
    endYear: dataFrames[dataFrameIndex].endYear
  }
  sortedCategories.forEach(category => {
    const v = dataFrames[dataFrameIndex][category]
    springValues[category] = v === 0 ? 0 : radiusScale(v)
    springValues[`${category}-label`] = v
  })
  const values = useSpring(springValues)
  const circles = sortedCategories.map((category, index) => {
    const fill = colors[category]
    const value = dataFrames[dataFrameIndex][category]
    let stroke = index === 0 ? null : 'white'
    return (
      <g key={category}>
        <animated.circle
          cx={paddingLeft + maxRadius }
          cy={values[category].to(v => svgHeight - v)}
          fill={fill}
          r={values[category]}
          stroke={stroke}
          strokeWidth={2}
          strokeDasharray='5, 5'
        />
        {
          value !== 0 ? <React.Fragment>
            <animated.text dy={4} fill='#777' y={values[category].to(v => svgHeight - v)} x={paddingLeft + maxRadius * 2 + 10}>
              {category}
              <animated.tspan>{values[`${category}-label`].to(v => ` (${valueFormatter(v)})`)}</animated.tspan>
            </animated.text>
            <animated.line
              y1={values[category].to(v => svgHeight - v)}
              y2={values[category].to(v => svgHeight - v)}
              x1={values[category].to(v => paddingLeft + maxRadius + v)}
              x2={paddingLeft+maxRadius * 2+10}
              stroke='#777'
            />
          </React.Fragment> : null
        }
      </g>
    )
  })
  const printDataFrames = fs => {
    return fs.map(frame =>
      categories.map(category => `${category}: ${valueFormatter(frame[category])}`)
    ).join('')
  }
  return (
    <div
      style={{ marginBottom: '3em'}}
      onMouseOver={e => setDataFrameIndex(0)}
      onMouseOut={e =>setDataFrameIndex(1)}
    >
      <div>{country}{' '}
        <animated.span>{values.startYear.to(Math.round)}</animated.span>
        {' - '}
        <animated.span>{values.endYear.to(Math.round)}</animated.span>
      </div>
      <svg width={svgWidth} height={svgHeight}>
        {circles}
      </svg>
      {/* <div>{printDataFrames(dataFrames)}</div> */}
    </div>
  )
}

export default function EmissionCircles(props) {

  const { data } = props
  const [metric, setMetric] = useState('sum')

  const byCountryAndYear = flatGroup(data, d=> d.country)
    .sort((a, b) => a[0].localeCompare(b[0]))

  // console.log(byCountryAndYear)

  const countries = Array.from(new Set(byCountryAndYear.map(d => d[0])))

  // console.log(countries)
  const countryGroups = countries.map(country => {
    const countryRows = byCountryAndYear.filter(d => d[0] === country)[0][1]
    const frames = [
      { startYear: 2013, endYear: 2016 },
      { startYear: 2017, endYear: 2020}
    ]

    const dataFrames = frames.map(({startYear, endYear}) => {
      const rowsInFrame = countryRows.filter(d => d.year >= startYear && d.year <= endYear)
      const rollup = metric === 'sum' ? sum : mean
      const values = {startYear, endYear}
      categories.forEach(category => {
        const categoryRows = rowsInFrame.filter(d => d.category === category)
        // console.log(rowsInFrame.length, categoryRows.length, rowsInFrame)
        const value = categoryRows.length ? rollup(categoryRows, d => d.amount) : 0
        values[category] = value
      })
      return values

    })
    return (

      <CircleGraphDuo key={country} country={country} dataFrames={dataFrames} />
    )
  })
  return (
    <div style={{ fontSize: '0.8em'}}>
      metric: <select value={metric} onChange={e => setMetric(e.target.value)}>
        <option value='sum'>sum</option>
        <option value='average'>average</option>
      </select>
      <p>Showing investments by type per country 2013-16 vs 2017-20</p>
      <div style={{ display: 'flex', flexWrap: 'wrap'}}>
        {countryGroups}
      </div>
    </div>
  )
}
