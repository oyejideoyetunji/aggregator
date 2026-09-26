import { setUser } from "../../shared/config";
import { createUser, getUser } from "../../shared/db";

export async function register(cmdName: string, ...args: string[]) {
    const username = args?.[0]?.trim();
    if (!username) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const user = await getUser(username);
    if (user) {
        throw new Error(`user ${username} already exists`);
    }

    const createdUser = await createUser(username);

    if (!createdUser) {
        throw new Error(`Failed to create user: ${username}`);
    }

    setUser(createdUser.name);
    console.log(`user ${createdUser.name} has been created!`);
    console.log(createdUser);
}
