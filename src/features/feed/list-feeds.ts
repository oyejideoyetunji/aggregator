import { getFeeds } from "../../shared/db";

export async function listFeeds(_: string) {
    const feeds = await getFeeds();

    for(const feed of feeds) {
        console.log(`-- ${feed.name}`);
        console.log(`   * Url: ${feed.url}`);
        console.log(`   * Created By: ${feed.username}`);
        console.log(`=====================================`);
    }
}
