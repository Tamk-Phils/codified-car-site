import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehiclesQuery } from "@/lib/queries";
import { SearchIcon, RefreshCcw } from "lucide-react";

type Search = {
  make?: string | undefined;
  q?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
};

export const Route = createFileRoute("/boutique")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    make: typeof search["make"] === "string" ? (search["make"] as string) : undefined,
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
    sort: typeof search["sort"] === "string" ? (search["sort"] as string) : undefined,
    page: Number(search["page"]) > 0 ? Number(search["page"]) : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(vehiclesQuery),
  head: () => ({
    meta: [
      { title: "Bank Seized Car Inventory | Certified Auction Listings" },
      {
        name: "description",
        content:
          "Browse our complete inventory of bank repossessed cars, trucks and SUVs. Filter by make, price and mileage, then reserve online with nationwide delivery.",
      },
      { property: "og:title", content: "Bank Seized Car Inventory | Certified Auction Listings" },
      {
        property: "og:description",
        content: "Every bank seized vehicle currently available, with asking prices, estimated down payments and full specs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/boutique" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/boutique" }],
  }),
  component: Boutique,
});

const PER_PAGE = 12;

function Boutique() {
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(search.q ?? "");

  const makes = useMemo(
    () => [...new Set(vehicles.map((v) => v.make).filter(Boolean))].sort() as string[],
    [vehicles],
  );

  const filtered = useMemo(() => {
    let list = [...vehicles];
    if (search.make) list = list.filter((v) => v.make === search.make);
    if (search.q) {
      const needle = search.q.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(needle) ||
          (v.make ?? "").toLowerCase().includes(needle) ||
          (v.body_type ?? "").toLowerCase().includes(needle),
      );
    }
    const price = (v: (typeof list)[number]) => Number(v.sale_price ?? v.price);
    if (search.sort === "price-asc") list.sort((a, b) => price(a) - price(b));
    else if (search.sort === "price-desc") list.sort((a, b) => price(b) - price(a));
    else if (search.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [vehicles, search.make, search.q, search.sort]);

  const page = search.page ?? 1;
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const setSearch = (next: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, page: 1, ...next }) });

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Inventory"
        title="Certified Bank & Lender Repossessions"
        subtitle="Every vehicle listed below is a genuine lender repossession with lien-free paperwork and multi-point inspection. Inventory is updated daily."
      />

      <div className="container-page py-12">
        {/* Filters Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <form
              className="flex flex-1 min-w-64 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSearch({ q: query || undefined });
              }}
            >
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by make, model (e.g. Porsche, G63, SUV)..."
                  className="pl-9 bg-slate-50 border-slate-200"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs">
                Search
              </Button>
            </form>

            <Select
              value={search.make ?? "all"}
              onValueChange={(value) => setSearch({ make: value === "all" ? undefined : value })}
            >
              <SelectTrigger className="w-48 bg-slate-50 border-slate-200 font-medium">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={search.sort ?? "default"}
              onValueChange={(value) => setSearch({ sort: value === "default" ? undefined : value })}
            >
              <SelectTrigger className="w-52 bg-slate-50 border-slate-200 font-medium">
                <SelectValue placeholder="Default Sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Sorting</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-slate-900 font-bold">{visible.length}</span> of <span className="text-slate-900 font-bold">{filtered.length}</span> bank seized vehicles
          </p>
          {search.make || search.q || search.sort ? (
            <Link
              to="/boutique"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
            >
              <RefreshCcw className="size-3.5" /> Reset Filters
            </Link>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-slate-200 mt-6 p-8">
            <p className="text-lg font-bold text-slate-800">No vehicles match your criteria.</p>
            <p className="text-sm text-slate-500 mt-1">Try broadening your search term or make selection.</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs"
              onClick={() => {
                setQuery("");
                navigate({ search: {} });
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : null}

        {pages > 1 ? (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === page ? "default" : "outline"}
                className={n === page ? "bg-blue-600 text-white font-bold" : "border-slate-300 font-semibold"}
                size="sm"
                onClick={() => navigate({ search: (prev: Search) => ({ ...prev, page: n }) })}
              >
                {n}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </SiteLayout>
  );
}
