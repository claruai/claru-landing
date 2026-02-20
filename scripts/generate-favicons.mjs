import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const SOURCE = join(PROJECT_ROOT, 'public/images/logo-nanobana-edit.png');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public');

// Claru brand colors
const THEME_COLOR = '#050505';
const BACKGROUND_COLOR = '#050505';

const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

function createRoundedMask(size) {
  const borderRadius = Math.round(size * 0.22); // 22% corner radius for more pronounced rounding
  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}"
            rx="${borderRadius}" ry="${borderRadius}" fill="white"/>
    </svg>
  `);
}

async function generateFavicons() {
  console.log('🎨 Generating favicons from:', SOURCE);
  console.log('📁 Output directory:', OUTPUT_DIR);
  console.log('');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const { name, size } of SIZES) {
    const mask = createRoundedMask(size);
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 5, g: 5, b: 5, alpha: 1 } })
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toFile(join(OUTPUT_DIR, name));
    console.log(`✓ ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (32x32)
  const mask32 = createRoundedMask(32);
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 5, g: 5, b: 5, alpha: 1 } })
    .composite([{ input: mask32, blend: 'dest-in' }])
    .png()
    .toFile(join(OUTPUT_DIR, 'favicon.ico'));
  console.log('✓ favicon.ico (32x32)');

  // Generate site.webmanifest
  const manifest = {
    name: "Claru - Expert Human Intelligence for AI Labs",
    short_name: "Claru",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: THEME_COLOR,
    background_color: BACKGROUND_COLOR,
    display: "standalone"
  };

  writeFileSync(
    join(OUTPUT_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ site.webmanifest');

  console.log('');
  console.log('✅ Favicon generation complete!');
}

generateFavicons().catch(console.error);
