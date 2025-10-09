import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Hero } from '@/components/sections/hero';
import { AboutUs } from '@/components/sections/about-us';
import MetricsSection from '@/components/sections/metrics-section';
import SuccessStoriesSection from '@/components/sections/success-stories-section';
import { AlliesSection } from '@/components/sections/allies-section';
import OurHistorySection from '@/components/sections/our-history-section';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      <SiteHeader />
      <Hero />
      <AboutUs />
      <AlliesSection />
      <OurHistorySection />
      <MetricsSection />
      <SuccessStoriesSection />
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
