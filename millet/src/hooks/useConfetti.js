// Canvas-based lightweight confetti + sparkles. No library.
// Usage: const fireConfetti = useConfetti(); fireConfetti();

import { useCallback } from 'react';

export function useConfetti() {
  const fire = useCallback((options = {}) => {
    const {
      duration = 3000,
      count = 140,
      colors = ['#0E7490', '#34D399', '#F59E0B', '#10B981', '#2DD4BF', '#FBBF24'],
      sparkles = true,
    } = options;

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const particles = [];
    const start = performance.now();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        gravity: 0.35,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 1,
      });
    }

    const sparkleList = [];
    if (sparkles) {
      for (let i = 0; i < 40; i++) {
        sparkleList.push({
          x: W / 2 + (Math.random() - 0.5) * 400,
          y: H / 2 + (Math.random() - 0.5) * 300,
          r: Math.random() * 3 + 1,
          delay: Math.random() * 1.2,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    let rafId;
    const loop = () => {
      const now = performance.now();
      const elapsed = now - start;

      ctx.clearRect(0, 0, W, H);

      // Confetti
      for (const p of particles) {
        p.vy += p.gravity;
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Sparkles
      for (const s of sparkleList) {
        const t = Math.max(0, elapsed / 1000 - s.delay);
        if (t <= 0) continue;
        const alpha = Math.max(0, 1 - t / 2) * (0.5 + 0.5 * Math.sin(s.twinkle + t * 8));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        // cross sparkle
        ctx.strokeStyle = '#FEF3C7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 2, s.y);
        ctx.lineTo(s.x + s.r * 2, s.y);
        ctx.moveTo(s.x, s.y - s.r * 2);
        ctx.lineTo(s.x, s.y + s.r * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (elapsed < duration) {
        rafId = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(rafId);
        canvas.remove();
      }
    };
    rafId = requestAnimationFrame(loop);
  }, []);

  return fire;
}