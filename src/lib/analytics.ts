// Lightweight analytics hook. Wire to Plausible/GA4 once the owner picks one:
// window.plausible?.(event, { props }) is used when present.
type Props = Record<string, string>;
export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { plausible?: (e: string, o?: { props?: Props } | undefined) => void };
  w.plausible?.(event, props ? { props } : undefined);
}
