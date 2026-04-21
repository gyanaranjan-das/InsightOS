"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import {
  ArrowRight,
  Bot,
  Lock,
  Activity,
  Code2,
  Globe,
  Database,
  Network,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRef, MouseEvent } from "react";

/* ── Animation Variants ──────────────────────────────────── */
const FADE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

/* ── Navbar ──────────────────────────────────────────────── */
export function MarketingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">InsightOS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)] h-9 px-5 py-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-32 overflow-hidden min-h-[90vh] flex items-center"
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 relative z-10"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            variants={FADE_UP_VARIANTS}
            className="mb-8 flex justify-center"
          >
            <div className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 rounded-full bg-[image:linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0.5),rgba(255,255,255,0))] animate-[spin_2s_linear_infinite]" />
              <div className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-xl px-4 py-1.5 text-xs font-semibold text-primary/80 ring-1 ring-white/10">
                <Globe className="h-3.5 w-3.5 mr-2 text-primary animate-pulse" />
                <span>InsightOS V1 Architecture Out Now</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            variants={FADE_UP_VARIANTS}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]"
          >
            Measure SaaS Scale with{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_8s_ease_infinite]">
              Algorithmic Precision.
            </span>
          </motion.h1>

          <motion.p
            variants={FADE_UP_VARIANTS}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-medium"
          >
            Merge raw telemetry logs with native vector-embedded generative AI
            parsing to scale deterministic analytics matrices instantaneously.
          </motion.p>

          <motion.div
            variants={FADE_UP_VARIANTS}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center rounded-xl text-base font-bold transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground shadow-[0_0_40px_rgba(var(--primary),0.5)] h-14 px-10 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center">
                Initialize Matrix{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all hover:bg-white/5 border border-white/10 bg-background/50 backdrop-blur-md h-14 px-10"
            >
              Access Terminal
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating 3D Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl hidden md:block"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full w-full" />
          <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden transform perspective-1000">
            <div className="border-b border-white/5 bg-black/40 px-4 py-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <div className="mx-auto bg-white/5 rounded-md px-24 py-1 text-xs text-white/40">
                app.insightos.com/dashboard/analytics
              </div>
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 opacity-80 h-[400px]">
              <div className="col-span-2 space-y-4">
                <div className="h-10 w-48 bg-white/10 rounded-md animate-pulse" />
                <div className="h-64 w-full bg-gradient-to-tr from-primary/20 to-cyan-400/20 rounded-xl border border-white/5" />
              </div>
              <div className="space-y-4">
                <div className="h-32 w-full bg-white/5 rounded-xl border border-white/5" />
                <div className="h-32 w-full bg-white/5 rounded-xl border border-white/5 shadow-[0_0_30px_rgba(var(--primary),0.1)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Interactive Bento Glow Card ────────────────────────── */
interface CardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  delay?: number;
}

function GlowCard({
  title,
  description,
  icon: Icon,
  className = "",
  delay = 0,
}: CardProps) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md px-8 py-10 flex flex-col overflow-hidden transition-colors hover:border-white/20 hover:bg-card/60 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(120,119,198,0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-xl font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Bento Features ──────────────────────────────────────── */
export function BentoFeatures() {
  return (
    <section className="py-32 relative z-20">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-3xl text-center mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Designed for Structural Scale
          </h2>
          <p className="text-xl text-muted-foreground">
            We bypass traditional vanity metrics by wrapping telemetry layers in
            highly responsive, algorithmically structured socket grids.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min max-w-6xl mx-auto">
          <GlowCard
            title="Bi-Directional Trackers"
            description="Continuous event logs are blasted through high-velocity HTTP bridges natively streaming back into secure dashboard realms."
            icon={Activity}
            delay={0.1}
            className="md:col-span-2 lg:col-span-2"
          />
          <GlowCard
            title="Embedded Conversational AI"
            description="Translate multi-variable database queries into actionable visual analysis using GPT-4o embeddings mapping natively over zero-trust routes."
            icon={Bot}
            delay={0.2}
            className="md:col-span-1"
          />
          <GlowCard
            title="Role-Based Validation Matrices"
            description="Multi-tier architectural RBAC ensuring your internal organization boundaries remain completely impervious and segmented."
            icon={Lock}
            delay={0.3}
            className="md:col-span-1"
          />
          <GlowCard
            title="Schemaless Document Architecture"
            description="Fully-managed injection loops routing into raw Mongo Atlas environments preventing strict-schema deadlock under high traffic."
            icon={Database}
            delay={0.4}
            className="md:col-span-2 lg:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}

/* ── Call To Action ──────────────────────────────────────── */
export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative rounded-3xl p-1px overflow-hidden mx-auto max-w-5xl"
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-cyan-400/30 to-primary/30 animate-[gradient_4s_linear_infinite] bg-[length:200%_auto]" />

          <div className="relative bg-background/80 backdrop-blur-2xl rounded-3xl p-16 md:p-24 text-center border border-white/10">
            <Network className="h-16 w-16 text-primary mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">
              Are you ready to map the Matrix?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Initialize a production-grade infrastructure immediately.
              Integrate, deploy, and scale.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground shadow-[0_0_40px_rgba(var(--primary),0.5)] h-16 px-12"
            >
              Spin up your cluster
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-16 bg-background relative z-10">
      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-primary/10 border border-primary/20 mb-6">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xl font-bold tracking-tight text-white mb-2">
          InsightOS Platform
        </p>
        <p className="text-sm text-muted-foreground mb-12 max-w-sm mx-auto">
          Engineered to track every trajectory. Built to intercept every
          anomaly.
        </p>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground font-medium">
          <p>
            © {new Date().getFullYear()} InsightOS Structure. All rights
            reserved.
          </p>
          <p className="mt-4 md:mt-0 flex items-center justify-center gap-1.5">
            Produced & Maintained by{" "}
            <a
              href="https://gyanlabs.io"
              className="text-primary hover:text-white transition-colors underline decoration-primary/50 underline-offset-4"
            >
              GyanLabs.io Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
