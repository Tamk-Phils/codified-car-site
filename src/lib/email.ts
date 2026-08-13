export interface OrderEmailPayload {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  paymentMethod: string;
  notes?: string;
  total: number;
  items: Array<{
    vehicle_name: string;
    quantity: number;
    unit_price: number;
  }>;
}

export async function sendOrderNotificationEmails(payload: OrderEmailPayload) {
  try {
    let res = await fetch("/api/send-order-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      res = await fetch("/.netlify/functions/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      console.warn("Server email endpoint status:", res.status);
    }
  } catch (err) {
    console.error("Failed to trigger order email notification:", err);
  }
}
