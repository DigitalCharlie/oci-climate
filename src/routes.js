import DataView from "DataView"

const routes = [
  { label: 'Home', path: '/' },
  { label: 'Data', path: '/data', Component: DataView },
  { label: 'Finance Tracker', path: '/finance' },
  { label: 'Methodology', path: '/methodology' },
  { label: 'Research', path: '/research' },
]

export default routes
