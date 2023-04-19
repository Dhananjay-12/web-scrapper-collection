const fs = require("fs");
const result = require("./result");

const oldJson = fs.readFileSync("./output.json", "utf-8");

const updateJson = (newTeam) => {
  const data = JSON.parse(oldJson);
  data.push(...newTeam);
  fs.writeFileSync("./output.json", JSON.stringify(data));
};

const alldata = async (page, url, teams) => {
  let i = 2;
  while (true) {
    let nextPageLink = url + `?page_num=${i}`;
    await page.goto(nextPageLink, { waitUntil: "domcontentloaded" });

    const teamsOnPage = await result(page);
    if (teamsOnPage.length === 0) {
      console.log("No more pages to scrape ");
      break;
    }
    updateJson(teamsOnPage);
    //   console.log(teamsOnPage);
    console.log(`scraped page: ${i}`);
    i++;
  }
  return Promise.resolve();
};

module.exports = alldata;
