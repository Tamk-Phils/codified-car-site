import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yehnqmufskriwtogpwzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG5xbXVmc2tyaXd0b2dwd3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNDk3ODIsImV4cCI6MjEwMTcyNTc4Mn0.Wfu_UZe5fKOvZPVHshhREJzn7niKiW0OQOPXwIA9uH0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLogin() {
  console.log("Testing login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@bankseizedcars.online',
    password: 'admin123',
  });

  if (error) {
    console.error("Login Error:", error);
  } else {
    console.log("Login Success!", data.user.id);
  }
}

testLogin();
