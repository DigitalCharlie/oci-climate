import { useEffect, useState } from 'react'
import { feature } from 'topojson-client'
export default function useMapHook() {

  const [map, setMap] = useState(null)

  useEffect(() => {
    const url = `${process.env.PUBLIC_URL}/countries-50m.json`
    window.fetch(url)
      .then(r => r.json())
      .then(topo => {
        const map = feature(topo, topo.objects.countries)
        // console.log(map)
        setMap(map)
      })
  }, [])
  return map
}