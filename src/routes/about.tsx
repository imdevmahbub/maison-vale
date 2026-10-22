import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { imageSet } from "@/lib/images";
import { Img } from "@/components/site/Img";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox, type LightboxItem } from "@/components/site/Lightbox";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio | Maison Vale" },
      { name: "description", content: "Meet the Maison Vale studio: a small team of jewellers, watchmakers and leather artisans working by hand." },
      { property: "og:title", content: "About the Maison Vale Studio" },
      { property: "og:description", content: "The people, place and process behind every Maison Vale piece." },
    ],
  }),
  component: About,
});

const studio: LightboxItem[] = [
  { image: imageSet("studio-4", 1024, 1280), alt: "Sunlit studio workbench with tools and plants", caption: "The studio" },
  { image: imageSet("studio-2", 1280, 960), alt: "Watchmaker assembling a movement under a loupe", caption: "Assembling a movement" },
  { image: imageSet("studio-1", 1024, 1280), alt: "Jeweller polishing a gold ring at the bench", caption: "Polishing by hand" },
  { image: imageSet("studio-3", 1280, 960), alt: "Artisan saddle-stitching a leather watch strap", caption: "Saddle stitching" },
];

const process = [
  { img: "studio-1", w: 1024, h: 1280, caption: "Forming & polishing" },
  { img: "studio-2", w: 1280, h: 960, caption: "Movement assembly" },
  { img: "studio-3", w: 1280, h: 960, caption: "Hand stitching" },
  { img: "ring-1", w: 1024, h: 1280, caption: "Final finish" },
  { img: "strap-3", w: 1024, h: 1280, caption: "Cutting the hide" },
  { img: "watch-2", w: 1024, h: 1280, caption: "Regulation & testing" },
];

function About() {
  const [idx, setIdx] = useState<number | null>(null);
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-14 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:pt-20">
        <div>
          <p className="eyebrow">Our Story</p>
          <h1 className="mt-3 text-5xl leading-tight lg:text-7xl">A small studio with a slow craft.</h1>
          <div className="mt-6 space-y-4 text-muted-foreground lg:text-lg">
            <p>Maison Vale began at a single bench, with a belief that the things we wear every day should be made carefully, by hand, and built to outlast us.</p>
            <p>Today our jewellers, watchmakers and leather artisans work side by side — every ring, watch and strap passes through just a few pairs of hands before it reaches yours.</p>
          </div>
        </div>
        <Img image={imageSet("studio-4", 1024, 1280)} alt="The Maison Vale studio bathed in morning light" sizes="(min-width: 1024px) 45vw, 100vw" priority />
      </section>

      <section aria-labelledby="studio-h" className="mx-auto max-w-7xl px-5 pt-24 lg:px-10">
        <Reveal><h2 id="studio-h" className="text-4xl lg:text-5xl">Inside the studio</h2></Reveal>
        <div className="mt-10 columns-1 gap-6 sm:columns-2">
          {studio.map((s, i) => (
            <button key={s.alt} onClick={() => setIdx(i)} aria-label={`Open photo: ${s.caption}`} className="group mb-6 block w-full cursor-zoom-in break-inside-avoid">
              <Img image={s.image} alt={s.alt} sizes="(min-width: 640px) 50vw, 100vw" imgClassName="zoom-img" />
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="craft-h" className="pt-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal><h2 id="craft-h" className="text-4xl lg:text-5xl">Craftsmanship</h2></Reveal>
        </div>
        <div className="mt-10 overflow-hidden">
          <ul className="marquee flex w-max gap-6">
            {[...process, ...process].map((p, i) => (
              <li key={i} className="w-64 shrink-0 sm:w-80" aria-hidden={i >= process.length}>
                <Img image={{ ...imageSet(p.img, p.w, p.h), width: 4, height: 5 }} alt={p.caption} sizes="320px" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pt-24 text-center">
        <Reveal>
          <h2 className="text-4xl lg:text-5xl">See what we've been making.</h2>
          <Link to="/gallery" className="btn btn-primary mt-8">View the Gallery</Link>
        </Reveal>
      </section>

      {idx !== null && <Lightbox items={studio} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />}
    </>
  );
}
