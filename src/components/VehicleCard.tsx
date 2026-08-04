import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/site";
import type { Vehicle } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { add } = useCart();
  const image = vehicle.images?.[0] ?? null;
  const hasSale = vehicle.sale_price !== null && Number(vehicle.sale_price) > 0;
  const effective = hasSale ? Number(vehicle.sale_price) : Number(vehicle.price);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link to="/produit/$slug" params={{ slug: vehicle.slug }} className="block overflow-hidden">
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={vehicle.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          {vehicle.is_sold ? (
            <span className="absolute left-3 top-3 rounded-sm bg-ink px-2 py-1 text-xs font-bold uppercase tracking-wide text-ink-foreground">
              Sold
            </span>
          ) : vehicle.is_hot_deal ? (
            <span className="absolute left-3 top-3 rounded-sm bg-hot px-2 py-1 text-xs font-bold uppercase tracking-wide text-hot-foreground">
              Hot Deal
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to="/produit/$slug" params={{ slug: vehicle.slug }}>
          <h3 className="text-base leading-tight tracking-wide">{vehicle.name}</h3>
        </Link>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {[vehicle.mileage, vehicle.transmission, vehicle.exterior_color]
            .filter(Boolean)
            .join(" • ")}
        </p>
        <div className="mt-auto flex items-baseline gap-2">
          {hasSale ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(vehicle.price)}
            </span>
          ) : null}
          <span className="text-lg font-bold text-hot">{formatPrice(effective)}</span>
        </div>
        <Button
          variant={vehicle.is_sold ? "outline" : "default"}
          disabled={vehicle.is_sold}
          onClick={() => {
            add({
              vehicleId: vehicle.id,
              slug: vehicle.slug,
              name: vehicle.name,
              price: effective,
              image,
            });
            toast.success("Added to cart", { description: vehicle.name });
          }}
        >
          {vehicle.is_sold ? "Sold out" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
