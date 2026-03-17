/* ═══════════════════════════════════════════════════════════════════
   SITE CONFIG — The single source of truth for all company content.

   🤖 AGENT: This is the PRIMARY file you edit to customise a company
   site. Change the values below to match the company's vertical,
   brand, and offering. The landing page reads from this file.
   ═══════════════════════════════════════════════════════════════════ */

export const siteConfig = {
  /* ─── Company identity ─────────────────────────────────────────── */
  name: "CashPulse",
  tagline: "Financial intelligence for growing businesses",
  description:
    "CashPulse helps small businesses forecast cash flow, automate invoicing, and get paid faster — so you can focus on growth, not spreadsheets.",
  url: "https://cashpulse.yocto.com",
  domain: "cashpulse.yocto.com",

  /* ─── Hero section ─────────────────────────────────────────────── */
  hero: {
    badge: "Early adopters program",
    headline: "Stop guessing.\nStart forecasting.",
    subheadline:
      "Real-time cash flow insights, automated invoicing, and payment tracking — built for freelancers and small teams.",
    cta: { label: "Join the early adopters", href: "#lead-form" },
    secondaryCta: { label: "Learn more", href: "/#features" },
    /** Social proof shown below the CTA */
    socialProof: "Join 120+ businesses in our early adopters program",
  },

  /* ─── Features ─────────────────────────────────────────────────── */
  features: {
    headline: "Everything you need to stay on top of your finances",
    subtitle:
      "Powerful tools that work together so you spend less time on admin and more time doing great work.",
    items: [
      {
        icon: "BarChart3",
        title: "Cash flow forecasting",
        description:
          "See exactly where your money is going with real-time projections and scenario planning.",
      },
      {
        icon: "Zap",
        title: "Automated invoicing",
        description:
          "Create and send professional invoices in seconds. Set up recurring billing on autopilot.",
      },
      {
        icon: "Shield",
        title: "Payment tracking",
        description:
          "Know instantly when you get paid. Automatic reminders for overdue invoices.",
      },
      {
        icon: "PieChart",
        title: "Expense categorisation",
        description:
          "AI-powered categorisation of every transaction. Tax time becomes a breeze.",
      },
      {
        icon: "Globe",
        title: "Multi-currency support",
        description:
          "Send invoices and track payments in any currency. Perfect for international clients.",
      },
      {
        icon: "Lock",
        title: "Bank-grade security",
        description:
          "256-bit encryption, SOC 2 compliant, and read-only bank connections. Your data is safe.",
      },
    ],
  },

  /* ─── How it works ─────────────────────────────────────────────── */
  howItWorks: {
    headline: "Up and running in 3 minutes",
    steps: [
      {
        step: "1",
        title: "Connect your accounts",
        description: "Link your bank and payment providers with one click. We never store credentials.",
      },
      {
        step: "2",
        title: "Get instant insights",
        description: "See your cash position, upcoming bills, and revenue forecast on a single dashboard.",
      },
      {
        step: "3",
        title: "Automate the busywork",
        description: "Set up recurring invoices, payment reminders, and expense tracking on autopilot.",
      },
    ],
  },

  /* ─── Testimonials ─────────────────────────────────────────────── */
  testimonials: [
    {
      quote:
        "CashPulse replaced three separate tools for us. The forecasting alone saved us from a cash crunch last quarter.",
      author: "Sarah Chen",
      role: "Founder, Meridian Design Studio",
      avatar: null,
    },
    {
      quote:
        "I used to spend Friday afternoons chasing invoices. Now it's fully automated and I get paid 40% faster.",
      author: "James Okafor",
      role: "Freelance Developer",
      avatar: null,
    },
    {
      quote:
        "The expense categorisation is magic. Tax prep went from 2 weeks to 2 hours.",
      author: "Priya Sharma",
      role: "CEO, Lumina Analytics",
      avatar: null,
    },
  ],

  /* ─── Pricing ──────────────────────────────────────────────────── */
  pricing: {
    headline: "Get in early. Lock in your advantage.",
    subtitle: "We're building CashPulse with our first users. Join the early adopters program and shape the product with us.",
    tiers: [
      {
        name: "Free trial",
        type: "free",
        price: "Free",
        period: "",
        description: "Try everything, no strings attached",
        features: [
          "Full access for 14 days",
          "All features included",
          "No credit card required",
          "Cancel anytime",
        ],
        cta: { label: "Start free trial", href: "#lead-form" },
        highlighted: false,
      },
      {
        name: "Early Adopters",
        type: "paid",
        price: "€19",
        period: "/month",
        description: "Lock in the founding rate — forever",
        features: [
          "Everything, unlimited",
          "Founding member pricing locked in",
          "Direct access to the team",
          "Shape the roadmap with us",
          "Priority support",
          "Early access to new features",
        ],
        cta: { label: "Become an early adopter", href: "/checkout?plan=early-adopters" },
        highlighted: true,
      },
    ],
  },

  /* ─── Lead capture form ────────────────────────────────────────── */
  leadForm: {
    headline: "Get early access",
    subtitle:
      "Join the beta and be the first to try CashPulse. No credit card needed.",
    buttonLabel: "Join the waitlist",
    successMessage: "You're on the list! We'll be in touch soon.",
  },

  /* ─── Footer ───────────────────────────────────────────────────── */
  footer: {
    companyLinks: [
      { label: "Contact", href: "/contact" },
    ],
    productLinks: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    copyright: "CashPulse",
  },

  /* ─── Contact page ─────────────────────────────────────────────── */
  contact: {
    headline: "Get in touch",
    subtitle:
      "Have a question or want to learn more? Drop us a line and we'll get back to you within 24 hours.",
    email: "hello@cashpulse.com",
  },

  /* ─── SEO & metadata ───────────────────────────────────────────── */
  meta: {
    title: "CashPulse — Financial intelligence for growing businesses",
    description:
      "Real-time cash flow forecasting, automated invoicing, and payment tracking for freelancers and small businesses.",
    ogImage: "/og.png",
  },
} as const;

export type SiteConfig = typeof siteConfig;
