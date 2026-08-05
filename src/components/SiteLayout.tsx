import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { SITE } from "@/lib/site";
import { MessageSquare } from "lucide-react";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-slate-900 antialiased">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Floating WhatsApp Widget - Exact match to reference site */}
      <a
        href={SITE.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#0d47a1] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#003882] focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <MessageSquare className="size-7 fill-white text-[#0d47a1]" />
        <span className="absolute -top-1 -right-1 flex size-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-3.5 rounded-full bg-emerald-500"></span>
        </span>
      </a>
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
    <section className="bg-[#0b1e36] text-white border-b border-blue-900 py-12">
      <div className="container-page">
        {breadcrumb ? (
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400 font-extrabold">{breadcrumb}</p>
        ) : null}
        <h1 className="mt-2 font-display text-3xl font-black uppercase md:text-4xl text-white">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p> : null}
      </div>
    </section>
  );
}
