import { Link } from "@tanstack/react-router";
import { BRAND } from "@/data/products";
import { Logo } from "./Header";
import { Socials } from "./Socials";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-10">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <Link to="/gallery" className="hover:text-accent">Gallery</Link>
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
        </nav>
        <div className="md:justify-self-end"><Socials /></div>
      </div>
      <div className="border-t border-border px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:text-left lg:px-5">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Developed by Md Mahbubur Rahman.</p>
        </div>
      </div>
    </footer>
  );
}
