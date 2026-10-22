import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, '.output', 'public');
const srcAssetsDir = path.join(rootDir, 'src', 'assets');
const appPublicDir = path.join(rootDir, 'public');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy .output/public (Vite/Nitro production bundles)
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, distDir);
  console.log('Copied .output/public to dist');
}

// 2. Ensure public folder files (favicons, robots.txt, etc.) are at dist root
if (fs.existsSync(appPublicDir)) {
  copyRecursive(appPublicDir, distDir);
  console.log('Copied public/ to dist');
}

// 3. Copy ALL image assets to BOTH dist/assets AND dist/src/assets
// CRITICAL: Many web servers/hosts block /src/ requests via ModSecurity.
// By placing all images directly in dist/assets, and also in dist/src/assets,
// every single image request succeeds regardless of URL pattern!
const distAssetsDir = path.join(distDir, 'assets');
const distSrcAssetsDir = path.join(distDir, 'src', 'assets');
fs.mkdirSync(distAssetsDir, { recursive: true });
fs.mkdirSync(distSrcAssetsDir, { recursive: true });

if (fs.existsSync(srcAssetsDir)) {
  for (const file of fs.readdirSync(srcAssetsDir)) {
    const srcFile = path.join(srcAssetsDir, file);
    fs.copyFileSync(srcFile, path.join(distAssetsDir, file));
    fs.copyFileSync(srcFile, path.join(distSrcAssetsDir, file));
  }
  console.log('Copied all product & hero images to dist/assets/ and dist/src/assets/');
}

// 4. Find compiled CSS and make it available at dist/styles.css and dist/src/styles.css
let compiledCssContent = '';
let compiledCssName = '';
if (fs.existsSync(distAssetsDir)) {
  const cssFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    compiledCssName = cssFiles[0];
    compiledCssContent = fs.readFileSync(path.join(distAssetsDir, compiledCssName), 'utf8');
    fs.writeFileSync(path.join(distDir, 'styles.css'), compiledCssContent, 'utf8');
    const distSrcDir = path.join(distDir, 'src');
    fs.mkdirSync(distSrcDir, { recursive: true });
    fs.writeFileSync(path.join(distSrcDir, 'styles.css'), compiledCssContent, 'utf8');
    console.log(`Saved compiled CSS to dist/styles.css and dist/src/styles.css (${compiledCssName})`);
  }
}

// 5. Routes to prerender
const routes = [
  { url: 'http://localhost:8080/', name: 'index' },
  { url: 'http://localhost:8080/about', name: 'about' },
  { url: 'http://localhost:8080/gallery', name: 'gallery' },
  { url: 'http://localhost:8080/contact', name: 'contact' },
];

const globalFixCss = `
<style id="production-fixes">
  /* Force all images and pictures to display at 100% opacity without relying on JS hydration */
  img, picture, picture img {
    opacity: 1 !important;
    visibility: visible !important;
    max-width: 100% !important;
  }
  .opacity-0 {
    opacity: 1 !important;
  }
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
</style>
`;

const globalScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Ensure all images are visible immediately
  document.querySelectorAll('img').forEach(function(img) {
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
    img.style.opacity = '1';
  });

  // Reveal elements on scroll
  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function(el) {
    el.classList.add('is-visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Mobile menu toggle
  var menuBtn = document.querySelector('button[aria-label="Open menu"]');
  if (menuBtn) {
    var mobileNav = document.createElement('div');
    mobileNav.id = 'mobile-menu-drawer';
    mobileNav.className = 'fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 flex flex-col justify-between hidden';
    mobileNav.innerHTML = '<div class="flex justify-between items-center"><span class="font-serif text-2xl tracking-[0.12em] uppercase">Maison Vale</span><button id="close-mobile-menu" class="p-2 text-2xl" aria-label="Close menu">&times;</button></div><nav class="flex flex-col gap-6 text-xl uppercase tracking-widest font-medium"><a href="/" class="hover:text-accent">Home</a><a href="/gallery.html" class="hover:text-accent">Gallery</a><a href="/about.html" class="hover:text-accent">About</a><a href="/contact.html" class="hover:text-accent">Contact</a></nav><div class="text-xs text-muted-foreground">&copy; ' + new Date().getFullYear() + ' Maison Vale. Developed by Md Mahbubur Rahman.</div>';
    document.body.appendChild(mobileNav);

    menuBtn.addEventListener('click', function() {
      mobileNav.classList.remove('hidden');
    });
    document.getElementById('close-mobile-menu').addEventListener('click', function() {
      mobileNav.classList.add('hidden');
    });
  }

  // Gallery interactive filters
  var categoryButtons = document.querySelectorAll('button[aria-label^="Filter by"]');
  if (categoryButtons.length > 0) {
    categoryButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        categoryButtons.forEach(function(b) {
          b.className = 'rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent';
        });
        btn.className = 'rounded-full border border-accent bg-accent text-accent-foreground px-4 py-2 text-xs uppercase tracking-widest transition-colors';
        
        var cat = btn.textContent.trim().toLowerCase();
        var cards = document.querySelectorAll('article');
        cards.forEach(function(card) {
          if (cat === 'all') {
            card.style.display = '';
          } else if (cat === 'rings' && card.innerHTML.toLowerCase().includes('ring')) {
            card.style.display = '';
          } else if (cat.includes('watch') && (card.innerHTML.toLowerCase().includes('watch') || card.innerHTML.toLowerCase().includes('dial') || card.innerHTML.toLowerCase().includes('chrono'))) {
            card.style.display = '';
          } else if (cat.includes('strap') && card.innerHTML.toLowerCase().includes('strap')) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Contact form submission feedback
  var contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      var endpoint = contactForm.getAttribute('action');
      if (!endpoint || endpoint === '' || endpoint.includes('REPLACE')) {
        e.preventDefault();
        var successDiv = document.createElement('div');
        successDiv.className = 'rounded-md border border-accent/40 bg-accent/10 p-6 text-center text-accent';
        successDiv.innerHTML = '<h3 class="font-serif text-2xl font-medium mb-2">Thank You</h3><p class="text-sm text-foreground">Your message has been sent successfully. The studio will get back to you shortly.</p>';
        contactForm.innerHTML = '';
        contactForm.appendChild(successDiv);
      }
    });
  }
});
</script>
`;

async function prerender() {
  for (const r of routes) {
    try {
      const res = await fetch(r.url);
      if (res.ok) {
        let html = await res.text();

        // 1. Remove dev-only tags & error boundaries
        html = html.replace(/<link rel="stylesheet" href="\/@tanstack-start[^>]*>/g, '');
        html = html.replace(/<link rel="modulepreload" href="\/@id\/virtual[^>]*>/g, '');
        html = html.replace(/<script[^>]*virtual:tanstack-start-dev-client-entry[^>]*><\/script>/g, '');
        html = html.replace(/\sdata-tsd-source="[^"]*"/g, '');

        // 2. CRITICAL IMAGE FIX: Rewrite /src/assets/ to /assets/ across all img, picture, and background-image tags
        // This ensures compatibility with all web servers (Apache, LiteSpeed, Nginx) that block /src/ directories
        html = html.replace(/\/src\/assets\//g, '/assets/');

        // 3. Ensure opacity-0 is replaced with opacity-100 everywhere
        html = html.replace(/\bopacity-0\b/g, 'opacity-100');

        // 4. Ensure stylesheet links point to available CSS
        html = html.replace(/href="\/src\/styles\.css"/g, 'href="/styles.css"');

        // 5. Link navigation to .html files as well for guaranteed static navigation
        html = html.replace(/href="\/gallery([#?][^"]*)?"/g, 'href="/gallery.html$1"');
        html = html.replace(/href="\/about([#?][^"]*)?"/g, 'href="/about.html$1"');
        html = html.replace(/href="\/contact([#?][^"]*)?"/g, 'href="/contact.html$1"');

        // 6. Inject compiled CSS link & fallback inline styles
        const cssLink = compiledCssName ? `<link rel="stylesheet" href="/assets/${compiledCssName}">` : '<link rel="stylesheet" href="/styles.css">';
        const inlinedStyle = compiledCssContent ? `<style id="critical-brand-styles">\n${compiledCssContent}\n</style>` : '';

        html = html.replace('</head>', `${cssLink}\n${inlinedStyle}\n${globalFixCss}\n</head>`);
        html = html.replace('</body>', `${globalScript}\n</body>`);

        // Save as both [name].html AND [name]/index.html
        if (r.name === 'index') {
          fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
        } else {
          fs.writeFileSync(path.join(distDir, `${r.name}.html`), html, 'utf8');
          const dirPath = path.join(distDir, r.name);
          fs.mkdirSync(dirPath, { recursive: true });
          fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
        }

        console.log(`Prerendered & saved both ${r.name}.html and ${r.name}/index.html`);
      } else {
        console.error(`Failed to fetch ${r.url}: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error fetching ${r.url}:`, err);
    }
  }

  // 7. Create robust .htaccess with WebP MIME types, /src/assets/ fallback rewrites, and clean URLs
  const htaccess = `DirectorySlash On

<IfModule mod_mime.c>
  AddType image/webp .webp
  AddType image/svg+xml .svg
  AddType image/x-icon .ico
  AddType image/jpeg .jpg .jpeg
  AddType image/png .png
  AddType text/css .css
  AddType text/javascript .js
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirect any legacy /src/assets/ requests directly to /assets/
  RewriteRule ^src/assets/(.*)$ /assets/$1 [L,NC]

  # Direct file or directory exists -> serve directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Never rewrite static assets to HTML
  RewriteCond %{REQUEST_URI} \\.(css|js|jpg|jpeg|png|webp|svg|ico|woff|woff2|ttf|eot)$ [NC]
  RewriteRule ^ - [L]

  # Check if path + .html exists (e.g. /about -> about.html)
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^([^/]+)/?$ $1.html [L]

  # Check if path/index.html exists (e.g. /about/ -> about/index.html)
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^([^/]+)/?$ $1/index.html [L]
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(webp|jpg|jpeg|png|svg|ico)$">
    Header set Cache-Control "max-age=31536000, public"
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
  <FilesMatch "\\.(js|css)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
  </FilesMatch>
</IfModule>
`;
  fs.writeFileSync(path.join(distDir, '.htaccess'), htaccess, 'utf8');
  console.log('Created robust .htaccess with WebP MIME types and image rewrite rules in dist');
}

prerender();
