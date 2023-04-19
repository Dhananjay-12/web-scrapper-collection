const fs = require("fs");

const puppeteer = require("puppeteer");

const url = "https://quotes.toscrape.com/";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  //function that return all the quotes from the page
  const result = async () => {
    return page.evaluate(() => {
      const target = document.querySelectorAll(
        ".container .row .col-md-8 .quote"
      );
      const answer = Array.from(target).map((el) => {
        const text = el.querySelector(".text").textContent;
        const author = el.querySelector(".author").textContent;

        return { text, author };
      });
      return answer;
    });
  };
  //UpdateJson
  const updateJson = async (quotes) => {
    const data = fs.readFileSync("./output.json", "utf-8");
    const json = JSON.parse(data);
    json.push(...quotes);
    fs.writeFileSync("./output.json", JSON.stringify(json));
  };

  let quotes = await result();
  fs.writeFileSync("./output.json", JSON.stringify(quotes));
  //loop to get quotes until there are no more pagination left
  let hasNextPage = true;
  while (hasNextPage) {
    const nextPageSelector = "li.next a";
    const disabledNextPageSelector = "li.next.disabled";
    try {
      //waiting for next page button
      await page.waitForSelector(nextPageSelector, { timeout: 3000 });
    } catch (err) {
      console.log("No more pages to scrape!");
      hasNextPage = false;
      break;
    }
    await page.click(nextPageSelector);
    try {
      //check if the button is disabled or not
      await page.waitForSelector(disabledNextPageSelector, { timeout: 3000 });
    } catch (err) {
      console.log("Next page button didn't become disabled!");
    }

    // Get the new quotes and update the JSON file
    quotes = await result();
    updateJson(quotes);
  }

  await browser.close();
};

main();
