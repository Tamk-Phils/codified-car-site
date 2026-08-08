import { supabase } from "@/integrations/supabase/client";

// Since we are no longer using SSR server functions, we rely completely on Supabase Auth sessions.
export const adminLogin = async ({ data }: { data: any }) => {
  const { username, password } = data;
  const normalizedUsername = username?.trim().toLowerCase();
  const email = normalizedUsername === "admin" ? "admin@kjautos.online" : (username?.trim() || "");
  
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error || !authData.user) {
    console.error("Login Error:", error);
    throw new Error("Invalid credentials");
  }
  
  return { ok: true, username: "admin" };
};

export const adminLogout = async () => {
  await supabase.auth.signOut();
  return { ok: true };
};

export const adminMe = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { admin: null };
  return { admin: { id: session.user.id, username: "admin" } };
};

export const adminStats = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");
  
  try {
    const [vehicles, sold, posts, orders, inquiries, subscribers] = await Promise.all([
      supabase.from("vehicles").select("id", { count: "exact", head: true }),
      supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("is_sold", true),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("total, status, created_at"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
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
};

export const adminVehicles = async () => {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminInquiries = async () => {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminSubscribers = async () => {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminSaveVehicle = async ({ data }: { data: any }) => {
  const { id, created_at, ...values } = data;
  if (id) {
    const { error } = await supabase.from("vehicles").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  const { data: res, error } = await supabase
    .from("vehicles")
    .insert(values)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: res.id };
};

export const adminSavePost = async ({ data }: { data: any }) => {
  const { id, created_at, ...values } = data;
  if (id) {
    const { error } = await supabase.from("posts").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  const { data: res, error } = await supabase
    .from("posts")
    .insert(values)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: res.id };
};

export const adminDelete = async ({ data }: { data: { table: string; id: string } }) => {
  const { table, id } = data;
  const targetTable = table === "subscribers" ? "newsletter_subscribers" : table;
  const { error } = await supabase.from(targetTable as any).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
};

export const adminSetOrderStatus = async ({ data }: { data: { id: string; status: any } }) => {
  const { error } = await supabase.from("orders").update({ status: data.status }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return { success: true };
};

export const adminSetInquiryStatus = async ({ data }: { data: { id: string; status: any } }) => {
  const { error } = await supabase.from("inquiries").update({ status: data.status }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return { success: true };
};

export const adminChangePassword = async ({ data }: { data: { password: string } }) => {
  const { error } = await supabase.auth.updateUser({
    password: data.password
  });
  if (error) throw new Error(error.message);
  return { success: true };
};
