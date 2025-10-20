//global variables
let xml;
let xsl;
let data = new Map();
//data will store products from xml
//key: product code, value: array of product child elements
//e.g. "001-01", [name, category, description, quantity, price]

let compareList = []; //array to hold product codes to ensure user only receives unique products in comparison view
let productCode; //product code set by successful search query, used to add product to compared products list

//output elements for html page
let searchMessage = document.getElementById("searchMessage");
let searchOutput = document.getElementById("searchOutput");
let compareOutput = document.getElementById("compareOutput");

function searchProduct() {
  //input
  //take value from search bar and remove whitespace
  productCode = document.getElementById("searchInput").value.trim();

  if (data.has(productCode)) {
    //determine product is defined
    searchOutput.innerHTML = printProduct(productCode);
    searchMessage.innerHTML = ""; //reset error message on successful query
    document.getElementById("compareBtn").className = "btn btn-primary mt-3"; //reveals compare button for user
    document.getElementById("searchInput").value = ""; //reset search bar text
  } else if (productCode.match(/^\d{3}-\d{2}$/)) {
    //regular expression ^: start of string, \d{3}: 3 digits, -: dash, \d{2}: 2 digits, $: end of string
    let error = `<p class="text-center text-light bg-danger d-inline-block px-2 rounded">Error: No product found with Code: ${productCode}</p>`;
    searchMessage.innerHTML = error;
    document.getElementById("searchInput").value = ""; //reset search bar text
  } else if (productCode === "") {
    //ensures search is not empty
    let error = `<p class="text-center text-light bg-danger d-inline-block px-2 rounded">Error: Search requires Code. (eg: 101-01)</p>`;
    searchMessage.innerHTML = error;
  } else {
    //code not empty and code not found
    let error = `<p class="text-center text-light bg-danger d-inline-block px-2 rounded">Error: Code must be ###-## where # is a digit</p>`;
    searchMessage.innerHTML = error;
    document.getElementById("searchInput").value = ""; //reset search bar text
  }
}

function resetProducts() {
  //reset all fields to empty strings
  searchOutput.innerHTML = "";
  searchMessage.innerHTML = "";
  document.getElementById("searchInput").value = "";
  compareOutput.innerHTML = "";
  document.getElementById("compareHeader").className = "mt-4 d-none"; //hide compare header
  document.getElementById("compareBtn").className =
    "btn btn-primary mt-3 d-none"; //hides compare button
  compareList = []; //compared products array set to empty
}

function compareProducts() {
  document.getElementById("compareHeader").className = "mt-4"; //display compared products header

  if (!compareList.includes(productCode)) {
    //determine if product already exists in compare list
    compareList.push(productCode); //add current code to list of compared products
    compareOutput.innerHTML += printProduct(productCode) + `<br/>`; //add product card to compare list

    document.getElementById("compareBtn").className =
      "btn btn-primary mt-3 d-none"; //hide compare button

    searchMessage.innerHTML = `<p class="text-center text-light bg-success d-inline-block px-2 rounded">Product Code: ${productCode} - added to Compare List</p>`; //informs user of product information moved to compare list
    searchOutput.innerHTML = ""; //clear search output when product moved to compare list
  } else {
    //product already in list
    let error = `<p class="text-center text-light bg-danger d-inline-block px-2 rounded">Error: Product: ${productCode} - already in Compare List</p>`;
    searchMessage.innerHTML = error;
  }
}

function printProduct(code) {
  //card markup that includes specific product information - built using data map
  let card = `
        <div class="d-flex justify-content-center">
          <div class="card index_card w-100">
            <div class="card-body d-flex flex-column justify-content-center">
              <span class="card-title text-center">
                <h5>${data.get(code)[0]}</h5>
                CODE: <b>${code}</b>
              </span>
              <ul class="text-start">
                <li><b>Category:</b> ${data.get(code)[1]}</li>
                <li><b>Description:</b> ${data.get(code)[2]}</li>
                <li><b>Quantity:</b> ${data.get(code)[3]}</li>
                <li><b>Unit Price:</b> €${data.get(code)[4]}</li>
              </ul>
            </div>
          </div>
        </div>`;

  return card;
}

function buildDataMap() {
  let products = xml.getElementsByTagName("product");

  //iterate through all products from xml
  for (let product of products) {
    //add elements to data dictionary - key: product code, value: array of product elements
    data.set(product.getAttribute("code"), [
      product.getElementsByTagName("name")[0].textContent,
      product.getElementsByTagName("category")[0].textContent,
      product.getElementsByTagName("description")[0].textContent,
      product.getElementsByTagName("quantity")[0].textContent,
      product.getElementsByTagName("unit_price")[0].textContent,
    ]);
  }
}

function getXMLXSLData() {
  //relative xml/xsl file path
  const xmlPath = "XML/products.xml";
  const xslPath = "XML/products.xsl";

  //https://www.w3schools.com/xml/xml_http.asp
  //documentation for XMLHttpRequest - reading XML & XSL with Javascript

  const fetchXML = new XMLHttpRequest();
  fetchXML.open("GET", xmlPath, false); //build request for xml data
  fetchXML.send(); //send above request from browser to server - waits for response
  const xmlFile = fetchXML.responseXML; //captures response and saves it to local variable

  //same as above but for xsl file
  const fetchXSL = new XMLHttpRequest();
  fetchXSL.open("GET", xslPath, false);
  fetchXSL.send();
  const xslFile = fetchXSL.responseXML;

  //returns the xml and xsl data as strings
  return [xmlFile, xslFile];
}

function loadXMLXSLToPage() {
  //retrieves xml and xsl data as strings
  [xml, xsl] = getXMLXSLData();

  //checks to ensure xml and xsl data has been loaded, posts error to console if not
  if (!xml || !xsl) {
    console.error("XML or XSL failed to load.");
    return;
  }

  //https://www.w3schools.com/xml/xsl_client.asp
  //Documentation for XSLTProcessor - apply XSL style to XML for browser display

  //processes xsl rules and styles xml
  const processor = new XSLTProcessor();
  processor.importStylesheet(xsl);
  const transformedDoc = processor.transformToFragment(xml, document);
  //appends transformed xml data to outputXML html element following template from xsl
  document.getElementById("outputXML").appendChild(transformedDoc);

  //adds all product information to hashmap for constant time lookup of product details
  buildDataMap();
}

//on page load run loadXMLXSLToPage function
document.addEventListener("DOMContentLoaded", loadXMLXSLToPage, false);
