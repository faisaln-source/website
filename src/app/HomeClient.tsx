"use client";

import {
  Heading,
  Text,
  Button,
  RevealFx,
  Column,
  Row,
  Line,
  Icon,
} from "@once-ui-system/core";
import { useState } from "react";
import styles from "./home.module.css";
import ContactWithGlobe from "@/components/ui/contact-with-globe";
import SwatchAccordion, { SwatchItem } from "@/components/ui/swatch-accordion";
import { HeroSection } from "@/components";

const MARQUEE_ITEMS = [
  "ATS Resumes", "Portfolio Sites", "Business Websites",
  "Web Applications", "POS Software", "React · Next.js",
  "Supabase · Node.js", "Fast Delivery", "Transparent Pricing",
  "Source Handoff", "Direct Collaboration", "GST Invoicing",
];

// ── Swatch Accordion Services Data ────────────────────────────────────────────
const SWATCH_SERVICES: SwatchItem[] = [
  {
    title: "ATS Resume",
    description: "Keyword-optimized resumes engineered to pass employer ATS filters and impress recruiters. Includes targeted executive cover letter and editable DOCX + clean PDF.",
    tags: "Pass Guarantee, 24–48h Delivery, From ₹250",
    color: "#D97736",
    focus: 50,
    button: "Order ATS Resume",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20an%20ATS%20resume!",
    newTab: true,
    image: {
      src: "/images/services/01-resume.jpg",
      alt: "Resume Websites and ATS Design",
    },
  },
  {
    title: "Portfolio Site",
    description: "Stunning, high-speed showcase websites for software engineers, designers, and creatives with interactive project demos and GitHub tech badges.",
    tags: "Interactive Demos, From ₹1500",
    color: "#8B5CF6",
    focus: 50,
    button: "Build Portfolio",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20a%20portfolio%20site!",
    newTab: true,
    image: {
      src: "/images/services/02-portfolio.jpg",
      alt: "Personal and Developer Portfolio Showcases",
    },
  },
  {
    title: "Web App",
    description: "Scalable full-stack SaaS MVPs, client portals, custom dashboards, and booking tools built with React, Next.js, and Supabase. 100% full source handoff.",
    tags: "Next.js & Supabase, Auth & Roles, Custom APIs, From ₹5000",
    color: "#3B82F6",
    focus: 50,
    button: "Discuss Web App",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20discuss%20a%20web%20app!",
    newTab: true,
    image: {
      src: "/images/services/03-webapp.jpg",
      alt: "Custom Web Applications & SaaS Dashboards",
    },
  },
  {
    title: "POS Software",
    description: "Production-ready Point-of-Sale billing and inventory software custom-built for retail shops, restaurants, and cloud kitchens.",
    tags: "From ₹8000",
    color: "#EF4444",
    focus: 50,
    button: "Get POS System",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20a%20POS%20system!",
    newTab: true,
    image: {
      src: "/images/services/04-pos.jpg",
      alt: "Point of Sale (POS) Billing & Inventory Systems",
    },
  },
  {
    title: "Mobile Web App",
    description: "Progressive mobile web apps (PWAs) engineered with native-like fluidity, offline caching, responsive touch gestures, and instant app store-less installation.",
    tags: "PWA Offline, Mobile First, Touch Optimized, From ₹4000",
    color: "#6366F1",
    focus: 50,
    button: "Build Mobile App",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20discuss%20a%20mobile%20web%20app!",
    newTab: true,
    image: {
      src: "/images/services/05-mobile.jpg",
      alt: "Mobile Web Applications and PWAs",
    },
  },
  {
    title: "Business Website",
    description: "Lead-generating, SEO-optimized multi-page websites and online stores built to establish authority, rank on Google, and convert visitors into paying clients.",
    tags: "Technical SEO, WhatsApp Leads, Core Web Vitals, From ₹3000",
    color: "#10B981",
    focus: 50,
    button: "Get Business Website",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%20have%20a%20business%20website%20project!",
    newTab: true,
    image: {
      src: "/images/services/06-website.jpg",
      alt: "High-Converting Business Websites & E-Commerce",
    },
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomeClient() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <Column fillWidth maxWidth="xl" gap="0" paddingY="0" horizontal="center" style={{ maxWidth: "min(1480px, 100%)" }}>

      {/* ── HERO CURTAIN SECTION ── */}
      <HeroSection />

      {/* ── STAGE / REVEALED WEBSITE CONTENT ── */}
      <div className={styles.stageContainer} id="services">

        {/* ── SERVICES SWATCH ACCORDION ── */}
        <RevealFx translateY="16" delay={200} fillWidth>
          <Column fillWidth gap="16">
            <Row fillWidth horizontal="between" vertical="center" wrap gap="16">
              <Column gap="2">
                <Text variant="label-strong-s" onBackground="brand-medium">WHAT WE BUILD</Text>
                <Heading as="h2" variant="display-strong-xs">Services &amp; Digital Solutions</Heading>
              </Column>
              <Button
                href="/work"
                variant="tertiary"
                size="s"
                arrowIcon
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }
                }}
              >
                See all services
              </Button>
            </Row>

            <SwatchAccordion
              items={SWATCH_SERVICES}
              openItem={1}
              trigger="hover"
              scrim={true}
              radius="20px"
              textColor="#FFFFFF"
              buttonColor="#FFFFFF"
              buttonTextColor="#141414"
              className={styles.accordionContainer}
              style={{ width: "100%", height: "520px", minHeight: "480px" }}
            />
          </Column>
        </RevealFx>

        {/* ── MARQUEE ── */}
        <div className={styles.marqueeOuter}>
          <div className={styles.marqueeTrack}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <span key={i} className={styles.marqueeItem}>
                {t}
                <span className={styles.marqueeSep}>✦</span>
              </span>
            ))}
          </div>
        </div>

        <Line />

        {/* ── FEATURE CARDS ── */}
        <RevealFx translateY="16" delay={200} fillWidth>
          <Column fillWidth gap="24">
            <Column gap="4">
              <Text variant="label-strong-s" onBackground="brand-medium">WHY MAKEWISE</Text>
              <Heading as="h2" variant="display-strong-xs">The difference is clear</Heading>
            </Column>

            <div className={styles.featureGrid}>
              {[
                {
                  icon: "person",
                  title: "Direct developer access",
                  tag: "No middlemen",
                  desc: "You talk directly to the person writing your code — no account managers, no overhead, no surprises.",
                },
                {
                  icon: "check",
                  title: "Transparent pricing",
                  tag: "Always upfront",
                  desc: "Every service has a published starting price. No hidden fees, no scope creep — you see the cost before we start.",
                },
                {
                  icon: "time",
                  title: "Fast turnaround",
                  tag: "3–10 day delivery",
                  desc: "Most projects ship in 3–10 days. Resumes within 24 hours. We respect your deadlines.",
                },
                {
                  icon: "download",
                  title: "Full source handoff",
                  tag: "100% yours",
                  desc: "All source files, deploy configs, and credentials handed over. No vendor lock-in, ever.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`${styles.featureCard} ${hoveredFeature === item.title ? styles.featureCardHovered : ""}`}
                  onMouseEnter={() => setHoveredFeature(item.title)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={styles.featureCardInner}>
                    <Row gap="12" vertical="center" marginBottom="16">
                      <div className={styles.featureIconBox}>
                        <Icon name={item.icon as any} size="s" onBackground="brand-weak" />
                      </div>
                      <span className={styles.featureTag}>{item.tag}</span>
                    </Row>
                    <Text variant="label-strong-l" as="p" marginBottom="8">{item.title}</Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">{item.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Column>
        </RevealFx>

        <Line />

        {/* ── CONTACT WITH GLOBE ── */}
        <section
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          <ContactWithGlobe />
        </section>
      </div>

    </Column>
  );
}

