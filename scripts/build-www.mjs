// Monta www/ a partir de app/index.html (o mesmo arquivo publicado como protótipo).
// O resultado serve tanto para o web app (GitHub Pages) quanto para o .ipa (Capacitor).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
const corpo = readFileSync("app/index.html", "utf8");
const versao = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const head = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Forster">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#f2f4f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0e1312" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-192.png">
<style>:root{color-scheme:light dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;-webkit-text-size-adjust:100%;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
input,textarea,select{-webkit-user-select:text;user-select:text}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>`;
mkdirSync("www", { recursive: true });
writeFileSync("www/index.html", head + corpo + "</body></html>");
for (const f of ["icon-180.png", "icon-192.png", "icon-512.png", "splash-logo.png"]) copyFileSync(`assets/${f}`, `www/${f}`);
writeFileSync("www/manifest.webmanifest", JSON.stringify({
  name: "Forster · Controle de Baterias", short_name: "Forster", lang: "pt-BR",
  start_url: "./", scope: "./", display: "standalone", orientation: "portrait",
  background_color: "#0b6e5f", theme_color: "#0b6e5f",
  icons: [
    { src: "icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
}, null, 2));
writeFileSync("www/sw.js", `// Funciona offline. O app em si é buscado na rede primeiro (para receber atualizações) e cai no cache sem internet.
const CACHE = "forster-${versao}";
const BASE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "splash-logo.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname.includes("awesomeapi")) return;
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put("index.html", c)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
    return r;
  })));
});
`);
console.log("www/ gerado · versão", versao);
