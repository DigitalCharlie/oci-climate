import './App.scss';
import DataView from './DataView/';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import useDataHook from './hooks/useDataHook'
function App() {

  const data = useDataHook()
  return (
    <div className="App">
      <Router>
        <Switch>

          <Route exact path="/data">
            <DataView data={data} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
