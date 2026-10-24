'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lanyard with ssr: false so Three.js only mounts in browser
const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--neutral-on-background-weak)',
        fontFamily: 'var(--font-label)',
        fontSize: '0.875rem',
      }}
    >
      Loading Interactive 3D Badge...
    </div>
  ),
});

export default function ProfileLanyard() {
  const [frontImage, setFrontImage] = useState<string | undefined>(undefined);
  const [backImage, setBackImage] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/images/avatar.jpg';

    logoImg.onload = () => {
      // 1. Generate Front Badge (Ultra-res 1536 x 2160)
      const canvasFront = document.createElement('canvas');
      canvasFront.width = 1536;
      canvasFront.height = 2160;
      const ctxF = canvasFront.getContext('2d');

      if (ctxF) {
        // Pristine bright card surface
        ctxF.fillStyle = '#ffffff';
        ctxF.fillRect(0, 0, canvasFront.width, canvasFront.height);

        // Outer border
        ctxF.strokeStyle = '#cbd5e1';
        ctxF.lineWidth = 18;
        ctxF.strokeRect(18, 18, canvasFront.width - 36, canvasFront.height - 36);

        // Top decorative orange bar
        ctxF.fillStyle = '#ea580c';
        ctxF.fillRect(18, 18, canvasFront.width - 36, 16);

        // Top Slot Cutout Guide
        ctxF.fillStyle = '#f1f5f9';
        ctxF.beginPath();
        ctxF.roundRect(canvasFront.width / 2 - 180, 75, 360, 60, 30);
        ctxF.fill();

        // Eyebrow Header
        ctxF.fillStyle = '#475569';
        ctxF.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'center';
        ctxF.fillText('MAKEWISE STUDIO IDENTIFIER • VERIFIED BUILDER', canvasFront.width / 2, 220);

        // Studio Brand & Avatar Block
        const logoSize = 230;
        const logoX = 90;
        const logoY = 280;

        // Gradient border for logo
        const grad = ctxF.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
        grad.addColorStop(0, '#ea580c');
        grad.addColorStop(1, '#f59e0b');
        ctxF.fillStyle = grad;
        ctxF.beginPath();
        ctxF.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 46);
        ctxF.fill();

        // Draw avatar image
        ctxF.save();
        ctxF.beginPath();
        ctxF.roundRect(logoX, logoY, logoSize, logoSize, 40);
        ctxF.clip();
        ctxF.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        ctxF.restore();

        // Studio Title
        ctxF.textAlign = 'left';
        ctxF.fillStyle = '#0f172a';
        ctxF.font = '900 108px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.fillText('MakeWise', logoX + logoSize + 48, logoY + 105);

        // Studio Subtitle
        ctxF.fillStyle = '#ea580c';
        ctxF.font = '800 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.fillText('Digital Products & Web Solutions', logoX + logoSize + 48, logoY + 172);

        // Divider Line
        ctxF.strokeStyle = '#e2e8f0';
        ctxF.lineWidth = 4;
        ctxF.beginPath();
        ctxF.moveTo(90, 560);
        ctxF.lineTo(canvasFront.width - 90, 560);
        ctxF.stroke();

        // 4 LARGE, HIGH-CONTRAST CREDENTIAL PANELS
        const cardW = canvasFront.width - 180; // 1356px
        const cardX = 90;

        // 1. DELIVERY SPEED (Emerald Highlight)
        const y1 = 600;
        const h1 = 235;
        ctxF.fillStyle = '#f0fdf4';
        ctxF.strokeStyle = '#4ade80';
        ctxF.lineWidth = 5;
        ctxF.beginPath();
        ctxF.roundRect(cardX, y1, cardW, h1, 28);
        ctxF.fill();
        ctxF.stroke();

        ctxF.fillStyle = '#15803d';
        ctxF.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'left';
        ctxF.fillText('DELIVERY SPEED', cardX + 44, y1 + 70);

        ctxF.fillStyle = '#15803d';
        ctxF.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'right';
        ctxF.fillText('RAPID TURNAROUND ⚡', cardX + cardW - 44, y1 + 70);

        ctxF.fillStyle = '#14532d';
        ctxF.font = '900 82px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'left';
        ctxF.fillText('3–10 Days Average', cardX + 44, y1 + 175);

        // 2. ACCESS MODEL (Brand Orange Highlight)
        const y2 = 875;
        const h2 = 235;
        ctxF.fillStyle = '#fff7ed';
        ctxF.strokeStyle = '#fb923c';
        ctxF.lineWidth = 5;
        ctxF.beginPath();
        ctxF.roundRect(cardX, y2, cardW, h2, 28);
        ctxF.fill();
        ctxF.stroke();

        ctxF.fillStyle = '#c2410c';
        ctxF.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'left';
        ctxF.fillText('ACCESS MODEL', cardX + 44, y2 + 70);

        ctxF.fillStyle = '#c2410c';
        ctxF.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'right';
        ctxF.fillText('ZERO MIDDLEMEN ★', cardX + cardW - 44, y2 + 70);

        ctxF.fillStyle = '#7c2d12';
        ctxF.font = '900 82px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'left';
        ctxF.fillText('1-on-1 Direct Developer', cardX + 44, y2 + 175);

        // 3. HEADQUARTERS & REACH
        const y3 = 1150;
        const h3 = 220;
        ctxF.fillStyle = '#f8fafc';
        ctxF.strokeStyle = '#cbd5e1';
        ctxF.lineWidth = 4;
        ctxF.beginPath();
        ctxF.roundRect(cardX, y3, cardW, h3, 28);
        ctxF.fill();
        ctxF.stroke();

        ctxF.fillStyle = '#475569';
        ctxF.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'left';
        ctxF.fillText('HEADQUARTERS', cardX + 44, y3 + 68);

        ctxF.fillStyle = '#0f172a';
        ctxF.font = '900 70px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.fillText('📍 Kerala, India (Global Remote)', cardX + 44, y3 + 162);

        // 4. COMMUNICATION
        const y4 = 1410;
        const h4 = 220;
        ctxF.fillStyle = '#f8fafc';
        ctxF.strokeStyle = '#cbd5e1';
        ctxF.lineWidth = 4;
        ctxF.beginPath();
        ctxF.roundRect(cardX, y4, cardW, h4, 28);
        ctxF.fill();
        ctxF.stroke();

        ctxF.fillStyle = '#475569';
        ctxF.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'left';
        ctxF.fillText('COMMUNICATION', cardX + 44, y4 + 68);

        ctxF.fillStyle = '#0f172a';
        ctxF.font = '900 70px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.fillText('💬 English, Malayalam', cardX + 44, y4 + 162);

        // Bottom Strip & Barcode
        ctxF.strokeStyle = '#e2e8f0';
        ctxF.lineWidth = 4;
        ctxF.beginPath();
        ctxF.moveTo(90, 1680);
        ctxF.lineTo(canvasFront.width - 90, 1680);
        ctxF.stroke();

        // Pass ID
        ctxF.fillStyle = '#334155';
        ctxF.font = '900 40px monospace';
        ctxF.textAlign = 'left';
        ctxF.fillText('ID: MW-2026-DEV', 90, 1750);

        ctxF.fillStyle = '#ea580c';
        ctxF.font = '900 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'right';
        ctxF.fillText('VERIFIED STUDIO PASS ★', canvasFront.width - 90, 1750);

        // Crisp Barcode
        const barcodeY = 1795;
        ctxF.fillStyle = '#0f172a';
        let bx = 90;
        const barWidths = [
          8, 16, 6, 22, 10, 30, 8, 18, 16, 8, 24, 10, 16, 8, 22, 34, 8, 16, 10, 22, 8, 24, 16, 10, 30, 8, 18, 16, 8, 24, 10, 16, 8, 22, 34, 8, 16, 10, 22, 8, 16, 8, 24
        ];
        for (let i = 0; i < barWidths.length && bx < canvasFront.width - 90; i++) {
          ctxF.fillRect(bx, barcodeY, barWidths[i], 130);
          bx += barWidths[i] + (i % 3 === 0 ? 14 : 8);
        }

        // Footer Tagline
        ctxF.fillStyle = '#475569';
        ctxF.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'center';
        ctxF.fillText('makewise.vercel.app • direct-to-developer', canvasFront.width / 2, 2040);

        setFrontImage(canvasFront.toDataURL('image/png'));
      }

      // 2. Generate Back Badge (Ultra-res 1536 x 2160)
      const canvasBack = document.createElement('canvas');
      canvasBack.width = 1536;
      canvasBack.height = 2160;
      const ctxB = canvasBack.getContext('2d');

      if (ctxB) {
        ctxB.fillStyle = '#090a0f';
        ctxB.fillRect(0, 0, canvasBack.width, canvasBack.height);

        ctxB.strokeStyle = '#334155';
        ctxB.lineWidth = 18;
        ctxB.strokeRect(18, 18, canvasBack.width - 36, canvasBack.height - 36);

        // Top decorative accent
        ctxB.fillStyle = '#ea580c';
        ctxB.fillRect(18, 18, canvasBack.width - 36, 16);

        // Center Big Logo
        const bLogoSize = 360;
        const bLogoX = (canvasBack.width - bLogoSize) / 2;
        const bLogoY = 300;

        const gradB = ctxB.createLinearGradient(bLogoX, bLogoY, bLogoX + bLogoSize, bLogoY + bLogoSize);
        gradB.addColorStop(0, '#ea580c');
        gradB.addColorStop(1, '#f59e0b');
        ctxB.fillStyle = gradB;
        ctxB.beginPath();
        ctxB.roundRect(bLogoX - 10, bLogoY - 10, bLogoSize + 20, bLogoSize + 20, 72);
        ctxB.fill();

        ctxB.save();
        ctxB.beginPath();
        ctxB.roundRect(bLogoX, bLogoY, bLogoSize, bLogoSize, 64);
        ctxB.clip();
        ctxB.drawImage(logoImg, bLogoX, bLogoY, bLogoSize, bLogoSize);
        ctxB.restore();

        // Branding
        ctxB.fillStyle = '#ffffff';
        ctxB.font = '900 110px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.textAlign = 'center';
        ctxB.fillText('MakeWise', canvasBack.width / 2, 780);

        ctxB.fillStyle = '#ea580c';
        ctxB.font = '800 50px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('DIRECT-TO-DEVELOPER DIGITAL STUDIO', canvasBack.width / 2, 865);

        // Contact Box
        const cBoxW = canvasBack.width - 180;
        const cBoxX = 90;
        const cBoxY = 945;
        const cBoxH = 490;
        ctxB.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctxB.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctxB.lineWidth = 4;
        ctxB.beginPath();
        ctxB.roundRect(cBoxX, cBoxY, cBoxW, cBoxH, 36);
        ctxB.fill();
        ctxB.stroke();

        ctxB.fillStyle = '#ffffff';
        ctxB.font = '900 66px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('💬 WhatsApp: +91 70120 80365', canvasBack.width / 2, 1090);

        ctxB.fillStyle = '#f1f5f9';
        ctxB.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('✉ makewisedigitalsolution@gmail.com', canvasBack.width / 2, 1215);

        ctxB.fillStyle = '#94a3b8';
        ctxB.font = '800 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('📍 Kerala, India • Worldwide Remote Delivery', canvasBack.width / 2, 1330);

        // Security / Ownership Badge
        const ownY = 1500;
        const ownH = 140;
        ctxB.fillStyle = 'rgba(234, 88, 12, 0.18)';
        ctxB.strokeStyle = '#ea580c';
        ctxB.lineWidth = 5;
        ctxB.beginPath();
        ctxB.roundRect(cBoxX, ownY, cBoxW, ownH, 70);
        ctxB.fill();
        ctxB.stroke();

        ctxB.fillStyle = '#ea580c';
        ctxB.font = '900 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('★ 100% SOURCE CODE OWNERSHIP ★', canvasBack.width / 2, ownY + 90);

        setBackImage(canvasBack.toDataURL('image/png'));
      }

      setReady(true);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '520px',
        }}
      >
        {ready && frontImage && (
          <Lanyard
            frontImage={frontImage}
            backImage={backImage}
            imageFit="contain"
            cardColor="#ffffff"
            finish="matte"
            orientation="portrait"
            size={0.95}
            strapLength={0.25}
            strapColor="#ea580c"
            strapWidth={0.65}
            metal="silver"
            interactive={true}
            breeze={0.35}
            gravity={1}
            elasticity={0.45}
            damping={0.5}
          />
        )}
      </div>
    </div>
  );
}
