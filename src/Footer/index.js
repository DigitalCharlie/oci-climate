
import classNames from 'classnames';
import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';

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
  return (
    <div className={classNames( "Footer", { introFooter })} style={{ opacity }}>
      © 2021 · Oil Change International · All Rights Reserved{' '}

      <HashLink smooth to='/about#downloadData'>Download Data</HashLink>
    </div>
  )
}