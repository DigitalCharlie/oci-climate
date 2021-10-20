import './App.css';
import useDataHook from './useDataHook';
import SummaryGraph from './SummaryGraph';
import SmallMultiples from './SmallMultiples'
import EmissionCircles from './EmissionCircles'

import AnimatedCircles from './EmissionCirclesAnimated'
import SplitCircles from './EmissionCirclesSplit'
import Maps from './Map'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
function App() {
  const data = useDataHook()

  return (
    <Router basename='oci/prototypes/dataview/'>
      <div>
        <Link to='/summary'>Summary</Link>{' '}
        <Link to='/country'>Country View</Link>{' '}
        <Link to='/maps'>Maps</Link>{' '}
        <Link to='/multiples'>Small Multiples</Link>{' '}
        <Link to='/emissionCircles'>Emission Circles</Link>{' '}
        <Link to='/emissionCirclesAnimated'>Animated</Link>{' '}
        <Link to='/emissionCirclesSplit'>Split</Link>{' '}
      </div>

      <Switch>
        <Route path='/summary'>
          <SummaryGraph data={data} />
        </Route>
        <Route path='/multiples'>
          <SmallMultiples data={data} />
        </Route>

        <Route path='/maps'>
          <Maps data={data} />
        </Route>

        <Route path='/country'>
          <div>coming soon?</div>
        </Route>
        <Route path='/emissionCircles'>
          <EmissionCircles data={data} />
        </Route>

        <Route path='/emissionCirclesAnimated'>
          <AnimatedCircles data={data} />
        </Route>

        <Route path='/emissionCirclesSplit'>
          <SplitCircles data={data} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
