import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageSquare, Sparkles, UtensilsCrossed, Store, Ticket } from 'lucide-react';
import LayeredHeroBackground from '../common/LayeredHeroBackground';
import MagneticButton from '../common/MagneticButton';
import ScrollIndicator from '../common/ScrollIndicator';
import { useSiteData } from '../../context/SiteDataContext';

export default function HeroSection() {
  const { settings } = useSiteData();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Coordinated Hero Exit Choreography
  const contentScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, 60]);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-gradient-to-b from-[#f4f8fe] via-[#fafcff] to-white"
    >
      {/* MotionSites-Inspired Multi-Layer Animated Canvas Background */}
      <LayeredHeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          style={{ scale: contentScale, opacity: contentOpacity, y: contentY }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-ariso-200 text-ariso-700 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-8 shadow-sm shadow-ariso-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-ariso-600" />
            <span>{settings.hero_eyebrow || 'BUILDING TECHNOLOGY THAT MOVES BUSINESS FORWARD'}</span>
          </motion.div>

          {/* Massive Cinematic Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-slate-950 tracking-tight leading-[0.98] uppercase mb-8"
          >
            <span className="block">Technology</span>
            <span className="block text-ariso-600">Built for the</span>
            <span className="block">Real World.</span>
          </motion.h1>

          {/* Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl mb-12"
          >
            {settings.hero_subtitle || 'Ariso builds practical digital products that simplify operations, improve experiences, and help businesses move forward.'}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
          >
            <MagneticButton strength={0.3}>
              <a
                href={settings.hero_cta_primary_url || '#products'}
                onClick={(e) => handleScrollTo(e, settings.hero_cta_primary_url || '#products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-950 hover:bg-ariso-600 text-white font-bold text-base shadow-xl shadow-slate-900/15 hover:shadow-ariso-600/30 transition-all duration-300 group"
                data-cursor="EXPLORE"
              >
                <span>{settings.hero_cta_primary_text || 'Explore Our Products'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.3}>
              <a
                href={settings.hero_cta_secondary_url || '#contact'}
                onClick={(e) => handleScrollTo(e, settings.hero_cta_secondary_url || '#contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold text-base border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all duration-300"
                data-cursor="TALK"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>{settings.hero_cta_secondary_text || "Let's Talk"}</span>
              </a>
            </MagneticButton>
          </motion.div>

          {/* 3 Ecosystem Chapters Quick Reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl pt-8 border-t border-slate-200/60"
          >
            <a
              href="#products"
              onClick={(e) => handleScrollTo(e, '#products')}
              className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-300 flex items-center gap-3.5 group text-left"
              data-cursor="POS"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">Chapter 01</span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Ariso POS</h4>
              </div>
            </a>

            <a
              href="#products"
              onClick={(e) => handleScrollTo(e, '#products')}
              className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center gap-3.5 group text-left"
              data-cursor="RETAIL"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase block">Chapter 02</span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Ariso Retail</h4>
              </div>
            </a>

            <a
              href="#products"
              onClick={(e) => handleScrollTo(e, '#products')}
              className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex items-center gap-3.5 group text-left"
              data-cursor="EVENTS"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase block">Chapter 03</span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">EventPass</h4>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Pulsating Scroll Indicator */}
      <ScrollIndicator target="#about" />
    </section>
  );
}
