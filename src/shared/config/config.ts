import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName: string;
};

/**
 * writes a config object that satisfies the Config type to the ~/.gatorconfig.json JSON file in home dir after setting the current_user_name field.
 */
export function setUser(currentUserName: string) {
    if (!currentUserName) return;

    const config = readConfig();
    config.currentUserName = currentUserName;
    writeConfig(config);
}

export function resetUser() {
    const config = readConfig();
    config.currentUserName = "";
    writeConfig(config);
}

/**
 * reads the JSON ~/.gatorconfig.json file in home dir and returns an object that satisfies Config
 */
export function readConfig(): Config {
    const fileContents = readFileSync(getConfigFilePath(), { encoding: "utf-8" });
    const rawConfig = JSON.parse(fileContents);

    return buildValidConfig(rawConfig);
}

function writeConfig(config: Config) {
    const configString = JSON.stringify({
        "db_url": config.dbUrl,
        "current_user_name": config.currentUserName
    })

    writeFileSync(getConfigFilePath(), configString, { encoding: "utf-8" });
}

function getConfigFilePath(): string {
    return path.join(homedir(), ".gatorconfig.json");
}

function buildValidConfig(value: any): Config {
    if (!value?.db_url || typeof value.db_url !== "string") {
        throw new Error("Invalid db_url in raw config");
    }

    if (value?.current_user_name && typeof value.current_user_name !== "string") {
        throw new Error("Invalid current_user_name in raw config");
    }

    return { dbUrl: value.db_url, currentUserName: value.current_user_name ?? "" }
}
