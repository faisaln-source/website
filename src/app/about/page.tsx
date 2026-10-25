import React from "react";
import Link from "next/link";
import {
  Icon,
  Meta,
  Schema,
  RevealFx,
} from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import ProfileLanyard from "@/components/about/ProfileLanyard";
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
    number: "3–10 days",
    label: "Fast delivery",
    subtext: "Most sites ship in 3–10 days; résumés in 24–48 hours.",
  },
  {
    number: "100%",
    label: "Source ownership",
    subtext: "Full GitHub repo, deploy configs, and credentials handed over.",
  },
  {
    number: "₹250+",
    label: "Transparent pricing",
    subtext: "Published starting prices with no hidden fees.",
  },
  {
    number: "Zero",
    label: "Middleman markup",
    subtext: "You work directly with the engineer writing your code.",
  },
];

const FEATURES = [
  {
    iconName: "person" as const,
    badge: "Zero friction",
    title: "Direct developer access",
    desc: "You talk directly to the software engineer writing your code, with no non-technical middle layers and fewer misunderstandings.",
    checklist: [
      "Direct WhatsApp, email, and phone communication",
      "Quick technical answers and scoping",
      "Real-time feedback and direct revision rounds",
    ],
  },
  {
    iconName: "check" as const,
    badge: "Upfront",
    title: "Transparent, honest pricing",
    desc: "Every service has a published starting price from ₹250. You approve the exact scope, timeline, and deliverables before kickoff.",
    checklist: [
      "Published starting rates for every service",
      "No monthly retainers or hidden fees",
      "Itemized project milestones and clear agreements",
    ],
  },
  {
    iconName: "rocket" as const,
    badge: "Fast delivery",
    title: "Rapid turnaround",
    desc: "Without agency layers, projects move from first conversation to live deployment in days rather than months.",
    checklist: [
      "ATS résumés delivered within 24–48 hours",
      "Portfolio and business websites live in 3–10 days",
      "Deadlines respected, with proactive updates",
    ],
  },
  {
    iconName: "code" as const,
    badge: "No lock-in",
    title: "Full source code handoff",
    desc: "You own everything that is built. GitHub repositories, production environment variables, and deployment credentials are fully transferred to you.",
    checklist: [
      "Full source code and design copyright",
      "Vercel, Netlify, or custom cloud deploy handoff",
      "Clear, maintainable documentation",
    ],
  },
];

const TECH_CATEGORIES = [
  {
    title: "Frontend",
    desc: "Responsive, pixel-perfect design tuned for strong Core Web Vitals scores.",
    chips: [
      { name: "React 19", icon: "react" as const },
      { name: "Next.js 16", icon: "nextjs" as const },
      { name: "TypeScript", icon: "typescript" as const },
      { name: "Vanilla CSS", icon: "code" as const },
      { name: "Figma UI/UX", icon: "figma" as const },
    ],
  },
  {
    title: "Backend and cloud",
    desc: "Reliable databases, real-time sync, and scalable serverless API integrations.",
    chips: [
      { name: "Node.js", icon: "node" as const },
      { name: "Supabase", icon: "supabase" as const },
      { name: "PostgreSQL", icon: "code" as const },
      { name: "Serverless APIs", icon: "rocket" as const },
      { name: "JavaScript", icon: "javascript" as const },
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
        {/* ── 1. HERO HEADER WITH MAKEWISE PROFILE CARD ── */}
        <section className={styles.heroSection} aria-label="About MakeWise">
          <div className={styles.heroContentLeft}>
            <RevealFx translateY="8" delay={100}>
              <span className={styles.sectionEyebrow} style={{ marginBottom: "1rem", display: "inline-block" }}>
                Direct-to-developer digital studio
              </span>
            </RevealFx>

            <RevealFx translateY="12" delay={150}>
              <h1 className={styles.mainHeading}>
                Building high-impact digital products{" "}
                <span className={styles.gradientText}>without agency bloat.</span>
              </h1>
            </RevealFx>

            <RevealFx translateY="12" delay={300}>
              <p className={styles.leadSubtitle}>
                MakeWise was founded to solve a common client frustration: inflated
                invoices, endless delays, and non-technical middle managers. Here, you
                work directly with the builder, with no account managers, no markup,
                and no mystery.
              </p>
            </RevealFx>

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
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={emailLink}
                  className={styles.btnSecondary}
                  aria-label="Email us"
                >
                  <Icon name="email" size="s" />
                  <span>Email us</span>
                </a>
              </div>
            </RevealFx>
          </div>

          {/* Right Column: MakeWise Studio 3D Interactive Lanyard Profile Card */}
          <RevealFx translateY="16" delay={250}>
            <div className={styles.lanyardCardWrapper}>
              <ProfileLanyard />
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
            {/* Left Card: The MakeWise philosophy */}
            <div className={styles.bentoCard}>
              <div className={styles.cardEyebrow}>
                <span>✦</span>
                <span>The MakeWise philosophy</span>
              </div>
              <h2 className={styles.cardTitle}>
                Craftsmanship over bureaucracy.
              </h2>
              <p className={styles.cardParagraph}>
                Many traditional agencies spend a large share of client budgets on account
                executives, sales teams, and project coordinators who mainly pass requests
                back and forth.
              </p>
              <p className={styles.cardParagraph}>
                MakeWise runs a leaner, more transparent model: you speak directly with
                the developer writing the code. The focus is ATS-friendly résumés,
                modern portfolio sites, high-converting business websites, custom web
                apps, and offline-first POS systems.
              </p>
            </div>

            {/* Right Card: Comparison Box */}
            <div className={styles.bentoCard}>
              <div className={styles.cardEyebrow}>
                <span>⚡</span>
                <span>The MakeWise Model</span>
              </div>
              <h2 className={styles.cardTitle}>
                Traditional agency vs. MakeWise
              </h2>
              <div className={styles.comparisonBox}>
                <div className={`${styles.comparisonRow} ${styles.comparisonBad}`}>
                  <span className={styles.comparisonIconBad}>✕</span>
                  <span>
                    <strong>Traditional agencies:</strong> High markups for middle management,
                    slow turnaround, and unclear hourly billing.
                  </span>
                </div>
                <div className={`${styles.comparisonRow} ${styles.comparisonGood}`}>
                  <span className={styles.comparisonIconGood}>✓</span>
                  <span>
                    <strong>The MakeWise model:</strong> One-on-one developer access, fixed
                    and transparent pricing from ₹250, and delivery in 3–10 days.
                  </span>
                </div>
                <div className={`${styles.comparisonRow} ${styles.comparisonBad}`}>
                  <span className={styles.comparisonIconBad}>✕</span>
                  <span>
                    <strong>Vendor lock-in:</strong> Proprietary builders or retained
                    codebases that keep your website tied to the agency.
                  </span>
                </div>
                <div className={`${styles.comparisonRow} ${styles.comparisonGood}`}>
                  <span className={styles.comparisonIconGood}>✓</span>
                  <span>
                    <strong>Full ownership:</strong> Complete GitHub repo, deploy config,
                    and production credentials handed over at launch.
                  </span>
                </div>
              </div>
            </div>
          </section>
        </RevealFx>

        {/* ── 4. WHY MAKEWISE (4-FEATURE BENTO) ── */}
        <section aria-label="Core Advantages">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Core advantages</span>
            <h2 className={styles.sectionTitle}>
              Engineered for speed, clarity, and control
            </h2>
            <p className={styles.sectionSubtitle}>
              Every project gets careful engineering and direct personal accountability.
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
        <section aria-label="Architecture">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Architecture</span>
            <h2 className={styles.sectionTitle}>
              Modern stack, production-grade reliability
            </h2>
            <p className={styles.sectionSubtitle}>
              MakeWise uses proven, modern technologies for fast load times, minimal
              bloat, and strong security.
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

        {/* ── 6. CLOSING CALL TO ACTION ── */}
        <RevealFx translateY="16" delay={200}>
          <section className={styles.ctaBanner} aria-label="Closing call to action">
            <h2 className={styles.ctaHeading}>
              Have a project in mind?
            </h2>
            <p className={styles.ctaSubtext}>
              Skip the agency meetings and sales decks. Send a message on WhatsApp to
              discuss your requirements and get an honest estimate.
            </p>

            <div className={styles.ctaButtons}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
                aria-label="Start a conversation"
              >
                <Icon name="whatsapp" size="s" />
                <span>Start a conversation</span>
              </a>

              <Link href="/services" className={styles.btnSecondary}>
                <Icon name="grid" size="s" />
                <span>View services and pricing</span>
              </Link>
            </div>
          </section>
        </RevealFx>
      </div>
    </main>
  );
}
