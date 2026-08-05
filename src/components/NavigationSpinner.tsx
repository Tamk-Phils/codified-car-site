import { useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export function NavigationSpinner() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });

  if (!isLoading) return null;

  return (
    <>
      {/* Top progress bar animation */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 overflow-hidden bg-blue-100">
        <div className="h-full w-full bg-blue-600 animate-pulse origin-left" />
      </div>

      {/* Center loading badge spinner for visual feedback when pages are clicked */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        <Loader2 className="size-4 animate-spin text-blue-400" />
        <span>Loading page...</span>
      </div>
    </>
  );
}
