import React, { useEffect, useRef } from 'react';

export default function ConnectedNetworkVisual() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 480);
    let height = (canvas.height = canvas.parentElement.clientHeight || 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3 Ecosystem Hubs: POS (Restaurant), Retail, EventPass converging into ARISO Center
    const center = { x: width / 2, y: height / 2, radius: 28, label: 'ARISO' };
    const hubs = [
      { id: 'pos', name: 'POS', angle: -Math.PI / 2, dist: 130, color: '#f59e0b', sublabel: 'Dining' },
      { id: 'retail', name: 'RETAIL', angle: Math.PI / 6, dist: 130, color: '#0284c7', sublabel: 'Store' },
      { id: 'events', name: 'EVENTS', angle: (5 * Math.PI) / 6, dist: 130, color: '#6366f1', sublabel: 'Passes' },
    ];

    // Orbiting Satellite particles
    const satellites = [];
    for (let i = 0; i < 24; i++) {
      satellites.push({
        hubIndex: i % 3,
        orbitRadius: Math.random() * 40 + 20,
        orbitSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        currentAngle: Math.random() * Math.PI * 2,
        size: Math.random() * 2.5 + 1.5,
      });
    }

    let t = 0;

    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw pulsating background connecting web
      ctx.beginPath();
      ctx.arc(cx, cy, 130 + Math.sin(t) * 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 110, 199, 0.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Hubs and Converging Flow Lines
      hubs.forEach((hub, idx) => {
        const hx = cx + Math.cos(hub.angle + Math.sin(t * 0.5) * 0.05) * hub.dist;
        const hy = cy + Math.sin(hub.angle + Math.sin(t * 0.5) * 0.05) * hub.dist;

        // Converging animated flow line to center
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = 'rgba(12, 141, 232, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Traveling pulse particle along the spoke
        const progress = (t * 0.6 + idx * 0.33) % 1;
        const px = hx + (cx - hx) * progress;
        const py = hy + (cy - hy) * progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.fill();

        // Draw Hub Node
        ctx.beginPath();
        ctx.arc(hx, hy, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = hub.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hub text
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hub.name, hx, hy);
      });

      // Draw Orbiting Satellites
      satellites.forEach((sat) => {
        sat.currentAngle += sat.orbitSpeed;
        const hub = hubs[sat.hubIndex];
        const hx = cx + Math.cos(hub.angle) * hub.dist;
        const hy = cy + Math.sin(hub.angle) * hub.dist;

        const sx = hx + Math.cos(sat.currentAngle) * sat.orbitRadius;
        const sy = hy + Math.sin(sat.currentAngle) * sat.orbitRadius;

        ctx.beginPath();
        ctx.arc(sx, sy, sat.size, 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw Central ARISO Node
      ctx.beginPath();
      ctx.arc(cx, cy, 34 + Math.sin(t * 2) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#006ec7';
      ctx.shadowColor = 'rgba(0, 110, 199, 0.25)';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Central ARISO text
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ARISO', cx, cy);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl bg-slate-50/80 border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden group">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-semibold text-slate-400 border-t border-slate-200/60 pt-2.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-ariso-500 animate-pulse" />
          Real-world System Convergence
        </span>
        <span className="font-mono text-slate-500">POS • RETAIL • EVENTS</span>
      </div>
    </div>
  );
}
