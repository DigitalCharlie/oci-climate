
import classNames from 'classnames'
import './ScopePicker.scss'
const scopePickerTypes = [
  {value: 'both', label: 'Both'},
  {value: 'Domestic', label: 'Domestic'},
  {value: 'International', label: 'International'}
]

export default function ScopePicker(props) {
  const { onChange, value} = props
  return (
    <div className="scope-picker">
      {scopePickerTypes.map(type => {
        const checked = value === type.value
        return (
          <span key={type.value}>
            <span className={classNames({checked})}>
            <input
              type='radio'
              name='scopePicker'
              value={type.value}
              checked={checked}
              onChange={onChange}
              id={type.value}
            />
            {type.label ? <label htmlFor={type.value}>{type.label}</label> : null}
          </span> </span>
        )
      })}
    </div>
  )
}