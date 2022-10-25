import './App.scss';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import useDataHook from './hooks/useDataHook'
import routes from './routes'
import ReactTooltip from 'react-tooltip';
import { useRef, useState, useEffect } from 'react';
import Footer from './Footer'

function App() {

  const data = useDataHook()
  const headerRef = useRef()
  const footerRef = useRef()
  const [contentHeight, setContentHeight] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [footerHeight, setFooterHeight] = useState(0)
  useEffect(() => {
    const resize = () => {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      console.log(headerHeight)
      setHeaderHeight(headerHeight)
      setContentHeight(window.innerHeight - headerHeight - 5)
      const footerHeight = footerRef.current.getBoundingClientRect().height
      setFooterHeight(footerHeight)
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
        <div style={{ paddingBottom: footerHeight + 30 }}>
          <Switch>
            {routes.map(({ label, path, Component }) => (
              <Route key={path} path={path} exact>
                {Component ? <Component data={data} contentHeight={contentHeight} headerHeight={headerHeight} /> : null}
              </Route>
            ))}
          </Switch>
        </div>
        <Footer ref={footerRef} />
      </Router>
      <ReactTooltip disable={disableTooltips} arrowColor='transparent' effect='solid' place='bottom' className='helperTooltip' />

    </div>
  );
}

export default App;
