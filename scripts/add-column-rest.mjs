const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

async function run() {
  const sql = "ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS down_payment numeric(12,2);";
  
  console.log("Attempting SQL execution via pg / management / query endpoints...");

  // Try pg meta / query endpoints
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  });

  console.log("Status:", res.status, await res.text());
}

run();
