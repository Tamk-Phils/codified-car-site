import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function test() {
  const { data: posts } = await adminClient.from("posts").select("*");
  console.log("Admin Client Posts Count:", posts?.length);
  console.log("Admin Client Posts:", posts);

  const { data: vehicles } = await adminClient.from("vehicles").select("id, name, is_sold, sort_order");
  console.log("Admin Client Vehicles Count:", vehicles?.length);
}

test();
