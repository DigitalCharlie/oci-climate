export default function exportSVG(svg, filename) {

  //get svg source.
  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(svg);

  var svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = filename ;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
