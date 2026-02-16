import axios from 'axios';

const API_KEY = 's-l5Oh_uyzznIZsAq-_FCSJdwv55-ZQ_GpB1Pr_mT_wn5y_X';
const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${API_KEY}&language=en&category=general`;

async function verifyApi() {
    console.log("📡 Testing Connection to Currents API...");
    console.log(`🔑 Key: ${API_KEY.substring(0, 5)}...`);

    try {
        const res = await axios.get(url, { timeout: 5000 });
        if (res.data.status === 'ok') {
            console.log("✅ SUCCESS: API Connected!");
            console.log(`📚 Articles Retrieved: ${res.data.news.length}`);
            console.log("---------------------------------------------------");
            console.log(`📰 Sample Headline: ${res.data.news[0].title}`);
            console.log(`🔗 Source: ${res.data.news[0].author || 'Unknown'}`);
            console.log("---------------------------------------------------");
        } else {
            console.error("❌ API Error:", res.data);
        }
    } catch (e) {
        console.error("❌ Connection Failed:", e.message);
        if (e.response) console.error("   Response:", e.response.data);
    }
}

verifyApi();
