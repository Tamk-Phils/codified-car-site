import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { Search, ShoppingBag, PhoneCall, ShieldCheck, CreditCard, Truck } from "lucide-react";

export const Route = createFileRoute("/processus-dachat")({
  head: () => ({
    meta: [
      { title: "How to Buy a Bank Seized Car | 5-Step Order Process" },
      {
        name: "description",
        content:
          "Our step-by-step buying process for bank repossessed vehicles: choose a car, reserve online, verify paperwork, pay securely, and take nationwide delivery.",
      },
      { property: "og:title", content: "How to Buy a Bank Seized Car | Bank Seized Cars" },
      {
        property: "og:description",
        content: "The complete guide from reserving a repo vehicle to delivery at your door.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/processus-dachat" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/processus-dachat" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to buy a bank repossessed car",
          step: STEPS.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.title,
            text: step.body,
          })),
        }),
      },
    ],
  }),
  component: Process,
});

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Select & Inspect Vehicle",
    body: "Browse our active inventory of bank-repossessed luxury vehicles. Review full specification sheets, 150-point inspection reports, and asking prices.",
  },
  {
    icon: ShoppingBag,
    step: "02",
    title: "Reserve Online",
    body: "Click Reserve or Add to Cart to hold the vehicle under your name for 48 hours. No upfront payment is charged during online reservation.",
  },
  {
    icon: PhoneCall,
    step: "03",
    title: "Speak with a Direct Agent",
    body: "A liquidation advisor connects with you via Phone or WhatsApp within minutes to confirm availability, answer questions, and send the VIN report.",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Title & Paperwork Verification",
    body: "Receive official lien-release documents, bill of sale, and title transfer guarantee before submitting any payment.",
  },
  {
    icon: CreditCard,
    step: "05",
    title: "Secure Escrow Payment",
    body: "Settle payment securely via Wire Transfer, Bank Draft, Zelle, or Escrow. Funds are protected until vehicle shipping assignment.",
  },
  {
    icon: Truck,
    step: "06",
    title: "Nationwide Door-to-Door Delivery",
    body: "Fully insured open or enclosed auto-transport delivers the vehicle directly to your residence in 3–7 business days.",
  },
];

function Process() {
  return (
    <SiteLayout>
      <PageHero
        breadcrumb="How to Order"
        title="Simple 6-Step Purchase Process"
        subtitle="Buying a bank repossessed vehicle is straightforward. No dealer fees, no auction license required, and guaranteed lien-free titles."
      />

      <div className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <step.icon className="size-6" />
                </div>
                <span className="font-display text-2xl font-black text-slate-300">
                  {step.step}
                </span>
              </div>

              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp Callout Card */}
        <div className="mt-16 rounded-2xl bg-[#0b1e36] text-white p-10 shadow-xl border border-blue-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Need Instant Assistance?
            </span>
            <h2 className="mt-2 font-display text-3xl font-black text-white uppercase">
              Speak With A Bank Repossession Specialist
            </h2>
            <p className="mt-3 text-slate-300 text-base leading-relaxed">
              Have questions about title transfer, shipping rates, or reserving a specific car? Our advisors respond promptly on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href={SITE.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-4 text-sm font-extrabold text-white uppercase tracking-wider shadow-lg transition-colors"
            >
              <PhoneCall className="size-4" />
              WhatsApp {SITE.whatsapp}
            </a>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold uppercase text-xs px-6 py-4" asChild>
              <Link to="/nous-contacter">Submit Inquiry Form</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
