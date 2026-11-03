// Dev helper (not shipped): parses the CMS CSVs (../cms/services.csv and
// ../cms/"Our Works.csv") and writes the bundled fallback JSON (src/data/*.json).
// Uses the SAME header->camelCase mapping as strapi/src/seed.js so the
// standalone build and the CMS return identical keys.
import fs from "fs";
import path from "path";

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ""));
}

const toCamel = (h) =>
  h.trim().toLowerCase().split(/\s+/)
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");

function toObjects(file) {
  const rows = parseCSV(fs.readFileSync(file, "utf8"));
  const headers = rows[0].map(toCamel);
  return rows.slice(1).map((r) => {
    const o = {};
    headers.forEach((h, i) => { o[h] = (r[i] || "").trim(); });
    return o;
  }).filter((o) => o.slug);
}

const services = toObjects(path.resolve("../cms/services.csv"));
const works = toObjects(path.resolve("../cms/Our Works.csv"));

fs.mkdirSync(path.resolve("src/data"), { recursive: true });
fs.writeFileSync(path.resolve("src/data/services.json"), JSON.stringify(services, null, 2));
fs.writeFileSync(path.resolve("src/data/works.json"), JSON.stringify(works, null, 2));

console.log(`services: ${services.length} items, keys: ${Object.keys(services[0]).length}`);
console.log(`works:    ${works.length} items, keys: ${Object.keys(works[0]).length}`);
console.log("service keys:", Object.keys(services[0]).join(", "));
console.log("work keys:", Object.keys(works[0]).join(", "));
