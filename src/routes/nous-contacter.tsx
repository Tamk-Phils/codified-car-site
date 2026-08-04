import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/site";
import { submitInquiry } from "@/lib/storefront.functions";

export const Route = createFileRoute("/nous-contacter")({
  head: () => ({
    meta: [
      { title: "Contact Us | Bank Seized Cars" },
      {
        name: "description",
        content:
          "Contact our repossessed vehicle sales desk by WhatsApp, email or the enquiry form. New York office, nationwide delivery across the USA.",
      },
      { property: "og:title", content: "Contact Us | Bank Seized Cars" },
      { property: "og:description", content: "Reach our repo vehicle sales desk in minutes." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/nous-contacter" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/nous-contacter" }],
  }),
  component: Contact,
});

function Contact() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Contact"
        title="Contact us"
        subtitle="Questions about a listing, delivery or paperwork? Our team replies fast."
      />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div>
          {sent ? (
            <div className="rounded-lg border border-border bg-card p-8">
              <h2 className="text-xl">Message received</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Thanks for reaching out — we reply to every enquiry within one business day.
              </p>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                setBusy(true);
                try {
                  await submitInquiry({
                    data: {
                      name: String(form.get("name") ?? ""),
                      email: String(form.get("email") ?? ""),
                      phone: String(form.get("phone") ?? ""),
                      subject: String(form.get("subject") ?? ""),
                      message: String(form.get("message") ?? ""),
                    },
                  });
                  setSent(true);
                } catch {
                  toast.error("We couldn't send that message. Please check your details.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Your name *</Label>
                  <Input id="name" name="name" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" name="message" rows={6} required className="mt-1" />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={busy}>
                {busy ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-6 rounded-lg border border-border bg-card p-6">
          <div className="flex gap-3">
            <Phone className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm uppercase tracking-wider">WhatsApp</p>
              <a href={SITE.whatsappLink} className="text-sm text-muted-foreground hover:text-hot">
                {SITE.whatsapp}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm uppercase tracking-wider">Email</p>
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm text-muted-foreground hover:text-hot"
              >
                {SITE.email}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm uppercase tracking-wider">Office</p>
              {SITE.address.map((line) => (
                <p key={line} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm uppercase tracking-wider">Hours</p>
              {SITE.hours.map((line) => (
                <p key={line} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
