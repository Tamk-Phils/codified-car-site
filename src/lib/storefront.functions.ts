import { supabase } from "@/integrations/supabase/client";

export async function submitOrder({ data }: { data: any }) {
  const ids = data.items.map((i: any) => i.vehicleId);
  const { data: vehicles, error: vErr } = await supabase
    .from("vehicles")
    .select("id, name, slug, price, images")
    .in("id", ids);
  if (vErr) throw new Error(vErr.message);

  const priced = data.items
    .map((item: any) => {
      const v = (vehicles ?? []).find((row: any) => row.id === item.vehicleId);
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
    .filter((x: any): x is NonNullable<typeof x> => x !== null);

  const total = priced.reduce((sum: number, i: any) => sum + i.unit_price * i.quantity, 0);

  const { data: order, error } = await supabase
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

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(priced.map((i: any) => ({ ...i, order_id: order.id })));
  if (itemsError) throw new Error(itemsError.message);

  return { orderNumber: order.order_number, total: Number(order.total) };
}

export async function submitInquiry({ data }: { data: any }) {
  const { error } = await supabase.from("inquiries").insert(data);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function subscribeToNewsletter({ data }: { data: { email: string } }) {
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: data.email }, { onConflict: "email" });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}
