import { useMemo } from 'react';

export default function Background() {
  const bubbles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      arr.push({
        id: i,
        size: 40 + Math.random() * 120,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 8,
        opacity: 0.05 + Math.random() * 0.1,
        color: [
          'rgba(52, 211, 153, VAR)',
          'rgba(14, 116, 144, VAR)',
          'rgba(245, 158, 11, VAR)',
        ][i % 3],
      });
    }
    return arr;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full blur-2xl"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            top: `${b.top}%`,
            background: b.color.replace('VAR', b.opacity),
            animation: `float ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}

      {/* Soft gradient orbs */}
      <div
        className="absolute rounded-full blur-3xl animate-float-slow"
        style={{
          width: 500,
          height: 500,
          left: '-10%',
          top: '-10%',
          background:
            'radial-gradient(circle, rgba(52,211,153,0.18), transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl animate-float-med"
        style={{
          width: 600,
          height: 600,
          right: '-15%',
          bottom: '-15%',
          background:
            'radial-gradient(circle, rgba(14,116,144,0.15), transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl animate-float-fast"
        style={{
          width: 400,
          height: 400,
          left: '40%',
          top: '40%',
          background:
            'radial-gradient(circle, rgba(245,158,11,0.10), transparent 70%)',
        }}
      />
    </div>
  );
}