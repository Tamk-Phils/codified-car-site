import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function exportData() {
  console.log("Fetching posts...");
  const { data: posts } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
  console.log("Fetching vehicles...");
  const { data: vehicles } = await supabase.from("vehicles").select("*").order("sort_order", { ascending: true });
  console.log("Fetching reviews...");
  const { data: reviews } = await supabase.from("reviews").select("*").order("sort_order", { ascending: true });

  console.log(`Fetched ${posts?.length || 0} posts, ${vehicles?.length || 0} vehicles, ${reviews?.length || 0} reviews.`);

  const content = `// Auto-generated static fallback data for instant 0ms site rendering
import type { Post, Vehicle, Review } from "./types";

export const FALLBACK_POSTS: Post[] = ${JSON.stringify(posts || [], null, 2)};

export const FALLBACK_VEHICLES: Vehicle[] = ${JSON.stringify(vehicles || [], null, 2)};

export const FALLBACK_REVIEWS: Review[] = ${JSON.stringify(reviews || [], null, 2)};
`;

  fs.writeFileSync(path.join(process.cwd(), 'src/lib/static-data.ts'), content);
  console.log("Successfully wrote src/lib/static-data.ts!");
}

exportData();
