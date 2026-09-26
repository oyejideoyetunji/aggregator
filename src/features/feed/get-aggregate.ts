import { fetchFeed } from "../../shared/api";

export async function getAggregate(_: string) {
    const aggregate = await fetchFeed("https://www.wagslane.dev/index.xml");

    console.log(aggregate);
}
