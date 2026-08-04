export const SITE = {
  name: "Bank Seized Cars",
  tagline: "Bank-repossessed vehicles at below-market prices",
  whatsapp: "+15756026334",
  whatsappLink: "https://wa.me/15756026334",
  email: "support@bankseizedcars.online",
  address: ["447 Broadway, 2nd Floor", "New York, NY 10013", "United States"],
  hours: [
    "Monday – Friday: 9:00 AM – 6:00 PM",
    "Saturday: 10:00 AM – 6:00 PM",
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
