import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/data/products";

const links = [
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return <span className={`font-serif text-2xl tracking-[0.12em] uppercase ${className}`}>{BRAND.name}</span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-10">
        <Link to="/" aria-label={`${BRAND.name} home`} onClick={() => setOpen(false)}><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-10 sm:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button className="grid size-11 place-items-center sm:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col items-center justify-center gap-10 bg-background animate-in fade-in slide-in-from-top-2 duration-300 sm:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-serif text-4xl">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
