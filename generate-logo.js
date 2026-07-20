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
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
      <feOffset dx="0" dy="6" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.6" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Professional rounded white background -->
  <rect width="1024" height="1024" fill="white" rx="160" />
  
  <g transform="translate(512, 512)">
    <text 
      text-anchor="middle" 
      dominant-baseline="middle"
      font-family="system-ui, -apple-system, sans-serif" 
      font-weight="950" 
      font-size="400" 
      stroke="#1e1b4b"
      stroke-width="4"
      y="-140"
      textLength="900"
      lengthAdjust="spacingAndGlyphs"
      filter="url(#shadow)"
    >
      <tspan fill="#ef4444">D</tspan>
      <tspan fill="#f59e0b">A</tspan>
      <tspan fill="#10b981">Y</tspan>
    </text>
    <text 
      text-anchor="middle" 
      dominant-baseline="middle"
      font-family="system-ui, -apple-system, sans-serif" 
      font-weight="950" 
      font-size="190" 
      stroke="#1e1b4b"
      stroke-width="2"
      y="180"
      textLength="900"
      lengthAdjust="spacingAndGlyphs"
      filter="url(#shadow)"
    >
      <tspan fill="#3b82f6">I</tspan>
      <tspan fill="#6366f1">N</tspan>
      <tspan fill="#8b5cf6">F</tspan>
      <tspan fill="#ec4899">O</tspan>
      <tspan fill="#06b6d4">T</tspan>
      <tspan fill="#14b8a6">E</tspan>
      <tspan fill="#f43f5e">C</tspan>
      <tspan fill="#f97316">H</tspan>
    </text>
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
  
  // Also save to root of public for easier access
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(path.join(process.cwd(), 'public', 'logo.png'));
  
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
