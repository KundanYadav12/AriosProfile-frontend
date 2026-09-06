import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Layers, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { FadeIn } from '../common/TextReveal';
import ConnectedNetworkVisual from '../common/ConnectedNetworkVisual';
import { useSiteData } from '../../context/SiteDataContext';

export default function AboutSection() {
  const { settings } = useSiteData();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth horizontal marquee parallax
  const xMarquee = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-36 relative bg-white overflow-hidden border-t border-slate-100">
      
      {/* Scroll-Driven Horizontal ARISO Watermark Movement */}
      <motion.div
        style={{ x: xMarquee }}
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap select-none pointer-events-none opacity-[0.035] text-[18vw] font-black tracking-tighter text-slate-900"
      >
        ARISO TECHNOLOGY ARISO
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          
          {/* Left Column: Bold Statement */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-ariso-600 uppercase block">
              WE ARE ARISO
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.05]">
              We build technology around the way people actually work.
            </h2>
            <p className="text-slate-600 text-base sm:text-xl leading-relaxed">
              {settings.company_description || 'Ariso is a technology company focused on creating practical digital solutions for businesses and communities. We build products that simplify operations, improve experiences, and help businesses move faster.'}
            </p>
          </div>

          {/* Right Column: Original Connected System Canvas Visual */}
          <div className="lg:col-span-6">
            <ConnectedNetworkVisual />
          </div>

        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeIn delay={0.1} className="h-full">
            <div className="h-full p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-ariso-300 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3 group-hover:text-ariso-600 transition-colors">
                  High-Speed Execution
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  From lightning-fast restaurant billing to supermarket rushes, our architecture guarantees sub-second response times under peak customer volumes.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200/60 text-xs font-bold text-slate-400">
                01 / SPEED & STABILITY
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="h-full">
            <div className="h-full p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-ariso-300 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3 group-hover:text-ariso-600 transition-colors">
                  Zero Learning Curve
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Engineered with refined simplicity so cashiers, captains, store managers, and event volunteers can master operations within minutes.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200/60 text-xs font-bold text-slate-400">
                02 / INTUITIVE DESIGN
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="h-full">
            <div className="h-full p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-ariso-300 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3 group-hover:text-ariso-600 transition-colors">
                  Real-World Resilience
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Offline billing resilience, counterfeit-proof QR pass verification, split tax engines, and automated cloud sync keeping your business continuous.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200/60 text-xs font-bold text-slate-400">
                03 / UNCOMPROMISED TRUST
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
