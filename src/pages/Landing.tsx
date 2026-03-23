import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Stats } from '@/components/landing/Stats';
import { About } from '@/components/landing/About';
import { Testimonials } from '@/components/landing/Testimonials';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';
import { LexWidget } from '@/components/landing/LexWidget';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Stats />
      <About />
      <Testimonials />
      <CallToAction />
      <Footer />
      <LexWidget />
    </div>
  );
}
