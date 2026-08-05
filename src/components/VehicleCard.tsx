import { Link } from "@tanstack/react-router";
import { formatPrice, SITE } from "@/lib/site";
import type { Vehicle } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, ShoppingBag } from "lucide-react";
import { OptimizedImage } from "./OptimizedImage";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { add } = useCart();
  const image = vehicle.images?.[0] ?? null;
  const hasSale = vehicle.sale_price !== null && Number(vehicle.sale_price) > 0;
  const effectivePrice = hasSale ? Number(vehicle.sale_price) : Number(vehicle.price);

  // Estimate down payment ~10-15% of effective price
  const downPayment = Math.round(effectivePrice * 0.1);

  const whatsappInquiryUrl = `${SITE.whatsappLink}?text=${encodeURIComponent(
    `Hello KJ Autos, I am inquiring about: ${vehicle.name} (${formatPrice(effectivePrice)})`
  )}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Image Container with Asking & Down Payment Badge Overlay */}
      <Link to="/produit/$slug" params={{ slug: vehicle.slug }} className="block overflow-hidden relative">
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          {image ? (
            <OptimizedImage
              src={image}
              alt={vehicle.name}
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400 font-bold">
              Vehicle Image
            </div>
          )}

          {/* Reference Site Overlay Badge: ASKING & DOWN PAYMENT */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[92%] rounded bg-slate-950/90 py-1 px-2 text-center text-white backdrop-blur-xs shadow-md border border-white/20">
            <p className="text-[11px] font-black uppercase tracking-tight text-white leading-none">
              ASKING:{formatPrice(effectivePrice)}
            </p>
            <p className="text-[10px] font-black uppercase tracking-tight text-emerald-400 leading-none mt-1">
              DOWN PAYMENT:{formatPrice(downPayment)}
            </p>
          </div>
        </div>
      </Link>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-4 text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          HOT DEAL
        </span>
        <Link to="/produit/$slug" params={{ slug: vehicle.slug }}>
          <h3 className="mt-1 font-display text-sm font-bold text-slate-900 group-hover:text-[#0d47a1] transition-colors line-clamp-1">
            {vehicle.name}
          </h3>
        </Link>
        <p className="mt-1 font-display text-base font-black text-slate-900">
          {formatPrice(effectivePrice)}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 rounded bg-emerald-600 px-2 py-1.5 text-[11px] font-bold uppercase text-white hover:bg-emerald-700 transition-colors"
          >
            <MessageSquare className="size-3" /> WhatsApp
          </a>

          <Button
            variant={vehicle.is_sold ? "outline" : "default"}
            disabled={vehicle.is_sold}
            className="bg-[#0d47a1] hover:bg-blue-800 text-white font-bold text-[11px] uppercase tracking-wider py-1.5 h-auto rounded"
            onClick={() => {
              add({
                vehicleId: vehicle.id,
                slug: vehicle.slug,
                name: vehicle.name,
                price: effectivePrice,
                image,
              });
              toast.success("Added to reserve cart", { description: vehicle.name });
            }}
          >
            <ShoppingBag className="size-3 mr-1" /> Reserve
          </Button>
        </div>
      </div>
    </article>
  );
}
