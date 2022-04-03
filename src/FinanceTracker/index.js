
import './styles.scss'
import Switch from 'DataView/Switch'
import React, { useEffect, useState, useRef } from 'react'
import useFinanceTrackerData, {financeTrackerAmountKey} from 'hooks/useFinanceTrackerData'
import ReactTooltip from 'react-tooltip'
import { color as d3Color} from 'd3-color'
import classNames from 'classnames'
import useWindowSize from 'hooks/useWindowSize'
import Select from 'Select'
import { csvParse } from 'd3-dsv'
import Linkify from 'react-linkify'
const financeTypes = [
  {
    label: 'Bilateral Institutions',
    file: `${process.env.PUBLIC_URL}/FinanceTrackerCountriesTableOnly.csv`,
    firstColumnLabel: 'Country',
  },
  {
    label: 'Multilateral Institutions',
    file: `${process.env.PUBLIC_URL}/FinanceTrackerMDBsTableOnly.csv`,
    firstColumnLabel: 'MDB',
  }
]

const dotColors = {
  // OLD COLORS
  // 'Red': '#D71921',
  // 'Orange': '#f5922f',
  // 'Yellow': '#F7C952',
  // 'Green': '#075A60',
  // NEW COLORS
  'Red': '#FF4242',
  'Orange': '#AB7800',
  'Yellow': '#FFB300',
  'Green': '#A4BA45',
}
const legendDescriptions = {
  'Red': 'No Exclusions',
  'Orange': 'Single Partial Exclusion',
  'Yellow': 'Multiple Partial Exclusions',
  'Green': 'Full Exclusion',
}

const policyTypes = ['Coal Exclusion', 'Oil Exclusion', 'Gas Exclusion', 'Indirect Finance']
const dot = (row, policyType, hoverDot) => {
  const color = dotColors[row[`${policyType} Colour`]]
  const explanation = row[`${policyType} Policies`]

  return (
    <div
      className='dot'
      style={{ backgroundColor: color, }}
      onMouseMove={hoverDot(color, explanation, policyType)}
      onMouseOver={hoverDot(color, explanation, policyType)}
      onMouseOut={hoverDot(null)}
    />
  )
}
const formatValue = (value) => {
  if (value > 1000) {
    return `$${(value / 1000).toFixed(1)}B`
  }
  return `$${value.toLocaleString()}M`
}
export default function FinanceTracker(props) {

  const [selectedFinanceType, setSelectedFinanceType] = useState(financeTypes[0])
  const data = useFinanceTrackerData(selectedFinanceType.file)
  const [hoveredDot, setHoveredDot] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const tableContainer = useRef()
  const {width} = useWindowSize()
  const [sortIndex, setSortIndex] = useState(0)
  const singleColumnView = width < 768
  const [sources, setSources] = useState(null)
  useEffect(() => {
    window.fetch( `${process.env.PUBLIC_URL}/Sources.csv`,)
      .then(response => response.text())
      .then(text => {
        setSources(csvParse(text))
      })
  }, [])
  const sortOptions = [
    {
      label: 'A-Z',
      sort: (a, b) => {
        const aLabel = a.Country || a.MDB
        const bLabel = b.Country || b.MDB
        return aLabel.localeCompare(bLabel)
        // a[selectedFinanceType.firstColumnLabel].localeCompare(b[selectedFinanceType.firstColumnLabel]),
      },
      value: 0,
    },
    {
      label: 'Average Amount',
      sort: (a, b) => b[financeTrackerAmountKey] - a[financeTrackerAmountKey],
      value: 1,
    }
  ]

  const hoverDot = (color, explanation, policyType) => {
    return (event) => {
      // if (event)
      if (window.innerWidth < 768 && 'ontouchstart' in window) {
        return
      }
      if (!color) {
        setHoveredDot(null)
        return
      }
      const tablePosition = tableContainer.current.getBoundingClientRect()
      const x = event.clientX - tablePosition.left
      const y = event.clientY - tablePosition.top
      setHoveredDot({ color, explanation, policyType, x ,y })
    }
  }
  const policyTypeColumns = policyTypes.map(policyType => ({
    label: policyType === 'Indirect Finance' ? policyType : policyType.split(' ')[0],
    accessor: d => dot(d, policyType, hoverDot),
    theadStyle: { textAlign: 'center', width: '45px', paddingBottom: 0 },
    tbodyStyle: { width: '45px'}, // (10/policyTypes.length) + 'em' },
  }))

  const defaultColumns = [
    {
      label: selectedFinanceType.firstColumnLabel,
      accessor: d => d[selectedFinanceType.firstColumnLabel],
      tbodyStyle: { fontWeight: 'bold' },
    },
    {
      label: `${financeTrackerAmountKey} / Billions`,
      accessor: d => formatValue(d[financeTrackerAmountKey]),
      theadStyle: { width: '13em'},
      tbodyStyle: { fontWeight: 'bold', fontSize: '0.875em' },
    },
    {
      label: 'Institution(s)',
      accessor: d => d.Institutions,
      tbodyStyle: { fontSize: '0.8em'}

    },
  ].filter(d => {
    if (selectedFinanceType === financeTypes[1] || singleColumnView) {
      if (d.label === 'Institution(s)') {
        return false
      }
    }
    return true
  })
  const columns = [
    ...defaultColumns,
    ...policyTypeColumns,
    {
      label: '',
      accessor: d => columns[0].accessor(d) === selectedCountry ? '–' : '+',
      tbodyStyle: { fontWeight: 'bold', fontSize: '1.25em', paddingRight: '0.25em', width: '1em' },
    }
  ]
  // console.log(columns)

  let tracker = null
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  let dotTooltip = null
  if (hoveredDot) {
    const color = d3Color(hoveredDot.color)
    const tooltipStyle = {
      transform: `translate(${hoveredDot.x - 5}px, ${hoveredDot.y - 5}px) translateX(-100%)`,

    }
    const contentStyle = {
      backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
    }
    dotTooltip = (
      <div className='dotTooltip' style={tooltipStyle}>
        <div className='dotTooltip-content' style={contentStyle}>
          <div className='dot-tooltip-title'>
            {hoveredDot.policyType} Policies
          </div>
          <div className='dot-tooltip-description'>
            {hoveredDot.explanation}
          </div>
        </div>
     </div>
    )
  }
  if (data) {
    const sortedData = [...data].sort(sortOptions[sortIndex].sort)
    tracker = (<table>
      <thead>
        <tr>
          {defaultColumns.map(column => (
            <td key={column.label} rowSpan={2} style={column.theadStyle}>{column.label}</td>
          ))}
          {policyTypeColumns.map(policyType => <td key={policyType.label} style={policyType.theadStyle}>{policyType.label}</td>)}
        </tr>
        <tr>
          <td colSpan={policyTypeColumns.length} style={{ width: '15em', textAlign: 'center'}}>(hover  over dot to see details)</td>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(row => {
          const key = columns[0].accessor(row)
          const hasSource = sources ? sources.find(source => source.Institution === key) : false
          return <React.Fragment key={key}>
            <tr className='table' onClick={() => setSelectedCountry(country => country === key ? null : key)}>
              {columns.map(column => <td style={column.tbodyStyle} key={column.label}>{column.accessor(row)}</td>)}
            </tr>
            <tr className='policies' >
              <td colSpan={columns.length}>
                <div className={classNames({ open: key=== selectedCountry })}>
                  <div className='policyList'>
                    {policyTypes.map(policyType => {
                      const key = `${policyType} Policies`
                      const color = d3Color(dotColors[row[`${policyType} Colour`]])
                      return (
                        <div className='policy' key={policyType} style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)` }}>
                          <div>{key}</div>
                          <div>
                            {row[key]}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {hasSource ? <div className='sources'><strong>Sources</strong><p><Linkify>{hasSource.Source}</Linkify></p></div> : null}
                </div>
              </td>
            </tr>
            <tr className='spacer'><td></td></tr>
          </React.Fragment>
        })}
      </tbody>
    </table>)
  }

  const legend = (
    <div className='legend'>
      <div className='legend-title'>
        Exclusion Policies Situation color indicator:
      </div>
      <div className='legend-items'>
        {Object.keys(dotColors).map(color => (
          <div key={color}>
            <div className='dot' style={{ backgroundColor: dotColors[color] }} key={color} />
            {legendDescriptions[color]}
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <div style={{ marginTop: props.headerHeight }} className={classNames('FinanceTracker', { singleColumnView })}>
      <div>
        <div className='description'>
          <h1>Fossil Free Policy Tracker</h1>
          <p>
            In order to ensure a safe climate for all, it is critical that public finance institutions end their support for fossil fuel projects and instead use their unique influence to catalyze a just energy transition. After years of promises, more institutions are finally starting to act. The joint Statement on International Public Support for the Clean Energy Transition at COP26 in Glasgow was an important landmark with 39 countries and institutions committing to end their public finance for fossil fuels by the end of 2022. 
          </p>
          <p>
            This interactive table tracks G20 country and multilateral development bank policies to exclude international public finance for fossil fuels from export credit agencies, bilateral development finance institutions, and multilateral development banks. We include policies dealing with coal, oil, and gas across the supply chain as well as “indirect” public finance for fossil fuels through related infrastructure, advisory services, technical assistance, policy support, and financial intermediaries.
          </p>
          <p>
            <strong>How to use:</strong> Toggle to see the country-level or multilateral development bank report card, and hover or click the + sign to see more details.  
          </p>
          <p>
            Last update: March 25, 2022
          </p>
        </div>
        <div className='controls'>
          <div>
            <Switch
              style={{
                backgroundColor: 'transparent',
                padding: '0.2em 0'
              }}
              value={selectedFinanceType === financeTypes[0]}
              label=''
              label1={financeTypes[0].label}
              label2={financeTypes[1].label}
              toggle={() => setSelectedFinanceType(selectedFinanceType === financeTypes[0] ? financeTypes[1] : financeTypes[0])}
            />
            <div className="sortBy">
              Sort by:{' '}
              <Select
                value={sortIndex}
                options={sortOptions}
                onChange={setSortIndex}
              />
            </div>
          </div>
          {legend}
        </div>
      </div>
      <div ref={tableContainer} className='tableContainer'>
        {tracker}
        {dotTooltip}
      </div>
    </div>
  )
}
