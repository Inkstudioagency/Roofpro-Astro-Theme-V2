"use strict";
/**
 * Seed importer: reads data/services.csv and data/works.csv (mirrored from
 * cms/services.csv and cms/"Our Works.csv") and creates
 * Service / Work entries on first boot (idempotent — skips if data exists).
 * CSV headers map to schema attributes via camelCase (schema attrs were named
 * to match), so only columns that exist as attributes are imported.
 */
const fs = require("fs");
const path = require("path");

/* --- Minimal RFC4180 CSV parser (handles quoted fields, "" escapes, newlines) --- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ""));
}

function toCamel(header) {
  return header
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");
}

function rowsToObjects(rows, allowedAttrs) {
  const headers = rows[0].map(toCamel);
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => {
      if (allowedAttrs.has(h)) {
        const v = (r[i] || "").trim();
        if (v !== "") obj[h] = v;
      }
    });
    return obj;
  });
}

function findCsv(strapi, filename) {
  const candidates = [
    path.join(strapi.dirs.app.root, "data", filename),
    path.join(strapi.dirs.app.root, "..", "cms", filename),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

async function importCollection(strapi, uid, filename) {
  const existing = await strapi.documents(uid).count();
  if (existing > 0) {
    strapi.log.info(`[seed] ${uid} already has ${existing} entries — skipping`);
    return;
  }
  const csvPath = findCsv(strapi, filename);
  if (!csvPath) {
    strapi.log.warn(`[seed] ${filename} not found — skipping ${uid}`);
    return;
  }
  const attrs = new Set(Object.keys(strapi.contentType(uid).attributes));
  const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
  const items = rowsToObjects(rows, attrs);
  let created = 0;
  for (const data of items) {
    if (!data.slug) continue;
    try {
      await strapi.documents(uid).create({ data, status: "published" });
      created++;
    } catch (e) {
      strapi.log.error(`[seed] failed to create ${uid} "${data.slug}": ${e.message}`);
    }
  }
  strapi.log.info(`[seed] imported ${created} entries into ${uid}`);
}

async function grantPublicRead(strapi) {
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });
  if (!publicRole) return;
  const actions = [
    "api::service.service.find",
    "api::service.service.findOne",
    "api::work.work.find",
    "api::work.work.findOne",
  ];
  for (const action of actions) {
    const existing = await strapi
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });
    if (existing) {
      if (!existing.enabled)
        await strapi
          .query("plugin::users-permissions.permission")
          .update({ where: { id: existing.id }, data: { enabled: true } });
    } else {
      await strapi
        .query("plugin::users-permissions.permission")
        .create({ data: { action, enabled: true, role: publicRole.id } });
    }
  }
  strapi.log.info("[seed] public read permissions granted for services & works");
}

module.exports = async function seed(strapi) {
  await importCollection(strapi, "api::service.service", "services.csv");
  await importCollection(strapi, "api::work.work", "works.csv");
  await grantPublicRead(strapi);
};
