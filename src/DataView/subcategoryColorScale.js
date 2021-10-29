import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const colorScale = scaleOrdinal(schemeCategory10);
export default colorScale;
