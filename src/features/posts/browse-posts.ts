import { getPostsForUser, type User } from "../../shared/db";

export async function browsePosts(user: User, cmdName: string, ...args: string[]) {
    const limit = args?.[0] ? Number(args?.[0]) : 2;

    const posts = await getPostsForUser(user.id, limit);

    console.log(`>====== Showing Posts From Feeds Followed User: ${user.name}`);
    for (const post of posts) {
        console.log(`-- Post: ${post.title}`);
        console.log(`   * Link: ${post.url}`);
    }
    console.log("======= End =======");
}
