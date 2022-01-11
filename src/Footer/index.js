
import classNames from 'classnames';
import { useEffect } from 'react'
import logo from 'images/logo.png'

import { useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';

import facebook from 'images/facebook.svg'
import twitter from 'images/twitter.svg'
import './styles.scss'

export default function Footer(props) {
  const { introFooter } = props
  const location = useLocation()
  const opacity = introFooter ? props.opacity : (location.pathname === '/' ? 0 : 1)
  useEffect(() => {
    if (!introFooter) {
      window.document.body.scrollTo(0, 0)
    }

  }, [location.pathname, introFooter])
  const pointerEvents = opacity ? 'auto' : 'none'
  return (
    <div className={classNames( "Footer", { introFooter })} style={{ opacity, pointerEvents }}>
      <div>
       <img className='logo' src={logo} alt='Oil Change International' />

      </div>
      <div>
              © 2021 · Oil Change International · All Rights Reserved{' '}

        <HashLink smooth to='/about#downloadData'>Download Data</HashLink>
      </div>

      <div className="social">
        <a href="https://www.facebook.com/priceofoil/" target="_blank" rel="noopener noreferrer">
          <img src={facebook} alt="Facebook" />
        </a>
        <a href="https://twitter.com/PriceofOil" target="_blank" rel="noopener noreferrer">
          <img src={twitter} alt="Twitter" />
        </a>
      </div>
    </div>
  )
}