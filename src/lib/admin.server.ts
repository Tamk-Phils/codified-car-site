import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const loginInput = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200),
});

export async function checkCredentials(username: string, password: string) {
  const { data, error } = await supabaseAdmin.rpc("verify_admin_login", {
    _username: username,
    _password: password,
  });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { id: string; username: string }[];
  return rows[0] ?? null;
}

export async function dashboardStats() {
  const [vehicles, sold, posts, orders, inquiries, subscribers] = await Promise.all([
    supabaseAdmin.from("vehicles").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("vehicles").select("id", { count: "exact", head: true }).eq("is_sold", true),
    supabaseAdmin.from("posts").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("total, status, created_at"),
    supabaseAdmin.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabaseAdmin.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
  ]);

  const orderRows = (orders.data ?? []) as { total: number; status: string; created_at: string }[];
  const revenue = orderRows.reduce((sum, o) => sum + Number(o.total), 0);

  const byDay = new Map<string, number>();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of orderRows) {
    const key = o.created_at.slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
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
}

export async function listOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listInquiries() {
  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listSubscribers() {
  const { data, error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listVehiclesAdmin() {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listPostsAdmin() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export const vehicleInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  name: z.string().min(2).max(200),
  price: z.number().nonnegative(),
  sale_price: z.number().nonnegative().nullable().default(null),
  down_payment: z.number().nonnegative().nullable().default(null),
  description: z.string().max(8000).default(""),
  mileage: z.string().max(80).nullable().default(null),
  transmission: z.string().max(80).nullable().default(null),
  exterior_color: z.string().max(80).nullable().default(null),
  interior_color: z.string().max(80).nullable().default(null),
  fuel_type: z.string().max(80).nullable().default(null),
  trim: z.string().max(120).nullable().default(null),
  title_status: z.string().max(80).nullable().default(null),
  body_type: z.string().max(80).nullable().default(null),
  make: z.string().max(80).nullable().default(null),
  year: z.number().int().min(1900).max(2100).nullable().default(null),
  images: z.array(z.string().max(600)).max(20).default([]),
  is_hot_deal: z.boolean().default(true),
  is_sold: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export async function saveVehicle(input: z.infer<typeof vehicleInput>) {
  const { id, down_payment, ...values } = input;
  if (id) {
    const { error } = await supabaseAdmin.from("vehicles").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .insert(values)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

export const postInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(2).max(220),
  excerpt: z.string().max(600).default(""),
  content: z.string().max(80000).default(""),
  cover_image: z.string().max(600).nullable().default(null),
  category: z.string().max(80).default("Guides"),
  keywords: z.array(z.string().max(80)).max(30).default([]),
  meta_title: z.string().max(200).nullable().default(null),
  meta_description: z.string().max(400).nullable().default(null),
  author: z.string().max(120).default("KJ Autos"),
  read_minutes: z.number().int().min(1).max(60).default(5),
  is_published: z.boolean().default(true),
});

export async function savePost(input: z.infer<typeof postInput>) {
  const { id, ...values } = input;
  if (id) {
    const { error } = await supabaseAdmin.from("posts").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  const { data, error } = await supabaseAdmin.from("posts").insert(values).select("id").single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function deleteRow(table: "vehicles" | "posts" | "orders" | "inquiries", id: string) {
  const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function updateInquiryStatus(id: string, status: string) {
  const { error } = await supabaseAdmin.from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function changePassword(adminId: string, newPassword: string) {
  const { error } = await supabaseAdmin.rpc("set_admin_password" as never, {
    _admin_id: adminId,
    _password: newPassword,
  } as never);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}
