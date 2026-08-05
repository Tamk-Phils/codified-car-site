import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Truck, BadgeDollarSign, FileCheck2, ArrowRight, PhoneCall, Star, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { vehiclesQuery, postsQuery, reviewsQuery } from "@/lib/queries";
import { SITE } from "@/lib/site";

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
      { title: "Bank Seized Cars | Directly Sourced Certified Repossessions" },
      {
        name: "description",
        content:
          "Buy bank seized and lender repossessed cars, trucks and SUVs at up to 60% below retail value. Lien-free titles, verified inspection reports, and nationwide delivery across the USA.",
      },
      { property: "og:title", content: "Bank Seized Cars | Certified Repossessed Vehicles For Sale" },
      {
        property: "og:description",
        content:
          "Browse verified bank repossessed luxury cars, trucks and SUVs with clean titles and nationwide US delivery.",
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
  { icon: BadgeDollarSign, title: "Below Market Liquidation", body: "Direct lender repossessions priced 40%–60% below standard retail value." },
  { icon: FileCheck2, title: "Certified Lien-Free Titles", body: "Every vehicle sold includes verified paperwork and clean title transfer." },
  { icon: Truck, title: "Nationwide Transport", body: "Insured open and enclosed vehicle delivery to your door in the lower 48." },
  { icon: ShieldCheck, title: "Verified 150-Point Inspection", body: "Thorough multi-point inspection report included with every vehicle listing." },
];

const LUXURY_BRANDS = [
  "Porsche", "Mercedes-Benz", "BMW", "Audi", "Land Rover",
  "Rolls-Royce", "Ferrari", "Lamborghini", "Bentley", "Cadillac"
];

function Home() {
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery);
  const { data: posts } = useSuspenseQuery(postsQuery);
  const { data: reviews } = useSuspenseQuery(reviewsQuery);

  const heroVehicle = vehicles[0];
  const featuredVehicles = vehicles.slice(0, 8);
  const hotDeals = vehicles.filter((v) => v.is_hot_deal && !v.is_sold).slice(8, 16);

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#0b1e36] text-white py-20 md:py-32">
        {heroVehicle?.images?.[0] ? (
          <img
            src={heroVehicle.images[0]}
            alt="Bank Repossessed Luxury Vehicle"
            className="absolute inset-0 size-full object-cover opacity-20 filter brightness-75 scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent z-0" />

        <div className="container-page relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-300 backdrop-blur-sm">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Directly Sourced Certified Bank Repossessions</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl text-white">
              Buy Bank Seized Vehicles Up To <span className="text-blue-400">60% Below Retail</span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Financial institutions need repossessed assets liquidated quickly. Access verified bank-seized luxury cars, trucks, and SUVs with clean titles, transparent inspections, and door-to-door delivery.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase tracking-wider text-sm px-8 py-6 shadow-lg shadow-blue-600/30" asChild>
                <Link to="/boutique">
                  Browse Inventory <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>

              <a
                href={SITE.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-600/20 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all backdrop-blur-sm"
              >
                <PhoneCall className="size-4" />
                <span>WhatsApp: {SITE.whatsapp}</span>
              </a>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="mt-12 flex flex-wrap gap-6 text-xs font-bold text-slate-300 uppercase tracking-wider border-t border-white/10 pt-6">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" /> Lien-Free Title</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" /> 150-Point Inspection</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" /> Nationwide Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Banner */}
      <section className="border-b border-slate-200 bg-white py-12 shadow-sm">
        <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <perk.icon className="size-6" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slate-900">{perk.title}</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Inventory Grid */}
      <section className="container-page py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Fresh Repossession Listings</span>
            <h2 className="mt-1 font-display text-3xl font-black text-slate-900 uppercase">Featured Bank Seized Vehicles</h2>
          </div>
          <Button variant="outline" className="border-blue-600 text-blue-700 font-bold uppercase text-xs hover:bg-blue-50" asChild>
            <Link to="/boutique">View Complete Inventory ({vehicles.length})</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* Top Luxury Brands */}
      <section className="bg-[#0b1e36] text-white py-14 border-y border-blue-900">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Premier Manufacturers</span>
            <h2 className="mt-1 font-display text-2xl font-black uppercase text-white">Top Repossessed Brands In Stock</h2>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {LUXURY_BRANDS.map((brand) => (
              <Link
                key={brand}
                to="/boutique"
                search={{ make: brand }}
                className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-lg"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Clearance Deals */}
      {hotDeals.length > 0 ? (
        <section className="container-page py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">Urgent Liquidation</span>
              <h2 className="mt-1 font-display text-3xl font-black text-slate-900 uppercase">Hot Price Drop Deals</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotDeals.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Verified Reviews Section */}
      {reviews.length > 0 ? (
        <section className="bg-slate-100 py-16 border-t border-slate-200">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Verified Buyer Experiences</span>
                <h2 className="mt-1 font-display text-3xl font-black text-slate-900 uppercase">Customer Reviews</h2>
              </div>
              <Button variant="outline" className="border-slate-300 font-bold uppercase text-xs" asChild>
                <Link to="/avis-client">Read All Customer Reviews</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1 italic">"{review.body}"</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{review.name}</p>
                      <p className="text-xs text-slate-500">{review.location}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="size-3" /> Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Blog Articles */}
      {posts.length > 0 ? (
        <section className="container-page py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Buyer Guide & Insights</span>
              <h2 className="mt-1 font-display text-3xl font-black text-slate-900 uppercase">Bank Repo Insights Blog</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {post.cover_image ? (
                  <div className="aspect-16/9 overflow-hidden bg-slate-100">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6 flex flex-1 flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">{post.category}</span>
                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-600 leading-relaxed flex-1">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </SiteLayout>
  );
}
