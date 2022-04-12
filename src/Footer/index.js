
import classNames from 'classnames';
import { useEffect } from 'react'
import logo from 'images/oci-logo.png'

import { useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom'

import facebook from 'images/facebook.svg'
import twitter from 'images/twitter.svg'
import './styles.scss'

const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

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
      <section className="left-footer">
          <img className='logo' src={logo} alt='Oil Change International' />
          <div>
            This database is a project of OCI<br />
            Press inquiries: <ExLink href="mailto:media@priceofoil.org">media@priceofoil.org</ExLink><br /><br />
            <Link to="/about">About</Link>
          </div>
      </section>
      <section className="right-footer">
        <div className="social">
          <a href="https://www.facebook.com/priceofoil/" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" />
          </a>
          <a href="https://twitter.com/PriceofOil" target="_blank" rel="noopener noreferrer">
            <img src={twitter} alt="Twitter" />
          </a>
        </div>
        <p> © Oil Change International (CC BY-NC-SA 4.0)</p>
      </section>
    </div>
  )
}