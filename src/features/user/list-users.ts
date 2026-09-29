import { readConfig } from "../../shared/config";
import { getUsers } from "../../shared/db";

export async function listUsers(_: string) {
    const users = await getUsers();

    const config = readConfig();

    console.log(">====== Getting All Users ======<")
    for (const user of users) {
        if (user.name === config?.currentUserName) {
            console.log(`* ${user.name} (current)`);
            continue;
        }
        console.log(`* ${user.name}`);
    }
    console.log(">====== End ======<")
}
