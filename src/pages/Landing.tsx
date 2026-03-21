import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import RevenueLeakage from '@/components/landing/RevenueLeakage';
import HowItWorks from '@/components/landing/HowItWorks';
import AIAgentsSection from '@/components/landing/AIAgentsSection';
import CostComparison from '@/components/landing/CostComparison';
import PricingSection from '@/components/landing/PricingSection';
import ROICalculator from '@/components/landing/ROICalculator';
import WhatHappensAfter from '@/components/landing/WhatHappensAfter';
import ObjectionHandling from '@/components/landing/ObjectionHandling';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <RevenueLeakage />
        <HowItWorks />
        <AIAgentsSection />
        <CostComparison />
        <ROICalculator />
        <PricingSection />
        <ObjectionHandling />
        <WhatHappensAfter />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
}
