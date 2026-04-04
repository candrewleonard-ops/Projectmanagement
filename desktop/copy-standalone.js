// Copies the Next.js standalone build output into desktop/next-app
// so electron-builder can package it with the .exe.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const srcStandalone = path.join(root, ".next", "standalone");
const srcStatic = path.join(root, ".next", "static");
const srcPublic = path.join(root, "public");
const dest = path.join(__dirname, "next-app");
const destStatic = path.join(dest, ".next", "static");
const destPublic = path.join(dest, "public");

function rimraf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyRecursive(src, out) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(out, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(out, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

console.log("[copy-standalone] cleaning desktop/next-app");
rimraf(dest);

if (!fs.existsSync(srcStandalone)) {
  console.error("[copy-standalone] .next/standalone not found. Did you run `next build` with DESKTOP_BUILD=true?");
  process.exit(1);
}

console.log("[copy-standalone] copying standalone server");
copyRecursive(srcStandalone, dest);

console.log("[copy-standalone] copying .next/static");
copyRecursive(srcStatic, destStatic);

if (fs.existsSync(srcPublic)) {
  console.log("[copy-standalone] copying public/");
  copyRecursive(srcPublic, destPublic);
}

console.log("[copy-standalone] done");
