import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "About Us | Bank Seized Cars" },
      {
        name: "description",
        content:
          "We move bank and lender repossessed vehicles directly to retail buyers across the USA, with verified titles, transparent pricing and door-to-door delivery.",
      },
      { property: "og:title", content: "About Us | Bank Seized Cars" },
      {
        property: "og:description",
        content: "Who we are and how we source bank repossessed vehicles.",
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
        breadcrumb="About"
        title="About Bank Seized Cars"
        subtitle="We connect retail buyers directly to bank and lender repossessions — no dealer licence needed."
      />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            When a vehicle loan defaults, the lender repossesses the car and has one priority: get it
            off the balance sheet quickly. Traditionally that stock disappears into closed dealer
            auctions, where licensed resellers buy low and mark up hard.
          </p>
          <p>
            We work the other side of that pipeline. Our team sources repossessed inventory directly
            from lending partners and remarketing agents, verifies the paperwork, photographs each
            unit and lists it at a price close to what a dealer would have paid.
          </p>
          <p>
            Every listing on this site is a real, physically inspected vehicle. We publish honest
            mileage, title status and condition notes, and we walk each buyer through lien release
            documentation before any payment is made.
          </p>
          <h2 className="pt-4 text-2xl text-foreground">What we promise</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Clean, transferable titles with lien release documentation.</li>
            <li>Real photographs — no stock imagery, no borrowed listings.</li>
            <li>Escrow-protected payment options and no online card charges.</li>
            <li>Enclosed or open transport to any address in the lower 48.</li>
            <li>A named sales agent from first enquiry through to delivery.</li>
          </ul>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl">Talk to us</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Our New York desk is open six days a week.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {SITE.address.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="hero" asChild>
              <a href={SITE.whatsappLink}>WhatsApp {SITE.whatsapp}</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/boutique">Browse inventory</Link>
            </Button>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
