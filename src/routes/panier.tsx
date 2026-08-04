import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Your Cart | Bank Seized Cars" },
      {
        name: "description",
        content:
          "Review the repossessed vehicles you have reserved before checkout, adjust quantities and continue to secure payment.",
      },
      { property: "og:title", content: "Your Cart | Bank Seized Cars" },
      { property: "og:description", content: "Review your reserved repossessed vehicles." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/panier" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/panier" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, total, remove, setQuantity } = useCart();

  return (
    <SiteLayout>
      <PageHero breadcrumb="Checkout" title="Your cart" />
      <div className="container-page py-12">
        {lines.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button variant="hero" className="mt-6" asChild>
              <Link to="/boutique">Browse inventory</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="ink-panel text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-4 text-left">Vehicle</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Qty</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.vehicleId} className="border-b border-border">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {line.image ? (
                            <img
                              src={line.image}
                              alt={line.name}
                              className="size-16 rounded object-cover"
                            />
                          ) : null}
                          <Link
                            to="/produit/$slug"
                            params={{ slug: line.slug }}
                            className="font-semibold hover:text-hot"
                          >
                            {line.name}
                          </Link>
                        </div>
                      </td>
                      <td className="p-4">{formatPrice(line.price)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(line.vehicleId, line.quantity - 1)}
                          >
                            <Minus />
                          </Button>
                          <span className="w-6 text-center">{line.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(line.vehicleId, line.quantity + 1)}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-hot">
                        {formatPrice(line.price * line.quantity)}
                      </td>
                      <td className="p-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Remove item"
                          onClick={() => remove(line.vehicleId)}
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="h-fit rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl">Cart totals</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd className="text-muted-foreground">Quoted after order</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="text-hot">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Button variant="hero" className="mt-6 w-full" asChild>
                <Link to="/commander">Proceed to checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
