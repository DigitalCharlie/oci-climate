
import './styles.scss'
export default function Select(props) {
  const { value, onChange, options, placeholder, ...rest } = props;

  return (
    <select className='Select' value={value} onChange={e => onChange(e.target.value)} {...rest}>
      {placeholder ? <option value=''>{placeholder}</option> : null}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
