import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink text-ink-foreground">
      <div className="border-b border-white/10 bg-black/20">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs uppercase tracking-widest">
          <p>Nationwide delivery • Bank & lender repossessions</p>
          <a href={SITE.whatsappLink} className="font-semibold text-primary">
            WhatsApp {SITE.whatsapp}
          </a>
        </div>
      </div>

      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-xl uppercase tracking-[0.18em] text-primary">
            Bank Seized
          </span>
          <span className="font-display text-xl uppercase tracking-[0.32em]">Cars</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="hero" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/boutique">Browse inventory</Link>
          </Button>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open cart"
            className="relative rounded-md p-2 transition-colors hover:bg-white/10"
          >
            <ShoppingCart className="size-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="rounded-md p-2 transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-white/10 lg:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-semibold uppercase tracking-wider hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
