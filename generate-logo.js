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
    <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080711" />
      <stop offset="50%" stop-color="#121324" />
      <stop offset="100%" stop-color="#1b1736" />
    </linearGradient>

    <linearGradient id="logoDayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff1a66" />
      <stop offset="60%" stop-color="#ff5500" />
      <stop offset="100%" stop-color="#ffaa00" />
    </linearGradient>

    <linearGradient id="logoTechGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f2fe" />
      <stop offset="50%" stop-color="#4facfe" />
      <stop offset="100%" stop-color="#7f00ff" />
    </linearGradient>

    <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff007f" />
      <stop offset="100%" stop-color="#00f2fe" />
    </linearGradient>
  </defs>

  <!-- 1. Base Squircle Container -->
  <rect width="1024" height="1024" rx="240" fill="url(#logoBgGrad)" />

  <!-- 2. Cyber Orbit Rings (Outer Branding) -->
  <circle cx="512" cy="512" r="425" stroke="url(#logoRingGrad)" stroke-width="10" stroke-dasharray="24 18" opacity="0.35" />
  <circle cx="512" cy="512" r="375" stroke="#ffffff" stroke-width="3" stroke-dasharray="6 8" opacity="0.15" />

  <!-- 3. Tech Horizon Waves -->
  <path d="M 142 512 A 370 370 0 0 1 882 512" fill="none" stroke="url(#logoTechGrad)" stroke-width="4" opacity="0.2" />
  <path d="M 172 512 A 340 340 0 0 0 852 512" fill="none" stroke="url(#logoDayGrad)" stroke-width="2" opacity="0.15" />

  <!-- 4. Ambient Glowing Center Aura -->
  <circle cx="512" cy="512" r="260" fill="url(#logoDayGrad)" opacity="0.06" />
  <circle cx="512" cy="512" r="180" fill="url(#logoTechGrad)" opacity="0.06" />

  <!-- 5. Center Monogram Group (DI Interlocking Masterpiece) -->
  <g transform="translate(512, 512)">
    <!-- Active Orbit Halves -->
    <path d="M -310 0 A 310 310 0 0 1 310 0" fill="none" stroke="url(#logoTechGrad)" stroke-width="18" stroke-linecap="round" stroke-dasharray="40 30" opacity="0.8" />
    <path d="M 310 0 A 310 310 0 0 1 -310 0" fill="none" stroke="url(#logoDayGrad)" stroke-width="18" stroke-linecap="round" stroke-dasharray="60 35" opacity="0.8" />

    <!-- Vertical Column for 'I' in Tech Blue -->
    <rect x="-155" y="-190" width="80" height="380" rx="40" fill="url(#logoTechGrad)" opacity="0.25" />
    <rect x="-145" y="-180" width="60" height="360" rx="30" fill="url(#logoTechGrad)" />
    <rect x="-133" y="-165" width="36" height="330" rx="18" fill="#ffffff" opacity="0.2" />
    
    <!-- Cyber Dot/Sun representing 'DAY' -->
    <circle cx="-115" cy="-250" r="45" fill="url(#logoDayGrad)" opacity="0.3" />
    <circle cx="-115" cy="-250" r="32" fill="url(#logoDayGrad)" />
    <circle cx="-115" cy="-250" r="12" fill="#ffffff" opacity="0.4" />

    <!-- Sweeping Bold Loop for 'D' in Day Red-Gold -->
    <path d="M -80 -140 C 25 -140 170 -80 170 0 C 170 80 25 140 -80 140" fill="none" stroke="url(#logoDayGrad)" stroke-width="90" stroke-linecap="round" stroke-linejoin="round" opacity="0.25" />
    <path d="M -80 -140 C 25 -140 170 -80 170 0 C 170 80 25 140 -80 140" fill="none" stroke="url(#logoDayGrad)" stroke-width="70" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M -80 -140 C 25 -140 170 -80 170 0 C 170 80 25 140 -80 140" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="0.25" />

    <!-- Connecting Data Nodes -->
    <circle cx="0" cy="-140" r="24" fill="url(#logoTechGrad)" opacity="0.3" />
    <circle cx="0" cy="-140" r="14" fill="#ffffff" />
    
    <circle cx="170" cy="0" r="28" fill="url(#logoDayGrad)" opacity="0.3" />
    <circle cx="170" cy="0" r="16" fill="#ffffff" />
    
    <circle cx="0" cy="140" r="24" fill="url(#logoTechGrad)" opacity="0.3" />
    <circle cx="0" cy="140" r="14" fill="#ffffff" />
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
