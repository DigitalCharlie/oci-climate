import './styles.scss'

import logo from 'images/logo.png'
import routes from 'routes'
import { NavLink } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router'
import { forwardRef } from 'react'
export default forwardRef(Header)
function Header(props, ref) {
  const history = useHistory()
  const location = useLocation()
  console.log(location)
  const updatePath = (e) => {
    const path = e.target.value
    history.push(path)
    e.target.blur()
  }
  return (
    <header className="Header" ref={ref}>
      <div>
        <a href="/"><img src={logo} alt='Oil Change International' /></a>
        <select value={location.pathname} className='menu' onChange={updatePath}>
          {routes.map((route, index) => (

            <option key={index} value={route.path}>{route.label}</option>
          ))}
        </select>

      </div>
      <div className='right'>
        <nav>
          {routes.map(route => (
            <NavLink exact key={route.path} to={route.path}>{route.label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
