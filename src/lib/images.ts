// Responsive image registry: every src/assets/<name>.jpg has WebP widths
// (<name>-480/800/1200/1800.webp) and a tiny blurred placeholder (<name>-lqip.webp).
const webps = import.meta.glob("/src/assets/*.webp", { eager: true, import: "default" }) as Record<string, string>;
const jpgs = import.meta.glob("/src/assets/*.jpg", { eager: true, import: "default" }) as Record<string, string>;

export type ImageSet = {
  src: string; // JPEG fallback (full size)
  srcSet: string; // WebP widths
  lqip: string;
  full: string; // largest WebP for the lightbox
  width: number;
  height: number;
};

export function imageSet(name: string, width: number, height: number): ImageSet {
  const widths = [480, 800, 1200, 1800].filter((w) => webps[`/src/assets/${name}-${w}.webp`]);
  const srcSet = widths.map((w) => `${webps[`/src/assets/${name}-${w}.webp`]} ${w}w`).join(", ");
  const largest = widths[widths.length - 1];
  return {
    src: jpgs[`/src/assets/${name}.jpg`] ?? "",
    srcSet,
    lqip: webps[`/src/assets/${name}-lqip.webp`] ?? "",
    full: webps[`/src/assets/${name}-${largest}.webp`] ?? jpgs[`/src/assets/${name}.jpg`] ?? "",
    width,
    height,
  };
}
