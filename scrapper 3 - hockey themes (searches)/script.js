const fs = require("fs");
const puppeteer = require("puppeteer");
const result = require("./result");
const alldata = require("./alldata");
const scrapeTeam = require("./scrapeTeam");
const url = "https://www.scrapethissite.com/pages/forms/";
//writing json of the data scraped
const writeData = (teams) => {
  fs.writeFileSync("output.json", teams);
};

console.log(process.argv);
const teamName = process.argv[3];
const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const teams = await result(page);
  writeData(JSON.stringify(teams));
  if (process.argv[2] === "--fullWebsite") {
    await alldata(page, url, teams);
  } else if (process.argv[2] == "--search") {
    await scrapeTeam(teamName, page);
  }
  await browser.close();
};

main();
