import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleCard } from "@/components/VehicleCard";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { formatPrice, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { vehicleQuery, vehiclesQuery } from "@/lib/queries";

export const Route = createFileRoute("/produit/$slug")({
  loader: async ({ context, params }) => {
    const vehicle = await context.queryClient.ensureQueryData(vehicleQuery(params.slug));
    if (!vehicle) throw notFound();
    await context.queryClient.ensureQueryData(vehiclesQuery);
    return { vehicle };
  },
  head: ({ loaderData, params }) => {
    const vehicle = loaderData?.vehicle;
    const title = vehicle ? `${vehicle.name} — ${formatPrice(vehicle.price)}` : "Vehicle";
    const description = vehicle
      ? `${vehicle.name} bank repossessed for sale at ${formatPrice(
          vehicle.sale_price ?? vehicle.price,
        )}. ${[vehicle.mileage, vehicle.transmission, vehicle.exterior_color]
          .filter(Boolean)
          .join(", ")}. Nationwide delivery.`
      : "Repossessed vehicle listing.";
    const image = vehicle?.images?.[0];
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 158) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produit/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/produit/${params.slug}` }],
      scripts: vehicle
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: vehicle.name,
                image: vehicle.images,
                description: vehicle.description?.slice(0, 400),
                brand: { "@type": "Brand", name: vehicle.make ?? "KJ Autos" },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "USD",
                  price: Number(vehicle.sale_price ?? vehicle.price),
                  availability: vehicle.is_sold
                    ? "https://schema.org/SoldOut"
                    : "https://schema.org/InStock",
                },
              }),
            },
          ]
        : [],
    };
  },
  component: Product,
});

function Product() {
  const { slug } = Route.useParams();
  const { data: vehicle } = useSuspenseQuery(vehicleQuery(slug));
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery);
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  if (!vehicle) return null;
  const price = Number(vehicle.sale_price ?? vehicle.price);
  const related = vehicles.filter((v) => v.id !== vehicle.id).slice(0, 4);

  const specs = [
    ["Mileage", vehicle.mileage],
    ["Transmission", vehicle.transmission],
    ["Exterior color", vehicle.exterior_color],
    ["Interior color", vehicle.interior_color],
    ["Fuel type", vehicle.fuel_type],
    ["Trim", vehicle.trim],
    ["Title status", vehicle.title_status],
    ["Body type", vehicle.body_type],
    ["Year", vehicle.year ? String(vehicle.year) : null],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <nav className="text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-hot">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/boutique" className="hover:text-hot">
            Inventory
          </Link>{" "}
          / <span className="text-foreground">{vehicle.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              {vehicle.images?.[active] ? (
                <OptimizedImage
                  src={vehicle.images[active]}
                  alt={vehicle.name}
                  priority
                  className="aspect-4/3 w-full object-cover"
                />
              ) : null}
            </div>
            {vehicle.images?.length > 1 ? (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {vehicle.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`overflow-hidden rounded-md border-2 ${
                      index === active ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <OptimizedImage src={src} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h1 className="text-3xl">{vehicle.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              {vehicle.sale_price ? (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(vehicle.price)}
                </span>
              ) : null}
              <span className="text-3xl font-bold text-hot">{formatPrice(price)}</span>
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {vehicle.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                type="number"
                min={1}
                max={5}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="h-10 w-20 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Quantity"
              />
              <Button
                variant="hero"
                size="lg"
                disabled={vehicle.is_sold}
                onClick={() => {
                  add(
                    {
                      vehicleId: vehicle.id,
                      slug: vehicle.slug,
                      name: vehicle.name,
                      price,
                      image: vehicle.images?.[0] ?? null,
                    },
                    qty,
                  );
                  toast.success("Added to cart", { description: vehicle.name });
                }}
              >
                {vehicle.is_sold ? "Sold" : "Add to cart"}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href={`${SITE.whatsappLink}?text=${encodeURIComponent(
                    `Hi, I'm interested in the ${vehicle.name} listed at ${formatPrice(price)}.`,
                  )}`}
                >
                  Ask on WhatsApp
                </a>
              </Button>
            </div>

            {specs.length > 0 ? (
              <table className="mt-8 w-full border-collapse text-sm">
                <tbody>
                  {specs.map(([label, value]) => (
                    <tr key={label} className="border-b border-border">
                      <th className="w-40 py-2 text-left font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </th>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-2xl">Related vehicles</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <VehicleCard key={item.id} vehicle={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}
