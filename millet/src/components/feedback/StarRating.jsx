import { useSound } from '../../hooks/useSound';

export default function StarRating({ value = 0, onChange, size = 'lg' }) {
  const { play } = useSound();
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => {
            play('tick');
            onChange?.(n);
          }}
          className={`${sizes[size]} transition-all duration-150 hover:scale-125 active:scale-95 ${
            n <= value ? 'text-amber-500' : 'text-ink/20'
          }`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}