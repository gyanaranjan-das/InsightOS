'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, Lock, Activity, Code2, Globe } from 'lucide-react';
import Link from 'next/link';

/* ── Animation Variants ──────────────────────────────────── */
const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

/* ── Navbar ──────────────────────────────────────────────── */
export function MarketingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">InsightOS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mb-6 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Globe className="h-3 w-3 mr-2" />
              InsightOS v1.0 is now live
            </span>
          </motion.div>
          <motion.h1 
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            Stop Guessing. Start Tracking Your SaaS Success Today.
          </motion.h1>
          <motion.p 
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Connect raw behavioral tracking with our vector-embedded generative AI data explorer to scale deterministic funnels in real-time.
          </motion.p>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              Start Engineering Your Data <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              View Live Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50" />
    </section>
  );
}

/* ── Bento Features ──────────────────────────────────────── */
const FEATURES = [
  {
    title: 'Bi-Directional WebSockets',
    description: 'Fire tracking logs through scalable HTTP layers bridging directly onto synchronous dashboard canvases.',
    icon: Activity,
    className: 'col-span-1 md:col-span-2 lg:col-span-3 bg-card/40 border border-white/5 backdrop-blur-sm',
  },
  {
    title: 'AI Data Intel',
    description: 'Vector-embedded mapping interprets loose queries converting raw behaviors into deterministic analysis instantly.',
    icon: Bot,
    className: 'col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20',
  },
  {
    title: 'Zero-Trust RBAC',
    description: 'Multi-matrix organizational governance wrapping JWT sessions perfectly natively.',
    icon: Lock,
    className: 'col-span-1 md:col-span-1 bg-card/40 border border-white/5 backdrop-blur-sm',
  },
];

export function BentoFeatures() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Architecture Designed for Scale</h2>
          <p className="text-muted-foreground">Traditional analytics platforms lose telemetry context. We aggregate, parse, and execute raw funnels dynamically leveraging machine intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl p-8 flex flex-col ${feat.className}`}
            >
              <feat.icon className="h-8 w-8 text-primary mb-6" />
              <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Call To Action ──────────────────────────────────────── */
export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary/10 border border-primary/20 rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-sm"
        >
          <Code2 className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Deploy InsightOS Now</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the frontier of algorithmic business mapping. Spin up your analytics organizational dashboard in seconds.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-lg">
            Create Free Account
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        <Activity className="h-6 w-6 text-primary mx-auto mb-4" />
        <p className="font-semibold mb-2 text-foreground">InsightOS Analytics Platform</p>
        <p className="mb-4">Engineered to track every move. Built to interpret every behavior.</p>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} InsightOS. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Produced & Maintained by <a href="https://gyanlabs.io" className="text-primary hover:underline">GyanLabs.io Studio</a></p>
        </div>
      </div>
    </footer>
  );
}
