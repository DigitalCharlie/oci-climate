import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip';
export default function InfoIcon(props) {
  useEffect(() => {
    ReactTooltip.rebuild();
  })
  return (
    <svg data-offset="{'top': 5, 'left': -160}" data-tip={props['dataTip']} data-html={props['dataHtml']} style={props.style} xmlns="http://www.w3.org/2000/svg" width="11.916" height="11.916" viewBox="0 0 11.916 11.916">
      <path id="info-circle-solid" d="M13.958,8a5.958,5.958,0,1,0,5.958,5.958A5.959,5.959,0,0,0,13.958,8Zm0,2.643a1.009,1.009,0,1,1-1.009,1.009A1.009,1.009,0,0,1,13.958,10.643Zm1.345,6.1a.288.288,0,0,1-.288.288H12.9a.288.288,0,0,1-.288-.288v-.577a.288.288,0,0,1,.288-.288h.288V14.342H12.9a.288.288,0,0,1-.288-.288v-.577a.288.288,0,0,1,.288-.288h1.538a.288.288,0,0,1,.288.288v2.4h.288a.288.288,0,0,1,.288.288Z" transform="translate(-8 -8)"/>
    </svg>

  )
}
