import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { ShieldCheck, CheckCircle2, PhoneCall, Building2 } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "About Us | Bank Seized Cars" },
      {
        name: "description",
        content:
          "We connect retail buyers directly to bank and lender repossessed luxury vehicles across the USA, with certified lien-free titles and nationwide delivery.",
      },
      { property: "og:title", content: "About Us | Bank Seized Cars" },
      {
        property: "og:description",
        content: "Who we are and how we source bank repossessed luxury vehicles.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/a-propos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        breadcrumb="About Us"
        title="About Bank Seized Cars"
        subtitle="Directly connecting retail buyers to certified bank and lender repossessed assets — no dealer license required."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-blue-900">
            <h2 className="font-display text-xl font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="size-6 text-blue-600" />
              Direct Lender Liquidation Marketplace
            </h2>
            <p className="text-xs text-blue-800 leading-relaxed">
              When auto loans default, financial institutions repossess vehicles and require rapid balance sheet liquidation. We bypass standard dealer auctions to offer these certified luxury assets directly to retail consumers at wholesale rates.
            </p>
          </div>

          <p>
            Our dedicated remarketing team partners directly with national lending institutions, banking networks, and credit unions across the United States. We inspect each vehicle, verify lien releases, photograph actual units, and list them at prices far below standard retail blue book valuations.
          </p>

          <p>
            Every single vehicle listed on Bank Seized Cars undergoes a comprehensive 150-point safety and mechanical inspection. We provide complete VIN reports, title history verification, and lien releases prior to payment confirmation.
          </p>

          <h2 className="font-display text-2xl font-bold text-slate-900 pt-4 border-b border-slate-200 pb-2">
            The Bank Seized Cars Promise
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "100% Lien-Free Verified Titles",
              "150-Point Multi-Point Inspection",
              "No Online Credit Card Charges",
              "Escrow Payment Protection",
              "Nationwide Insured Transport",
              "Dedicated Personal Sales Advisor",
            ].map((promise) => (
              <div key={promise} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{promise}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-display text-lg font-bold border-b border-slate-100 pb-3">
            <Building2 className="size-5 text-blue-600" />
            Headquarters & Advisory Desk
          </div>

          <p className="text-xs text-slate-600">
            Our central sales & logistics desk operates six days a week from New York, supporting nationwide auto transport.
          </p>

          <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
            {SITE.address.map((line) => (
              <p key={line} className="font-medium">{line}</p>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={SITE.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-xs font-extrabold text-white uppercase tracking-wider transition-colors shadow-md"
            >
              <PhoneCall className="size-4" />
              WhatsApp {SITE.whatsapp}
            </a>

            <Button variant="outline" className="border-slate-300 font-bold uppercase text-xs w-full py-3" asChild>
              <Link to="/boutique">Browse Available Vehicles</Link>
            </Button>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
