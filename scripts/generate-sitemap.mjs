import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Hardcoded to ensure correct database is hit during build
const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNDk3ODIsImV4cCI6MjEwMTcyNTc4Mn0.Wfu_UZe5fKOvZPVHshhREJzn7niKiW0OQOPXwIA9uH0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BASE_URL = 'https://kjautos.online';

async function generateSitemap() {
  console.log("Generating sitemap.xml...");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const addUrl = (url, priority = 0.8, lastmod = new Date().toISOString()) => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  };

  // Static routes
  addUrl('/', 1.0);
  addUrl('/boutique', 0.9);
  addUrl('/processus-dachat', 0.8);
  addUrl('/a-propos', 0.8);
  addUrl('/nous-contacter', 0.8);
  addUrl('/avis-client', 0.8);
  addUrl('/blog', 0.8);

  // Dynamic Vehicles
  try {
    const { data: vehicles, error: vError } = await supabase
      .from('vehicles')
      .select('slug, created_at')
      .order('created_at', { ascending: false });
    
    if (!vError && vehicles) {
      for (const v of vehicles) {
        addUrl(`/produit/${v.slug}`, 0.9, v.created_at);
      }
    }
  } catch (err) {
    console.error("Failed to fetch vehicles for sitemap:", err);
  }

  // Dynamic Posts
  try {
    const { data: posts, error: pError } = await supabase
      .from('posts')
      .select('slug, published_at')
      .order('published_at', { ascending: false });
    
    if (!pError && posts) {
      for (const p of posts) {
        addUrl(`/blog/${p.slug}`, 0.7, p.published_at || new Date().toISOString());
      }
    }
  } catch (err) {
    console.error("Failed to fetch posts for sitemap:", err);
  }

  sitemap += `\n</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
  console.log("sitemap.xml generated successfully in public directory!");
}

generateSitemap();
