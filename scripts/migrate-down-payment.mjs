import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function run() {
  console.log("Adding down_payment column to vehicles table if not exists...");
  
  // Try calling rpc or raw SQL via postgres REST
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS down_payment numeric(12,2);' });

  if (error) {
    console.log("RPC exec_sql result:", error.message);
  } else {
    console.log("Successfully executed SQL via RPC!");
  }
}

run();
