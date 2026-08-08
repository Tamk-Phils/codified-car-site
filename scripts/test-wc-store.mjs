import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });
const headers = {
  'User-Agent': 'Mozilla/5.0',
  'Accept': 'application/json'
};

async function testWCStore() {
  try {
    const res = await fetch('https://bankseizedcars.online/wp-json/wc/store/products?per_page=1', { agent, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("WC Store API Works!");
    if (data.length > 0) {
      console.log("Price:", data[0].prices);
      console.log("Images:", data[0].images.length);
    }
  } catch (err) {
    console.error("WC Store API failed:", err.message);
  }
}
testWCStore();
