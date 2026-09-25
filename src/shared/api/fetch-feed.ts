import { XMLParser } from "fast-xml-parser";

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};  

export async function fetchFeed(url: string) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'gator',
            'Accept': 'application/xml'
        }
    });

    if(!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();

    const parser = new XMLParser({ processEntities: false });
    const channel = parser.parse(xml)?.rss?.channel;

    if (!channel) {
        throw new Error('Invalide data returned!');
    }

    const { title, link, description, item } = channel;


    if (!(title && link && description && item)) {
        throw new Error('Incomplete metadata returned');
    }

    const items: Record<string, any>[] = Array.isArray(item) ? item : [item];
    const rssItems: RSSItem[] = []

    for (const item of items) {
        const { title, link, description, pubDate } = item ?? {};

        if (!(title && link && description && pubDate)) {
            continue;
        }

        rssItems.push({ title, link, description, pubDate });
    }

    return { title, link, description, item: rssItems };
}
