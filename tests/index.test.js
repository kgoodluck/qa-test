const { chromium, test, expect } = require("@playwright/test");
const { getTimestampsByLimit } = require("../utils/getTimestampsByLimit");
const { getIsSortedDescending } = require("../utils/getIsSortedDescending");

const ARTICLES_LIMIT = 100;

test.describe("Hacker News Article Sorting", () => {
    test(`Validate that the first ${ARTICLES_LIMIT} articles are sorted from newest to oldest`, async () => {
        // Launch browser
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        // Go to Hacker News "newest" page
        await page.goto("https://news.ycombinator.com/newest");

        const timestampsOfArticles = await getTimestampsByLimit(page, ARTICLES_LIMIT);

        // Ensure we retrieved enough timestamps
        expect(timestampsOfArticles.length).toBe(10);

        // Validate that the timestamps are sorted in descending order
        const isSorted = getIsSortedDescending(timestampsOfArticles);
        expect(isSorted).toBe(true);

        await browser.close();
    });
});
