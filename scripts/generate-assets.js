const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  const uploadedImg = 'C:/Users/user/.gemini/antigravity-ide/brain/b66b61a3-50e0-4be6-9224-e637220ca878/.user_uploaded/media_1792941301273.png';
  
  if (!fs.existsSync(uploadedImg)) {
    throw new Error('Uploaded image not found at ' + uploadedImg);
  }

  fs.mkdirSync('public/images', { recursive: true });
  fs.mkdirSync('assets', { recursive: true });

  // 1. Save original transparent full logo
  fs.copyFileSync(uploadedImg, 'public/images/logo.png');
  fs.copyFileSync(uploadedImg, 'public/images/logo-light.png');
  console.log('1. Saved public/images/logo.png & logo-light.png');

  // 2. Generate logo-dark.png (clean white text for dark backgrounds, preserving the M ribbon's 3D dark fold)
  const { data, info } = await sharp(uploadedImg).raw().toBuffer({ resolveWithObject: true });
  const darkBuf = Buffer.from(data);
  // Text starts at y >= 348
  for (let y = 348; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      const r = darkBuf[idx];
      const g = darkBuf[idx + 1];
      const b = darkBuf[idx + 2];
      const a = darkBuf[idx + 3];
      if (a > 10) {
        // Charcoal letters in 'Make' and 'DIGITAL SOLUTIONS'
        if (r < 110 && g < 110 && b < 110 && Math.abs(r - g) < 35 && Math.abs(g - b) < 35) {
          darkBuf[idx] = 255;
          darkBuf[idx + 1] = 255;
          darkBuf[idx + 2] = 255;
        }
      }
    }
  }

  await sharp(darkBuf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile('public/images/logo-dark.png');
  console.log('2. Saved public/images/logo-dark.png');

  // 3. Generate logo-icon.png (M ribbon isolated: left: 294, top: 47, w: 433, h: 294)
  const mWidth = 726 - 294 + 1; // 433
  const mHeight = 340 - 47 + 1;  // 294
  const mCrop = await sharp(uploadedImg)
    .extract({ left: 294, top: 47, width: mWidth, height: mHeight })
    .toBuffer();

  const mScaled = await sharp(mCrop)
    .resize(440, 440, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mScaled, gravity: 'center' }])
    .png()
    .toFile('public/images/logo-icon.png');
  console.log('3. Saved public/images/logo-icon.png');

  // 4. Generate public/images/avatar.jpg (1254x1254 cosmic badge with glowing orange ring and prominent M ribbon)
  const size = 1254;
  const cx = size / 2;
  const cy = size / 2;
  const r = 575;

  const svgRing = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0c1220" />
          <stop offset="60%" stop-color="#05070e" />
          <stop offset="100%" stop-color="#020306" />
        </radialGradient>
        
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff9a1a" />
          <stop offset="40%" stop-color="#ff6000" />
          <stop offset="75%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#ea580c" />
        </linearGradient>

        <radialGradient id="center-glow" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stop-color="#ff6a00" stop-opacity="0.38" />
          <stop offset="50%" stop-color="#ea580c" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>

        <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="20" result="b1" />
          <feGaussianBlur stdDeviation="7" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Cosmic Background -->
      <rect width="${size}" height="${size}" fill="url(#bg-radial)" />

      <!-- Center Ambient Glow -->
      <circle cx="${cx}" cy="${cy}" r="${Math.round(r * 0.85)}" fill="url(#center-glow)" />

      <!-- Glowing Neon Orange Ring -->
      <circle cx="${cx}" cy="${cy}" r="${r}" stroke="url(#ring-grad)" stroke-width="12" fill="none" filter="url(#ring-glow)" opacity="0.95" />
      <circle cx="${cx}" cy="${cy}" r="${r}" stroke="#ffd599" stroke-width="2.5" fill="none" opacity="0.8" />
    </svg>
  `;

  const bgBuffer = await sharp(Buffer.from(svgRing)).png().toBuffer();

  // Make ribbon M large and impactful inside the 1254px badge (width ~ 840px)
  const mBadge = await sharp(mCrop)
    .resize(840, null, { fit: 'inside' })
    .toBuffer();

  const mMeta = await sharp(mBadge).metadata();
  const mTop = Math.round((size - mMeta.height) / 2);
  const mLeft = Math.round((size - mMeta.width) / 2);

  await sharp(bgBuffer)
    .composite([{ input: mBadge, top: mTop, left: mLeft }])
    .jpeg({ quality: 98, progressive: true })
    .toFile('public/images/avatar.jpg');
  console.log('4. Saved public/images/avatar.jpg');

  await sharp(bgBuffer)
    .composite([{ input: mBadge, top: mTop, left: mLeft }])
    .png()
    .toFile('public/images/avatar.png');
  console.log('5. Saved public/images/avatar.png');

  // Also create avatar-with-text.jpg
  // Overall bounding box of logo in new image: minX: 173, minY: 47, maxX: 851, maxY: 486 (w: 679, h: 440)
  const logoDark = await sharp('public/images/logo-dark.png')
    .extract({ left: 173, top: 47, width: 679, height: 440 })
    .resize(920, null, { fit: 'inside' })
    .toBuffer();
  const ldMeta = await sharp(logoDark).metadata();
  const ldTop = Math.round((size - ldMeta.height) / 2);
  const ldLeft = Math.round((size - ldMeta.width) / 2);
  await sharp(bgBuffer)
    .composite([{ input: logoDark, top: ldTop, left: ldLeft }])
    .jpeg({ quality: 98, progressive: true })
    .toFile('public/images/avatar-with-text.jpg');
  console.log('6. Saved public/images/avatar-with-text.jpg');

  // 5. Update legacy assets
  fs.copyFileSync('public/images/avatar.jpg', 'assets/logo.jpeg');
  fs.copyFileSync('public/images/avatar.jpg', 'assets/makewise-logo.jpeg');
  console.log('7. Updated assets/logo.jpeg and assets/makewise-logo.jpeg');

  // 6. Generate favicon.svg & src/app/favicon.ico
  const avatarB64 = (await sharp('public/images/avatar.png').resize(128, 128).png().toBuffer()).toString('base64');
  const faviconSvgContent = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${avatarB64}" width="64" height="64" />
</svg>
`;
  fs.writeFileSync('favicon.svg', faviconSvgContent);
  console.log('8. Updated favicon.svg');

  // Valid 120x120 RGBA PNG for Next.js App Router favicon.ico
  await sharp('public/images/avatar.png')
    .resize(120, 120)
    .ensureAlpha()
    .png({ compressionLevel: 9 })
    .toFile('src/app/favicon.ico');
  console.log('9. Updated src/app/favicon.ico');

  console.log('ALL BRAND ASSETS GENERATED FOR NEW LOGO!');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
