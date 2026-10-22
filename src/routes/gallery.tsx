import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { categories, products, type Product } from "@/data/products";
import { Img } from "@/components/site/Img";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox, type LightboxItem } from "@/components/site/Lightbox";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Rings, Bespoke Watches & Leather Straps | Maison Vale" },
      { name: "description", content: "Browse handmade rings, bespoke mechanical watches and hand-stitched leather watch straps. Buy directly through our secure checkout partner." },
      { property: "og:title", content: "The Maison Vale Gallery" },
      { property: "og:description", content: "Rings, bespoke watches and leather watch straps — browse the full collection." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Product", name: p.name, description: p.description, brand: "Maison Vale" } })),
        }),
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [box, setBox] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const open = (p: Product) =>
    setBox({ index: 0, items: p.images.map((im) => ({ image: im, alt: im.alt, caption: p.name, buy: { url: p.checkoutUrl, productId: p.id } })) });

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-14 lg:px-10 lg:pt-20">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-3 text-5xl lg:text-7xl">Gallery</h1>
      </div>

      <nav aria-label="Gallery sections" className="sticky top-16 z-40 mt-8 border-y border-border bg-background/90 backdrop-blur-md lg:top-20">
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 lg:px-10">
          {categories.map((c) => (
            <li key={c.id} className="shrink-0">
              <a href={`#${c.id}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-xs uppercase tracking-[0.18em] transition-colors hover:border-foreground">
                {c.title.replace("Bespoke Leather Watch Straps", "Straps").replace("Bespoke ", "")}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {categories.map((c) => (
        <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="mx-auto max-w-7xl px-5 pt-16 lg:px-10 lg:pt-24">
          <Reveal>
            <h2 id={`${c.id}-h`} className="text-4xl lg:text-5xl">{c.title}</h2>
            <p className="mt-2 text-muted-foreground">{c.line}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 min-[420px]:grid-cols-2 lg:grid-cols-3">
            {products.filter((p) => p.category === c.id).map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <article className="group flex h-full flex-col">
                  <button onClick={() => open(p)} aria-label={`View larger images of ${p.name}`} className="block cursor-zoom-in">
                    <Img image={p.images[0]!} alt={p.images[0]!.alt} sizes="(min-width: 1024px) 30vw, (min-width: 420px) 50vw, 100vw" imgClassName="zoom-img" />
                  </button>
                  <div className="mt-4 flex flex-1 flex-col">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-2xl">{p.name}</h3>
                      {p.price && <span className="text-sm text-muted-foreground">{p.price}</span>}
                    </div>
                    {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
                    <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("Buy Now", { product: p.id })} className="btn btn-primary mt-5 self-start">
                      Buy Now<span className="sr-only"> {p.name} (opens in new tab)</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      {box && <Lightbox items={box.items} index={box.index} onClose={() => setBox(null)} onIndex={(i) => setBox({ ...box, index: i })} />}
    </>
  );
}
