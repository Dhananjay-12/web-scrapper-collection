const fs = require("fs");
const result = require("./result");

const writeData = (teams) => {
  fs.writeFileSync("output.json", teams);
};

const scrapeTeam = async (teamName, page, returnArray = true) => {
  const inputValue = teamName.toLowerCase().trim();
  await page.type(".form-control", teamName, { delay: 100 });
  await page.click(".btn.btn-primary", { delay: 100 });
  await page.waitForNavigation();
  const teams = await result(page, returnArray);
  writeData(JSON.stringify(teams));
};

module.exports = scrapeTeam;
