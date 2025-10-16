let xml;
let xsl;
let output = document.getElementById("searchOutput");

function searchProduct() {
  let code = document.getElementById("searchInput").value.trim(); //take value from search bar and remove whitespace

  let products = xml.getElementsByTagName("product");
  let found = false;

  //iterate through all products from xml
  for (let product of products) {
    //product associated with code found
    if (product.getAttribute("code") === code) {
      found = true;

      //intialize local variables to text stored in product child elements
      let name = product.getElementsByTagName("name")[0].textContent;
      let desc = product.getElementsByTagName("description")[0].textContent;
      let qnty = product.getElementsByTagName("quantity")[0].textContent;
      let price = product.getElementsByTagName("unit_price")[0].textContent;

      //markup for card html
      let card = `
        <div class="d-flex justify-content-center">
          <div class="card index_card w-100">
            <div class="card-body d-flex flex-column justify-content-center">
              <span class="card-title text-center">
                ${name}<br />
                <b>${code}</b>
              </span>
              <ul>
                <li><b>Description:</b> ${desc}</li>
                <li><b>Quantity:</b> ${qnty}</li>
                <li><b>Unit Price:</b> $${price}</li>
              </ul>
            </div>
          </div>
        </div>`;

      //set innerHTML to card markup
      output.innerHTML = card;

      break; //product found early, exit loop
    }
  }

  if (code === "") {
    let error = `<p class="text-center text-danger">Search requires Code. (eg: 101-01)</p>`;
    output.innerHTML = error;
  } else if (!found) {
    let error = `<p class="text-center text-danger">No product found with Code: ${code}</p>`;
    output.innerHTML = error;
  }
}

function resetProducts() {
  output.innerHTML = "";
}

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
  [xml, xsl] = getXMLXSL();
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
