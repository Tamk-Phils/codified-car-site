import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNDk3ODIsImV4cCI6MjEwMTcyNTc4Mn0.Wfu_UZe5fKOvZPVHshhREJzn7niKiW0OQOPXwIA9uH0";

const anonClient = createClient(SUPABASE_URL, ANON_KEY);

async function test() {
  const t0 = Date.now();
  console.log("Fetching posts from Supabase...");
  const { data, error } = await anonClient
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  const t1 = Date.now();
  console.log(`Supabase responded in ${t1 - t0}ms. Posts count: ${data?.length}, Error:`, error);
}

test();
