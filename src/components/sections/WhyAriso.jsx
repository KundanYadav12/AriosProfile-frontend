import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { FadeIn } from '../common/TextReveal';

export default function WhyAriso() {
  const [activeItem, setActiveItem] = useState(0);

  const statements = [
    {
      num: '01',
      title: 'BUILT FOR REAL BUSINESSES',
      desc: 'We solve operational realities. From packed dinner rushes to high-volume supermarket queues and crowded event gates, our software thrives under actual pressure.',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      num: '02',
      title: 'DESIGNED FOR SIMPLICITY',
      desc: 'Complex technology should feel completely effortless to frontline teams. We eliminate bloated navigation so transactions complete in seconds.',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      num: '03',
      title: 'MADE TO EVOLVE',
      desc: 'Our modular architecture grows seamlessly alongside your business expansion—whether opening a second outlet or organizing a multi-day festival.',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      num: '04',
      title: 'TECHNOLOGY WITH PURPOSE',
      desc: 'We never build software for the sake of buzzwords. Every single line of code is dedicated to eliminating manual errors, boosting revenue, and saving time.',
      icon: Target,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
  ];

  return (
    <section id="why-ariso" className="py-24 sm:py-36 relative bg-white overflow-hidden border-t border-slate-100">
      
      {/* Dynamic Background Rotating Geometry */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none opacity-20 hidden lg:block">
        <motion.div
          animate={{ rotate: activeItem * 90 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full rounded-full border-2 border-dashed border-ariso-400 relative flex items-center justify-center"
        >
          <div className="w-3/4 h-3/4 rounded-full border border-ariso-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-ariso-500 shadow-md shadow-ariso-500/30" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-ariso-600 uppercase block mb-3">
            WHY ARISO
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.05]">
            Four principles behind everything we engineer.
          </h2>
        </div>

        {/* 4 Interactive Statements Accordion/Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          {statements.map((stmt, idx) => {
            const isActive = activeItem === idx;
            const Icon = stmt.icon;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveItem(idx)}
                onClick={() => setActiveItem(idx)}
                className={`p-8 sm:p-10 rounded-3xl cursor-pointer transition-all duration-400 border flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-950 text-white border-slate-900 shadow-2xl shadow-slate-950/20 scale-[1.02]'
                    : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-white hover:border-ariso-300'
                }`}
                data-cursor="EXPAND"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className={`text-sm font-mono font-bold tracking-widest ${isActive ? 'text-ariso-400' : 'text-slate-400'}`}>
                      {stmt.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isActive ? 'bg-slate-800 text-ariso-400 border-slate-700' : stmt.color
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight mb-4 ${
                    isActive ? 'text-white' : 'text-slate-950'
                  }`}>
                    {stmt.title}
                  </h3>

                  <p className={`text-sm sm:text-base leading-relaxed ${
                    isActive ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {stmt.desc}
                  </p>
                </div>

                <div className={`pt-6 mt-6 border-t flex items-center justify-between text-xs font-semibold ${
                  isActive ? 'border-slate-800 text-ariso-400' : 'border-slate-200/60 text-slate-400'
                }`}>
                  <span>Core Operational Standard</span>
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-ariso-400 animate-pulse' : 'bg-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
