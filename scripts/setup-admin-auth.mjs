import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE0OTc4MiwiZXhwIjoyMTAxNzI1NzgyfQ.VvlCRLsTua27p8FSvS1HnH5DGn-cCtlbFrDbU_5VgO8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupAdmin() {
  console.log("Creating admin user in Supabase Auth...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@bankseizedcars.online',
    password: 'admin123',
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log("Admin user already exists. We are good to go!");
    } else {
      console.error("Error creating admin user:", error.message);
    }
  } else {
    console.log("Admin user successfully created! ID:", data.user.id);
  }
}

setupAdmin();
