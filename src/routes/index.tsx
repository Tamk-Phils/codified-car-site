import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Truck, BadgeDollarSign, FileCheck2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { vehiclesQuery, postsQuery, reviewsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(vehiclesQuery),
      context.queryClient.ensureQueryData(postsQuery),
      context.queryClient.ensureQueryData(reviewsQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Bank Seized Cars | Repossessed Vehicles For Sale Below Market" },
      {
        name: "description",
        content:
          "Buy bank seized and repossessed cars, trucks and SUVs at up to 60% below retail. Clean titles, verified mileage and nationwide delivery across the USA.",
      },
      { property: "og:title", content: "Bank Seized Cars | Repossessed Vehicles For Sale" },
      {
        property: "og:description",
        content:
          "Browse bank repossessed luxury cars, trucks and SUVs with clean titles and nationwide delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const PERKS = [
  { icon: BadgeDollarSign, title: "Below market pricing", body: "Repossessed stock priced to move — often 40-60% under retail." },
  { icon: FileCheck2, title: "Clean, verified titles", body: "Every listing ships with lien-free paperwork and a VIN report." },
  { icon: Truck, title: "Nationwide delivery", body: "Enclosed and open transport to any address in the lower 48." },
  { icon: ShieldCheck, title: "Secure escrow process", body: "Funds are only released once your vehicle is confirmed." },
];

function Home() {
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery);
  const { data: posts } = useSuspenseQuery(postsQuery);
  const { data: reviews } = useSuspenseQuery(reviewsQuery);

  const hero = vehicles[0];
  const featured = vehicles.slice(0, 8);
  const hotDeals = vehicles.filter((v) => v.is_hot_deal && !v.is_sold).slice(8, 16);
  const brands = [...new Set(vehicles.map((v) => v.make).filter(Boolean))].slice(0, 10) as string[];

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        {hero?.images?.[0] ? (
          <img
            src={hero.images[0]}
            alt="Repossessed luxury vehicle"
            className="absolute inset-0 size-full object-cover opacity-25"
          />
        ) : null}
        <div className="container-page relative py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Bank & lender repossessions
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">
            Seized vehicles, sold fast, far below retail
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Banks need these vehicles off their books. Browse verified repossessed cars, trucks and
            SUVs with clean titles, real mileage and delivery to your driveway.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/boutique">Shop inventory</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 bg-transparent" asChild>
              <Link to="/processus-dachat">How ordering works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex gap-3">
              <perk.icon className="size-6 shrink-0 text-primary" />
              <div>
                <p className="font-display text-sm uppercase tracking-wider">{perk.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-hot">Fresh repossessions</p>
            <h2 className="mt-2 text-3xl">Featured vehicles</h2>
          </div>
          <Button variant="ink" asChild>
            <Link to="/boutique">View all</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {brands.length > 0 ? (
        <section className="ink-panel">
          <div className="container-page py-12">
            <h2 className="text-2xl">Top brands in stock</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to="/boutique"
                  search={{ make: brand }}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:border-primary hover:text-primary"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hotDeals.length > 0 ? (
        <section className="container-page py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-hot">Clearance</p>
          <h2 className="mt-2 text-3xl">Hot deals this week</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotDeals.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      ) : null}

      {reviews.length > 0 ? (
        <section className="bg-card py-16">
          <div className="container-page">
            <h2 className="text-3xl">What buyers say</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 6).map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-lg border border-border bg-background p-6 shadow-sm"
                >
                  <p className="text-primary">{"★".repeat(review.rating)}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
                  <footer className="mt-4 text-sm font-semibold">
                    {review.name} — <span className="text-muted-foreground">{review.location}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
            <Button variant="ink" className="mt-8" asChild>
              <Link to="/avis-client">Read all reviews</Link>
            </Button>
          </div>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section className="container-page py-16">
          <h2 className="text-3xl">From the repo car blog</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              >
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-16/9 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-hot">{post.category}</p>
                  <h3 className="mt-2 text-base leading-snug">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </SiteLayout>
  );
}
