
import classNames from 'classnames'
import './YearPicker.scss'
import { range } from 'd3-array'
import { finalYear } from 'App'
const yearPickerTypes = [
  {value: 'all', label: 'All Years'},
  {value: 'paris', label: 'Before/After Paris Agreement Adopted'},
  {value: 'custom', label: 'From'}
]

export default function YearPicker(props) {
  const { customYears, setCustomYears, onChange, value} = props
  const options = range(2013, finalYear + 1).map(year => <option key={year} value={year}>{year}</option>)
  return (
    <div className="year-picker">
      {yearPickerTypes.map(type => {
        const checked = value === type.value
        return (
          <span key={type.value}>
            <span className={classNames({checked})}>
            <input
              type='radio'
              name='yearPicker'
              value={type.value}
              checked={checked}
              onChange={onChange}
              id={type.value}
            />
            {type.label ? <label htmlFor={type.value}>{type.label}</label> : null}
            {type.value === 'custom' ? <span>
              <select value={customYears[0]} onChange={e => setCustomYears(years => {
                const newYears = [...years]
                const value = +e.target.value
                if (value > newYears[1]) {
                  return newYears
                }
                newYears[0] = value
                return newYears
              })}>
                {options}
              </select>
              to
              <select value={customYears[1]} onChange={e => setCustomYears(years => {
                const newYears = [...years]
                const value = +e.target.value
                if (value < newYears[0]) {
                  return newYears
                }
                newYears[1] = value
                return newYears
              })}>
                {options}
              </select>
              </span>: null
            }
          </span> </span>
        )
      })}
    </div>
  )
}