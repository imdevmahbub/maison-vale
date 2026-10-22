import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { ImageSet } from "@/lib/images";
import { track } from "@/lib/analytics";

export type LightboxItem = {
  image: ImageSet;
  alt: string;
  caption?: string;
  buy?: { url: string; productId: string };
};

export function Lightbox({ items, index, onClose, onIndex }: { items: LightboxItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const dialogRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number; dist?: number } | null>(null);
  const item = items[index]!;

  const go = useCallback((d: number) => { setZoom(1); onIndex((index + d + items.length) % items.length); }, [index, items.length, onIndex]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => { document.body.style.overflow = ""; prev?.focus(); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = f[0]!, last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const dist = (t: React.TouchList) => Math.hypot(t[0]!.clientX - t[1]!.clientX, t[0]!.clientY - t[1]!.clientY);

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[100] flex flex-col bg-overlay text-overlay-foreground animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-2 p-3 sm:p-5">
        <span className="text-xs tracking-[0.2em]" aria-live="polite">{index + 1} / {items.length}</span>
        <div className="flex items-center gap-1">
          <button aria-label={zoom > 1 ? "Zoom out" : "Zoom in"} onClick={() => setZoom(zoom > 1 ? 1 : 2.2)} className="grid size-11 place-items-center hover:text-accent">
            {zoom > 1 ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </button>
          <button aria-label="Close viewer" onClick={onClose} className="grid size-11 place-items-center hover:text-accent"><X className="size-6" /></button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-0 sm:px-16"
        onTouchStart={(e) => { touch.current = e.touches.length === 2 ? { x: 0, y: 0, dist: dist(e.touches) } : { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY }; }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && touch.current?.dist) setZoom(Math.min(4, Math.max(1, dist(e.touches) / touch.current.dist * (zoom || 1))));
        }}
        onTouchEnd={(e) => {
          const t = touch.current; touch.current = null;
          if (!t || t.dist || zoom > 1) return;
          const dx = e.changedTouches[0]!.clientX - t.x;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <img
          key={item.image.full}
          src={item.image.full}
          alt={item.alt}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            setZoom(zoom > 1 ? 1 : 2.2);
          }}
          style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
          className={`max-h-full max-w-full object-contain transition-transform duration-300 ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        />
        {items.length > 1 && (
          <>
            <button aria-label="Previous image" onClick={() => go(-1)} className="absolute left-1 top-1/2 grid size-12 -translate-y-1/2 place-items-center hover:text-accent sm:left-4"><ChevronLeft className="size-7" /></button>
            <button aria-label="Next image" onClick={() => go(1)} className="absolute right-1 top-1/2 grid size-12 -translate-y-1/2 place-items-center hover:text-accent sm:right-4"><ChevronRight className="size-7" /></button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 p-5 text-center sm:flex-row sm:justify-center sm:gap-8">
        {item.caption && <p className="font-serif text-2xl">{item.caption}</p>}
        {item.buy && (
          <a href={item.buy.url} target="_blank" rel="noopener noreferrer" onClick={() => track("Buy Now", { product: item.buy!.productId, from: "lightbox" })} className="btn btn-light">Buy Now</a>
        )}
      </div>
    </div>,
    document.body,
  );
}
