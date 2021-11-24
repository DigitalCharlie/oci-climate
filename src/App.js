import './App.scss';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Header from './Header';
import useDataHook from './hooks/useDataHook'
import routes from './routes'
import ReactTooltip from 'react-tooltip';
function App() {

  const data = useDataHook()
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          {routes.map(({ label, path, Component }) => (
            <Route key={path} path={path} exact>
              {Component ? <Component data={data} /> : null}
            </Route>
          ))}
        </Switch>
      </Router>
      <ReactTooltip arrowColor='transparent' effect='solid' place='bottom' className='helperTooltip' />

    </div>
  );
}

export default App;
