import {
  Column,
  Heading,
  Text,
  Row,
  Card,
  Icon,
  Button,
  Line,
  RevealFx,
  Meta,
  Schema,
} from "@once-ui-system/core";
import { work, person, baseURL, about } from "@/resources";
import styles from "@/app/work/work.module.css";
import { ScrollTopOnMount } from "@/app/work/ScrollTopOnMount";
import { SendEmailButton } from "@/app/work/SendEmailButton";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    path: "/services",
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
  });
}

const services = [
  {
    id: "resume",
    icon: "document",
    title: "ATS Résumé",
    price: "₹250–₹999",
    timeline: "24–48 hours",
    tag: "Most popular",
    summary:
      "Professionally formatted, keyword-optimized résumés designed to pass ATS scanners and impress recruiters.",
    deliverables: [
      "ATS keyword optimization for your target role",
      "Clean, editable Word and PDF files",
      "Industry-tailored layout and content",
      "One free revision round",
      "Fast-track delivery available (extra fee)",
      "Targeted cover letter included",
    ],
    cta: "Order on WhatsApp",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20order%20an%20ATS%20r%C3%A9sum%C3%A9!",
  },
  {
    id: "portfolio",
    icon: "person",
    title: "Portfolio Website",
    price: "₹1,500–₹4,999",
    timeline: "3–5 days",
    tag: "For creatives",
    summary:
      "Polished, mobile-first personal sites that showcase your work and help recruiters find you.",
    deliverables: [
      "Fully responsive custom design",
      "Smooth animations and interactions",
      "Deployed on Vercel or Netlify",
      "Custom domain setup included",
      "Full source code handoff",
    ],
    cta: "Get a Quote",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Portfolio%20Website!",
  },
  {
    id: "business-website",
    icon: "globe",
    title: "Business Website",
    price: "₹3,000–₹12,999",
    timeline: "5–10 days",
    tag: "Best value",
    summary:
      "Lead-generating, SEO-optimized multi-page websites that make your business look professional and convert visitors.",
    deliverables: [
      "Multi-page responsive layout",
      "WhatsApp and contact form integration",
      "On-page SEO and schema markup",
      "Google Maps and business info",
      "Optimized for Core Web Vitals",
    ],
    cta: "Get a Quote",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Business%20Website!",
  },
  {
    id: "webapp",
    icon: "code",
    title: "Web Application",
    price: "₹5,000+",
    timeline: "Scoped per project",
    tag: "Custom build",
    summary:
      "Full-stack custom web applications: dashboards, booking systems, SaaS tools, and admin panels, all built to scale.",
    deliverables: [
      "React / Next.js frontend",
      "Node.js and Supabase backend",
      "Custom dashboard or admin panel",
      "Authentication and role management",
      "Full source code handoff",
    ],
    cta: "Get a Quote",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Web%20Application!",
  },
  {
    id: "mobile-app",
    icon: "rocket",
    title: "Mobile Web App",
    price: "₹4,000+",
    timeline: "Scoped per project",
    tag: "Installable",
    summary:
      "Progressive web apps with a native-app feel, offline support, and touch-friendly design, installable without an app store.",
    deliverables: [
      "Offline caching",
      "Mobile-first, touch-optimized interface",
      "Install to home screen",
      "Full source code handoff",
    ],
    cta: "Get a Quote",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20a%20Mobile%20Web%20App!",
  },
  {
    id: "pos",
    icon: "grid",
    title: "POS and Billing Software",
    price: "₹8,000+",
    timeline: "Scoped per project",
    tag: "Custom build",
    summary:
      "Offline-capable billing software for retail, restaurants, and pharmacies, custom-made for your business.",
    deliverables: [
      "Barcode scanning and inventory",
      "GST invoice generation",
      "Reliable offline mode",
      "Sales reports and analytics",
      "Customized for your business type",
    ],
    cta: "Get a Quote",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20POS%20and%20Billing%20Software!",
  },
];

export default function ServicesPage() {
  return (
    <main className={styles.pageContainer}>
      <ScrollTopOnMount />
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/services"
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Ambient Background Lighting */}
      <div className={styles.ambientBackground} aria-hidden="true">
        <div className={styles.topGlowOrb} />
        <div className={styles.gridPattern} />
      </div>

      {/* Header */}
      <section className={styles.heroHeader} aria-label="Services and Pricing">
        <RevealFx translateY="8" delay={100}>
          <div className={styles.statusPill}>
            <span className={styles.statusDotPulse} aria-hidden="true">
              <span className={styles.statusDotWave} />
              <span className={styles.statusDotCore} />
            </span>
            <span>Transparent pricing and fast delivery</span>
          </div>
        </RevealFx>

        <RevealFx translateY="12" delay={200}>
          <h1 className={styles.mainHeading}>
            Services and <span className={styles.gradientText}>Pricing</span>
          </h1>
        </RevealFx>

        <RevealFx translateY="12" delay={300}>
          <p className={styles.leadSubtitle}>
            From résumés to full-stack apps, every service has transparent pricing and fast
            turnaround. Websites and apps include your full source code.
          </p>
        </RevealFx>
      </section>

      {/* Services Grid */}
      <div className={styles.contentGrid}>
        {services.map((svc, i) => (
          <RevealFx key={svc.id} translateY="8" delay={i * 80}>
            <Card
              className={styles.serviceCard}
              padding="32"
              radius="l"
              border="neutral-alpha-weak"
              background="surface"
              fillWidth
            >
              <Column gap="24" fillWidth>
                {/* Top row */}
                <Row fillWidth horizontal="between" vertical="start" gap="16" wrap>
                  <Row gap="16" vertical="center">
                    <Icon name={svc.icon as any} size="l" onBackground="brand-weak" />
                    <Column gap="4">
                      <Row gap="12" vertical="center">
                        <Heading as="h2" variant="heading-strong-xl">
                          {svc.title}
                        </Heading>
                        <Text
                          variant="label-default-xs"
                          onBackground="brand-strong"
                          style={{
                            padding: "2px 10px",
                            borderRadius: "100px",
                            background: "var(--brand-alpha-weak)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {svc.tag}
                        </Text>
                      </Row>
                      <Row gap="16">
                        <Text variant="label-strong-m" onBackground="brand-medium">
                          {svc.price}
                        </Text>
                        <Text variant="label-default-s" onBackground="neutral-weak">
                          · {svc.timeline}
                        </Text>
                      </Row>
                    </Column>
                  </Row>
                </Row>

                {/* Summary */}
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {svc.summary}
                </Text>

                <Line />

                {/* Deliverables + CTA */}
                <Row fillWidth gap="24" s={{ direction: "column" }} wrap>
                  <Column gap="8" fillWidth style={{ flex: "1 1 240px" }}>
                    <Text variant="label-strong-s" onBackground="neutral-strong">
                      What&apos;s included
                    </Text>
                    <Column gap="8" paddingTop="4">
                      {svc.deliverables.map((d) => (
                        <Row key={d} gap="8" vertical="center">
                          <Icon name="check" size="xs" onBackground="brand-weak" />
                          <Text variant="body-default-s">{d}</Text>
                        </Row>
                      ))}
                    </Column>
                  </Column>
                  <Column gap="12" horizontal="center" fillWidth style={{ flex: "1 1 200px" }}>
                    <Button
                      id={`cta-${svc.id}`}
                      href={svc.href}
                      variant="primary"
                      size="m"
                      arrowIcon
                      fillWidth
                    >
                      {svc.cta}
                    </Button>
                    <SendEmailButton
                      id={`email-${svc.id}`}
                      serviceTitle={svc.title}
                    />
                  </Column>
                </Row>
              </Column>
            </Card>
          </RevealFx>
        ))}
      </div>

      {/* Bottom CTA */}
      <Card
        className={styles.bottomCtaCard}
        padding="40"
        radius="l"
        border="brand-alpha-medium"
        background="brand-alpha-weak"
        fillWidth
      >
        <Column gap="16" horizontal="center" align="center" fillWidth>
          <Heading variant="display-strong-xs" wrap="balance" align="center">
            Not sure which service you need?
          </Heading>
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: "480px" }}
          >
            Message MakeWise on WhatsApp and describe your project. You will get a
            recommendation and a free quote.
          </Text>
          <Button
            id="services-bottom-cta"
            href="https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27m%20not%20sure%20which%20service%20I%20need%20-%20can%20you%20help?"
            variant="primary"
            size="l"
            arrowIcon
          >
            Chat on WhatsApp
          </Button>
          <Text variant="label-default-xs" onBackground="neutral-weak">
            +91 70120 80365 · makewisedigitalsolution@gmail.com
          </Text>
        </Column>
      </Card>
    </main>
  );
}
