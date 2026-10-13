import { useEffect } from 'react';

export default function Toast({ type = 'success', message, onClose, duration = 3200 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-fresh-500',
    error: 'bg-red-500',
    info: 'bg-trust-500',
    warning: 'bg-amber-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '!',
  };

  return (
    <div
      className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60]
                 px-5 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm
                 flex items-center gap-2 animate-bounce-in
                 ${styles[type] || styles.info}`}
      role="alert"
    >
      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-extrabold">
        {icons[type]}
      </span>
      <span>{message}</span>
    </div>
  );
}