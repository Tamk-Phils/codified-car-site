import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleCard } from "@/components/VehicleCard";
import { vehiclesQuery, reviewsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(vehiclesQuery),
      context.queryClient.ensureQueryData(reviewsQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "KJ Autos | KJ Autos & Repossessed Vehicles" },
      {
        name: "description",
        content:
          "Browse certified bank repossessed luxury cars, trucks and SUVs directly sourced from financial institutions in California with nationwide delivery.",
      },
      { property: "og:title", content: "KJ Autos | KJ Autos" },
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
    image: "https://bankseizedcars.online/wp-content/uploads/2026/06/peter-broomfield-m3m-lnR90uM-unsplash-scaled.jpg",
    title: "BANK-REPOSSESSED VEHICLES AT UNBEATABLE PRICES",
    subtitle: "Browse a wide selection of certified bank seized cars directly sourced from financial institutions. No middlemen. Just real deals.",
    primaryBtn: { label: "BROWSE INVENTORY >", to: "/boutique" },
  },
  {
    image: "https://bankseizedcars.online/wp-content/uploads/2026/06/erik-mclean-H1NxvaTUf_o-unsplash-scaled.jpg",
    title: "SAVE UP TO 70% ON REPO CARS",
    subtitle: "These vehicles won’t last long. Explore limited-time listings and secure your deal before it’s gone.",
    primaryBtn: { label: "SEE LISTINGS >", to: "/boutique" },
    secondaryBtn: { label: "HOW IT WORKS >", to: "/processus-dachat" },
  },
];

const TOP_BRANDS = [
  {
    name: "Ferrari",
    image: "https://bankseizedcars.online/wp-content/uploads/2026/06/hd-ferrari-black-logo-transparent-png-701751694773098iuwzos1hjw-removebg-preview.png",
    make: "Ferrari",
  },
  {
    name: "Cadillac",
    image: "https://bankseizedcars.online/wp-content/uploads/2026/06/cadillac-115309621794y3hky6zha-removebg-preview.png",
    make: "Cadillac",
  },
  {
    name: "Mercedes-Benz",
    image: "https://bankseizedcars.online/wp-content/uploads/2026/06/Mercedes-Benz-Logo-1024x637.png",
    make: "Mercedes-Benz",
  },
  {
    name: "Chevrolet / Corvette",
    image: "https://bankseizedcars.online/wp-content/uploads/2026/06/corvette-logo-png_seeklogo-368597.png",
    make: "Chevrolet",
  },
];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="container-page flex items-center justify-center gap-4 my-10">
      <div className="flex-1 border-t border-slate-300" />
      <div className="flex items-center gap-1.5 text-[#093e91] font-display text-sm md:text-base font-black uppercase tracking-widest">
        <ChevronDown className="size-4 stroke-[3]" />
        <span>{title}</span>
      </div>
      <div className="flex-1 border-t border-slate-300" />
    </div>
  );
}

function Home() {
  const { data: vehicles = [] } = useQuery(vehiclesQuery);
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
      {/* 1. HERO SLIDER CAROUSEL - Exact replicate of kjautos.online */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white min-h-[480px] md:min-h-[560px] flex items-center justify-center">
        {/* Background Car Image */}
        <div className="absolute inset-0 z-0 transition-opacity duration-700">
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-center transition-transform duration-1000 scale-105"
          />
          {/* Exact dark overlay rgba(0,0,0,0.5) */}
          <div className="absolute inset-0 bg-black/55" />
        </div>

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

      {/* 2. TOP BRANDS SECTION - Exact 4 brand images with divider line */}
      <section className="py-8 bg-white border-b border-slate-100">
        <SectionTitle title="top brands" />

        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center max-w-4xl mx-auto px-4">
            {TOP_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                to="/boutique"
                search={{ make: brand.make }}
                className="flex items-center justify-center p-4 transition-transform hover:scale-105 group w-full max-w-[200px]"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-24 md:max-h-28 w-auto object-contain transition-all group-hover:drop-shadow-md"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLING SECTION */}
      <section className="py-10 bg-slate-50/50">
        <SectionTitle title="BEST SELLING" />
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellingVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY BUY BANK-REPOSSESSED VEHICLES SECTION */}
      <section className="py-12 bg-white border-y border-slate-200">
        <SectionTitle title="WHY BUY BANK-REPOSSESSED VEHICLES" />
        <div className="container-page max-w-6xl">
          <p className="text-center text-xs sm:text-sm text-slate-600 font-medium max-w-3xl mx-auto mb-10">
            Get access to vehicles repossessed by banks and lenders, priced to sell quickly, without dealership markups.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="py-10 bg-slate-50/50">
        <SectionTitle title="RECENT LISTINGS" />
        <div className="container-page">
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
