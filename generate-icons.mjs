import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, 'public', 'icons');
const baseLogo = join(__dirname, 'public', 'logo.png');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  try {
    const sharp = (await import('sharp')).default;
    
    for (const size of sizes) {
      await sharp(baseLogo)
        .resize(size, size)
        .png()
        .toFile(join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    for (const size of [192, 512]) {
      await sharp(baseLogo)
        .resize({ width: size, height: size, fit: 'contain', background: '#070911' })
        .png()
        .toFile(join(iconsDir, `icon-maskable-${size}x${size}.png`));
      console.log(`✓ Generated icon-maskable-${size}x${size}.png`);
    }

    await sharp(baseLogo)
      .resize(180, 180)
      .png()
      .toFile(join(iconsDir, 'apple-touch-icon.png'));
    
    console.log('✓ Generated apple-touch-icon.png');
    console.log('\n🎉 All icons generated successfully!');
  } catch (err) {
    console.error('Error generating icons:', err.message);
  }
}

generate();
