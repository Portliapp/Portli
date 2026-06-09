// generate-icons.mjs — Converts SVG icon to PNG at all required PWA sizes
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, 'public', 'icons');

// Read the base SVG
const baseSvg = readFileSync(join(iconsDir, 'icon-base.svg'), 'utf-8');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  try {
    const sharp = (await import('sharp')).default;
    
    for (const size of sizes) {
      const svgWithSize = baseSvg
        .replace(/width="\d+"/, `width="${size}"`)
        .replace(/height="\d+"/, `height="${size}"`);
      
      await sharp(Buffer.from(svgWithSize))
        .resize(size, size)
        .png()
        .toFile(join(iconsDir, `icon-${size}x${size}.png`));
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    // Maskable icons (with extra padding for safe zone)
    const maskableSvg = baseSvg.replace(
      'viewBox="0 0 512 512"',
      'viewBox="-60 -60 632 632"'
    );

    for (const size of [192, 512]) {
      const svgWithSize = maskableSvg
        .replace(/width="\d+"/, `width="${size}"`)
        .replace(/height="\d+"/, `height="${size}"`);
      
      await sharp(Buffer.from(svgWithSize))
        .resize(size, size)
        .png()
        .toFile(join(iconsDir, `icon-maskable-${size}x${size}.png`));
      
      console.log(`✓ Generated icon-maskable-${size}x${size}.png`);
    }

    // Apple touch icon (180x180)
    const appleSvg = baseSvg
      .replace(/width="\d+"/, 'width="180"')
      .replace(/height="\d+"/, 'height="180"');
    
    await sharp(Buffer.from(appleSvg))
      .resize(180, 180)
      .png()
      .toFile(join(iconsDir, 'apple-touch-icon.png'));
    
    console.log('✓ Generated apple-touch-icon.png');
    console.log('\n🎉 All icons generated successfully!');
  } catch (err) {
    console.error('Error generating icons:', err.message);
    console.log('\nFallback: Using SVG icons directly (supported by all modern browsers).');
    
    // Fallback: write SVG files as-is with correct names
    for (const size of sizes) {
      const svgWithSize = baseSvg
        .replace(/width="\d+"/, `width="${size}"`)
        .replace(/height="\d+"/, `height="${size}"`);
      writeFileSync(join(iconsDir, `icon-${size}x${size}.svg`), svgWithSize);
    }
    console.log('✓ SVG fallback icons created');
  }
}

generate();
