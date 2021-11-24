
import './styles.scss'
import Switch from 'DataView/Switch'
import { useEffect, useState } from 'react'
import useFinanceTrackerData, {financeTrackerAmountKey} from 'hooks/useFinanceTrackerData'
import infoIcon from 'images/info_icon.svg'
import ReactTooltip from 'react-tooltip'
import { colors } from '@react-spring/shared'
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
  'Red': 'No restriction/policy',
  'Orange': 'Partial restrictions/policies',
  'Yellow': 'Partial restrictions/policies',
  'Green': 'Full restrictions/policies',
}
const policyTypes = ['Coal Exclusion', 'Oil Exclusion', 'Gas Exclusion', 'Indirect Finance']
const dot = (row, policyType) => {
  const color = dotColors[row[`${policyType} Colour`]]
  return (
    <div className='dot' style={{ backgroundColor: color }} />
  )
}
const formatValue = (value) => {
  return `$ ${value.toLocaleString()}M`
}
export default function FinanceTracker(props) {

  const [selectedFinanceType, setSelectedFinanceType] = useState(financeTypes[0])
  const data = useFinanceTrackerData(selectedFinanceType.file)

  const policyTypeColumns = policyTypes.map(policyType => ({
    label: policyType.split(' ')[0],
    accessor: d => dot(d, policyType),
    theadStyle: { textAlign: 'center' },
    tbodyStyle: { width: (10/policyTypes.length) + 'em' },
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
    if (selectedFinanceType === financeTypes[1]) {
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
  console.log(columns)

  let tracker = null
  useEffect(() => {
    ReactTooltip.rebuild()
  })
  if (data) {
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
        {data.map(row => {
          return <tr key={columns[0].accessor(row)}>
            {columns.map(column => <td style={column.tbodyStyle} key={column.label}>{column.accessor(row)}</td>)}
          </tr>
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
    <div className='FinanceTracker'>
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
          </div>
          {legend}
        </div>
      </div>
      {tracker}
    </div>
  )
}