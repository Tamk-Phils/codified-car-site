import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lines, total, remove, setQuantity } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            Reserve a repossessed vehicle — our team confirms availability within 24 hours.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is currently empty.</p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.vehicleId} className="flex gap-3 border-b border-border pb-4">
                  {line.image ? (
                    <img
                      src={line.image}
                      alt={line.name}
                      className="size-20 rounded-md object-cover"
                    />
                  ) : null}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{line.name}</p>
                    <p className="text-sm text-hot">{formatPrice(line.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setQuantity(line.vehicleId, line.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm">{line.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setQuantity(line.vehicleId, line.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(line.vehicleId)}
                        aria-label="Remove item"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-col">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Subtotal</span>
            <span className="text-hot">{formatPrice(total)}</span>
          </div>
          <Button variant="hero" disabled={lines.length === 0} asChild>
            <Link to="/commander" onClick={() => onOpenChange(false)}>
              Checkout
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/panier" onClick={() => onOpenChange(false)}>
              View cart
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
