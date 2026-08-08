import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBag, Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { NAV, SITE, formatPrice } from "@/lib/site";
import { useCart } from "@/lib/cart";

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { count, total } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && selectedCategory === "All") {
      navigate({ to: "/boutique" });
    } else {
      navigate({
        to: "/boutique",
        search: {
          q: searchQuery.trim() || undefined,
          make: selectedCategory !== "All" ? selectedCategory : undefined,
        },
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* 1. Top Announcement Bar - Solid Royal Blue */}
      <div className="bg-[#0d47a1] text-white text-[11px] font-bold uppercase tracking-widest py-1.5 border-b border-blue-900/50">
        <div className="container-page flex items-center justify-between">
          <div className="hidden sm:block text-blue-200">
            California Desk • Lien-Free Repossessions
          </div>
          <div className="w-full sm:w-auto text-center font-extrabold tracking-widest">
            WELCOME TO OUR WEBSITE
          </div>
          <div className="hidden sm:flex items-center gap-3 text-blue-200">
            <a href={SITE.phoneLink} className="hover:text-white transition-colors">
              Call/SMS: {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row - Clean White Background */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="container-page flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-tight">
              <span className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0d47a1] group-hover:text-blue-700 transition-colors">
                KJ AUTOS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                KJ Autos
              </span>
            </div>
          </Link>

          {/* Integrated Search Bar & Cart */}
          <div className="hidden md:flex items-center gap-6">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-full border border-slate-300 bg-slate-100/80 p-1 text-xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
            >
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-transparent py-1.5 pl-3 pr-7 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Hot deal">Hot deal</option>
                  <option value="Rolls-Royce">Rolls-Royce</option>
                  <option value="Porsche">Porsche</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-slate-500" />
              </div>

              <div className="h-4 w-px bg-slate-300" />

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search..."
                className="bg-transparent py-1.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-48 lg:w-64"
              />

              {/* Submit Button */}
              <button
                type="submit"
                aria-label="Submit search"
                className="rounded-full p-2 text-slate-600 hover:text-[#0d47a1] transition-colors"
              >
                <Search className="size-4" />
              </button>
            </form>

            {/* Cart Summary Widget */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 font-display text-xs font-bold text-slate-800 hover:text-[#0d47a1] transition-colors"
            >
              <span>{formatPrice(total)}</span>
              <div className="relative">
                <ShoppingBag className="size-5 text-slate-700" />
                {count > 0 ? (
                  <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#0d47a1] text-[9px] font-extrabold text-white">
                    {count}
                  </span>
                ) : null}
              </div>
            </button>
          </div>

          {/* Mobile Actions Header */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-1 text-xs font-bold text-slate-800"
            >
              <span>{formatPrice(total)}</span>
              <ShoppingBag className="size-5 text-[#0d47a1]" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-800 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar - Solid Royal Blue Banner */}
      <div className="bg-[#0d47a1] text-white">
        <div className="container-page flex items-center justify-center">
          <nav className="hidden md:flex items-center justify-center gap-8 py-2.5">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-amber-400 font-extrabold border-b-2 border-amber-400 pb-0.5" }}
                className="text-xs font-bold uppercase tracking-wider text-white hover:text-amber-300 transition-colors py-0.5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen ? (
          <div className="bg-[#003882] border-t border-blue-800 md:hidden">
            <div className="container-page py-4 space-y-3">
              <form onSubmit={handleSearchSubmit} className="flex items-center rounded-lg bg-white px-3 py-1.5 text-xs text-slate-900 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search inventory..."
                  className="w-full bg-transparent outline-none"
                />
                <button type="submit" aria-label="Search"><Search className="size-4 text-slate-500" /></button>
              </form>

              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  activeProps={{ className: "text-amber-400 font-bold" }}
                  className="block py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-amber-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
