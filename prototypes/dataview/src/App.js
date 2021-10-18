import logo from './logo.svg';
import './App.css';
import LineGraph from './LineGraph'
import useDataHook from './useDataHook';
import { useState } from 'react'
function App() {
  const data = useDataHook()
  const [yMax, setYMax] = useState('')
  return (
    <div className="App">
      <select value={yMax} onChange={e => setYMax(e.target.value)}>
        <option value=''>yMax</option>
        <option value='30000000000'>30B</option>
        <option value='20000000000'>20B</option>
        <option value='10000000000'>10B</option>
      </select>
      <LineGraph data={data} yMax={yMax} />
    </div>
  );
}

export default App;
