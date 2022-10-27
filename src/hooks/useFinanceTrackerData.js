import { useEffect,useState } from "react"
import { csvParse } from "d3-dsv"
import { financeTypes } from "FinanceTracker"
export const financeTrackerAmountKey = 'Average Annual Fossil Fuel Finance, USD Millions'
const loadedData = {}
export default function useFinanceTrackerData(file) {
  const [data, setData] = useState(null)
  useEffect(() => {
    if (loadedData[financeTypes[1].file]) {
      return
    }
    window.fetch(financeTypes[1].file)
        .then(response => response.text())
        .then(text => {
          const rows = csvParse(text)
          rows.forEach(row => {
            row[financeTrackerAmountKey] = +row[financeTrackerAmountKey].replace(',', '')
          })
          loadedData[financeTypes[1].file] = rows
        })
  }, [])
  useEffect(() => {
    if (loadedData[file]) {
      setData(loadedData[file])
    } else {
      setData(null)
      window.fetch(file)
        .then(response => response.text())
        .then(text => {
          const rows = csvParse(text)
          rows.forEach(row => {
            row[financeTrackerAmountKey] = +row[financeTrackerAmountKey].replace(',', '')
          })
          loadedData[file] = rows
          setData(rows)
        })
    }
  }, [file])
  return data
}
