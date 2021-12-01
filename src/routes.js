import DataView from "DataView"
import About from 'About'
import FinanceTracker from "FinanceTracker"
const routes = [
  { label: 'Home', path: '/' },
  { label: 'Data', path: '/data', Component: DataView },
  { label: 'Finance Tracker', path: '/finance', Component: FinanceTracker },
  { label: 'About', path: '/about', Component: About },
  { label: 'Research', path: '/research' },
]

export default routes
