import React from "react";
import type {
  About,
  Blog,
  Gallery,
  Home,
  Newsletter,
  Person,
  Social,
  Work,
} from "@/types";

const person: Person = {
  firstName: "MakeWise",
  lastName: "",
  name: "MakeWise",
  role: "Digital Products & Web Solutions",
  avatar: "/images/avatar.jpg",
  location: "Asia/Kolkata",
  languages: ["English", "Malayalam"],
  email: "makewisedigitalsolution@gmail.com",
  locale: "en",
};

const newsletter: Newsletter = {
  display: false,
  title: <>Get a free project quote</>,
  description: (
    <>Send your project idea and we'll respond with a tailored estimate within 24 hours.</>
  ),
};

const social: Social = [
  {
    name: "WhatsApp",
    icon: "whatsapp",
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%20have%20a%20project%20idea!",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:makewisedigitalsolution@gmail.com",
    essential: true,
  },
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/faisaln",
    essential: false,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/faisaln",
    essential: false,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "MakeWise Digital Solutions — High-Impact Digital Products",
  description:
    "MakeWise builds fast websites, scalable web apps, POS software, and ATS-optimized resumes and portfolios, with direct developer access and agency-level quality.",
  headline: (
    <>
      High-impact digital products,
      <br />
      crafted with direct collaboration.
    </>
  ),
  featured: {
    display: true,
    title: (
      <>
        <strong>MakeWise</strong> — Direct developer access. Transparent pricing.
      </>
    ),
    href: "/services",
  },
  subline: (
    <>
      From ATS-optimized resumes and portfolios to business websites, web apps, and POS systems.
      Work directly with the builder: transparent pricing, rapid turnaround, and full source code ownership.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: "About — MakeWise Digital Solutions",
  description:
    "MakeWise is a direct-to-developer digital studio delivering websites, web apps, POS software, and resumes, built on direct collaboration.",
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%27d%20like%20to%20discuss%20a%20project.",
  },
  intro: {
    display: true,
    title: "Who we are",
    description: (
      <>
        MakeWise was founded to solve a common client frustration: inflated invoices, endless delays,
        and non-technical middle managers. Here, you work directly with the builder, with no account
        managers, no markup, and no mystery.
        <br />
        <br />
        We specialize in ATS-friendly resumes, modern portfolio sites, high-converting business
        websites, custom web apps, and offline-first POS systems.
      </>
    ),
  },
  work: {
    display: false,
    title: "Our Services",
    experiences: [
      {
        company: "ATS Resume",
        timeframe: "₹250–₹999 · 24–48 hours",
        role: "Professionally formatted, keyword-optimized resumes",
        achievements: [
          <>ATS keyword optimization to pass automated screening at top companies.</>,
          <>Clean Word & PDF formatting, tailored for your industry and target role.</>,
          <>One free revision round included. Fast-track delivery available.</>,
        ],
        images: [],
      },
      {
        company: "Portfolio Websites",
        timeframe: "₹1,500 – ₹4,999 · Delivered in 3–5 days",
        role: "Stunning, fast, and mobile-first personal sites",
        achievements: [
          <>Fully responsive design with custom animations and a unique visual identity.</>,
          <>Hosted on Vercel/Netlify with custom domain setup included.</>,
          <>Perfect for developers, designers, freelancers, and creatives.</>,
        ],
        images: [],
      },
      {
        company: "Business Websites",
        timeframe: "₹3,000 – ₹12,999 · Delivered in 5–10 days",
        role: "Lead-generating, SEO-optimized websites for your business",
        achievements: [
          <>Multi-page sites with contact forms, WhatsApp integration, and Google Maps.</>,
          <>On-page SEO, Schema markup, and Core Web Vitals optimization built in.</>,
          <>Full source code handoff with deployment on your domain.</>,
        ],
        images: [],
      },
      {
        company: "Web Applications",
        timeframe: "₹5,000+ · Timeline scoped per project",
        role: "Full-stack custom web apps built to scale",
        achievements: [
          <>Custom dashboards, booking systems, admin panels, and SaaS tools.</>,
          <>Built with React / Next.js + Node.js / Supabase for reliability and scale.</>,
          <>Timeline and pricing defined after scoping your exact requirements.</>,
        ],
        images: [],
      },
      {
        company: "POS & Billing Software",
        timeframe: "₹8,000+ · Timeline scoped per project",
        role: "Offline-capable billing software for retail & restaurants",
        achievements: [
          <>Barcode scanning, inventory management, and GST invoice generation.</>,
          <>Works offline — critical for areas with unreliable internet connectivity.</>,
          <>Custom built for your business type: retail, restaurant, pharmacy, and more.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Why MakeWise",
    institutions: [
      {
        name: "Direct Developer Access",
        description: (
          <>
            You talk directly to the person writing your code — no account managers, no overhead, no
            surprises. WhatsApp, email, or a call — anytime.
          </>
        ),
      },
      {
        name: "Transparent Pricing",
        description: (
          <>
            Every service has published starting prices. No hidden fees, no scope creep — you see
            the cost before we start.
          </>
        ),
      },
      {
        name: "Fast Turnaround",
        description: (
          <>
            Most projects ship in 3–10 days. Resumes in 24–48 hours. We respect your deadlines and
            keep you updated at every step.
          </>
        ),
      },
      {
        name: "Full Source Code Handoff",
        description: (
          <>
            You own everything. All source files, deploy configs, and credentials are handed over —
            no vendor lock-in, ever.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Tech Stack",
    skills: [
      {
        title: "Frontend",
        description: (
          <>
            React, Next.js, TypeScript, Vanilla CSS — fast, accessible, and pixel-perfect on every
            device.
          </>
        ),
        tags: [
          { name: "React", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "TypeScript", icon: "typescript" },
          { name: "Figma", icon: "figma" },
        ],
        images: [],
      },
      {
        title: "Backend & Database",
        description: (
          <>
            Node.js, Supabase, PostgreSQL, Firebase — reliable backends and real-time databases
            built for production.
          </>
        ),
        tags: [
          { name: "Node.js", icon: "node" },
          { name: "Supabase", icon: "supabase" },
          { name: "JavaScript", icon: "javascript" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Insights on web, design & tech",
  description:
    "Practical tips on web development, portfolio building, freelancing, and digital products in India.",
};

const work: Work = {
  path: "/services",
  label: "Services",
  title: "Services & Pricing — MakeWise Digital Solutions",
  description:
    "Explore MakeWise services and pricing, from ATS resumes to full-stack web apps and POS software.",
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Gallery — MakeWise",
  description: "Selected work and project screenshots.",
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "Project screenshot",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "Project screenshot",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "Project screenshot",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "Project screenshot",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
