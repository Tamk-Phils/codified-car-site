import { createClient } from "@supabase/supabase-js";
import TurndownService from "turndown";

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const turndownService = new TurndownService();

// Clean up HTML tags for excerpt
function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, '');
}

async function fetchAndMigratePosts() {
  console.log("Fetching posts from bankseizedcars.online WP REST API...");
  try {
    const response = await fetch("https://bankseizedcars.online/wp-json/wp/v2/posts?per_page=40&_embed");
    const wpPosts = await response.json();
    
    console.log(`Successfully fetched ${wpPosts.length} posts.`);
    
    let insertedCount = 0;
    
    for (const post of wpPosts) {
      // Find featured image if available
      let coverImage = null;
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        coverImage = post._embedded['wp:featuredmedia'][0].source_url;
      }
      
      const title = post.title.rendered;
      // create a clean slug
      const slug = post.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const excerpt = stripHtml(post.excerpt.rendered).substring(0, 150) + "...";
      const content = turndownService.turndown(post.content.rendered);
      
      // Attempt to map category or just use default
      let categoryName = "Guides";
      if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0].length > 0) {
          categoryName = post._embedded['wp:term'][0][0].name;
      }

      // calculate reading time (rough estimate 200 words per minute)
      const wordCount = content.split(/\s+/).length;
      const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const newPost = {
        slug: slug,
        title: title,
        excerpt: excerpt,
        content: content,
        cover_image: coverImage,
        category: categoryName,
        keywords: [],
        author: "Bank Seized Cars",
        read_minutes: readMinutes,
        is_published: true,
        published_at: post.date,
        created_at: post.date,
        updated_at: post.modified
      };
      
      const { data, error } = await supabase.from('posts').insert(newPost);
      
      if (error) {
         if (error.code === '23505') {
             console.log(`Skipping duplicate slug: ${slug}`);
         } else {
            console.error(`Failed to insert ${slug}:`, error.message);
         }
      } else {
        insertedCount++;
        console.log(`Inserted: ${title}`);
      }
    }
    
    console.log(`Migration complete! Successfully inserted ${insertedCount} new posts.`);
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

fetchAndMigratePosts();
