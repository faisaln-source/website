"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { RevealFx } from "@once-ui-system/core";
import styles from "./HeroSection.module.css";

const ROTATING_PHRASES = [
  "built to win clients.",
  "engineered for speed & scale.",
  "crafted with direct collaboration.",
  "delivered with agency quality.",
];

export function HeroSection() {
  const pathname = usePathname();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isRaised, setIsRaised] = useState(false);
  const curtainRef = useRef<HTMLElement>(null);

  // Rotate tagline phrase
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Whenever navigating to Home page, ALWAYS show the Hero curtain at the top
  useEffect(() => {
    if (pathname === "/") {
      if (typeof window !== "undefined") {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      setIsRaised(false);
    }
  }, [pathname]);

  // Listen for navbar Home click reset events
  useEffect(() => {
    const handleReset = () => {
      setIsRaised(false);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    window.addEventListener("makewise:reset-hero", handleReset);
    return () => window.removeEventListener("makewise:reset-hero", handleReset);
  }, []);

  const raiseCurtain = useCallback(() => {
    setIsRaised(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const lowerCurtain = useCallback(() => {
    setIsRaised(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Handle subtle interactive cursor tracking for background spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!curtainRef.current) return;
    const rect = curtainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    curtainRef.current.style.setProperty("--mouse-x", `${x.toFixed(2)}%`);
    curtainRef.current.style.setProperty("--mouse-y", `${y.toFixed(2)}%`);
  }, []);

  // Manage body scroll overflow and lock scroll while raising curtain
  useEffect(() => {
    if (!isRaised) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      // Ensure page is pinned at (0, 0) for 450ms while the curtain animates up
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 450);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [isRaised]);

  // Detect scroll intent while the curtain is down
  useEffect(() => {
    if (isRaised) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 5) {
        if (e.cancelable) e.preventDefault();
        raiseCurtain();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 20) {
        if (e.cancelable) e.preventDefault();
        raiseCurtain();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        raiseCurtain();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRaised, raiseCurtain]);

  // While curtain is raised, allow lowering if user scrolls up from the absolute top
  useEffect(() => {
    if (!isRaised) return;

    const handleWheelUp = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < -25) {
        setIsRaised(false);
      }
    };

    window.addEventListener("wheel", handleWheelUp, { passive: true });
    return () => window.removeEventListener("wheel", handleWheelUp);
  }, [isRaised]);

  return (
    <>
      {/* ── TOP LAYER: FIXED HERO CURTAIN ── */}
      <aside
        ref={curtainRef}
        onMouseMove={handleMouseMove}
        className={`${styles.curtainTopLayer} ${isRaised ? styles.curtainRaised : ""}`}
        aria-label="Hero Curtain Overlay"
        aria-hidden={isRaised}
      >
        {/* ── RICH ATMOSPHERIC BACKGROUND ── */}
        <div className={styles.bgLayer} aria-hidden="true">
          {/* 0. Cinematic Ambient Artwork & Framing Ribbon Curves */}
          <div className={styles.bgArtwork} />
          <div className={styles.bgCenterGradient} />

          {/* 1. Geometric Blueprint Grid */}
          <div className={styles.gridPattern} />

          {/* 2. Fluid Mesh Gradient Orbs */}
          <div className={`${styles.meshOrb} ${styles.meshOrb1}`} />
          <div className={`${styles.meshOrb} ${styles.meshOrb2}`} />
          <div className={`${styles.meshOrb} ${styles.meshOrb3}`} />
          <div className={`${styles.meshOrb} ${styles.meshOrb4}`} />

          {/* 3. Interactive Cursor Spotlight */}
          <div className={styles.cursorSpotlight} />

          {/* 4. Cinematic Vignette */}
          <div className={styles.curtainVignette} />
        </div>

        {/* ── Main Hero Content ── */}
        <div className={styles.heroContent}>
          {/* Status Pill Badge */}
          <RevealFx translateY="8" delay={100}>
            <div className={styles.statusBadge}>
              <span className={styles.statusIndicator} aria-hidden="true">
                <span className={styles.statusPing} />
                <span className={styles.statusDot} />
              </span>
              <span>Open for new projects &bull; Direct developer access</span>
            </div>
          </RevealFx>

          {/* Main Heading with Subtle Rotating Text */}
          <RevealFx translateY="12" delay={200}>
            <h1 className={styles.heroHeading}>
              <span className={styles.heroHeadingPrefix}>
                High-impact digital products
              </span>
              <span className={styles.rotatorContainer}>
                <span key={phraseIndex} className={styles.rotatingPhrase}>
                  {ROTATING_PHRASES[phraseIndex]}
                </span>
              </span>
            </h1>
          </RevealFx>

          {/* Persuasive Elegant Subtitle */}
          <RevealFx translateY="12" delay={300}>
            <p className={styles.heroSubtitle}>
              From ATS-optimized portfolios and high-converting business websites
              to scalable web applications and POS systems. Work directly with
              the builder &mdash; transparent pricing, rapid turnaround, and 100%
              source code ownership.
            </p>
          </RevealFx>

          {/* Trust Points Minimal Strip */}
          <RevealFx translateY="16" delay={400} fillWidth>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%" }}>
              <div className={styles.trustStrip}>
                <div className={styles.trustPill}>
                  <span className={styles.trustDot}>✦</span>
                  <span>100% Source Code Handoff</span>
                </div>
                <div className={styles.trustPill}>
                  <span className={styles.trustDot}>⚡</span>
                  <span>3–10 Day Fast Delivery</span>
                </div>
                <div className={styles.trustPill}>
                  <span className={styles.trustDot}>✓</span>
                  <span>Transparent Pricing from ₹250</span>
                </div>
                <div className={styles.trustPill}>
                  <span className={styles.trustDot}>★</span>
                  <span>Zero Middlemen Markup</span>
                </div>
              </div>

              <button
                type="button"
                onClick={raiseCurtain}
                className={styles.heroExploreMobile}
                aria-label="Explore Services & Digital Solutions"
              >
                <span>Explore Services &amp; Work</span>
                <span className={styles.heroExploreArrow}>↓</span>
              </button>
            </div>
          </RevealFx>
        </div>

        {/* ── Glowing Golden Hem Line (Click or scroll to raise curtain) ── */}
        <div
          onClick={raiseCurtain}
          className={styles.curtainHemLine}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") raiseCurtain();
          }}
          aria-label="Raise curtain to view website"
          title="Click or scroll to view website"
        />
      </aside>

      {/* ── Return-to-Hero Floating Pill (visible when curtain is raised) ── */}
      <button
        type="button"
        onClick={lowerCurtain}
        className={`${styles.curtainReturnBtn} ${isRaised ? styles.curtainReturnBtnVisible : ""}`}
        aria-label="Lower curtain to view hero"
        title="View Hero Intro"
      >
        <span>✦</span>
        <span>Hero Intro</span>
      </button>
    </>
  );
}

export default HeroSection;
