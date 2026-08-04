import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/processus-dachat")({
  head: () => ({
    meta: [
      { title: "How To Buy A Repossessed Car | Ordering Process" },
      {
        name: "description",
        content:
          "Our six-step buying process for bank repossessed vehicles: choose a car, reserve it, verify paperwork, pay securely and take delivery anywhere in the USA.",
      },
      { property: "og:title", content: "How To Buy A Repossessed Car | Bank Seized Cars" },
      {
        property: "og:description",
        content: "The six steps from reserving a repo vehicle to delivery at your door.",
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
    title: "1. Choose your vehicle",
    body: "Browse the live inventory and pick the repossessed car, truck or SUV that fits your budget. Every listing shows real photos, mileage and title status.",
  },
  {
    title: "2. Reserve it online",
    body: "Add the vehicle to your cart and complete checkout. No card is charged — this simply reserves the unit under your name for 48 hours.",
  },
  {
    title: "3. Speak with a sales agent",
    body: "A specialist calls or messages you within 24 hours to confirm availability, answer questions and send the VIN report.",
  },
  {
    title: "4. Verify the paperwork",
    body: "You receive the title documentation, lien release and condition report before any money changes hands.",
  },
  {
    title: "5. Pay securely",
    body: "Settle by bank transfer, Zelle, Cash App or escrow-backed crypto. Funds are only released once the vehicle is allocated to you.",
  },
  {
    title: "6. Take delivery",
    body: "Open or enclosed transport delivers to your driveway anywhere in the lower 48, typically in 3–10 business days.",
  },
];

function Process() {
  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Buying process"
        title="How ordering works"
        subtitle="Six clear steps from browsing to delivery — no auction licence, no dealer fees, no surprises."
      />
      <div className="container-page py-12">
        <ol className="grid gap-6 md:grid-cols-2">
          {STEPS.map((step) => (
            <li key={step.title} className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-lg uppercase tracking-wider text-hot">
                {step.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="ink-panel mt-12 rounded-lg p-8">
          <h2 className="text-2xl">Still have questions?</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            Our team answers WhatsApp messages within minutes during business hours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="hero" asChild>
              <a href={SITE.whatsappLink}>WhatsApp {SITE.whatsapp}</a>
            </Button>
            <Button variant="outline" className="border-white/30 bg-transparent" asChild>
              <Link to="/nous-contacter">Contact form</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
