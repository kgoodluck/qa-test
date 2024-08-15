export async function getTimestampsByLimit(page, articlesLimit) {
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
