import { Facebook, Instagram, Mail } from "lucide-react";
import { BRAND } from "@/data/products";

export function Socials() {
  const items = [
    { href: BRAND.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: BRAND.socials.facebook, label: "Facebook", Icon: Facebook },
    { href: `mailto:${BRAND.email}`, label: "Email", Icon: Mail },
  ];
  return (
    <ul className="flex gap-3">
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent">
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
