import React, { useState } from 'react';
import CustomCursor from '../components/common/CustomCursor';
import ScrollProgress from '../components/common/ScrollProgress';
import PageLoader from '../components/common/PageLoader';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/layout/WhatsAppButton';

import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ProductShowcase from '../components/sections/ProductShowcase';
import WhyAriso from '../components/sections/WhyAriso';
import VisionSection from '../components/sections/VisionSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import EnquirySection from '../components/sections/EnquirySection';

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#fafcff] text-[#090d16] flex flex-col selection:bg-ariso-500 selection:text-white">
      {/* Custom Desktop Dual-Ring Cursor */}
      <CustomCursor />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Initial Smooth Brand Reveal */}
      <PageLoader onComplete={() => setLoaded(true)} />

      {/* Sticky Blur Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ProductShowcase />
        <WhyAriso />
        <VisionSection />
        <TestimonialsSection />
        <EnquirySection />
      </main>

      {/* Dynamic Footer */}
      <Footer />

      {/* Floating Solid WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
