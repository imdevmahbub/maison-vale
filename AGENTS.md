<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Product content lives only in src/data/products.ts (typed Product list + BRAND); components never hardcode products — owner edits one file.
- Images: each src/assets/<name>.jpg has generated -480/-800/-1200/-1800.webp and -lqip.webp siblings, resolved via src/lib/images.ts; regenerate siblings when adding photos.
- Lightbox renders through a portal to document.body so page wrappers can't trap its stacking/positioning.
- No cart, checkout or payment code: Buy Now always links out to the product's checkoutUrl in a new tab.
- Contact form posts to VITE_FORM_ENDPOINT (Formspree/Web3Forms) when set; otherwise simulates success.
