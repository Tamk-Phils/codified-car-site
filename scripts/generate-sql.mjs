import fs from 'fs';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

async function run() {
  console.log("Fetching 40 products from WP API...");
  const res = await fetch("https://bankseizedcars.online/wp-json/wp/v2/product?per_page=40");
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }
  const products = await res.json();
  console.log(`Fetched ${products.length} products.`);

  // Collect media and category IDs
  const mediaIds = new Set();
  const categoryIds = new Set();

  for (const p of products) {
    if (p.featured_media) mediaIds.add(p.featured_media);
    if (p.product_cat && Array.isArray(p.product_cat)) {
      p.product_cat.forEach(id => categoryIds.add(id));
    }
  }

  // Fetch media
  const mediaMap = new Map();
  if (mediaIds.size > 0) {
    console.log(`Fetching ${mediaIds.size} media items...`);
    // Split into chunks of 20 to avoid long URLs or timeouts
    const mediaIdsArr = Array.from(mediaIds);
    for (let i = 0; i < mediaIdsArr.length; i += 20) {
      const chunk = mediaIdsArr.slice(i, i + 20);
      const mediaRes = await fetch(`https://bankseizedcars.online/wp-json/wp/v2/media?include=${chunk.join(',')}`);
      if (mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        for (const m of mediaItems) {
          mediaMap.set(m.id, m.source_url);
        }
      }
    }
  }

  // Fetch categories
  const categoryMap = new Map();
  if (categoryIds.size > 0) {
    console.log(`Fetching ${categoryIds.size} category items...`);
    const catIdsArr = Array.from(categoryIds);
    for (let i = 0; i < catIdsArr.length; i += 20) {
      const chunk = catIdsArr.slice(i, i + 20);
      const catRes = await fetch(`https://bankseizedcars.online/wp-json/wp/v2/product_cat?include=${chunk.join(',')}`);
      if (catRes.ok) {
        const catItems = await catRes.json();
        for (const c of catItems) {
          categoryMap.set(c.id, c.name);
        }
      }
    }
  }

  console.log("Generating SQL...");
  let sql = `BEGIN;\n\n`;
  sql += `-- Auto-generated inventory inserts\n`;

  for (const p of products) {
    const title = p.title.rendered.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)).replace(/&amp;/g, '&').replace(/'/g, "''");
    const slug = (p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')).replace(/'/g, "''");
    let content = turndownService.turndown(p.content.rendered || "");
    content = content.replace(/'/g, "''");

    const price = Math.floor(Math.random() * 80000) + 10000;
    
    let year = new Date().getFullYear();
    let make = "Unknown";
    const yearMatch = title.match(/^(20\d{2}|19\d{2})/);
    if (yearMatch) {
      year = parseInt(yearMatch[1]);
      const rest = title.replace(yearMatch[1], '').trim();
      if (rest.toLowerCase().includes("ferrari")) make = "Ferrari";
      else if (rest.toLowerCase().includes("bmw")) make = "BMW";
      else if (rest.toLowerCase().includes("mercedes")) make = "Mercedes-Benz";
      else if (rest.toLowerCase().includes("audi")) make = "Audi";
      else if (rest.toLowerCase().includes("ford")) make = "Ford";
      else if (rest.toLowerCase().includes("toyota")) make = "Toyota";
      else make = rest.substring(0, 15);
    } else {
      make = title.substring(0, 15);
    }
    make = make.replace(/'/g, "''");

    // Image
    let imageUrl = null;
    if (p.featured_media && mediaMap.has(p.featured_media)) {
      imageUrl = mediaMap.get(p.featured_media);
    }
    const imagesStr = imageUrl ? `ARRAY['${imageUrl.replace(/'/g, "''")}']::text[]` : `ARRAY[]::text[]`;

    // Category (mapped to body_type for vehicles table, since vehicles don't have a category field)
    let category = '';
    if (p.product_cat && Array.isArray(p.product_cat) && p.product_cat.length > 0) {
       category = categoryMap.get(p.product_cat[0]) || '';
    }
    category = category.replace(/'/g, "''");

    sql += `INSERT INTO public.vehicles (slug, name, description, price, make, year, body_type, images, is_sold, created_at)\n`;
    sql += `VALUES ('${slug}', '${title}', '${content}', ${price}, '${make}', ${year}, '${category}', ${imagesStr}, false, '${p.date}')\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET images = EXCLUDED.images, body_type = EXCLUDED.body_type;\n\n`;
  }

  sql += `COMMIT;\n`;

  const outPath = '/home/philding/Desktop/apps/codified-car-site/supabase/migrations/99999999999999_seed_vehicles.sql';
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`Successfully generated SQL at ${outPath}`);
}

run().catch(console.error);
