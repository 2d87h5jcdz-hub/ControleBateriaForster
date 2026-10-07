// Monta www/index.html a partir de app/index.html (o mesmo arquivo publicado como protótipo)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const corpo = readFileSync("app/index.html", "utf8");
const head = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="format-detection" content="telephone=no">
<style>:root{color-scheme:light dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;-webkit-text-size-adjust:100%;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
input,textarea,select{-webkit-user-select:text;user-select:text}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>`;
mkdirSync("www", { recursive: true });
writeFileSync("www/index.html", head + corpo + "</body></html>");
console.log("www/index.html gerado");
