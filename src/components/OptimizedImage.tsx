import { useState } from "react";
import { Loader2, ImageOff } from "lucide-react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${wrapperClassName}`}>
      {/* Loading Skeleton & Spinner */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <Loader2 className="size-6 animate-spin text-blue-600/60" />
        </div>
      )}

      {/* Fallback Error View */}
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400 font-medium text-xs gap-1.5 p-4 text-center">
          <ImageOff className="size-4" />
          <span>Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
