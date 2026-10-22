import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/products";
import { imageSet } from "@/lib/images";
import { Img } from "@/components/site/Img";
import { Reveal } from "@/components/site/Reveal";
import { track } from "@/lib/analytics";

const hero = imageSet("hero", 1920, 1088);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Vale — Handmade Rings, Bespoke Watches & Straps" },
      { name: "description", content: "Discover handmade rings, bespoke mechanical watches and hand-stitched leather watch straps from the Maison Vale studio." },
      { property: "og:title", content: "Maison Vale — Heirlooms, Made by Hand" },
      { property: "og:description", content: "Handmade rings, bespoke watches and leather straps, crafted in small numbers to be kept for life." },
    ],
    links: [{ rel: "preload", as: "image", href: hero.full, imageSrcSet: hero.srcSet, imageSizes: "100vw", type: "image/webp" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative -mt-px h-[calc(100svh-4rem)] min-h-[520px] lg:h-[calc(100svh-5rem)]">
        <Img image={hero} alt="Gold ring and bespoke watch resting on linen and travertine in soft light" sizes="100vw" priority className="absolute inset-0 !aspect-auto h-full rounded-none" imgClassName="object-[70%_center]" />
        <div className="absolute inset-0 hero-scrim" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-16 lg:items-center lg:px-10 lg:pb-0">
          <div className="max-w-xl text-primary-foreground">
            <p className="eyebrow !text-primary-foreground/80">The Studio Collection</p>
            <h1 className="mt-4 text-5xl leading-[1.02] sm:text-6xl lg:text-8xl">Heirlooms, made by hand.</h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/85 lg:text-lg">Rings, bespoke watches and leather straps, crafted in small numbers at our studio.</p>
            <Link to="/gallery" onClick={() => track("Hero CTA")} className="btn btn-light mt-8">Explore the Collection</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10 lg:pt-28" aria-labelledby="cats">
        <h2 id="cats" className="sr-only">Collections</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 120}>
              <a href={`/gallery#${c.id}`} className="group block">
                <Img image={imageSet(c.cover, 1024, 1280)} alt={c.title} sizes="(min-width: 640px) 33vw, 100vw" imgClassName="zoom-img" />
                <h3 className="mt-4 text-2xl lg:text-3xl">{c.title.replace("Bespoke Leather Watch Straps", "Bespoke Straps")}</h3>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
