import { resetUser } from "../../shared/config";
import { resetUsers } from "../../shared/db";

export async function reset(_: string) {
    const response = await resetUsers();

    if (!response) {
        throw new Error("Failed to reset users");
    }

    resetUser();

    console.log("users reset successfully");
}
