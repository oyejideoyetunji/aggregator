import type { User } from "../db";

export type UserRequiredHandler = (
    user: User,
    cmdName: string,
    ...args: string[]
) => Promise<void>;
