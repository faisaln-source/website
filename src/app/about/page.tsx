import React from "react";
import Link from "next/link";
import {
  Avatar,
  Icon,
  Meta,
  Schema,
  RevealFx,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import styles from "./About.module.css";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

const STATS = [
  {
    number: "3–10 Days",
    label: "Fast Delivery",
    subtext: "Most sites shipped within 3–10 days; resumes in 24 hrs.",
  },
  {
    number: "100%",
    label: "Source Ownership",
    subtext: "Full GitHub repo, deploy configs, and credentials handed over.",
  },
  {
    number: "₹250+",
    label: "Transparent Pricing",
    subtext: "Published starting prices with zero hidden fees or surprise costs.",
  },
  {
    number: "0",
    label: "Middlemen Markup",
    subtext: "Collaborate directly with the software engineer writing your code.",
  },
];

const FEATURES = [
  {
    iconName: "person" as const,
    badge: "Zero Friction",
    title: "Direct Developer Access",
    desc: "You talk directly to the software engineer writing your code — no account managers, no non-technical middle layers, and no miscommunication.",
    checklist: [
      "Direct WhatsApp, Email, & Phone communication",
      "Instant technical answers and scoping without delay",
      "Real-time feedback and direct revision iterations",
    ],
  },
  {
    iconName: "check" as const,
    badge: "100% Upfront",
    title: "Transparent, Honest Pricing",
    desc: "Every project tier has published starting prices starting from ₹250. You approve the exact scope, timeline, and deliverables before kick-off.",
    checklist: [
      "Published starter rates for every digital service",
      "Zero monthly retainer obligations or hidden fees",
      "Itemized project milestones and clear contracts",
    ],
  },
  {
    iconName: "rocket" as const,
    badge: "High Velocity",
    title: "Rapid Turnaround",
    desc: "By eliminating bureaucratic agency layers, we move from initial conversation to live production deployment in days rather than months.",
    checklist: [
      "ATS Résumés delivered within 24–48 hours",
      "Portfolio & business websites live in 3–10 days",
      "Strict deadline adherence with proactive updates",
    ],
  },
  {
    iconName: "code" as const,
    badge: "No Lock-In",
    title: "Full Source Code Handoff",
    desc: "You own everything we build. All GitHub repositories, production environment variables, and deployment credentials are fully transferred to you.",
    checklist: [
      "100% complete source code and design copyright",
      "Vercel, Netlify, or custom cloud deploy handoff",
      "Clean, modular, and maintainable documentation",
    ],
  },
];

const TECH_CATEGORIES = [
  {
    title: "Frontend Architecture",
    desc: "Speed, responsiveness, and pixel-perfect design tuned for maximum Core Web Vitals.",
    chips: [
      { name: "React 19", icon: "react" as const },
      { name: "Next.js 16", icon: "nextjs" as const },
      { name: "TypeScript", icon: "typescript" as const },
      { name: "Vanilla CSS", icon: "code" as const },
      { name: "Figma UI/UX", icon: "figma" as const },
    ],
  },
  {
    title: "Backend & Cloud",
    desc: "Reliable databases, real-time sync, and scalable serverless API integrations.",
    chips: [
      { name: "Node.js", icon: "node" as const },
      { name: "Supabase", icon: "supabase" as const },
      { name: "PostgreSQL", icon: "code" as const },
      { name: "Serverless APIs", icon: "rocket" as const },
      { name: "JavaScript", icon: "javascript" as const },
    ],
  },
  {
    title: "Specialized Systems",
    desc: "Custom business tools, automated keyword parsers, and offline retail workflows.",
    chips: [
      { name: "Offline POS Billing", icon: "grid" as const },
      { name: "GST Invoice Engine", icon: "document" as const },
      { name: "Barcode Scanning", icon: "check" as const },
      { name: "ATS Optimization", icon: "document" as const },
      { name: "Vercel Deploy", icon: "globe" as const },
    ],
  },
];

export default function About() {
  const whatsappLink =
    about.calendar.link ||
    "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20discuss%20a%20project.";
  const emailLink = "mailto:makewisedigitalsolution@gmail.com";

  return (
    <main className={styles.pageContainer}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* ── Ambient Background Lighting ── */}
      <div className={styles.ambientBackground} aria-hidden="true">
        <div className={styles.topGlowOrb} />
        <div className={styles.gridPattern} />
      </div>

      <div className={styles.contentWrapper}>
        {/* ── 1. HERO HEADER ── */}
        <section className={styles.heroHeader} aria-label="About MakeWise">
          <RevealFx translateY="8" delay={100}>
            <div className={styles.statusPill}>
              <span className={styles.statusDotPulse} aria-hidden="true">
                <span className={styles.statusDotWave} />
                <span className={styles.statusDotCore} />
              </span>
              <span>Direct-to-Developer Digital Studio</span>
            </div>
          </RevealFx>

          <RevealFx translateY="12" delay={200}>
            <h1 className={styles.mainHeading}>
              Building high-impact digital products{" "}
              <span className={styles.gradientText}>without agency bloat.</span>
            </h1>
          </RevealFx>

          <RevealFx translateY="12" delay={300}>
            <p className={styles.leadSubtitle}>
              MakeWise was founded to solve a universal client frustration: bloated
              invoices, endless delay, and dealing with non-technical middle managers.
              Here, you collaborate directly with the builder — no account managers,
              no markup, no mystery.
            </p>
          </RevealFx>

          {/* Quick Actions & Meta */}
          <RevealFx translateY="16" delay={400}>
            <div className={styles.heroActions}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
                aria-label="Chat on WhatsApp"
              >
                <Icon name="whatsapp" size="s" />
                <span>Schedule a Call via WhatsApp</span>
              </a>

              <a
                href={emailLink}
                className={styles.btnSecondary}
                aria-label="Direct Email"
              >
                <Icon name="email" size="s" />
                <span>Direct Email</span>
              </a>
            </div>

            <div className={styles.metaInfoPills}>
              <div className={styles.metaPillItem}>
                <Icon name="globe" size="xs" onBackground="brand-weak" />
                <span>Kerala, India &bull; Global Remote Delivery</span>
              </div>
              <div className={styles.metaPillItem}>
                <span>Languages: English, Malayalam</span>
              </div>
              <div className={styles.metaPillItem}>
                <span style={{ color: "#10b981" }}>✦</span>
                <span>Direct Developer Chat Anytime</span>
              </div>
            </div>
          </RevealFx>
        </section>

        {/* ── 2. STATS & CREDIBILITY STRIP ── */}
        <RevealFx translateY="16" delay={200}>
          <section className={styles.statsGrid} aria-label="Key Performance Metrics">
            {STATS.map((stat, idx) => (
              <div key={idx} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statSubtext}>{stat.subtext}</div>
              </div>
            ))}
          </section>
        </RevealFx>

        {/* ── 3. STORY & THE ANTI-AGENCY MODEL (BENTO DUAL) ── */}
        <RevealFx translateY="16" delay={200}>
          <section className={styles.bentoDualSection} aria-label="Our Philosophy">
            {/* Left Card: Who We Are */}
            <div className={styles.bentoCard}>
              <div className={styles.cardEyebrow}>
                <span>✦</span>
                <span>The MakeWise Philosophy</span>
              </div>
              <h2 className={styles.cardTitle}>
                Craftsmanship over bureaucracy.
              </h2>
              <p className={styles.cardParagraph}>
                Traditional software agencies spend up to 60% of client budgets on account
                executives, sales teams, and project coordinators who merely translate
                requests back and forth.
              </p>
              <p className={styles.cardParagraph}>
                MakeWise operates on a leaner, radically transparent model: you speak
                directly with the developer writing the code. We specialize in
                ATS-friendly résumés, modern portfolio sites, high-converting business
                platforms, custom web apps, and offline-first POS systems.
              </p>
            </div>

            {/* Right Card: Comparison Box */}
            <div className={styles.bentoCard}>
              <div className={styles.cardEyebrow}>
                <span>⚡</span>
                <span>The Difference in Practice</span>
              </div>
              <h2 className={styles.cardTitle}>
                Traditional Agency vs. MakeWise
              </h2>
              <div className={styles.comparisonBox}>
                <div className={`${styles.comparisonRow} ${styles.comparisonBad}`}>
                  <span className={styles.comparisonIconBad}>✕</span>
                  <span>
                    <strong>Traditional Agencies:</strong> 3–5x markup for middle
                    managers, slow turnaround times, and opaque hourly billing.
                  </span>
                </div>
                <div className={`${styles.comparisonRow} ${styles.comparisonGood}`}>
                  <span className={styles.comparisonIconGood}>✓</span>
                  <span>
                    <strong>The MakeWise Model:</strong> 1-on-1 direct developer access,
                    fixed transparent pricing from ₹250, and 3–10 day delivery.
                  </span>
                </div>
                <div className={`${styles.comparisonRow} ${styles.comparisonBad}`}>
                  <span className={styles.comparisonIconBad}>✕</span>
                  <span>
                    <strong>Vendor Lock-in:</strong> Proprietary builders or retained
                    codebases that hold your website hostage.
                  </span>
                </div>
                <div className={`${styles.comparisonRow} ${styles.comparisonGood}`}>
                  <span className={styles.comparisonIconGood}>✓</span>
                  <span>
                    <strong>100% Freedom:</strong> Complete GitHub repo, deploy config,
                    and production credentials handed over upon launch.
                  </span>
                </div>
              </div>
            </div>
          </section>
        </RevealFx>

        {/* ── 4. WHY MAKEWISE (4-FEATURE BENTO) ── */}
        <section aria-label="Why MakeWise Features">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Core Advantages</span>
            <h2 className={styles.sectionTitle}>
              Engineered for Speed, Clarity, & Control
            </h2>
            <p className={styles.sectionSubtitle}>
              Every project is handled with precision engineering and direct personal
              accountability.
            </p>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <RevealFx translateY="16" delay={200}>
              <div className={styles.featuresGrid}>
                {FEATURES.map((feature, idx) => (
                  <div key={idx} className={styles.featureCard}>
                    <div className={styles.featureHeader}>
                      <div className={styles.featureIconBadge}>
                        <Icon name={feature.iconName} size="m" />
                      </div>
                      <span className={styles.featurePill}>{feature.badge}</span>
                    </div>

                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDesc}>{feature.desc}</p>

                    <div className={styles.checklist}>
                      {feature.checklist.map((item, itemIdx) => (
                        <div key={itemIdx} className={styles.checklistItem}>
                          <span className={styles.checkBullet}>✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </RevealFx>
          </div>
        </section>

        {/* ── 5. TECH STACK & ARCHITECTURE ── */}
        <section aria-label="Technology Stack">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Architecture</span>
            <h2 className={styles.sectionTitle}>
              Modern Stack, Production-Grade Reliability
            </h2>
            <p className={styles.sectionSubtitle}>
              We use modern, battle-tested technologies to guarantee fast loading
              times, zero bloat, and enterprise security.
            </p>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <RevealFx translateY="16" delay={200}>
              <div className={styles.techGrid}>
                {TECH_CATEGORIES.map((category, idx) => (
                  <div key={idx} className={styles.techCard}>
                    <h3 className={styles.techCategoryTitle}>{category.title}</h3>
                    <p className={styles.techCategoryDesc}>{category.desc}</p>
                    <div className={styles.techChipsWrap}>
                      {category.chips.map((chip, chipIdx) => (
                        <div key={chipIdx} className={styles.techChip}>
                          <Icon name={chip.icon} size="xs" onBackground="brand-weak" />
                          <span>{chip.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </RevealFx>
          </div>
        </section>

        {/* ── 6. CONVERSION CTA BANNER ── */}
        <RevealFx translateY="16" delay={200}>
          <section className={styles.ctaBanner} aria-label="Get in Touch">
            <h2 className={styles.ctaHeading}>
              Ready to build something exceptional?
            </h2>
            <p className={styles.ctaSubtext}>
              Skip the agency meetings and endless sales decks. Send us a message on
              WhatsApp to discuss your requirements and get a straightforward, honest
              estimate.
            </p>

            <div className={styles.ctaButtons}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
                aria-label="Start WhatsApp conversation"
              >
                <Icon name="whatsapp" size="s" />
                <span>Start Direct Conversation</span>
              </a>

              <Link href="/work" className={styles.btnSecondary}>
                <Icon name="grid" size="s" />
                <span>View All Services & Pricing</span>
              </Link>
            </div>
          </section>
        </RevealFx>
      </div>
    </main>
  );
}
