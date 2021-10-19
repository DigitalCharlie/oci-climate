import './App.css';
import useDataHook from './useDataHook';
import SummaryGraph from './SummaryGraph';
import SmallMultiples from './SmallMultiples'

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
function App() {
  const data = useDataHook()

  return (
    <Router>
      <div>
        <Link to='/summary'>Summary</Link>
        <Link to='/country'>Country View</Link>
        <Link to='/maps'>Maps</Link>
        <Link to='/multiples'>Small Multiples</Link>
      </div>

      <Switch>
        <Route path='/summary'>
          <SummaryGraph data={data} />
        </Route>
        <Route path='/multiples'>
          <SmallMultiples data={data} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
