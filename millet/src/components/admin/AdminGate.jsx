import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { SHOP } from '../../config/shop';

export default function AdminGate({ children }) {
  const { isAdmin, login } = useAdmin();
  const { t } = useLang();
  const { play } = useSound();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (isAdmin) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(password);
    if (ok) {
      play('success');
      setError(false);
    } else {
      play('buzz');
      setError(true);
      setPassword('');
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass-dark rounded-3xl p-8 max-w-sm w-full text-center animate-slide-up">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="font-display text-2xl font-extrabold text-trust-700">
          {t('adminLogin')}
        </h1>
        <p className="text-xs text-ink/50 mt-1">{SHOP.name}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder={t('adminPassword')}
            autoFocus
            className={`input-field text-center ${error ? 'border-red-300 animate-shake' : ''}`}
          />

          {error && (
            <p className="text-xs text-red-500 -mt-1">{t('wrongPassword')}</p>
          )}

          <button type="submit" className="btn-primary w-full">
            {t('login')} →
          </button>
        </form>
      </div>
    </main>
  );
}