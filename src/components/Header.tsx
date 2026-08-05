import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X, PhoneCall, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-[#071322] py-2 text-white text-xs font-medium border-b border-white/10">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="size-4 shrink-0" />
            <span className="tracking-wide text-white/90">
              NATIONWIDE DELIVERY • CERTIFIED LIEN-FREE VEHICLES • DIRECT BANK AUCTION REPOS
            </span>
          </div>
          <a
            href={SITE.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <PhoneCall className="size-3.5" />
            <span>WhatsApp Inquiry: {SITE.whatsapp}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-[#0b1e36] text-white">
        <div className="container-page flex items-center justify-between gap-4 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Bank Seized Cars Logo"
              className="size-11 rounded-lg object-contain bg-slate-900 border border-amber-500/30 p-1 shadow-lg group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                Bank Seized
              </span>
              <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                Cars & Liquidation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-blue-400 font-bold border-b-2 border-blue-400 pb-1" }}
                className="text-sm font-semibold uppercase tracking-wider text-white/90 hover:text-blue-400 transition-colors py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 font-bold uppercase tracking-wider text-xs px-4"
              asChild
            >
              <Link to="/boutique">Browse Inventory</Link>
            </Button>
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Open cart"
              className="relative rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <ShoppingCart className="size-5" />
              {count > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-extrabold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open ? (
          <nav className="border-t border-white/10 bg-[#071322] lg:hidden">
            <div className="container-page flex flex-col py-3 space-y-2">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-blue-400 font-bold" }}
                  className="py-2 text-sm font-semibold uppercase tracking-wider text-white/90 hover:text-blue-400"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10">
                <a
                  href={SITE.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider"
                >
                  Contact Us on WhatsApp
                </a>
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
