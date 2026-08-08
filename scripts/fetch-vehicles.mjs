import { createClient } from "@supabase/supabase-js";
import TurndownService from "turndown";

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const turndownService = new TurndownService();

// Helper to strip HTML
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

async function fetchAndMigrateVehicles() {
  console.log("Fetching vehicles (products) from bankseizedcars.online WP REST API...");
  try {
    const response = await fetch("https://bankseizedcars.online/wp-json/wp/v2/product?per_page=40&_embed=1");
    if (!response.ok) {
       console.error("Failed to fetch:", response.status, response.statusText);
       return;
    }
    const wpProducts = await response.json();
    console.log(`Successfully fetched ${wpProducts.length} items from inventory.`);
    
    // Pick 40 random items
    const shuffled = wpProducts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 40);
    
    let insertedCount = 0;
    
    for (const post of selected) {
      // Find featured image if available
      let imageUrl = null;
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
      }
      
      const title = post.title.rendered.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)).replace(/&amp;/g, '&');
      const slug = post.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const content = turndownService.turndown(post.content.rendered || "");
      
      // Parse year and make from title (e.g. "2023FerrariConvertible2d")
      let year = new Date().getFullYear();
      let make = "Unknown";
      
      const yearMatch = title.match(/^(20\d{2}|19\d{2})/);
      if (yearMatch) {
          year = parseInt(yearMatch[1]);
          const rest = title.replace(yearMatch[1], '').trim();
          // rough guess for make
          if (rest.toLowerCase().includes("ferrari")) make = "Ferrari";
          else if (rest.toLowerCase().includes("bmw")) make = "BMW";
          else if (rest.toLowerCase().includes("mercedes")) make = "Mercedes-Benz";
          else if (rest.toLowerCase().includes("audi")) make = "Audi";
          else if (rest.toLowerCase().includes("ford")) make = "Ford";
          else if (rest.toLowerCase().includes("toyota")) make = "Toyota";
          else make = rest.substring(0, 15); // just take a chunk
      } else {
         const words = title.split(/[A-Z]/);
         make = title.substring(0, 15);
      }

      // Generate a reasonable random price between 10k and 90k
      const randomPrice = Math.floor(Math.random() * 80000) + 10000;

      const newVehicle = {
        slug: slug,
        name: title,
        description: content || title,
        price: randomPrice,
        images: imageUrl ? [imageUrl] : [],
        make: make,
        year: year,
        is_sold: false,
        created_at: post.date,
      };
      
      const { data, error } = await supabase.from('vehicles').insert(newVehicle);
      
      if (error) {
         if (error.code === '23505') {
             console.log(`Skipping duplicate slug: ${slug}`);
         } else {
            console.error(`Failed to insert ${slug}:`, error.message);
         }
      } else {
        insertedCount++;
        console.log(`Inserted vehicle: ${title}`);
      }
    }
    
    console.log(`Migration complete! Successfully inserted ${insertedCount} vehicles into inventory.`);
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

fetchAndMigrateVehicles();
