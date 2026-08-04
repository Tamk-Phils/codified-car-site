import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const orderInput = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(60).default(""),
  address: z.string().max(200).default(""),
  city: z.string().max(100).default(""),
  state: z.string().max(100).default(""),
  postcode: z.string().max(30).default(""),
  country: z.string().max(100).default("United States"),
  payment_method: z.enum(["bank_transfer", "zelle", "crypto", "cashapp"]),
  notes: z.string().max(2000).default(""),
  items: z
    .array(
      z.object({
        vehicleId: z.string().uuid(),
        name: z.string().max(200),
        slug: z.string().max(200),
        image: z.string().max(500).nullable(),
        price: z.number().nonnegative(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
});

export type OrderInput = z.infer<typeof orderInput>;

export async function persistOrder(data: OrderInput) {
  const ids = data.items.map((i) => i.vehicleId);
  const { data: vehicles, error: vErr } = await supabaseAdmin
    .from("vehicles")
    .select("id, name, slug, price, images")
    .in("id", ids);
  if (vErr) throw new Error(vErr.message);
  if (!vehicles || vehicles.length === 0) throw new Error("No valid vehicles in this order");

  const priced = data.items
    .map((item) => {
      const v = vehicles.find((row) => row.id === item.vehicleId);
      if (!v) return null;
      return {
        vehicle_id: v.id,
        vehicle_name: v.name,
        vehicle_slug: v.slug,
        image: (v.images as string[] | null)?.[0] ?? null,
        unit_price: Number(v.price),
        quantity: item.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const total = priced.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      country: data.country,
      payment_method: data.payment_method,
      notes: data.notes,
      total,
    })
    .select("id, order_number, total")
    .single();
  if (error) throw new Error(error.message);

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(priced.map((i) => ({ ...i, order_id: order.id })));
  if (itemsError) throw new Error(itemsError.message);

  return { orderNumber: order.order_number, total: Number(order.total) };
}

export const inquiryInput = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(60).default(""),
  subject: z.string().max(200).default(""),
  message: z.string().min(5).max(4000),
});

export async function persistInquiry(data: z.infer<typeof inquiryInput>) {
  const { error } = await supabaseAdmin.from("inquiries").insert(data);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function persistSubscriber(email: string) {
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email" });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}
