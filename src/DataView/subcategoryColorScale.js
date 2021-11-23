import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const d3colorScale = scaleOrdinal(schemeCategory10);

const fossilFuels = {
  'Gas': '#f4ebe2',
  'Oil and Gas': '#cbc6aa',
  'Oil': '#ffdd52',
  'Coal': '#4d2907',
  'Mixed Fossil': '#d8794f',
}
const colorScale = (subcategory) => {
  if (fossilFuels[subcategory]) {
    return fossilFuels[subcategory];
  }
  return d3colorScale(subcategory);
}
export default colorScale;
