import { useEffect,useState } from "react"
import { csvParse } from "d3-dsv"
export const financeTrackerAmountKey = 'Average Annual Fossil Fuel Finance 2018-2020, USD Millions'
export default function useFinanceTrackerData(file) {
  const [data, setData] = useState(null)
  useEffect(() => {
    setData(null)
    window.fetch(file)
      .then(response => response.text())
      .then(text => {
        const rows = csvParse(text)
        rows.forEach(row => {
          row[financeTrackerAmountKey] = +row[financeTrackerAmountKey].replace(',', '')
        })
        setData(rows)
      })
  }, [file])
  return data
}
