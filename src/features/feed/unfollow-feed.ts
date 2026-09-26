import { getFeed, removeFeedFollow, type User } from "../../shared/db";

export async function unfollowFeed(user: User, cmdName: string, ...args: string[]) {
    const url = args?.[0];
    if (!url) {
        throw new Error(`url is required. usage: ${cmdName} <url>`);
    }

    const feed = await getFeed(url);
    if (!feed) {
        throw new Error(`Failed to get record for feed with url: ${url}`);
    }

    const deleted = await removeFeedFollow(user.id, feed.id);

    if(!deleted) {
        throw new Error(`Failed to unfollow feed ${url}`)
    }

    console.log(`User ${user.name} unfollowed feed ${feed.url}`);
}
