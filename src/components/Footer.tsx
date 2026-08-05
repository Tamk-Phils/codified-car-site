import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { NAV, SITE, formatPrice } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/storefront.functions";
import { ShieldCheck, PhoneCall, MessageSquare, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <footer className="bg-[#0b1e36] text-white mt-20 border-t border-blue-900">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="KJ Autos Logo"
              className="size-10 rounded-lg object-contain bg-slate-900 border border-amber-500/30 p-1 shadow-md"
            />
            <p className="font-display text-xl font-black uppercase tracking-wider text-white">
              KJ AUTOS
            </p>
          </div>
          <p className="text-sm text-white/75 leading-relaxed">
            KJ Autos is your trusted California source for bank-repossessed vehicles, lender seized assets, and auction clearance inventory at up to 70% below retail value. Nationwide door-to-door delivery.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              100% Lien-Free Verified Titles
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-blue-400">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-blue-400 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-blue-400">
            Contact & Location
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                {SITE.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <PhoneCall className="size-4 text-blue-400 shrink-0" />
              <a href={SITE.phoneLink} className="hover:text-blue-400 transition-colors font-semibold">
                Call / SMS: {SITE.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="size-4 text-emerald-400 shrink-0" />
              <a
                href={SITE.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                WhatsApp: {SITE.phoneFormatted}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-blue-400 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="hover:text-blue-400 transition-colors">
                {SITE.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5 pt-1">
              <Clock className="size-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                {SITE.hours.map((line) => (
                  <p key={line} className="text-xs">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-blue-400">
            Inventory Alerts
          </p>
          <p className="mt-4 text-sm text-white/75">
            Be the first to know when new bank repo cars drop at unbeatable prices.
          </p>
          <form
            className="mt-4 flex flex-col sm:flex-row gap-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              try {
                await subscribeToNewsletter({ data: { email } });
                toast.success("You are subscribed for inventory updates!");
                setEmail("");
              } catch {
                toast.error("Please enter a valid email address.");
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
              placeholder="Enter your email"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-400"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs" disabled={busy}>
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#071322] py-6 text-xs text-white/60">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All Rights Reserved. Bank-Repossessed Vehicles Dealer, California.
          </p>
          <p className="flex items-center gap-2">
            <span>Prices in USD</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Updated Daily</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
