import Parser from 'rss-parser';

const parser = new Parser();
const RSS_FEEDS = [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://techcrunch.com/feed/'
];

async function testFeeds() {
    console.log("Testing RSS Feed Connection...");

    for (const url of RSS_FEEDS) {
        try {
            console.log(`Fetching: ${url}`);
            const feed = await parser.parseURL(url);
            console.log(`✅ Success: ${feed.title}`);
            console.log(`   - Found ${feed.items.length} articles.`);
            console.log(`   - Sample: ${feed.items[0].title}`);
        } catch (error) {
            console.error(`❌ Failed: ${url}`);
            console.error(`   - Error: ${error.message}`);
        }
    }
}

testFeeds();
