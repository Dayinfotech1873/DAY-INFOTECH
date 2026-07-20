import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `
<svg
  width="1024"
  height="1024"
  viewBox="0 0 512 512"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Pure white background for maximum compatibility -->
  <rect width="512" height="512" fill="white" />
  
  <!-- Outer Rings -->
  <circle cx="256" cy="256" r="240" stroke="#1E3A8A" stroke-width="12" />
  <circle cx="256" cy="256" r="228" stroke="#F97316" stroke-width="8" />

  <!-- Professional Iconography -->
  <g id="CenterSymbol">
    <!-- Main Bold "D" Shape -->
    <path 
      d="M170 140 V372 C170 372 342 372 342 256 C342 140 170 140 170 140Z" 
      fill="#1E3A8A" 
    />
    
    <!-- Accent Inner Shape -->
    <path 
      d="M205 175 V337 C205 337 305 337 305 256 C305 175 205 175 205 175Z" 
      fill="#F97316" 
    />

    <!-- Connectivity Dot -->
    <circle cx="342" cy="256" r="40" fill="#1E3A8A" />
    <circle cx="342" cy="256" r="16" fill="white" />
  </g>

  <!-- Connectivity Nodes -->
  <circle cx="256" cy="85" r="24" fill="#1E3A8A" />
  <circle cx="256" cy="427" r="24" fill="#F97316" />
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
