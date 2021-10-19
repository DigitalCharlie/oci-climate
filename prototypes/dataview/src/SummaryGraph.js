import LineGraph from './LineGraph'
import { useState, useMemo } from 'react'
function SummaryGraph(props) {
  const { data } = props
  const [yMax, setYMax] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const categories = useMemo(() =>
    Array.from(new Set(data.map(d => d.category))).filter(d => d !== '')
  , [data])

  console.log(categories)

  let filteredData = useMemo(() => {
    let filteredData = data
    if (selectedCategory !== '') {
      filteredData = filteredData.filter(d => d.category === selectedCategory)
    }
    return filteredData
  }, [selectedCategory, data])
  console.log(filteredData)
  return (
    <div className="App">
      <select value={yMax} onChange={e => setYMax(e.target.value)}>
        <option value=''>yMax</option>
        <option value='30000000000'>30B</option>
        <option value='20000000000'>20B</option>
        <option value='10000000000'>10B</option>
        <option value='5000000000'>5B</option>
        <option value='1000000000'>1B</option>
      </select>

      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value=''>category</option>
        {
          categories.map(category => <option key={category} value={category}>{category}</option>)
        }
      </select>

      <LineGraph data={filteredData} yMax={yMax} />
    </div>
  );
}

export default SummaryGraph;
