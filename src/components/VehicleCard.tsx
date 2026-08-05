import { Link } from "@tanstack/react-router";
import { formatPrice, SITE } from "@/lib/site";
import type { Vehicle } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, MessageSquare } from "lucide-react";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { add } = useCart();
  const image = vehicle.images?.[0] ?? null;
  const hasSale = vehicle.sale_price !== null && Number(vehicle.sale_price) > 0;
  const effectivePrice = hasSale ? Number(vehicle.sale_price) : Number(vehicle.price);

  // Calculate estimated down payment (20% of effective price) if not explicitly set
  const downPayment = Math.round(effectivePrice * 0.2);

  const whatsappInquiryUrl = `${SITE.whatsappLink}?text=${encodeURIComponent(
    `Hello, I am interested in inquiring about the bank seized vehicle: ${vehicle.name} (Asking Price: ${formatPrice(effectivePrice)})`
  )}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image & Badges Overlay */}
      <Link to="/produit/$slug" params={{ slug: vehicle.slug }} className="block overflow-hidden relative">
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          {image ? (
            <img
              src={image}
              alt={vehicle.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400 font-bold">
              Vehicle Image
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {vehicle.is_sold ? (
              <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                SOLD OUT
              </span>
            ) : vehicle.is_hot_deal ? (
              <span className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md animate-pulse">
                HOT DEAL
              </span>
            ) : (
              <span className="rounded-md bg-blue-700 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                <ShieldCheck className="size-3" />
                SEIZED • CLEAN TITLE
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div>
          <Link to="/produit/$slug" params={{ slug: vehicle.slug }}>
            <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {vehicle.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            {[vehicle.year, vehicle.mileage, vehicle.transmission, vehicle.fuel_type]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>

        {/* Pricing Section matching reference site */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Asking Price:</span>
            <div className="flex items-baseline gap-1.5">
              {hasSale ? (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(vehicle.price)}
                </span>
              ) : null}
              <span className="text-lg font-black text-blue-700">{formatPrice(effectivePrice)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Est. Down Payment:</span>
            <span className="text-sm font-black text-emerald-700">{formatPrice(downPayment)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors"
          >
            <MessageSquare className="size-3.5" />
            <span>Inquire</span>
          </a>

          <Button
            variant={vehicle.is_sold ? "outline" : "default"}
            disabled={vehicle.is_sold}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2"
            onClick={() => {
              add({
                vehicleId: vehicle.id,
                slug: vehicle.slug,
                name: vehicle.name,
                price: effectivePrice,
                image,
              });
              toast.success("Vehicle added to your reserve cart", { description: vehicle.name });
            }}
          >
            {vehicle.is_sold ? "Sold Out" : "Reserve"}
          </Button>
        </div>
      </div>
    </article>
  );
}
