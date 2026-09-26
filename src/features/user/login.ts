import { setUser } from "../../shared/config";
import { getUser } from "../../shared/db";

export async function login(cmdName: string, ...args: string[]) {
    const username = args?.[0]?.trim();
    if (!username) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const user = await getUser(username);
    if (!user) {
        throw new Error(`user ${username} does not exist`);
    }

    setUser(user.name);
    console.log(`user ${user.name} has been set!`);
}
