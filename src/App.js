import './App.scss';
import { HashRouter as Router, Switch, Route, useLocation } from 'react-router-dom';

import Header from './Header';
import useDataHook from './hooks/useDataHook'
import routes from './routes'
import ReactTooltip from 'react-tooltip';
import { useRef, useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
function Footer() {
  const location = useLocation()
  console.log(location)
  const opacity = location.pathname === '/' ? 0 : 1
  useEffect(() => {
    window.document.body.scrollTo(0, 0)

  }, [location.pathname])
  return (
    <div className="Footer" style={{ opacity }}>
      © 2021 · Oil Change International · All Rights Reserved{' '}

      <HashLink smooth to='/about#downloadData'>Download Data</HashLink>
    </div>
  )
}
function App() {

  const data = useDataHook()
  const headerRef = useRef()
  const [contentHeight, setContentHeight] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    const resize = () => {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      console.log(headerHeight)
      setHeaderHeight(headerHeight)
      setContentHeight(window.innerHeight - headerHeight - 5)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  })
  const disableTooltips = window.innerWidth < 768 && 'ontouchstart' in window

  return (
    <div className="App">
      <Router>
        <Header ref={headerRef} />
        <Switch>
          {routes.map(({ label, path, Component }) => (
            <Route key={path} path={path} exact>
              {Component ? <Component data={data} contentHeight={contentHeight} headerHeight={headerHeight} /> : null}
            </Route>
          ))}
        </Switch>
        <Footer />
      </Router>
      <ReactTooltip disable={disableTooltips} arrowColor='transparent' effect='solid' place='bottom' className='helperTooltip' />

    </div>
  );
}

export default App;
