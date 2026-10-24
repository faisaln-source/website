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
      // 1. Generate Front Badge
      const canvasFront = document.createElement('canvas');
      canvasFront.width = 1024;
      canvasFront.height = 1440;
      const ctxF = canvasFront.getContext('2d');

      if (ctxF) {
        // Background - pristine warm studio white
        ctxF.fillStyle = '#faf8f5';
        ctxF.fillRect(0, 0, canvasFront.width, canvasFront.height);

        // Subtle outer border
        ctxF.strokeStyle = '#e7e5e4';
        ctxF.lineWidth = 14;
        ctxF.strokeRect(16, 16, canvasFront.width - 32, canvasFront.height - 32);

        // Top decorative lanyard slot guide
        ctxF.fillStyle = '#f5f5f4';
        ctxF.beginPath();
        ctxF.roundRect(canvasFront.width / 2 - 130, 60, 260, 48, 24);
        ctxF.fill();

        // Top Eyebrow Tag
        ctxF.fillStyle = '#78716c';
        ctxF.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'center';
        ctxF.fillText('MAKEWISE STUDIO IDENTIFIER', canvasFront.width / 2, 175);

        // Logo & Title block
        const logoSize = 140;
        const logoX = 90;
        const logoY = 225;

        // Gradient border for logo
        const grad = ctxF.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
        grad.addColorStop(0, '#ea580c');
        grad.addColorStop(1, '#eab308');
        ctxF.fillStyle = grad;
        ctxF.beginPath();
        ctxF.roundRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10, 32);
        ctxF.fill();

        // Draw logo image
        ctxF.save();
        ctxF.beginPath();
        ctxF.roundRect(logoX, logoY, logoSize, logoSize, 28);
        ctxF.clip();
        ctxF.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        ctxF.restore();

        // Studio Name & Role
        ctxF.textAlign = 'left';
        ctxF.fillStyle = '#1c1917';
        ctxF.font = '800 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.fillText('MakeWise', logoX + logoSize + 36, logoY + 68);

        ctxF.fillStyle = '#ea580c';
        ctxF.font = '600 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.fillText('Digital Products & Web Solutions', logoX + logoSize + 36, logoY + 118);

        // Divider Line
        ctxF.strokeStyle = '#e7e5e4';
        ctxF.lineWidth = 3;
        ctxF.beginPath();
        ctxF.moveTo(90, 420);
        ctxF.lineTo(canvasFront.width - 90, 420);
        ctxF.stroke();

        // Key-Value Rows (exact from user's card)
        const items = [
          { label: 'Headquarters', value: 'Kerala, India (Global Remote)', color: '#1c1917' },
          { label: 'Communication', value: 'English, Malayalam', color: '#1c1917' },
          { label: 'Delivery Speed', value: '3–10 Days Average', color: '#10b981' },
          { label: 'Access Model', value: '1-on-1 Direct Developer', color: '#ea580c' },
        ];

        let currentY = 515;
        items.forEach((item) => {
          ctxF.fillStyle = '#78716c';
          ctxF.font = '500 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctxF.textAlign = 'left';
          ctxF.fillText(item.label, 90, currentY);

          ctxF.fillStyle = item.color;
          ctxF.font = '700 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctxF.textAlign = 'right';
          ctxF.fillText(item.value, canvasFront.width - 90, currentY);

          currentY += 105;
        });

        // Second Divider
        ctxF.strokeStyle = '#e7e5e4';
        ctxF.lineWidth = 2;
        ctxF.beginPath();
        ctxF.moveTo(90, currentY - 10);
        ctxF.lineTo(canvasFront.width - 90, currentY - 10);
        ctxF.stroke();

        // Pass ID
        ctxF.fillStyle = '#a8a29e';
        ctxF.font = '600 24px monospace';
        ctxF.textAlign = 'left';
        ctxF.fillText('PASS ID: MW-2026-DEV', 90, 1030);

        ctxF.textAlign = 'right';
        ctxF.fillText('VERIFIED STUDIO PASS', canvasFront.width - 90, 1030);

        // Decorative barcode
        const barcodeY = 1080;
        ctxF.fillStyle = '#1c1917';
        let bx = 90;
        const barWidths = [4, 8, 3, 12, 6, 16, 4, 10, 8, 4, 14, 6, 8, 4, 12, 18, 4, 8, 6, 12, 4, 14, 8, 6, 16, 4, 10, 8, 4, 14, 6, 8, 4, 12, 18, 4, 8, 6, 12, 4, 8, 4, 12];
        for (let i = 0; i < barWidths.length && bx < canvasFront.width - 90; i++) {
          ctxF.fillRect(bx, barcodeY, barWidths[i], 85);
          bx += barWidths[i] + (i % 3 === 0 ? 8 : 4);
        }

        // Footer Tagline
        ctxF.fillStyle = '#78716c';
        ctxF.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxF.textAlign = 'center';
        ctxF.fillText('makewise.vercel.app • direct-to-developer', canvasFront.width / 2, 1240);

        setFrontImage(canvasFront.toDataURL('image/png'));
      }

      // 2. Generate Back Badge
      const canvasBack = document.createElement('canvas');
      canvasBack.width = 1024;
      canvasBack.height = 1440;
      const ctxB = canvasBack.getContext('2d');

      if (ctxB) {
        ctxB.fillStyle = '#141416';
        ctxB.fillRect(0, 0, canvasBack.width, canvasBack.height);

        ctxB.strokeStyle = '#292524';
        ctxB.lineWidth = 14;
        ctxB.strokeRect(16, 16, canvasBack.width - 32, canvasBack.height - 32);

        // Center Logo
        const bLogoSize = 220;
        const bLogoX = (canvasBack.width - bLogoSize) / 2;
        const bLogoY = 300;

        ctxB.save();
        ctxB.beginPath();
        ctxB.roundRect(bLogoX, bLogoY, bLogoSize, bLogoSize, 44);
        ctxB.clip();
        ctxB.drawImage(logoImg, bLogoX, bLogoY, bLogoSize, bLogoSize);
        ctxB.restore();

        // Branding
        ctxB.fillStyle = '#ffffff';
        ctxB.font = '800 60px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.textAlign = 'center';
        ctxB.fillText('MakeWise', canvasBack.width / 2, 595);

        ctxB.fillStyle = '#ea580c';
        ctxB.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('DIRECT-TO-DEVELOPER DIGITAL STUDIO', canvasBack.width / 2, 650);

        // Contact info
        ctxB.fillStyle = '#d6d3d1';
        ctxB.font = '500 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('WhatsApp: +91 70120 80365', canvasBack.width / 2, 760);
        ctxB.fillText('Email: makewisedigitalsolution@gmail.com', canvasBack.width / 2, 820);
        ctxB.fillText('Kerala, India • Worldwide Delivery', canvasBack.width / 2, 880);

        // Security / Ownership Badge
        ctxB.strokeStyle = '#ea580c';
        ctxB.lineWidth = 3;
        ctxB.beginPath();
        ctxB.roundRect(canvasBack.width / 2 - 220, 960, 440, 68, 34);
        ctxB.stroke();

        ctxB.fillStyle = '#ea580c';
        ctxB.font = '700 24px monospace';
        ctxB.fillText('★ 100% SOURCE CODE OWNERSHIP ★', canvasBack.width / 2, 1004);

        ctxB.fillStyle = '#78716c';
        ctxB.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctxB.fillText('Click or drag badge to swing and flip', canvasBack.width / 2, 1140);

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
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '480px',
        }}
      >
        {ready && frontImage && (
          <Lanyard
            frontImage={frontImage}
            backImage={backImage}
            imageFit="contain"
            cardColor="#faf8f5"
            finish="glossy"
            orientation="portrait"
            size={0.65}
            strapLength={0.42}
            strapColor="#ea580c"
            strapWidth={0.65}
            metal="silver"
            interactive={true}
            breeze={0.4}
            gravity={1}
            elasticity={0.45}
            damping={0.5}
          />
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontFamily: 'var(--font-label)',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: 'var(--neutral-on-background-weak)',
          pointerEvents: 'none',
        }}
      >
        <span>✦</span>
        <span>Drag or click to swing & flip</span>
      </div>
    </div>
  );
}
