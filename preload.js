const puppeteer = require("puppeteer");


//console.log("Hello from the scraper.");
//const isbnNumber = 9780385741279;

async function asyncBookSellPriceScrape(isbn) {
  document.getElementById("priceDisplay").innerHTML ='';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://bookscouter.com/search?query=${isbn}`, {
    waitUntil: "networkidle0",
  });

  let allVendors = await page.$$("div.results a[data-vendor]");

  for (let vendor of allVendors) {
    const vendorName = await page.evaluate(
      (el) => el.getAttribute("data-vendor"),
      vendor
    );
    const price = await page.evaluate(
      (el) => el.getAttribute("data-price"),
      vendor
    );
    console.log(vendorName + " will buy it for $" + price);
    addVendorPriceDisplay(vendorName, price);

  }

  await browser.close();
}

async function singleISBN_Click() {
  let isbn = document.getElementById("isbnEntry");
  console.log(isbn.value);
  await asyncBookSellPriceScrape(isbn.value);
}

window.addEventListener('DOMContentLoaded', () => {
  const btn_submitISBN = document.getElementById("submitISBN");
  btn_submitISBN.addEventListener("click", singleISBN_Click)
})


function addVendorPriceDisplay(name, price) {
  let itemSpan = document.createElement("span");
  let lineBreak = document.createElement("hr");
  lineBreak.classList.add("border-2");
  lineBreak.classList.add("border-white");
  lineBreak.classList.add("mt-2");
  itemSpan.classList.add("font-medium");
  itemSpan.classList.add("text-black");
  itemSpan.classList.add("text-2xl");
  itemSpan.innerText = `${name} is buying for \$${price}`;
  document.getElementById("priceDisplay").appendChild(itemSpan);
  document.getElementById("priceDisplay").appendChild(lineBreak);
}