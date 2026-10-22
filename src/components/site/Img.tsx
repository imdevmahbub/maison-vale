import { useState } from "react";
import type { ImageSet } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  image: ImageSet;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/** Responsive <picture> with WebP srcset, JPEG fallback, blurred placeholder and fixed aspect ratio. */
export function Img({ image, alt, sizes, priority, className, imgClassName }: Props) {
  const [loaded, setLoaded] = useState(true);
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-muted", className)}
      style={{ aspectRatio: `${image.width} / ${image.height}`, backgroundImage: `url(${image.lqip})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <picture className="block h-full w-full">
        <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />
        <img
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          ref={(el) => { if (el?.complete) setLoaded(true); }}
          className={cn("h-full w-full object-cover transition-opacity duration-700 opacity-100", imgClassName)}
        />
      </picture>
    </div>
  );
}
