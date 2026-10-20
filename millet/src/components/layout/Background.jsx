import { useMemo } from 'react';

export default function Background() {
  const bubbles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: 40 + Math.random() * 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      opacity: 0.03 + Math.random() * 0.05,
      color: ['rgba(52, 211, 153, VAR)', 'rgba(14, 116, 144, VAR)', 'rgba(245, 158, 11, VAR)'][i % 3],
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full blur-3xl animate-float-slow"
          style={{
            width: b.size, height: b.size, left: `${b.left}%`, top: `${b.top}%`,
            background: b.color.replace('VAR', b.opacity),
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}