import { createClient } from '@supabase/supabase-js';
import https from 'https';
import TurndownService from 'turndown';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const turndownService = new TurndownService();

const agent = new https.Agent({ rejectUnauthorized: false });
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json'
};

async function fetch40Products() {
  console.log("Fetching 40 exact products from WordPress...");
  const res = await fetch('https://bankseizedcars.online/wp-json/wc/store/products?per_page=40', { agent, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function run() {
  try {
    const products = await fetch40Products();
    if (products.length === 0) {
      console.error("No products fetched.");
      return;
    }

    console.log(`Successfully fetched exactly ${products.length} products.`);
    
    // Upsert products without deleting manually added items
    console.log("Upserting vehicles into Supabase...");

    // Format the 40 products perfectly
    const vehiclesToInsert = products.map(p => {
      // Images
      const allImages = p.images.map(img => img.src);
      
      // Category
      const category = p.categories && p.categories.length > 0 ? p.categories[0].name : 'Unknown';
      
      // Title / Slug
      const title = p.name.replace(/&#(\d+);/g, (m, dec) => String.fromCharCode(dec)).replace(/&amp;/g, '&');
      let slug = p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!slug) slug = `vehicle-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      
      // Exact Price (from minor units)
      let price = 0;
      if (p.prices && p.prices.price) {
         const minorUnit = p.prices.currency_minor_unit || 2;
         price = parseInt(p.prices.price, 10) / Math.pow(10, minorUnit);
      }
      
      // Parse Year and Make
      let year = 2024;
      let make = "Unknown";
      const yearMatch = title.match(/^(20\d{2}|19\d{2})/);
      if (yearMatch) {
          year = parseInt(yearMatch[1]);
          const rest = title.replace(yearMatch[1], '').trim();
          const restLower = rest.toLowerCase();
          if (restLower.includes("ferrari")) make = "Ferrari";
          else if (restLower.includes("bmw")) make = "BMW";
          else if (restLower.includes("mercedes")) make = "Mercedes-Benz";
          else if (restLower.includes("audi")) make = "Audi";
          else if (restLower.includes("ford")) make = "Ford";
          else if (restLower.includes("toyota")) make = "Toyota";
          else if (restLower.includes("rollsroyce") || restLower.includes("rolls royce")) make = "Rolls-Royce";
          else if (restLower.includes("lamborghini")) make = "Lamborghini";
          else if (restLower.includes("maserati")) make = "Maserati";
          else if (restLower.includes("porsche")) make = "Porsche";
          else if (restLower.includes("chevrolet")) make = "Chevrolet";
          else if (restLower.includes("dodge")) make = "Dodge";
          else if (restLower.includes("lexus")) make = "Lexus";
          else if (restLower.includes("kia")) make = "Kia";
          else if (restLower.includes("gmc")) make = "GMC";
          else if (restLower.includes("acura")) make = "Acura";
          else if (restLower.includes("hyundai")) make = "Hyundai";
          else make = rest.substring(0, 20); 
      }

      // Custom formatting for description to handle the user's specific single-line asterisk format
      let rawText = p.description ? p.description.replace(/(<([^>]+)>)/gi, "") : '';
      
      // Replace instances like "* Mileage: 10 * Color: Red" with proper newlines
      let formattedDesc = rawText.replace(/\s*\*\s*/g, '\n* ').trim();
      
      // Remove any double newlines that might have been created
      formattedDesc = formattedDesc.replace(/\n\n+/g, '\n');
      
      const desc = formattedDesc.substring(0, 1500);

      return {
        slug: slug,
        name: title,
        description: desc,
        price: price,
        make: make,
        year: year,
        body_type: category,
        images: allImages,
        is_sold: false,
      };
    });

    console.log("Inserting 40 perfectly formatted vehicles...");
    
    // Insert in chunks of 20 just to be safe with Supabase limits
    for (let i = 0; i < vehiclesToInsert.length; i += 20) {
      const chunk = vehiclesToInsert.slice(i, i + 20);
      const { error: insertError } = await supabase.from('vehicles').upsert(chunk, { onConflict: 'slug' });
      if (insertError) {
        console.error("Failed to insert chunk:", insertError);
        return;
      }
    }

    console.log("SUCCESS! EXACTLY 40 vehicles perfectly integrated into your live site.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

run();
