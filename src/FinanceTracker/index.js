
import './styles.scss'
import Switch from 'DataView/Switch'
import React, { useEffect, useState, useRef } from 'react'
import useFinanceTrackerData, {financeTrackerAmountKey} from 'hooks/useFinanceTrackerData'
import infoIcon from 'images/info_icon.svg'
import ReactTooltip from 'react-tooltip'
import { colors } from '@react-spring/shared'
import { color as d3Color} from 'd3-color'
import classNames from 'classnames'
import useWindowSize from 'hooks/useWindowSize'
import Select from 'Select'
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
  'Red': '#D71921',
  'Orange': '#f5922f',
  'Yellow': '#F7C952',
  'Green': '#075A60',
}
const legendDescriptions = {
  'Red': 'No exclusions',
  'Orange': 'Single exclusion',
  'Yellow': 'Multi-exclusion',
  'Green': 'Full exclusions',
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
  return `$${value.toLocaleString()}M`
}
export default function FinanceTracker(props) {

  const [selectedFinanceType, setSelectedFinanceType] = useState(financeTypes[0])
  const data = useFinanceTrackerData(selectedFinanceType.file)
  const [hoveredDot, setHoveredDot] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const tableContainer = useRef()
  const {width, height} = useWindowSize()
  const [sortIndex, setSortIndex] = useState(0)
  const singleColumnView = width < 768
  const sortOptions = [
    {
      label: 'A-Z',
      sort: (a, b) => a[selectedFinanceType.firstColumnLabel].localeCompare(b[selectedFinanceType.firstColumnLabel]),
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
    label: policyType.split(' ')[0],
    accessor: d => dot(d, policyType, hoverDot),
    theadStyle: { textAlign: 'center', width: '45px' },
    tbodyStyle: { width: '45px'}, // (10/policyTypes.length) + 'em' },
  }))

  const defaultColumns = [
    {
      label: selectedFinanceType.firstColumnLabel,
      accessor: d => d[selectedFinanceType.firstColumnLabel],
      tbodyStyle: { fontWeight: 'bold' },
    },
    {
      label: financeTrackerAmountKey,
      accessor: d => formatValue(d[financeTrackerAmountKey]),
      theadStyle: { width: '13em'},
      tbodyStyle: { fontWeight: 'bold' },
    },
    {
      label: 'Institution',
      accessor: d => d.Institutions,

    },
  ].filter(d => {
    if (selectedFinanceType === financeTypes[1] || singleColumnView) {
      if (d.label === 'Institution') {
        return false
      }
    }
    return true
  })
  const columns = [
    ...defaultColumns,
    ...policyTypeColumns,
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
          <td colSpan={policyTypeColumns.length} style={{ width: '15em', textAlign: 'center'}}>(hover a dot to see details)</td>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(row => {
          const key = columns[0].accessor(row)
          return <React.Fragment key={key}>
            <tr className='table' onClick={() => setSelectedCountry(key)}>
              {columns.map(column => <td style={column.tbodyStyle} key={column.label}>{column.accessor(row)}</td>)}
            </tr>
            <tr className='policies' >
              <td colSpan={columns.length}>
                <div className={classNames({ open: key=== selectedCountry })}>
                  {policyTypes.map(policyType => {
                    const key = `${policyType} Policies`
                    const color = d3Color(dotColors[row[`${policyType} Colour`]])
                    return (
                      <div key={policyType} style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)` }}>
                        <div>{key}</div>
                        <div>
                          {row[key]}
                        </div>
                      </div>
                    )
                  })}
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
          <div>
            <div className='dot' style={{ backgroundColor: dotColors[color] }} key={color} />
            {legendDescriptions[color]}
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <div className={classNames('FinanceTracker', { singleColumnView })}>
      <div>
        <h2>Fossil Free Public Finance Tracker
          <img src={infoIcon} data-tip='Lorem ipsum dollar...' />
        </h2>

        <div className='description'>
          <p>
            Last update: DD/MM/YYYY, from Still Digging (2020) by Friends of the Earth US and OCI
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Sed ut perspiciatis unde omnis istpoe natus error sit voluptatem accusantium doloremque eopsloi laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunot explicabo. Nemo ernim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sedopk quia consequuntur magni dolores eos qui rationesopl voluptatem sequi nesciunt. Neque porro quisquameo est, qui dolorem ipsum quia dolor sit amet, eopsmiep consectetur, adipisci velit, seisud quia non numquam eius modi tempora incidunt ut labore et dolore wopeir magnam aliquam quaerat voluptatem eoplmuriquisqu
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
            <div>
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
