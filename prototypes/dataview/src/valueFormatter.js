
import { format } from 'd3-format'
const valueFormatter = (value) => format('.2s')(value).replace(/G/, 'B')

export default valueFormatter
