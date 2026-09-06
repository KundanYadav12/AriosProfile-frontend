import React, { useEffect, useRef } from 'react';

export default function LayeredHeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      lightRadius: Math.min(width, height) * 0.45,
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      mouse.lightRadius = Math.min(width, height) * 0.45;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    // Layer 2: Abstract Translucent Geometric Shapes (Restaurant, Retail, Event motifs)
    const geometricShapes = [
      { type: 'circle', x: width * 0.2, y: height * 0.35, radius: 120, baseRadius: 120, depth: 0.03, angle: 0, speed: 0.003, color: 'rgba(12, 141, 232, 0.06)' },
      { type: 'roundedRect', x: width * 0.8, y: height * 0.4, w: 180, h: 180, r: 40, depth: 0.05, angle: 0.5, speed: 0.002, color: 'rgba(0, 110, 199, 0.05)' },
      { type: 'circle', x: width * 0.65, y: height * 0.75, radius: 90, baseRadius: 90, depth: 0.02, angle: 0, speed: 0.004, color: 'rgba(56, 189, 248, 0.07)' },
      { type: 'ring', x: width * 0.3, y: height * 0.7, radius: 140, depth: 0.04, angle: 0, speed: -0.002, color: 'rgba(12, 141, 232, 0.04)' },
      { type: 'pill', x: width * 0.5, y: height * 0.25, w: 140, h: 44, depth: 0.06, angle: -0.3, speed: 0.0015, color: 'rgba(0, 110, 199, 0.04)' }
    ];

    // Layer 4: Multi-Depth Particle Field (depths: 0.08 foreground, 0.04 midground, 0.015 background)
    const particleCount = Math.min(Math.floor((width * height) / 14000), 65);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const depthTier = Math.random();
      let depth, radius, baseAlpha;
      if (depthTier > 0.75) {
        depth = 0.08; // foreground
        radius = Math.random() * 2.2 + 1.6;
        baseAlpha = 0.35;
      } else if (depthTier > 0.4) {
        depth = 0.04; // midground
        radius = Math.random() * 1.5 + 1.0;
        baseAlpha = 0.22;
      } else {
        depth = 0.015; // background
        radius = Math.random() * 1.0 + 0.6;
        baseAlpha = 0.12;
      }

      particles.push({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius,
        depth,
        baseAlpha,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += prefersReducedMotion ? 0 : 0.012;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const deltaX = (mouse.x - width / 2);
      const deltaY = (mouse.y - height / 2);

      ctx.clearRect(0, 0, width, height);

      // ================= LAYER 1: Ambient Radial Light Field =================
      const lightGrad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, mouse.lightRadius
      );
      lightGrad.addColorStop(0, 'rgba(12, 141, 232, 0.09)');
      lightGrad.addColorStop(0.5, 'rgba(12, 141, 232, 0.03)');
      lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, width, height);

      // ================= LAYER 2: Translucent Geometric Forms =================
      geometricShapes.forEach((shape) => {
        shape.angle += shape.speed;
        const posX = shape.x + deltaX * shape.depth;
        const posY = shape.y + deltaY * shape.depth + Math.sin(time + shape.x) * 8;

        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(shape.angle);

        ctx.fillStyle = shape.color;
        ctx.strokeStyle = 'rgba(0, 110, 199, 0.08)';
        ctx.lineWidth = 1;

        if (shape.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (shape.type === 'ring') {
          ctx.beginPath();
          ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 110, 199, 0.07)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (shape.type === 'roundedRect') {
          ctx.beginPath();
          ctx.roundRect(-shape.w / 2, -shape.h / 2, shape.w, shape.h, shape.r);
          ctx.fill();
          ctx.stroke();
        } else if (shape.type === 'pill') {
          ctx.beginPath();
          ctx.roundRect(-shape.w / 2, -shape.h / 2, shape.w, shape.h, shape.h / 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      });

      // ================= LAYER 3: Flowing Connecting Paths =================
      ctx.beginPath();
      const path1Y = height * 0.45 + Math.sin(time * 0.8) * 30 + deltaY * 0.03;
      ctx.moveTo(0, path1Y);
      ctx.bezierCurveTo(
        width * 0.3, path1Y - 60,
        width * 0.7, path1Y + 80,
        width, path1Y - 20
      );
      ctx.strokeStyle = 'rgba(12, 141, 232, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      const path2Y = height * 0.65 + Math.cos(time * 0.6) * 25 + deltaY * 0.02;
      ctx.moveTo(0, path2Y);
      ctx.bezierCurveTo(
        width * 0.4, path2Y + 50,
        width * 0.6, path2Y - 70,
        width, path2Y + 30
      );
      ctx.strokeStyle = 'rgba(0, 110, 199, 0.05)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // ================= LAYER 4: Multi-Tier Floating Particles & Node Mesh =================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.baseX += p.vx;
        p.baseY += p.vy;

        if (p.baseX < 0) p.baseX = width;
        if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        if (p.baseY > height) p.baseY = 0;

        const currentX = p.baseX + deltaX * p.depth;
        const currentY = p.baseY + deltaY * p.depth;

        // Proximity glow to cursor
        const distToMouse = Math.hypot(mouse.x - currentX, mouse.y - currentY);
        const mouseGlow = distToMouse < 180 ? (1 - distToMouse / 180) * 0.4 : 0;

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 110, 199, ${Math.min(p.baseAlpha + mouseGlow, 0.8)})`;
        ctx.fill();

        // Connect nearby nodes in the same depth tier
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (Math.abs(p.depth - p2.depth) < 0.03) {
            const p2X = p2.baseX + deltaX * p2.depth;
            const p2Y = p2.baseY + deltaY * p2.depth;
            const dist = Math.hypot(currentX - p2X, currentY - p2Y);

            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(currentX, currentY);
              ctx.lineTo(p2X, p2Y);
              const lineAlpha = (1 - dist / 110) * 0.12 * (p.baseAlpha + mouseGlow);
              ctx.strokeStyle = `rgba(12, 141, 232, ${lineAlpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle Blueprint Dot Grid Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#006ec7 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      {/* Subtle Noise Texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
