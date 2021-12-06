import DataView from "DataView"
import About from 'About'
import FinanceTracker from "FinanceTracker"
import Intro from 'Intro'
const routes = [
  { label: 'Home', path: '/', Component: Intro },
  { label: 'Data', path: '/data', Component: DataView },
  { label: 'Finance Tracker', path: '/finance', Component: FinanceTracker },
  { label: 'About', path: '/about', Component: About },
  { label: 'Research', path: '/research' },
]

export default routes
