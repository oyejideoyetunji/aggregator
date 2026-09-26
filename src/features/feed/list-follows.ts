import { readConfig } from "../../shared/config";
import { getFeedsFollowedByUser, getUser, type User } from "../../shared/db";

export async function listFollows(user: User, _: string) {
    const followings = await getFeedsFollowedByUser(user.id);

    console.log("======== followings ========");
    for (const following of followings) {
        console.log(`-- Feed: ${following.feedName}`);
        console.log(`   * Follower: ${following.followerName}`);
    }
}
