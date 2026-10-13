export default function EmptyState({ emoji = '🌾', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="text-6xl mb-4 animate-float-med">{emoji}</div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      {subtitle && <p className="text-sm text-ink/60 mt-2 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}