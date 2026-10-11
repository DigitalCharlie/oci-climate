import './ColorLegend.scss'

export default function ColorLegend(props) {
  const {colors, selectedfossilFuelSubTypes} = props
  return (
    <div className='ColorLegend'>
      {colors.map(({category, color}) => {

        return (
          <div key={category} className='legend-item'>
            <div className='legend-item-color' style={{backgroundColor: color}} />
            <div className='legend-item-label'>{category === 'Fossil Fuel' && selectedfossilFuelSubTypes && selectedfossilFuelSubTypes.length < 6 ? <>Fossil Fuel<sup class="legend-item-sup">†</sup></> : category}</div>
          </div>
        )
      })}
    </div>
  )
}
