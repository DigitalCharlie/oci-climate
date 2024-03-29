import { csvParse } from 'd3-dsv'
import { useEffect, useState } from 'react'

import incompleteCountries from './incompleteCountries'

const normalizedDetail = {
  'oil': 'Oil',
  'clean': 'Clean',
  'coal': 'Coal',
  'gas': 'Gas',
  'other': 'Other',
  'oil and gas': 'Oil and Gas',
}
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

          if (incompleteCountries.includes(row.institutionGroup)) {
            row.institutionGroup = `${row.institutionGroup}*`
          }
          const subcategory = row['category detail'].trim().toLowerCase()
          row['category detail'] = normalizedDetail[subcategory] || subcategory
        })
        rows = rows.filter(d => d.visible === 'TRUE' && d.year > 2000)
        // console.log(rows)
        setData(rows)
      })
  }, [])
  return data
}