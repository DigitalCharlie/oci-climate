import DataView from "DataView"
import About from 'About'
import FinanceTracker from "FinanceTracker"
import Intro from 'Intro'
import Research from 'Research'
const routes = [
  { label: 'Home', path: '/', Component: Intro },
  { label: 'About', path: '/about', Component: About },
  { label: 'Data Dashboard', path: '/data', Component: DataView },
  { label: 'Policy Tracker', path: '/tracker', Component: FinanceTracker },
  { label: 'Resources', path: '/resources', Component: Research },
]

export default routes
