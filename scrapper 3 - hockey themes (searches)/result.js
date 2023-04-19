// const puppeteer = require("puppeteer");

const result = async (page, returnArray = false) => {
  return page.evaluate((returnArray) => {
    const target = document.querySelectorAll(".table tbody tr.team");
    const answer = Array.from(target).map((el) => {
      const team = el.querySelector("td.name").innerText;
      const year = parseInt(el.querySelector("td.year").innerText);
      const wins = parseInt(el.querySelector("td.wins").innerText);
      const losses = parseInt(el.querySelector("td.losses").innerText);
      const winPercent = parseFloat(el.querySelector("td.pct").innerText);
      const goalsFor = parseInt(el.querySelector(".gf").innerText);
      const goalsAgainst = parseInt(el.querySelector(".ga").innerText);
      if (returnArray)
        return { year, wins, losses, winPercent, goalsFor, goalsAgainst };
      else
        return { team, year, wins, losses, winPercent, goalsFor, goalsAgainst };
    });
    return answer;
  }, returnArray);
};

module.exports = result;
