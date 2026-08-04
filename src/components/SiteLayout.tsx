import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}) {
  return (
    <section className="ink-panel border-b border-white/10">
      <div className="container-page py-14">
        {breadcrumb ? (
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{breadcrumb}</p>
        ) : null}
        <h1 className="mt-3 text-3xl md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p> : null}
      </div>
    </section>
  );
}
