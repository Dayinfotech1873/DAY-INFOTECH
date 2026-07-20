import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Minimalist text-only logo with rainbow gradient
const svgContent = `
<svg
  width="1024"
  height="1024"
  viewBox="0 0 1024 1024"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1" />
      <stop offset="16.6%" style="stop-color:#FF7F00;stop-opacity:1" />
      <stop offset="33.3%" style="stop-color:#FFFF00;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#00FF00;stop-opacity:1" />
      <stop offset="66.6%" style="stop-color:#0000FF;stop-opacity:1" />
      <stop offset="83.3%" style="stop-color:#4B0082;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9400D3;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Clean white background -->
  <rect width="1024" height="1024" fill="white" />
  
  <!-- Centered Minimalist Brand Typography with Rainbow Gradient -->
  <g transform="translate(512, 512)">
    <text 
      text-anchor="middle" 
      dominant-baseline="middle"
      font-family="Impact, Charcoal, 'Arial Black', sans-serif" 
      font-weight="950" 
      font-size="320" 
      fill="url(#rainbowGradient)" 
      y="-160"
      textLength="850"
      lengthAdjust="spacingAndGlyphs"
    >DAY</text>
    <text 
      text-anchor="middle" 
      dominant-baseline="middle"
      font-family="Impact, Charcoal, 'Arial Black', sans-serif" 
      font-weight="950" 
      font-size="160" 
      fill="url(#rainbowGradient)" 
      y="160"
      textLength="850"
      lengthAdjust="spacingAndGlyphs"
    >INFOTECH</text>
  </g>
</svg>
`;

async function main() {
  const assetsDir = path.join(process.cwd(), 'assets');
  const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
  
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

  // 1. Generate primary logo.png
  await sharp(Buffer.from(svgContent))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'logo.png'));
  
  // 2. Sync files
  const files = ['logo.png'];
  files.forEach(f => {
    fs.copyFileSync(path.join(assetsDir, f), path.join(publicAssetsDir, f));
    // Also copy to 'icon.png' for legacy capacitor compatibility
    fs.copyFileSync(path.join(assetsDir, f), path.join(assetsDir, 'icon.png'));
    fs.copyFileSync(path.join(assetsDir, f), path.join(publicAssetsDir, 'icon.png'));
    fs.copyFileSync(path.join(assetsDir, f), path.join(assetsDir, 'icon-only.png'));
    fs.copyFileSync(path.join(assetsDir, f), path.join(publicAssetsDir, 'icon-only.png'));
    fs.copyFileSync(path.join(assetsDir, f), path.join(assetsDir, 'icon-foreground.png'));
    fs.copyFileSync(path.join(assetsDir, f), path.join(publicAssetsDir, 'icon-foreground.png'));
  });

  // 3. Create solid white background for icons
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .png()
  .toFile(path.join(assetsDir, 'icon-background.png'));
  fs.copyFileSync(path.join(assetsDir, 'icon-background.png'), path.join(publicAssetsDir, 'icon-background.png'));

  // 4. Generate splash.png (centered logo)
  const logoForSplash = await sharp(path.join(assetsDir, 'logo.png'))
    .resize(1500, 1500)
    .toBuffer();

  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: logoForSplash, gravity: 'center' }])
  .png()
  .toFile(path.join(assetsDir, 'splash.png'));

  fs.copyFileSync(path.join(assetsDir, 'splash.png'), path.join(publicAssetsDir, 'splash.png'));
  fs.copyFileSync(path.join(assetsDir, 'splash.png'), path.join(assetsDir, 'splash-only.png'));
  fs.copyFileSync(path.join(assetsDir, 'splash.png'), path.join(publicAssetsDir, 'splash-only.png'));

  console.log('Text-only assets generated successfully!');
}

main().catch(console.error);
