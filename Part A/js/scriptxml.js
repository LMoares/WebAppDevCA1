function getXMLXSL() {
  const xmlPath = "XML/products.xml";
  const xslPath = "XML/products.xsl";

  const fetchXML = new XMLHttpRequest();
  fetchXML.open("GET", xmlPath, false);
  fetchXML.send();

  const xmlFile = fetchXML.responseXML;

  const fetchXSL = new XMLHttpRequest();
  fetchXSL.open("GET", xslPath, false);
  fetchXSL.send();

  const xslFile = fetchXSL.responseXML;

  return [xmlFile, xslFile];
}

function loadXMLXSL() {
  const [xml, xsl] = getXMLXSL();
  console.log(xml);
  console.log(xsl);

  console.log(window.location.href);
  if (!xml || !xsl) {
    console.error("XML or XSL failed to load.");
    return;
  }
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);

  const resultDocument = xsltProcessor.transformToFragment(xml, document);
  document.getElementById("output").appendChild(resultDocument);
}

document.addEventListener("DOMContentLoaded", loadXMLXSL, false);
