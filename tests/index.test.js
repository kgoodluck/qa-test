const { chromium, test, expect } = require("@playwright/test");

const ARTICLES_LIMIT = 100;

test.describe("Hacker News Article Sorting", () => {
    test("Validate that the first 100 articles are sorted from newest to oldest", async () => {
        // Launch browser
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            // Go to Hacker News "newest" page
            await page.goto("https://news.ycombinator.com/newest");

            const timestampsOfArticles = await getTimestampsByLimit(page, ARTICLES_LIMIT);

            // Ensure we retrieved enough timestamps
            expect(timestampsOfArticles.length).toBe(ARTICLES_LIMIT);

            // Validate that the timestamps are sorted in descending order
            const isSorted = isSortedDescending(timestampsOfArticles);
            expect(isSorted).toBe(true);

            console.log("Test passed: The timestamps are sorted correctly");
        } catch (error) {
            console.error("An error occurred during the test execution:", error);
        } finally {
            // Close browser
            await browser.close();
        }
    });

    async function getTimestampsByLimit(page, articlesLimit) {
        const timestampsOfArticles = [];

        while (timestampsOfArticles.length < articlesLimit) {
            try {
                const visibleTimestamps = await getVisibleTimestampsFromPage(page);
                timestampsOfArticles.push(...visibleTimestamps);

                if (timestampsOfArticles.length < articlesLimit) {
                    await page.click("a.morelink");
                }
            } catch (error) {
                console.error("Error fetching timestamps or clicking 'More':", error);
            }
        }

        return timestampsOfArticles.slice(0, articlesLimit);
    }

    async function getVisibleTimestampsFromPage(page) {
        try {
            return await page
                .locator("#hnmain .subtext .age")
                .evaluateAll((articles) => articles.map((article) => article.getAttribute("title")));
        } catch (error) {
            console.error("Error retrieving timestamps from page:", error);
            return [];
        }
    }

    function isSortedDescending(timestamps) {
        for (let i = 1; i < timestamps.length; i++) {
            if (timestamps[i - 1] < timestamps[i]) {
                return false;
            }
        }
        return true;
    }
});
