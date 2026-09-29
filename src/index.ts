import { listUsers, login, register, reset, aggregate, addFeed, listFeeds, followFeed, listFollows, unfollowFeed, browsePosts } from "./features";
import { readConfig } from "./shared/config";
import { getUser } from "./shared/db";
import type { UserRequiredHandler } from "./shared/types";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
type CommandsRegistry = Record<string, CommandHandler>;


const commandRegistry: CommandsRegistry = {};

async function main() {
    try {
        const [cmdName, ...args] = process.argv.slice(2);

        if (!cmdName) {
            console.error("not enough arguments were provided");
            process.exit(1);
        }

        registerCommand(commandRegistry, 'login', login);
        registerCommand(commandRegistry, 'register', register);
        registerCommand(commandRegistry, 'reset', reset);
        registerCommand(commandRegistry, 'users', listUsers);
        registerCommand(commandRegistry, 'agg', aggregate);
        registerCommand(commandRegistry, 'addfeed', loggedInMiddleware(addFeed));
        registerCommand(commandRegistry, 'feeds', listFeeds);
        registerCommand(commandRegistry, 'follow', loggedInMiddleware(followFeed));
        registerCommand(commandRegistry, 'following', loggedInMiddleware(listFollows));
        registerCommand(commandRegistry, 'unfollow', loggedInMiddleware(unfollowFeed));
        registerCommand(commandRegistry, 'browse', loggedInMiddleware(browsePosts));
        await runCommand(commandRegistry, cmdName, ...args);
    } catch (e: any) {
        console.log(e?.message);
        process.exit(1);
    }

    process.exit(0);
}

main();


function registerCommand(
    registry: CommandsRegistry, cmdName: string, handler: CommandHandler
) {
    registry[cmdName] = handler;
}

async function runCommand(
    registry: CommandsRegistry, cmdName: string, ...args: string[]
) {
    const handler = registry[cmdName];

    if (!handler) {
        throw new Error(`Error: unknown command "${cmdName}"`);
    }

    return await handler(cmdName, ...args);
}

function loggedInMiddleware(handler: UserRequiredHandler){
    return async function(cmdName: string, ...args: string[]) {
        const username = readConfig()?.currentUserName;
        if (!username) {
            throw new Error('No user is currently logged in');
        }
    
        const user = await getUser(username);
        if (!user) {
            throw new Error(`user ${username} does not exist`);
        }
    
        return handler(user, cmdName, ...args);
    }
}
