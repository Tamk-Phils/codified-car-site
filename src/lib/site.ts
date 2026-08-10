export const SITE = {
  name: "KJ Autos",
  tagline: "Bank-repossessed vehicles at below-market prices",
  phone: "(213) 298-4108",
  phoneFormatted: "213 298 4108",
  phoneLink: "tel:+12132984108",
  smsLink: "sms:+12132984108",
  whatsapp: "+1 (213) 298-4108",
  whatsappLink: "https://wa.me/12132984108",
  email: "support@kjautos.online",
  location: "California",
  address: ["Wilshire Blvd", "Los Angeles, California"],
  hours: [
    "Monday – Friday: 8:00 AM – 7:00 PM (PST)",
    "Saturday: 9:00 AM – 6:00 PM (PST)",
    "Sunday: Closed",
  ],
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/boutique" },
  { label: "Blog", to: "/blog" },
  { label: "Reviews", to: "/avis-client" },
  { label: "How to Order", to: "/processus-dachat" },
  { label: "Contact Us", to: "/nous-contacter" },
  { label: "About Us", to: "/a-propos" },
] as const;

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
