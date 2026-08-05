import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { ShieldCheck, CheckCircle2, PhoneCall, MessageSquare, Building2, Target, Award } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "About Us | KJ Autos — Your Trusted Car Dealer in California" },
      {
        name: "description",
        content:
          "Welcome to KJ Autos, your trusted source for affordable bank-repossessed and seized vehicles across North America. Based in California with nationwide delivery.",
      },
      { property: "og:title", content: "About Us | KJ Autos" },
      {
        property: "og:description",
        content: "Your trusted source for bank-repossessed and seized vehicles below market value.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/a-propos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: About,
});

export function About() {
  return (
    <SiteLayout>
      <PageHero
        breadcrumb="About Us"
        title="Your Trusted Car Dealer in California"
        subtitle="Sourcing bank repossessions, seized assets, and lender surplus inventories at below-market prices."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 border-b border-slate-200 pb-3 uppercase">
              Welcome to KJ Autos
            </h2>
            <p className="text-base text-slate-800 leading-relaxed font-medium">
              Welcome to <strong>KJ Autos</strong>, your trusted source for affordable vehicles across the United States and Canada.
            </p>
            <p>
              We specialize in offering vehicles sourced from bank repossessions, seized assets, and surplus inventories. These vehicles are often sold below market value, giving our customers the opportunity to purchase quality cars at significantly reduced prices.
            </p>
            <p>
              Our goal is to make car buying simple, transparent, and accessible. Whether you’re looking for a reliable daily driver or a great deal on a newer luxury model, we provide a wide selection of vehicles to match your needs and budget.
            </p>
            <p>
              Every vehicle listed on our platform is carefully reviewed and presented with detailed information, including specifications, condition, and pricing. We aim to give you all the information you need to make a confident purchase online.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-xl font-black text-slate-900 flex items-center gap-2 uppercase">
              <ShieldCheck className="size-6 text-blue-600" />
              Why Choose Us ?
            </h3>
            <div className="grid gap-3 sm:grid-cols-1">
              {[
                "Below-market prices on repossessed and seized vehicles",
                "Wide selection across California, the United States, and Canada",
                "Transparent listings with detailed vehicle information and inspection reports",
                "Secure payment options and clear purchase process",
                "Dedicated customer support available via Phone, SMS, and WhatsApp",
              ].map((reason) => (
                <div key={reason} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Commitment */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="size-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Target className="size-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 uppercase">Our Mission</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                To provide customers with access to some of the best vehicle deals in North America, while maintaining transparency, trust, and simplicity throughout the buying process.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="size-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Award className="size-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 uppercase">Our Commitment</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                We are committed to helping our customers save money without compromising on quality. Our team works continuously to source the best deals and present them clearly, so you can shop with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Desk */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-display text-lg font-bold border-b border-slate-100 pb-3">
            <Building2 className="size-5 text-blue-600" />
            KJ Autos • California Desk
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Our California sales & advisory team operates six days a week, offering nationwide door-to-door vehicle transport and lien-free title transfers.
          </p>

          <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900 mb-1">California Headquarters:</p>
            {SITE.address.map((line) => (
              <p key={line} className="font-medium">{line}</p>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={SITE.phoneLink}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-xs font-extrabold text-white uppercase tracking-wider transition-colors shadow-md"
            >
              <PhoneCall className="size-4" />
              Call / SMS: {SITE.phone}
            </a>

            <a
              href={SITE.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-xs font-extrabold text-white uppercase tracking-wider transition-colors shadow-md"
            >
              <MessageSquare className="size-4" />
              WhatsApp: {SITE.phoneFormatted}
            </a>

            <Button variant="outline" className="border-slate-300 font-bold uppercase text-xs w-full py-3" asChild>
              <Link to="/boutique">Browse Available Inventory</Link>
            </Button>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
