import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleCard } from "@/components/VehicleCard";
import { vehiclesQuery, reviewsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(vehiclesQuery),
      context.queryClient.ensureQueryData(reviewsQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "KJ Autos | Bank Seized Cars & Repossessed Vehicles" },
      {
        name: "description",
        content:
          "Browse certified bank repossessed luxury cars, trucks and SUVs directly sourced from financial institutions in California with nationwide delivery.",
      },
      { property: "og:title", content: "KJ Autos | Bank Seized Cars" },
      {
        property: "og:description",
        content:
          "Browse certified bank repossessed luxury cars, trucks and SUVs below market value with clean titles.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const HERO_SLIDES = [
  {
    title: "BANK-REPOSSESSED VEHICLES AT UNBEATABLE PRICES",
    subtitle: "Browse a wide selection of certified bank seized cars directly sourced from financial institutions. No middlemen. Just real deals.",
    primaryBtn: { label: "BROWSE INVENTORY >", to: "/boutique" },
  },
  {
    title: "SAVE UP TO 70% ON REPO CARS",
    subtitle: "These vehicles won’t last long. Explore limited-time listings and secure your deal before it’s gone.",
    primaryBtn: { label: "SEE LISTINGS >", to: "/boutique" },
    secondaryBtn: { label: "HOW IT WORKS >", to: "/processus-dachat" },
  },
];

const TOP_BRANDS = [
  { name: "Ferrari", logo: "🏎️" },
  { name: "Cadillac", logo: "👑" },
  { name: "Mercedes-Benz", logo: "⭐" },
  { name: "Chevrolet", logo: "⚡" },
  { name: "Rolls-Royce", logo: "✨" },
  { name: "Porsche", logo: "🛡️" },
  { name: "BMW", logo: "🏁" },
  { name: "Audi", logo: "⭕" },
];

function Home() {
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = (HERO_SLIDES[activeSlide] || HERO_SLIDES[0])!;
  const bestSellingVehicles = vehicles.slice(0, 12);
  const recentListings = vehicles.slice(4, 16);

  return (
    <SiteLayout>
      {/* 1. HERO SLIDER CAROUSEL - Exactly matching reference site */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white min-h-[460px] md:min-h-[540px] flex items-center justify-center">
        {/* Background Car Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img
            src={vehicles[0]?.images?.[0] || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80"}
            alt="Hero Background Cars"
            className="h-full w-full object-cover transition-opacity duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 z-0" />

        {/* Carousel Content */}
        <div className="container-page relative z-10 py-16 text-center max-w-4xl mx-auto px-6">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl md:text-5xl text-white leading-tight transition-all duration-500">
            {slide.title}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={slide.primaryBtn.to}
              className="inline-flex items-center rounded-full border border-white bg-white/10 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg"
            >
              {slide.primaryBtn.label}
            </Link>

            {slide.secondaryBtn ? (
              <Link
                to={slide.secondaryBtn.to}
                className="inline-flex items-center rounded-full border border-white bg-white/10 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg"
              >
                {slide.secondaryBtn.label}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <ChevronLeft className="size-8" />
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <ChevronRight className="size-8" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`size-2.5 rounded-full transition-all ${
                index === activeSlide ? "bg-white w-6" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. TOP BRANDS SECTION */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container-page">
          <div className="flex items-center justify-center gap-1.5 text-[#0d47a1] font-display text-sm font-extrabold uppercase tracking-widest text-center mb-8">
            <ChevronDown className="size-4" /> TOP BRANDS
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 hover:opacity-100 transition-opacity">
            {TOP_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                to="/boutique"
                search={{ make: brand.name }}
                className="flex flex-col items-center gap-2 group transition-transform hover:scale-110"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-2xl group-hover:border-[#0d47a1] shadow-sm">
                  {brand.logo}
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase group-hover:text-[#0d47a1]">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLING SECTION */}
      <section className="py-14 bg-slate-50/50">
        <div className="container-page">
          <div className="flex items-center justify-center gap-1.5 text-[#0d47a1] font-display text-base font-extrabold uppercase tracking-widest text-center mb-10">
            <ChevronDown className="size-4" /> BEST SELLING
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellingVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY BUY BANK-REPOSSESSED VEHICLES SECTION */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-page max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-1.5 text-[#0d47a1] font-display text-base font-extrabold uppercase tracking-widest text-center mb-2">
              <ChevronDown className="size-4" /> WHY BUY BANK-REPOSSESSED VEHICLES
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 font-medium">
              Get access to vehicles repossessed by banks and lenders, priced to sell quickly, without dealership markups.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 text-center shadow-xs">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-900">
                BELOW MARKET PRICING
              </h3>
              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
                Banks aim to recover losses, not maximize profits. That means vehicles are priced below market value, giving you access to real deals without inflated dealership markups.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 text-center shadow-xs">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-900">
                VERIFIED INVENTORY
              </h3>
              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
                All vehicles are sourced directly from banks and lenders. Each listing is reviewed for accuracy, ensuring transparent pricing, reliable details, and a trustworthy buying experience.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 text-center shadow-xs">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-900">
                WIDE VEHICLE SELECTION
              </h3>
              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
                Choose from a diverse range of vehicles, including sedans, SUVs, trucks, and luxury models. Inventory is updated frequently, so you always have fresh options to explore.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 text-center shadow-xs">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-900">
                FAST & SIMPLE PROCESS
              </h3>
              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
                Skip the long negotiations and delays. Our streamlined process lets you browse, select, and secure your vehicle quickly with clear steps and secure payment options.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/boutique"
              className="inline-flex items-center rounded-full bg-[#0d47a1] px-8 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-blue-800 transition-colors shadow-md"
            >
              VIEW ALL DEALS &gt;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. RECENT LISTINGS SECTION */}
      <section className="py-14 bg-slate-50/50">
        <div className="container-page">
          <div className="flex items-center justify-center gap-1.5 text-[#0d47a1] font-display text-base font-extrabold uppercase tracking-widest text-center mb-10">
            <ChevronDown className="size-4" /> RECENT LISTINGS
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentListings.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
