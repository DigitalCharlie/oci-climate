
import './styles.scss'
import Switch from 'DataView/Switch'
import { useState } from 'react'
import useFinanceTrackerData, {financeTrackerAmountKey} from 'hooks/useFinanceTrackerData'
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
  'Yellow': '#F7C952',
  'Red': '#D71921',
  'Orange': '#f5922f',
  'Green': '#075A60',
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


  const columns = [
    {
      label: selectedFinanceType.firstColumnLabel,
      accessor: d => d[selectedFinanceType.firstColumnLabel],
      tbodyStyle: { fontWeight: 'bold' },
    },
    {
      label: financeTrackerAmountKey,
      accessor: d => formatValue(d[financeTrackerAmountKey]),
      theadStyle: { maxWidth: '13em'},
      tbodyStyle: { fontWeight: 'bold' },
    },
    {
      label: 'Institution',
      accessor: d => d.Institutions,
    },
    ...policyTypeColumns,
  ]

  let tracker = null
  if (data) {
    tracker = (<table>
      <thead>
        <tr>
          <td rowSpan={2}>{columns[0].label}</td>
          <td rowSpan={2} style={columns[1].theadStyle}>{columns[1].label}</td>
          <td rowSpan={2}>{columns[2].label}</td>
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
  return (
    <div className='FinanceTracker'>
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
      {tracker}
    </div>
  )
}
