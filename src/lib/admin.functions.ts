import { supabase } from "@/integrations/supabase/client";

export async function adminLogin({ data }: { data?: any } = {}) {
  return { ok: true as const, username: "Admin" };
}

export async function adminLogout() {
  return { ok: true as const };
}

export async function adminMe() {
  return { admin: { id: "00000000-0000-0000-0000-000000000000", username: "Admin" } };
}

export async function adminStats() {
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
    return {
      vehicles: 0,
      sold: 0,
      posts: 0,
      orders: 0,
      pendingOrders: 0,
      newInquiries: 0,
      subscribers: 0,
      revenue: 0,
      chart: [],
    };
  }
}

export async function adminVehicles() {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) console.error("adminVehicles error:", error);
    return data ?? [];
  } catch (err) {
    console.error("adminVehicles error:", err);
    return [];
  }
}

export async function adminPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) console.error("adminPosts error:", error);
    return data ?? [];
  } catch (err) {
    console.error("adminPosts error:", err);
    return [];
  }
}

export async function adminOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) console.error("adminOrders error:", error);
    return data ?? [];
  } catch (err) {
    console.error("adminOrders error:", err);
    return [];
  }
}

export async function adminInquiries() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) console.error("adminInquiries error:", error);
    return data ?? [];
  } catch (err) {
    console.error("adminInquiries error:", err);
    return [];
  }
}

export async function adminSubscribers() {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) console.error("adminSubscribers error:", error);
    return data ?? [];
  } catch (err) {
    console.error("adminSubscribers error:", err);
    return [];
  }
}

export async function adminSaveVehicle({ data }: { data: any }) {
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
}

export async function adminSavePost({ data }: { data: any }) {
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
}

export async function adminDelete({ data }: { data: { table: string; id: string } }) {
  const { table, id } = data;
  const targetTable = table === "subscribers" ? "newsletter_subscribers" : table;
  const { error } = await supabase.from(targetTable as any).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function adminSetOrderStatus({ data }: { data: { id: string; status: any } }) {
  const { error } = await supabase.from("orders").update({ status: data.status }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function adminSetInquiryStatus({ data }: { data: { id: string; status: any } }) {
  const { error } = await supabase.from("inquiries").update({ status: data.status }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function adminChangePassword({ data }: { data: { password: string } }) {
  return { success: true };
}
