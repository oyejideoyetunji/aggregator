import { getFeedsFollowedByUser, type User } from "../../shared/db";

export async function listFollows(user: User, _: string) {
    const followings = await getFeedsFollowedByUser(user.id);

    console.log(`======== Feeds Followed By User: ${user.name} ========`);
    for (const following of followings) {
        console.log(`-- Feed: ${following.feedName}`);
        console.log(`   * Link: ${following.feedUrl}`);
    }
    console.log("======= End =======");
}
