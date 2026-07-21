import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Crystal clear modern geometric "DAY INFOTECH" logo content
const svgContent = `
<svg
  width="1024"
  height="1024"
  viewBox="0 0 1024 1024"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <!-- Deep Navy/Space Premium Background Gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>

    <!-- Warm Sun/Day Rose-to-Orange Gradient -->
    <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="60%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>

    <!-- Digital Info Tech Cyan-to-Blue Gradient -->
    <linearGradient id="techGradient" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>

    <!-- Outer Ring Gold Gradient -->
    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>

    <!-- Futuristic Neon Glow Filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Squircle container with premium gradient background -->
  <rect width="1024" height="1024" rx="240" fill="url(#bgGradient)" />

  <!-- Tech decorative concentric pattern -->
  <circle cx="512" cy="512" r="410" stroke="url(#ringGradient)" stroke-width="6" stroke-dasharray="24 16" opacity="0.25" />
  <circle cx="512" cy="512" r="360" stroke="#ffffff" stroke-width="2" opacity="0.1" />

  <!-- Ambient glow in the center -->
  <circle cx="512" cy="512" r="160" fill="url(#sunGradient)" opacity="0.15" filter="url(#neonGlow)" />

  <g transform="translate(512, 512)">
    <!-- Tech Digital Orbit Path -->
    <path 
      d="M -280,0 A 280,280 0 1,1 280,0" 
      fill="none" 
      stroke="url(#techGradient)" 
      stroke-width="14" 
      stroke-linecap="round" 
      stroke-dasharray="40 25" 
      opacity="0.8"
    />
    <path 
      d="M 280,0 A 280,280 0 0,1 -280,0" 
      fill="none" 
      stroke="url(#sunGradient)" 
      stroke-width="14" 
      stroke-linecap="round" 
      stroke-dasharray="60 30" 
      opacity="0.8"
    />

    <!-- Interlocking "D" and "I" Monogram Geometric Shapes -->
    <!-- Left Vertical Pillar for "I" -->
    <rect 
      x="-160" 
      y="-180" 
      width="64" 
      height="360" 
      rx="32" 
      fill="url(#techGradient)" 
      filter="url(#neonGlow)"
    />
    
    <!-- Digital Dot Node above "I" -->
    <circle 
      cx="-128" 
      cy="-240" 
      r="36" 
      fill="url(#techGradient)" 
      filter="url(#neonGlow)"
    />
    
    <!-- Glowing Golden "D" Arc intersecting the "I" -->
    <path 
      d="M -110,-140 C -10,-140 140,-90 140,0 C 140,90 -10,140 -110,140" 
      fill="none" 
      stroke="url(#sunGradient)" 
      stroke-width="64" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      filter="url(#neonGlow)"
    />

    <!-- Additional decorative digital nodes to represent data flow -->
    <circle cx="0" cy="-140" r="14" fill="#ffffff" opacity="0.9" />
    <circle cx="140" cy="0" r="16" fill="#ffffff" opacity="0.9" />
    <circle cx="0" cy="140" r="14" fill="#ffffff" opacity="0.9" />
  </g>
</svg>
`;

async function main() {
  const assetsDir = path.join(process.cwd(), 'assets');
  const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
  
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

  // Save the SVG file
  fs.writeFileSync(path.join(assetsDir, 'logo.svg'), svgContent);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo.svg'), svgContent);

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

  console.log('Premium vector-crisp assets generated successfully!');
}

main().catch(console.error);
