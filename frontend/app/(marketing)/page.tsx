import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { LogoStrip } from '@/components/landing/LogoStrip';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { MetricsSection } from '@/components/landing/MetricsSection';
import { ProductWorkspace } from '@/components/landing/ProductWorkspace';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { WorkspaceOverview } from '@/components/landing/WorkspaceOverview';
import { CaseStudy } from '@/components/landing/CaseStudy';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F7F8FF' }}>
      <Navbar />
      <Hero />
      <LogoStrip />
      <ProblemSection />
      <MetricsSection />
      <ProductWorkspace />
      <HowItWorks />
      <FeaturesGrid />
      <WorkspaceOverview />
      <CaseStudy />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
