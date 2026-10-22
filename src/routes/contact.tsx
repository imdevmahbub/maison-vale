import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { BRAND } from "@/data/products";
import { contactSchema, interests } from "@/lib/contact";
import { Socials } from "@/components/site/Socials";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the Studio | Maison Vale" },
      { name: "description", content: "Ask about a ring, commission a bespoke watch or strap, or visit the Maison Vale studio." },
      { property: "og:title", content: "Contact Maison Vale" },
      { property: "og:description", content: "Get in touch about rings, bespoke watches and leather straps." },
    ],
  }),
  component: Contact,
});

// Form delivery: set VITE_FORM_ENDPOINT to a Formspree/Web3Forms URL once the owner confirms the provider.
const ENDPOINT = import.meta.env["VITE_FORM_ENDPOINT"] as string | undefined;

type Errors = Partial<Record<"name" | "email" | "phone" | "interest" | "message", string>>;

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) { setStatus("sent"); return; } // honeypot
    const parsed = contactSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(errs);
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(parsed.data) });
        if (!res.ok) throw new Error("Failed");
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      track("Contact Form Submitted", { interest: parsed.data.interest });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field = "mt-2 block w-full min-h-12 border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-accent aria-[invalid=true]:border-destructive";
  const label = "text-xs uppercase tracking-[0.2em]";
  const err = (k: keyof Errors) => errors[k] && <p id={`${k}-err`} className="mt-1.5 text-sm text-destructive">{errors[k]}</p>;
  const a11y = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-5 pt-14 lg:grid-cols-[1fr_1.3fr] lg:px-10 lg:pt-20">
      <div>
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-3 text-5xl lg:text-7xl">Contact</h1>
        <p className="mt-6 max-w-md text-muted-foreground">Questions about a piece, a commission, or a new strap for an old favourite — we'd love to hear from you.</p>
        <dl className="mt-10 space-y-5 text-sm">
          <div><dt className={label}>Email</dt><dd className="mt-1"><a href={`mailto:${BRAND.email}`} className="hover:text-accent">{BRAND.email}</a></dd></div>
          <div><dt className={label}>Studio</dt><dd className="mt-1 text-muted-foreground">{BRAND.address}</dd></div>
          <div><dt className={label}>Hours</dt><dd className="mt-1 text-muted-foreground">{BRAND.hours}</dd></div>
        </dl>
        <div className="mt-10"><Socials /></div>
      </div>

      {status === "sent" ? (
        <div role="status" className="flex flex-col items-start justify-center border border-border bg-card p-10">
          <CheckCircle2 className="size-10 text-accent" />
          <h2 className="mt-4 text-4xl">Thank you.</h2>
          <p className="mt-2 text-muted-foreground">Your message has been sent. We'll reply within two working days.</p>
          <button className="btn btn-outline mt-8" onClick={() => setStatus("idle")}>Send another message</button>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="space-y-6" aria-label="Contact form">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block"><span className={label}>Name *</span><input name="name" autoComplete="name" maxLength={100} className={field} {...a11y("name")} />{err("name")}</label>
            <label className="block"><span className={label}>Email *</span><input name="email" type="email" autoComplete="email" maxLength={255} className={field} {...a11y("email")} />{err("email")}</label>
            <label className="block"><span className={label}>Phone (optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} className={field} {...a11y("phone")} />{err("phone")}</label>
            <label className="block"><span className={label}>Interest *</span>
              <select name="interest" defaultValue="" className={field} {...a11y("interest")}>
                <option value="" disabled>Select…</option>
                {interests.map((i) => <option key={i}>{i}</option>)}
              </select>{err("interest")}
            </label>
          </div>
          <label className="block"><span className={label}>Message *</span><textarea name="message" rows={6} maxLength={2000} className={field} {...a11y("message")} />{err("message")}</label>
          <div aria-hidden="true" className="absolute -left-[9999px]"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
          <p className="text-xs text-muted-foreground">We only use your details to reply to your enquiry. We never share them or add you to a mailing list.</p>
          {status === "error" && <p role="alert" className="text-sm text-destructive">Something went wrong sending your message. Please try again or email us directly.</p>}
          <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">{status === "sending" ? "Sending…" : "Send Message"}</button>
        </form>
      )}
    </div>
  );
}
