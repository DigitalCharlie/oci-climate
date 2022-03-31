import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const d3colorScale = scaleOrdinal(schemeCategory10);

const fossilFuels = {
  // OLD COLORS
  // 'Gas': '#d8794f',
  // 'Oil and Gas': '#cbc6aa',
  // 'Oil and gas': '#cbc6aa',
  // 'Oil': '#ffdd52',
  // 'Coal': '#4d2907',
  // 'Mixed Fossil': '#d8794f',
  // NEW COLORS
  'Gas': '#FFB300',
  'Oil and Gas': '#AB7800',
  'Oil and gas': '#AB7800',
  'Oil': '#6F5517',
  'Coal': '#3C2A00',
  'Mixed Fossil': '#04000A',
}
const colorScale = (subcategory) => {
  if (fossilFuels[subcategory]) {
    return fossilFuels[subcategory];
  }
  return d3colorScale(subcategory);
}
export default colorScale;
