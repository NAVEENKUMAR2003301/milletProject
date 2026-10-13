export default function Loader({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-trust-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-trust-500 border-r-fresh-500 animate-spin" />
      </div>
      {label && <p className="text-sm text-ink/60">{label}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse-soft">
      <div className="aspect-square rounded-2xl bg-trust-100/60 mb-4" />
      <div className="h-4 w-3/4 rounded bg-trust-100/60 mb-2" />
      <div className="h-3 w-1/2 rounded bg-trust-100/40" />
    </div>
  );
}