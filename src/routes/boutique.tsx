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

type Search = { make?: string; q?: string; sort?: string; page?: number };

export const Route = createFileRoute("/boutique")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    make: typeof search.make === "string" ? search.make : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
    page: typeof search.page === "number" ? search.page : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(vehiclesQuery),
  head: () => ({
    meta: [
      { title: "Repossessed Car Inventory | Bank Seized Cars" },
      {
        name: "description",
        content:
          "Browse our full inventory of bank repossessed cars, trucks and SUVs. Filter by make, price and mileage, then reserve online with nationwide delivery.",
      },
      { property: "og:title", content: "Repossessed Car Inventory | Bank Seized Cars" },
      {
        property: "og:description",
        content: "Every bank seized vehicle currently available, with prices and full specs.",
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
    navigate({ search: (prev) => ({ ...prev, page: 1, ...next }) });

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Inventory"
        title="Bank repossessed vehicles"
        subtitle="Every vehicle below is a genuine bank or lender repossession with clean paperwork. Prices update as stock moves."
      />

      <div className="container-page py-12">
        <div className="flex flex-wrap items-center gap-3">
          <form
            className="flex flex-1 min-w-64 gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch({ q: query || undefined });
            }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by model, make or body type"
            />
            <Button type="submit" variant="hero">
              Search
            </Button>
          </form>

          <Select
            value={search.make ?? "all"}
            onValueChange={(value) => setSearch({ make: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All makes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All makes</SelectItem>
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
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Default sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default sorting</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing {visible.length} of {filtered.length} vehicles
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No vehicles match those filters.{" "}
            <Link to="/boutique" className="text-hot underline">
              Reset
            </Link>
          </p>
        ) : null}

        {pages > 1 ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === page ? "hero" : "outline"}
                size="sm"
                onClick={() => navigate({ search: (prev) => ({ ...prev, page: n }) })}
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
