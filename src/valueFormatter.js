
import { format } from 'd3-format'
const valueFormatter = (value) => {
  if (value === 0) return '$0'
  return `$${format('.2s')(value).replace(/G/, 'B')}`
}
export default valueFormatter
