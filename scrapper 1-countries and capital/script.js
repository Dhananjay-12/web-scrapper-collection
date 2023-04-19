const fs = require("fs");
const puppeteer = require("puppeteer");
const url = "https://www.scrapethissite.com/pages/simple/";
const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });
  const result = async () => {
    return page.evaluate(() => {
      const section = document.querySelectorAll(
        "#countries .container .row .col-md-4.country "
      );

      const answer = Array.from(section).map((el) => {
        const name = el.querySelector("h3").innerText;
        const capital = el.querySelector(
          "div.country-info span.country-capital"
        ).innerText;
        const population = parseInt(
          el.querySelector("div.country-info span.country-population").innerText
        );
        const area = parseFloat(
          el.querySelector("div.country-info span.country-area").innerText
        );
        return { name: name, capital, population, area };
      });
      return answer;
    });
  };
  const answer = await result();
  console.log(typeof answer.toString());
  fs.writeFileSync("test.json", JSON.stringify(answer));

  await browser.close();
};
main();
