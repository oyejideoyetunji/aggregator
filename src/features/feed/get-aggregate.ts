import { fetchFeed } from "../../shared/api";
import { getNextFeedToFetch, markFeedFetched } from "../../shared/db";
import { parseDuration } from "../../shared/helpers/parse-duration";

export async function getAggregate(cmdName: string, ...args: string[]) {
    const interval = args?.[0];
    if (!interval) {
        throw new Error(`interval is required. usage: ${cmdName} <interval>`);
    }

    const parsedInterval = parseDuration(interval);
    if (!parsedInterval) {
        throw new Error("Invalid fetch interval supplied");
    }

    console.log(`Collecting feeds every ${interval}...`);
    scrapeFeeds();
    const intervalId = setInterval(scrapeFeeds, parsedInterval)

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
          console.log("Shutting down feed aggregator...");
          clearInterval(intervalId);
          resolve();
        });
    });
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();

    if (!feed?.url) {
        throw new Error("Failed to get the next feed to fetch");
    }

    const aggregate = await fetchFeed(feed.url);
    await markFeedFetched(feed.id);

    const feedItems = aggregate.item;
    console.log(">========== Displaying The Titles Of Feed Items ===========<")
    for (const item of feedItems) {
        console.log(`** ${item.title}`);
    }
    console.log(">========== End ===========<")
}
