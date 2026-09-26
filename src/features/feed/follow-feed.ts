import { readConfig } from "../../shared/config";
import { createFeedFollow, getFeed, type User } from "../../shared/db";

export async function followFeed(user: User, cmdName: string, ...args: string[]) {
    const url = args?.[0];
    if (!url) {
        throw new Error(`url is required. usage: ${cmdName} <url>`);
    }

    const feed = await getFeed(url);
    if (!feed) {
        throw new Error(`Failed to get record for feed with url: ${url}`);
    }


    const details = await createFeedFollow(user.id, feed.id);

    console.log(details);
    console.log(`Feed at ${url} followed by ${user.name}`);
}
