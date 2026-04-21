import { MarketingNavbar, HeroSection, BentoFeatures, CTASection, Footer } from '@/components/marketing/LandingComponents';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Abstract Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />
      
      <MarketingNavbar />
      
      <div className="flex-1">
        <HeroSection />
        <BentoFeatures />
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
