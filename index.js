// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

const ARTICLES_LIMIT = 100;

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const timestampsOfArticles = await getTimestampsByLimit(page, ARTICLES_LIMIT);

  if (timestampsOfArticles.length !== ARTICLES_LIMIT) {
    console.error(`Error getting ${ARTICLES_LIMIT} last timestamps of articles`);
    await browser.close();
    return;
  }

  const isSorted = isSortedDescending(timestampsOfArticles);

  const message = isSorted === true
    ? "Test passed: The timestamps are sorted correctly"
    : "Test failed: The timestamps are not sorted correctly";

  console.log(message);
  await browser.close();
  return;
}



async function getTimestampsByLimit(page, articlesLimit) {
  const timestampsOfArticles = [];

  while (timestampsOfArticles.length < articlesLimit) {    
    const visibleTimestamps = await getVisibleTimestampsFromPage(page);
    timestampsOfArticles.push(...visibleTimestamps);
    
    await page.click('a.morelink');
  }
  
  return timestampsOfArticles.slice(0, articlesLimit);
}



async function getVisibleTimestampsFromPage(page) {
  return await page
    .locator("#hnmain .subtext .age")
    .evaluateAll((articles) => articles.map((article) => article.getAttribute("title")));
}



function isSortedDescending(timestamps) {
  for (let i = 1; i < timestamps.length; i++) {      
    if (new Date(timestamps[i - 1]) < new Date(timestamps[i])) {
      return false;
    }
  }
  return true;
}



(async () => {
  await sortHackerNewsArticles();
})();
