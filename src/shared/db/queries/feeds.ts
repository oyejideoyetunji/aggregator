import { and, asc, eq, sql } from "drizzle-orm";
import { feedFollows, feeds, users } from "../schema";
import { db } from "../setup";

export async function createFeed(userId: string, feedName: string, url: string) {
    const [result] = await db.insert(feeds).values({ userId, name: feedName, url, }).returning();
    return result;
}

export async function getFeed(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getFeeds() {
    const result = await db.select({
        id: feeds.id,
        name: feeds.name,
        url: feeds.url,
        username: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
    return result;
}

export async function getNextFeedToFetch() {
    const [result] = await db
        .select()
        .from(feeds)
        .orderBy(
            sql`${feeds.lastFetchedAt} ASC NULLS FIRST`,
            asc(feeds.createdAt)
        )
        .limit(1);
    return result;
}

export async function markFeedFetched(feedId: string) {
    const [result] = await db
        .update(feeds)
        .set({ lastFetchedAt: sql`NOW()` })
        .where(eq(feeds.id, feedId))
        .returning();
    return result;
}

export async function createFeedFollow(userId: string, feedId: string) {
    const [result] = await db.insert(feedFollows).values({ userId, feedId }).returning();

    if (!result) {
        throw new Error("Failed to follow feed");
    }

    const [feedFollowDetails] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        followerName: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, result.id));

    return feedFollowDetails;
}

export async function getFeedsFollowedByUser(userId: string){
    const feedsFollowed = await db.select({
        id: feedFollows.id,
        feedUrl: feeds.url,
        feedName: feeds.name,
        followerName: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

    return feedsFollowed;
}

export async function removeFeedFollow(userId: string, feedId: string) {
    const [deleted] = await db
        .delete(feedFollows)
        .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
        .returning();
    
    console.log([deleted]);

    return deleted;
}


// https://hnrss.org/newest
// https://www.wagslane.dev/index.xml
// https://techcrunch.com/feed/
// https://news.ycombinator.com/rss