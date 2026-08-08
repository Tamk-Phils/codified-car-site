import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

async function fetchProduct() {
  console.log("Fetching media...");
  const res = await fetch('https://bankseizedcars.online/wp-json/wp/v2/media?parent=15476', {
    agent,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*'
    }
  });
  const data = await res.json();
  console.log(`Found ${data.length} media items`);
  if (data.length > 0) {
    console.log(data.map(m => m.source_url));
  }
}

fetchProduct();
