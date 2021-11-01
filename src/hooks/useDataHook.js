import { csvParse } from 'd3-dsv'
import { useEffect, useState } from 'react'

export default function useDataHook() {

  const [data, setData] = useState([])

  useEffect(() => {
    const url = `${process.env.PUBLIC_URL}/dataset.csv`
    window.fetch(url)
      .then(r => r.text())
      .then(csv => {
        let rows = csvParse(csv)

        const numbers = ['FY', 'amountUSD']
        const renames = [['FY', 'year'], ['amountUSD', 'amount']]
        rows.forEach(row => {
          numbers.forEach(numberCol => {
            row[numberCol] = +(row[numberCol].replace(/[^0-9.]/g, ''))
          })
          renames.forEach(rename => {
            row[rename[1]] = row[rename[0]]
          })
          const group = row.institutionGroup
          // this works for now, but might need something more robust
          // e.g. a hardcoded list of MDBs
          row.isBank = group.includes('Bank') && group !== 'North American Development Bank'
          row.isCountry = !row.isBank

        })

        rows = rows.filter(d => d.visible === 'TRUE' && d.year > 2000)
        setData(rows)
      })
  }, [])
  return data
}