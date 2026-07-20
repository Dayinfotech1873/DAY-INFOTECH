import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `
<svg
  width="1024"
  height="1024"
  viewBox="0 0 500 500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <style>
    .brand-title {
      font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
      font-weight: 900;
      font-size: 28px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .brand-sub {
      font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
      font-weight: 800;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 6px;
      fill: #1e3a8a;
    }
  </style>

  <!-- Background Circle Base -->
  <circle cx="250" cy="250" r="235" fill="#F8FAFC" />
  
  <!-- Concentric Borders - Orange and Blue rings -->
  <circle cx="250" cy="250" r="230" stroke="#0284C7" strokeWidth="11" />
  <circle cx="250" cy="250" r="214" stroke="#EA580C" strokeWidth="9" />
  <circle cx="250" cy="250" r="202" stroke="#0F172A" strokeWidth="2" strokeDasharray="10 10" opacity="0.2" />

  <!-- Central Sun -->
  <g id="Sun">
    <circle cx="250" cy="180" r="42" fill="#F97316" />
    <!-- Sun Rays -->
    <path d="M250 120 L250 100" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M250 240 L250 260" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M190 180 L170 180" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M310 180 L330 180" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    
    <path d="M208 138 L194 124" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M292 222 L306 236" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M208 222 L194 236" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M292 138 L306 124" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
  </g>

  <!-- Dynamic Digital Data Pathways & Circuit Tracks -->
  <g id="DigitalPathways">
    <!-- Pathway 1 (Blue) -->
    <path d="M120 300 Q210 240 300 220 T410 110" stroke="#0284C7" strokeWidth="9" strokeLinecap="round" />
    <!-- Pathway 2 (Orange) -->
    <path d="M140 320 Q220 270 280 235 T400 140" stroke="#EA580C" strokeWidth="7" strokeLinecap="round" />
    <!-- Pathway 3 (Dark Blue) -->
    <path d="M100 270 Q190 220 290 190 T390 80" stroke="#1E3A8A" strokeWidth="5" strokeLinecap="round" />

    <!-- Network Nodes (Circles representing data) -->
    <circle cx="120" cy="300" r="11" fill="#1E3A8A" />
    <line x1="120" y1="300" x2="105" y2="275" stroke="#1E3A8A" strokeWidth="4" />
    <circle cx="105" cy="275" r="9" fill="#1E3A8A" />

    <circle cx="300" cy="220" r="10" fill="#0284C7" />
    <circle cx="280" cy="235" r="9" fill="#EA580C" />
    <circle cx="210" cy="240" r="8" fill="#0284C7" />
    <circle cx="340" cy="170" r="8" fill="#1E3A8A" />
    
    <circle cx="410" cy="110" r="12" fill="#0284C7" />
    <line x1="410" y1="110" x2="390" y2="85" stroke="#0284C7" strokeWidth="4" />
    <circle cx="390" cy="85" r="9" fill="#0284C7" />
  </g>

  <!-- Human Figures holding hands/reaching up -->
  <g id="Figures">
    <!-- Blue Figure (Left) -->
    <path d="M180 245 Q160 195 190 165 T230 145 Q210 195 195 245 Z" fill="#0284C7" />
    <!-- Head -->
    <circle cx="170" cy="120" r="23" fill="#1E3A8A" />
    <!-- Reaching arm left -->
    <path d="M180 165 Q130 180 110 220" stroke="#1E3A8A" strokeWidth="13" strokeLinecap="round" />
    <circle cx="110" cy="220" r="9" fill="#1E3A8A" />
    <!-- Connecting arm right -->
    <path d="M210 155 Q245 120 265 85" stroke="#1E3A8A" strokeWidth="15" strokeLinecap="round" />
    <circle cx="265" cy="85" r="12" fill="#1E3A8A" />

    <!-- Orange Figure (Right) -->
    <path d="M320 245 Q340 195 310 165 T270 145 Q290 195 305 245 Z" fill="#EA580C" />
    <!-- Head -->
    <circle cx="330" cy="120" r="23" fill="#EA580C" />
    <!-- Reaching arm right -->
    <path d="M320 165 Q370 180 390 220" stroke="#EA580C" strokeWidth="13" strokeLinecap="round" />
    <circle cx="390" cy="220" r="9" fill="#EA580C" />
    <!-- Connecting arm left (overlapping with blue figure) -->
    <path d="M290 155 Q255 120 235 85" stroke="#F97316" strokeWidth="15" strokeLinecap="round" />
    <circle cx="235" cy="85" r="12" fill="#F97316" />
  </g>

  <!-- Brand Text -->
  <g id="BrandText" text-anchor="middle">
    <text x="250" y="375" class="brand-title">
      <tspan fill="#EA580C">DAY</tspan> <tspan fill="#1e3a8a">INFOTECH</tspan>
    </text>
    <text x="250" y="405" class="brand-sub">
      digital point
    </text>
  </g>
</svg>
`;

async function main() {
  const assetsDir = path.join(process.cwd(), 'assets');
  const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true });
  }

  // Save the SVG itself for reference/future use
  fs.writeFileSync(path.join(assetsDir, 'logo.svg'), svgContent);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo.svg'), svgContent);

  // Generate 1024x1024 logo.png
  await sharp(Buffer.from(svgContent))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'logo.png'));
  
  fs.copyFileSync(path.join(assetsDir, 'logo.png'), path.join(publicAssetsDir, 'logo.png'));

  // Copy logo.png to icon.png, icon-only.png, icon-foreground.png
  fs.copyFileSync(path.join(assetsDir, 'logo.png'), path.join(assetsDir, 'icon.png'));
  fs.copyFileSync(path.join(assetsDir, 'logo.png'), path.join(assetsDir, 'icon-only.png'));
  fs.copyFileSync(path.join(assetsDir, 'logo.png'), path.join(assetsDir, 'icon-foreground.png'));
  
  fs.copyFileSync(path.join(assetsDir, 'icon.png'), path.join(publicAssetsDir, 'icon.png'));
  fs.copyFileSync(path.join(assetsDir, 'icon-only.png'), path.join(publicAssetsDir, 'icon-only.png'));
  fs.copyFileSync(path.join(assetsDir, 'icon-foreground.png'), path.join(publicAssetsDir, 'icon-foreground.png'));

  // Create solid white background for icon-background.png
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 248, g: 250, b: 252, alpha: 1 }
    }
  })
  .png()
  .toFile(path.join(assetsDir, 'icon-background.png'));
  
  fs.copyFileSync(path.join(assetsDir, 'icon-background.png'), path.join(publicAssetsDir, 'icon-background.png'));

  // Create splash.png by centering resized logo on solid background
  const logoResized = await sharp(path.join(assetsDir, 'logo.png'))
    .resize(800, 800)
    .toBuffer();

  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background: { r: 248, g: 250, b: 252, alpha: 1 }
    }
  })
  .composite([{ input: logoResized, gravity: 'center' }])
  .png()
  .toFile(path.join(assetsDir, 'splash.png'));

  fs.copyFileSync(path.join(assetsDir, 'splash.png'), path.join(publicAssetsDir, 'splash.png'));

  // Copy to splash-only.png
  fs.copyFileSync(path.join(assetsDir, 'splash.png'), path.join(assetsDir, 'splash-only.png'));
  fs.copyFileSync(path.join(assetsDir, 'splash-only.png'), path.join(publicAssetsDir, 'splash-only.png'));

  console.log('✓ Successfully generated assets/ and public/assets/ logo.png and all Capacitor launcher icon & splash screen assets!');
}

main().catch(console.error);
