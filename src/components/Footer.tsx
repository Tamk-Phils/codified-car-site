import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { NAV, SITE, formatPrice } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/storefront.functions";

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <footer className="ink-panel mt-20">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg uppercase tracking-[0.2em] text-primary">
            Bank Seized Cars
          </p>
          <p className="mt-4 text-sm text-white/70">
            We list bank and lender repossessed vehicles across the United States and deliver them
            straight to your door at well below retail prices.
          </p>
          <a
            href={SITE.whatsappLink}
            className="mt-4 inline-block text-sm font-semibold text-primary"
          >
            WhatsApp: {SITE.whatsapp}
          </a>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em]">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em]">Visit us</p>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            {SITE.address.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            {SITE.hours.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em]">Newsletter</p>
          <p className="mt-4 text-sm text-white/70">
            Get new repossessed arrivals and price drops in your inbox.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              try {
                await subscribeToNewsletter({ data: { email } });
                toast.success("You're subscribed");
                setEmail("");
              } catch {
                toast.error("Please enter a valid email address");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="border-white/20 bg-white/10 text-ink-foreground placeholder:text-white/40"
            />
            <Button type="submit" variant="hero" disabled={busy}>
              Join
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Prices shown in USD ({formatPrice(0).slice(0, 1)}) — inventory updated daily.</p>
        </div>
      </div>
    </footer>
  );
}
