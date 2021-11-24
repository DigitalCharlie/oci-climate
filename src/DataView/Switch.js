import classNames from "classnames";
import './Switch.scss'

export default function Switch(props) {
  const {value, toggle, label1, label2, label, style} = props;

  return (
    <div className="switch" onClick={toggle} style={style}>
      {label ? <span>{label}</span> : null }
      <label className={classNames({enabled: value})}>
        {label1}
      </label>
      <svg className={classNames({enabled: value})} xmlns="http://www.w3.org/2000/svg" width="22.26" height="14.84" viewBox="0 0 22.26 14.84">
        <path id="toggle-on-solid" d="M7.42,64h7.42a7.42,7.42,0,0,1,0,14.84H7.42A7.42,7.42,0,0,1,7.42,64Zm0,12.367A4.947,4.947,0,1,0,2.473,71.42,4.944,4.944,0,0,0,7.42,76.367Z" transform="translate(0 -64)"/>
      </svg>

      <label className={classNames({enabled: !value})}>
        {label2}
     </label>
    </div>
  )
}