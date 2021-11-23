import DataView from "DataView"
import Methodology from 'Methodology'
const routes = [
  { label: 'Home', path: '/' },
  { label: 'Data', path: '/data', Component: DataView },
  { label: 'Finance Tracker', path: '/finance' },
  { label: 'Methodology', path: '/methodology', Component: Methodology },
  { label: 'Research', path: '/research' },
]

export default routes
