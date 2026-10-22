import { imageSet, type ImageSet } from "@/lib/images";

export type Category = "rings" | "watches" | "straps";

export type Product = {
  id: string;
  category: Category;
  name: string;
  description?: string;
  price?: string; // display only
  images: (ImageSet & { alt: string })[];
  checkoutUrl: string; // external provider link
};

/**
 * PLACEHOLDER: every checkoutUrl below points to example.com until the owner
 * supplies the final external checkout links. Names, prices and copy are
 * also placeholders.
 */
export const PLACEHOLDER_CHECKOUT = "https://example.com/checkout/REPLACE-ME";

const p = (name: string, alt: string) => ({ ...imageSet(name, 1024, 1280), alt });

export const categories: { id: Category; title: string; line: string; cover: string }[] = [
  { id: "rings", title: "Rings", line: "Hand-finished bands and signets in solid gold and silver.", cover: "ring-1" },
  { id: "watches", title: "Bespoke Watches", line: "Mechanical timepieces assembled and finished to order.", cover: "watch-1" },
  { id: "straps", title: "Bespoke Leather Watch Straps", line: "Hand-stitched straps cut from the finest hides.", cover: "strap-1" },
];

export const products: Product[] = [
  { id: "signet-ring", category: "rings", name: "Oval Signet Ring", description: "18k yellow gold, polished face", price: "£1,450", images: [p("ring-1", "Polished 18k gold oval signet ring on travertine stone")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=signet-ring` },
  { id: "solitaire-ring", category: "rings", name: "Petite Solitaire", description: "Fine gold band, round brilliant diamond", price: "£980", images: [p("ring-2", "Slim gold ring with a small round diamond on linen")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=solitaire-ring` },
  { id: "hammered-band", category: "rings", name: "Hammered Wide Band", description: "Sterling silver, hand-hammered texture", price: "£320", images: [p("ring-3", "Wide hammered sterling silver ring on dark stone")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=hammered-band` },
  { id: "ivory-dress", category: "watches", name: "Ivory Dress Watch", description: "Gold case, small seconds, brown calf strap", price: "£6,800", images: [p("watch-1", "Gold dress watch with ivory dial and brown leather strap"), p("strap-2", "Dark brown leather strap option with gold buckle")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=ivory-dress` },
  { id: "verde-skeleton", category: "watches", name: "Verde Skeleton", description: "Steel case, open-worked green dial", price: "£8,200", images: [p("watch-2", "Steel watch with green skeleton dial showing the movement")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=verde-skeleton` },
  { id: "bronze-chrono", category: "watches", name: "Bronze Flyback Chronograph", description: "Bronze case, black dial, canvas strap", price: "£7,400", images: [p("watch-3", "Bronze chronograph watch with black dial on dark linen")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=bronze-chrono` },
  { id: "tan-saddle", category: "straps", name: "Tan Saddle Strap", description: "Vegetable-tanned leather, cream stitch", price: "£180", images: [p("strap-1", "Coiled tan leather watch strap with cream stitching")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=tan-saddle` },
  { id: "cordovan", category: "straps", name: "Cordovan Classic", description: "Shell cordovan, gold-tone buckle", price: "£240", images: [p("strap-2", "Dark brown shell cordovan strap with gold buckle")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=cordovan` },
  { id: "noir-suede", category: "straps", name: "Noir Suede", description: "Black suede, hand-stitched", price: "£165", images: [p("strap-3", "Black suede watch strap among leather tools")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=noir-suede` },
  { id: "emerald-signet", category: "rings", name: "Emerald Signet", description: "Brushed rose gold, emerald-cut stone", price: "£2,150", images: [p("ring-4", "Brushed rose gold signet ring with emerald-cut green stone on travertine")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=emerald-signet` },
  { id: "nocturne-moonphase", category: "watches", name: "Nocturne Moonphase", description: "Steel case, navy dial, blued hands", price: "£7,900", images: [p("watch-4", "Steel moonphase watch with navy dial and black alligator strap")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=nocturne-moonphase` },
  { id: "olive-nubuck", category: "straps", name: "Olive Nubuck", description: "Waxed nubuck, cream contrast stitch", price: "£195", images: [p("strap-4", "Olive green nubuck watch strap with cream stitching and steel buckle")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=olive-nubuck` },
  { id: "gold-rope-band", category: "rings", name: "Gold Rope Band", description: "18k yellow gold, twisted rope finish", images: [p("ring-5", "Twisted yellow gold rope ring on pale travertine")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=gold-rope-band` },
  { id: "silver-open-ring", category: "rings", name: "Sculpted Silver Ring", description: "Sterling silver, polished open silhouette", images: [p("ring-6", "Polished sterling silver open ring on off-white linen")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=silver-open-ring` },
  { id: "atelier-field", category: "watches", name: "Atelier Field Watch", description: "Brushed steel case, cream dial, olive canvas strap", images: [p("watch-5", "Steel field watch with cream dial and olive canvas strap on limestone")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=atelier-field` },
  { id: "rose-rectangle", category: "watches", name: "Rose Rectangle Watch", description: "Rose gold case, silver dial, burgundy leather strap", images: [p("watch-6", "Rectangular rose gold watch with burgundy leather strap on linen")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=rose-rectangle` },
  { id: "navy-grain", category: "straps", name: "Navy Grain Strap", description: "Grained calf leather, tonal stitch, steel buckle", images: [p("strap-5", "Navy grained leather watch strap halves with silver buckle on travertine")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=navy-grain` },
  { id: "burgundy-pebble", category: "straps", name: "Burgundy Pebble Strap", description: "Pebbled leather, cream hand stitch, brushed buckle", images: [p("strap-6", "Burgundy pebbled leather watch strap halves with cream stitching on linen")], checkoutUrl: `${PLACEHOLDER_CHECKOUT}?p=burgundy-pebble` },
];

export const BRAND = {
  name: "Maison Vale",
  tagline: "Rings, watches and straps, made by hand.",
  email: "studio@example.com",
  address: "12 Atelier Lane, London",
  hours: "Tue–Sat, 10:00–18:00",
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    pinterest: "https://pinterest.com/",
  },
};
