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

// ── Swatch Accordion Services Data ────────────────────────────────────────────
const SWATCH_SERVICES: SwatchItem[] = [
  {
    title: "ATS Resume",
    description: "Keyword-optimized resumes designed to pass employer ATS filters and impress recruiters. Includes a targeted cover letter and editable DOCX plus clean PDF files.",
    tags: "ATS-tested · 24–48h delivery · From ₹250",
    color: "#D97736",
    focus: 50,
    button: "Order ATS Resume",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20order%20an%20ATS%20resume!",
    newTab: true,
    image: {
      src: "/images/services/01-resume.jpg",
      alt: "ATS Resume and Executive Cover Letter Design",
    },
  },
  {
    title: "Portfolio Website",
    description: "Fast, polished showcase websites for software engineers, designers, and creatives, with interactive project demos and GitHub tech badges.",
    tags: "Interactive demos · From ₹1,500",
    color: "#8B5CF6",
    focus: 50,
    button: "Get a Quote",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Portfolio%20Website!",
    newTab: true,
    image: {
      src: "/images/services/02-portfolio.jpg",
      alt: "Personal and Developer Portfolio Showcases",
    },
  },
  {
    title: "Web Application",
    description: "Scalable full-stack SaaS MVPs, client portals, custom dashboards, and booking tools built with React, Next.js, and Supabase. Full source code handoff.",
    tags: "Next.js and Supabase · Auth and roles · Custom APIs · From ₹5,000",
    color: "#3B82F6",
    focus: 50,
    button: "Get a Quote",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Web%20Application!",
    newTab: true,
    image: {
      src: "/images/services/03-webapp.jpg",
      alt: "Custom Web Applications & SaaS Dashboards",
    },
  },
  {
    title: "POS and Billing Software",
    description: "Production-ready point-of-sale billing and inventory software, custom-built for retail shops, restaurants, and pharmacies.",
    tags: "Offline-capable · GST invoices · From ₹8,000",
    color: "#EF4444",
    focus: 50,
    button: "Get a Quote",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20POS%20and%20Billing%20Software!",
    newTab: true,
    image: {
      src: "/images/services/04-pos.jpg",
      alt: "POS and Billing Software with Offline Mode",
    },
  },
  {
    title: "Mobile Web App",
    description: "Progressive web apps (PWAs) with a native-app feel, offline support, smooth touch gestures, and instant installation with no app store needed.",
    tags: "Works offline · Mobile first · Touch optimized · From ₹4,000",
    color: "#6366F1",
    focus: 50,
    button: "Get a Quote",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Mobile%20Web%20App!",
    newTab: true,
    image: {
      src: "/images/services/05-mobile.jpg",
      alt: "Mobile Web Applications and PWAs",
    },
  },
  {
    title: "Business Website",
    description: "Lead-generating, SEO-optimized multi-page websites and online stores that build trust, rank on Google, and turn visitors into customers.",
    tags: "Technical SEO · WhatsApp leads · Core Web Vitals · From ₹3,000",
    color: "#10B981",
    focus: 50,
    button: "Get a Quote",
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
                <Heading as="h2" variant="display-strong-xs">Services and Digital Solutions</Heading>
              </Column>
              <Button
                href="/services"
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

        <Line />

        {/* ── WHY MAKEWISE SECTION ── */}
        <RevealFx translateY="16" delay={200} fillWidth>
          <Column fillWidth gap="24">
            <Column gap="4">
              <Text variant="label-strong-s" onBackground="brand-medium">THE MAKEWISE ADVANTAGE</Text>
              <Heading as="h2" variant="display-strong-xs">Why choose MakeWise</Heading>
            </Column>

            <div className={styles.featureGrid}>
              {[
                {
                  icon: "person",
                  title: "No middlemen",
                  tag: "Direct developer access",
                  desc: "Direct developer access. You talk to the person writing your code. No account managers, no overhead.",
                },
                {
                  icon: "check",
                  title: "Always upfront",
                  tag: "Transparent pricing",
                  desc: "Transparent pricing. Every service has a published starting price, and the scope is agreed before work begins.",
                },
                {
                  icon: "time",
                  title: "3–10 day delivery",
                  tag: "Fast turnaround",
                  desc: "Fast turnaround. Most projects ship in 3–10 days and resumes in 24–48 hours.",
                },
                {
                  icon: "download",
                  title: "100% yours",
                  tag: "Full source code handoff",
                  desc: "Full source code handoff. Source files, deploy configs, and credentials are handed over. No vendor lock-in.",
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

