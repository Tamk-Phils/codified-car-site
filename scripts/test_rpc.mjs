import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ccrvwzvtfbwdgdgveagm.supabase.co";
const SUPABASE_KEY = "sb_publishable_H1l6BX_mwt_Lc7n1ZFc30A_gJlyI-WK";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log("Testing verify_admin_login RPC...");
  const { data, error } = await supabase.rpc("verify_admin_login", {
    _username: "admin",
    _password: "admin123"
  });
  
  if (error) {
    console.error("RPC Error:", error);
  } else {
    console.log("RPC Success:", data);
  }
}

test();
