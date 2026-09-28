export function parseDuration(duration: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = duration.match(regex);
    console.log(duration.match(regex)?.length);
    if (match?.length !== 3) return;

    const value = match[1];
    const unit = match[2];
    return Number(value) * unitToFactorMap[unit as keyof typeof unitToFactorMap];
}

const unitToFactorMap = {
    'ms': 1,
    's': 1000,
    'm': 1000 * 60,
    'h': 1000 * 60 * 60,
};
