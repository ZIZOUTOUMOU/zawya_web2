/**
 * scripts/generate_placeholders.js
 *
 * Generates SVG placeholder covers for books missing cover_image.
 * SVGs are browser-native, support Arabic text, tiny files (~1KB each).
 * Saves to backend/uploads/covers/, updates DB with /uploads/covers/ URL.
 *
 * Run:  node scripts/generate_placeholders.js
 */
'use strict';

const path = require('path');
const fs   = require('fs');

const db = require('../backend/database/db');

const COVERS_DIR = path.join(__dirname, '..', 'backend', 'uploads', 'covers');
const BASE_URL   = '/uploads/covers';

// Category → background color (hex)
const CAT_COLORS = {
  'الشعر':          '#1a1a2e',
  'الطب':           '#2c3e50',
  'الدوريات العامة': '#3d5a80',
  'الفرق والمذاهب': '#4a2c2c',
  'القانون':        '#2c4a3e',
  'المعاجم والقواميس': '#5a3d2c',
  'الفيزياء':       '#2c3d5a',
  'عام':            '#3d3d3d',
  'علوم الأرض':     '#3d5a3d',
  'الميتافيزيقا':   '#4a2c5a',
  'الرياضيات':      '#2c5a5a',
  'العلوم السياسية': '#5a2c3d',
  'النحو والصرف':   '#3d4a2c',
  'علم الكلام':     '#2c2c4a',
  'الفنون':         '#5a3d5a',
  'علم النفس':      '#3d5a5a',
  'المكتبات والمعلومات': '#4a4a2c',
  'الأخلاق والتصوف': '#2c4a4a',
  'الرسم والزخرفة': '#5a4a2c',
  'علم اللغة':      '#2c3d4a',
};

const FALLBACK_COLOR = '#555555';

function getCategoryColor(cat) {
  return CAT_COLORS[cat] || FALLBACK_COLOR;
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(str, max) {
  if (!str) return '';
  str = str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (str.length <= max) return str;
  return str.substring(0, max) + '…';
}

function lighten(hex, amount) {
  // Lighten a hex color by the given amount (0-1)
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.floor(r + (255 - r) * amount));
  const lg = Math.min(255, Math.floor(g + (255 - g) * amount));
  const lb = Math.min(255, Math.floor(b + (255 - b) * amount));
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function generateSvg(bookId, title, author, category) {
  const bgColor = getCategoryColor(category);
  const catLabel = escapeXml(truncate(category, 30));
  const titleLines = wrapText(escapeXml(truncate(title, 80)), 24);
  const authorLine = escapeXml(truncate(author, 40));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${lighten(bgColor, 0.15)}"/>
      <stop offset="100%" style="stop-color:${bgColor}"/>
    </linearGradient>
  </defs>
  <rect width="300" height="450" fill="url(#bg)" rx="4"/>
  <rect x="8" y="8" width="284" height="434" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" rx="3"/>
  <!-- Category badge -->
  <rect x="50" y="20" width="200" height="28" rx="14" fill="rgba(255,255,255,0.15)"/>
  <text x="150" y="39" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-size="12">${catLabel}</text>
  <!-- Decorative line -->
  <line x1="40" y1="70" x2="260" y2="70" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <!-- Decorative geometric pattern -->
  <circle cx="150" cy="200" r="80" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <circle cx="150" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <circle cx="150" cy="200" r="40" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
  <!-- Title -->
  <text x="150" y="310" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-family="sans-serif" font-size="16" font-weight="bold">
    <tspan x="150" dy="0">${titleLines[0] || ''}</tspan>
    ${titleLines.slice(1).map((line, i) => `<tspan x="150" dy="${i === 0 ? 22 : 22}">${line}</tspan>`).join('\n    ')}
  </text>
  <!-- Author -->
  <text x="150" y="370" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-size="13" font-style="italic">${authorLine}</text>
  <!-- Book ID -->
  <text x="15" y="438" fill="rgba(255,255,255,0.25)" font-family="monospace" font-size="9">#${bookId}</text>
</svg>`;
}

function wrapText(text, maxPerLine) {
  if (!text) return [''];
  // For Arabic/French/English: try to split at word boundary
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    // SVG removes leading/trailing whitespace via xml:space="default"
    if (current && (current + ' ' + w).length > maxPerLine) {
      lines.push(current);
      current = w;
    } else if (current) {
      current += ' ' + w;
    } else {
      current = w;
    }
  }
  if (current) lines.push(current);
  if (!lines.length) lines.push('');
  return lines;
}

async function run() {
  await db.ready();

  const books = db.prepare(`
    SELECT id, title, author, category
    FROM books
    WHERE (cover_image IS NULL OR cover_image = '')
      AND is_visible = 1
    ORDER BY id
  `).all();

  console.log(`\n📚 Generating ${books.length} SVG placeholder covers...\n`);

  let count = 0;
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const svg = generateSvg(b.id, b.title, b.author, b.category);
    const filename = `placeholder_${b.id}.svg`;
    const filepath = path.join(COVERS_DIR, filename);
    fs.writeFileSync(filepath, svg, 'utf-8');
    const url = `${BASE_URL}/${filename}`;

    db.prepare(`UPDATE books SET cover_image = ?, first_page_img = ? WHERE id = ?`)
      .run(url, url, b.id);
    count++;

    if (count % 200 === 0) process.stdout.write(`  ✓ ${count} / ${books.length}\n`);
  }

  console.log(`\n✅ ${count} SVG placeholders generated.`);
  process.exit(0);
}

run().catch(err => { console.error('❌ Failed:', err); process.exit(1); });
