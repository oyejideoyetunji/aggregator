import { desc, eq } from "drizzle-orm";
import { feedFollows, posts } from "../schema";
import { db } from "../setup";

type PostParams = {
    feedId: string,
    url: string;
    title: string;
    description: string;
    publishedAt: Date;
};

export async function createPosts(values: PostParams[]){
    const result = await db
        .insert(posts)
        .values(values)
        .onConflictDoNothing()
        .returning();
    
    return result;
}

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db
        .select({
            id: posts.id,
            url: posts.url,
            title: posts.title,
            description: posts.description
        })
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
    return result;
}
