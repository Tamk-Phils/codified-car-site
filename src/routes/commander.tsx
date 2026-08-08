import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart";
import { formatPrice, SITE } from "@/lib/site";
import { submitOrder } from "@/lib/storefront.functions";

export const Route = createFileRoute("/commander")({
  head: () => ({
    meta: [
      { title: "Checkout | KJ Autos" },
      {
        name: "description",
        content:
          "Complete your repossessed vehicle order. Enter delivery details, choose a payment method and our team confirms availability within 24 hours.",
      },
      { property: "og:title", content: "Checkout | KJ Autos" },
      { property: "og:description", content: "Complete your repossessed vehicle order." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/commander" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/commander" }],
  }),
  component: Checkout,
});

const PAYMENTS = [
  { value: "bank_transfer", label: "Direct bank transfer", note: "Wire details are emailed after your order is confirmed." },
  { value: "zelle", label: "Zelle", note: "Fast domestic transfer, same-day confirmation." },
  { value: "cashapp", label: "Cash App", note: "For deposits and part payments." },
  { value: "crypto", label: "Bitcoin / USDT", note: "Escrow-backed crypto settlement." },
];

function Checkout() {
  const { lines, total, clear } = useCart();
  const [payment, setPayment] = useState("bank_transfer");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; total: number } | null>(null);

  if (placed) {
    return (
      <SiteLayout>
        <PageHero breadcrumb="Order received" title="Thank you — your order is in" />
        <div className="container-page py-14">
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Order number</p>
            <p className="mt-1 font-display text-2xl">{placed.orderNumber}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Total: <span className="font-semibold text-hot">{formatPrice(placed.total)}</span>
            </p>
            <p className="mt-6 max-w-xl text-sm text-muted-foreground">
              Our sales desk will contact you within 24 hours with payment instructions and a
              delivery quote. For an immediate reply, message us on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <a href={SITE.whatsappLink}>Message on WhatsApp</a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/boutique">Keep browsing</Link>
              </Button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (lines.length === 0) {
    return (
      <SiteLayout>
        <PageHero breadcrumb="Checkout" title="Checkout" />
        <div className="container-page py-14">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button variant="hero" className="mt-6" asChild>
            <Link to="/boutique">Browse inventory</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero breadcrumb="Checkout" title="Billing & delivery details" />
      <form
        className="container-page grid gap-10 py-12 lg:grid-cols-[3fr_2fr]"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setBusy(true);
          try {
            const result = await submitOrder({
              data: {
                full_name: String(form.get("full_name") ?? ""),
                email: String(form.get("email") ?? ""),
                phone: String(form.get("phone") ?? ""),
                address: String(form.get("address") ?? ""),
                city: String(form.get("city") ?? ""),
                state: String(form.get("state") ?? ""),
                postcode: String(form.get("postcode") ?? ""),
                country: String(form.get("country") ?? "United States"),
                payment_method: payment,
                notes: String(form.get("notes") ?? ""),
                items: lines.map((l) => ({
                  vehicleId: l.vehicleId,
                  name: l.name,
                  slug: l.slug,
                  image: l.image,
                  price: l.price,
                  quantity: l.quantity,
                })),
              },
            });
            clear();
            setPlaced(result);
          } catch {
            toast.error("We couldn't place that order. Please check your details and try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="full_name">Full name *</Label>
              <Input id="full_name" name="full_name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email address *</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue="United States" className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Delivery address *</Label>
            <Input id="address" name="address" required className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" name="state" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="postcode">ZIP code *</Label>
              <Input id="postcode" name="postcode" required className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Order notes</Label>
            <Textarea id="notes" name="notes" rows={4} className="mt-1" />
          </div>

          <fieldset className="rounded-lg border border-border bg-card p-5">
            <legend className="px-2 font-display text-sm uppercase tracking-widest">
              Payment method
            </legend>
            <RadioGroup value={payment} onValueChange={setPayment} className="mt-2 space-y-3">
              {PAYMENTS.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-start gap-3">
                  <RadioGroupItem value={option.value} className="mt-1" />
                  <span>
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="block text-sm text-muted-foreground">{option.note}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.vehicleId} className="flex justify-between gap-4 border-b border-border pb-3">
                <span>
                  {line.name} <span className="text-muted-foreground">× {line.quantity}</span>
                </span>
                <span>{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-hot">{formatPrice(total)}</span>
          </div>
          <Button type="submit" variant="hero" size="lg" className="mt-6 w-full" disabled={busy}>
            {busy ? "Placing order…" : "Place order"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No card is charged online. A sales agent confirms availability and payment details
            before any funds move.
          </p>
        </aside>
      </form>
    </SiteLayout>
  );
}
