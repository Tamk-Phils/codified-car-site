import { createServerFn } from "@tanstack/react-start";
import { setCookie, getCookie, deleteCookie } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Helper to check authentication on the server
async function requireAdmin() {
  const authId = getCookie("admin_auth");
  if (!authId) throw new Error("Unauthorized");
  return authId;
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { username, password } = data;
    const { data: result, error } = await supabaseAdmin.rpc("verify_admin_login", {
      _username: username,
      _password: password,
    });
    
    if (error || !result || result.length === 0) {
      console.error("Login Error:", error || "No result found for credentials");
      throw new Error("Invalid credentials");
    }
    
    const user = result[0];
    
    setCookie("admin_auth", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    return { ok: true, username: user.username };
  });

export const adminLogout = createServerFn({ method: "POST" })
  .handler(async () => {
    deleteCookie("admin_auth");
    return { ok: true };
  });

export const adminMe = createServerFn({ method: "GET" })
  .handler(async () => {
    const authId = getCookie("admin_auth");
    if (!authId) return { admin: null };
    
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, username")
      .eq("id", authId)
      .single();
      
    if (error || !data) {
      deleteCookie("admin_auth");
      return { admin: null };
    }
    return { admin: data };
  });

export const adminStats = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin();
    try {
      const [vehicles, sold, posts, orders, inquiries, subscribers] = await Promise.all([
        supabaseAdmin.from("vehicles").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("vehicles").select("id", { count: "exact", head: true }).eq("is_sold", true),
        supabaseAdmin.from("posts").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("orders").select("total, status, created_at"),
        supabaseAdmin.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabaseAdmin.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);
  
      const orderRows = (orders.data ?? []) as { total: number; status: string; created_at: string }[];
      const revenue = orderRows.reduce((sum, o) => sum + Number(o.total || 0), 0);
  
      const byDay = new Map<string, number>();
      for (let i = 13; i >= 0; i -= 1) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        byDay.set(d.toISOString().slice(0, 10), 0);
      }
      for (const o of orderRows) {
        const key = o.created_at ? o.created_at.slice(0, 10) : "";
        if (key && byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
      }
  
      return {
        vehicles: vehicles.count ?? 0,
        sold: sold.count ?? 0,
        posts: posts.count ?? 0,
        orders: orderRows.length,
        pendingOrders: orderRows.filter((o) => o.status === "pending").length,
        newInquiries: inquiries.count ?? 0,
        subscribers: subscribers.count ?? 0,
        revenue,
        chart: [...byDay.entries()].map(([day, count]) => ({ day: day.slice(5), count })),
      };
    } catch (err) {
      console.error("adminStats error:", err);
      throw new Error("Failed to load stats");
    }
  });

export const adminVehicles = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminPosts = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminInquiries = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSubscribers = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveVehicle = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, created_at, ...values } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("vehicles").update(values).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: res, error } = await supabaseAdmin
      .from("vehicles")
      .insert(values)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: res.id };
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, created_at, ...values } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("posts").update(values).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: res, error } = await supabaseAdmin
      .from("posts")
      .insert(values)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: res.id };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .validator((data: { table: string; id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { table, id } = data;
    const targetTable = table === "subscribers" ? "newsletter_subscribers" : table;
    const { error } = await supabaseAdmin.from(targetTable as any).delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const adminSetOrderStatus = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: any }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const adminSetInquiryStatus = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: any }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await supabaseAdmin.from("inquiries").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const adminChangePassword = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const authId = await requireAdmin();
    const { error } = await supabaseAdmin.rpc("set_admin_password", {
      _admin_id: authId,
      _password: data.password,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });
