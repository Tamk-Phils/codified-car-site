import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, PhoneCall, Clock, CheckCircle2 } from "lucide-react";
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
      { title: "Contact Sales Desk | Bank Seized Cars" },
      {
        name: "description",
        content:
          "Contact our repossessed vehicle sales desk via WhatsApp, email, or inquiry form. New York office with nationwide door-to-door delivery.",
      },
      { property: "og:title", content: "Contact Sales Desk | Bank Seized Cars" },
      { property: "og:description", content: "Reach our bank repossessed vehicle sales advisors in minutes." },
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
        breadcrumb="Contact Us"
        title="Contact Our Sales & Advisory Desk"
        subtitle="Have questions regarding a bank seized listing, lien-free title transfer, or nationwide shipping? Our advisors are ready to assist."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-8 text-center">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-3" />
              <h2 className="font-display text-2xl font-bold text-slate-900">Inquiry Received</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Thank you for contacting Bank Seized Cars. A liquidation advisor will review your message and reply within one business hour.
              </p>
              <Button
                className="mt-6 bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs"
                onClick={() => setSent(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form
              className="space-y-5"
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
                  toast.success("Inquiry submitted successfully!");
                } catch {
                  toast.error("Could not submit inquiry. Please verify your details.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="font-display text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
                Direct Inquiry Form
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase">
                    Your Full Name *
                  </Label>
                  <Input id="name" name="name" required placeholder="John Doe" className="mt-1 bg-slate-50 border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase">
                    Email Address *
                  </Label>
                  <Input id="email" name="email" type="email" required placeholder="john@example.com" className="mt-1 bg-slate-50 border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700 uppercase">
                    Phone Number
                  </Label>
                  <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" className="mt-1 bg-slate-50 border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-xs font-bold text-slate-700 uppercase">
                    Subject / Stock #
                  </Label>
                  <Input id="subject" name="subject" placeholder="Inquiry about Porsche 911 / Shipping" className="mt-1 bg-slate-50 border-slate-200" />
                </div>
              </div>
              <div>
                <Label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase">
                  Message Details *
                </Label>
                <Textarea id="message" name="message" rows={5} required placeholder="Please provide any specific questions regarding vehicle condition, title transfer, or delivery timing..." className="mt-1 bg-slate-50 border-slate-200" />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs px-8 py-3 w-full sm:w-auto" disabled={busy}>
                {busy ? "Submitting Inquiry…" : "Submit Inquiry"}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="flex gap-3.5 items-start">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <PhoneCall className="size-5" />
            </div>
            <div>
              <p className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-400">WhatsApp Instant Desk</p>
              <a
                href={SITE.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-emerald-600 hover:underline block mt-0.5"
              >
                {SITE.whatsapp}
              </a>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-400">Email Contact</p>
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm font-bold text-blue-600 hover:underline block mt-0.5"
              >
                {SITE.email}
              </a>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-400">Head Office</p>
              {SITE.address.map((line) => (
                <p key={line} className="text-xs text-slate-600 font-medium">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-400">Business Hours</p>
              {SITE.hours.map((line) => (
                <p key={line} className="text-xs text-slate-600 font-medium">
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
