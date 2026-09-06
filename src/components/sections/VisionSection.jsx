import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import MagneticButton from '../common/MagneticButton';
import { FadeIn } from '../common/TextReveal';

export default function VisionSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Sphere Points
    const nodeCount = 55;
    const sphereRadius = Math.min(width, height) * 0.38;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      nodes.push({
        x: sphereRadius * Math.cos(theta) * Math.sin(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(phi),
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      angleX += 0.003;
      angleY += 0.005;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Project & Rotate 3D Sphere Points
      const projected = nodes.map((node) => {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        let y1 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        const fov = 400;
        const scale = fov / (fov + z2 + 250);
        return {
          px: cx + x1 * scale,
          py: cy + y1 * scale,
          scale,
          alpha: Math.max(0.1, (z2 + sphereRadius) / (2 * sphereRadius)),
        };
      });

      // Draw connecting lines between close sphere nodes
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);

          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(12, 141, 232, ${(1 - dist / 75) * 0.18 * p1.alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, 2.2 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.9})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vision" className="py-28 sm:py-40 relative bg-slate-950 text-white overflow-hidden">
      {/* 3D Rotating Sphere Background Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Center Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-ariso-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-ariso-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8 shadow-inner">
            <Rocket className="w-3.5 h-3.5 text-ariso-400" />
            <span>THE OPPORTUNITIES AHEAD</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight leading-[0.98] uppercase mb-8">
            We’re just getting started.
          </h2>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-slate-300 text-lg sm:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-12">
            From restaurants and retail to events and whatever comes next, Ariso is building technology for the opportunities ahead.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton strength={0.3}>
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ariso-500 hover:bg-ariso-400 text-slate-950 font-bold text-base shadow-xl shadow-ariso-500/20 hover:shadow-ariso-500/35 transition-all duration-300 group"
                data-cursor="PARTNER"
              >
                <span>Partner With Ariso</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
