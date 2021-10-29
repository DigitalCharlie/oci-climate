import './ColorLegend.scss'

export default function ColorLegend(props) {
  const {colors} = props
  return (
    <div className='ColorLegend'>
      {colors.map(({category, color}) => {

        return (
          <div key={category} className='legend-item'>
            <div className='legend-item-color' style={{backgroundColor: color}} />
            <div className='legend-item-label'>{category}</div>
          </div>
        )
      })}
    </div>
  )
}
