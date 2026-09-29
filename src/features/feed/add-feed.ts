import { createFeed, createFeedFollow, type User } from "../../shared/db";

export async function addFeed(user: User, cmdName: string, ...args: string[]) {
    const [name, url] = args;

    if (!name || !url) {
        throw new Error(`Not enough args was supplied. usage: ${cmdName} <name> <url>`)
    }

    const feed = await createFeed(user.id, name, url);
    if (!feed) {
        throw new Error(`Failed to create feed ${name} with url: ${url}`);
    }

    const feedFollowDetails = await createFeedFollow(user.id, feed.id)

    console.log(feedFollowDetails);

    console.log(feed);
}
