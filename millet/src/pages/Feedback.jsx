import { useLang } from '../contexts/LanguageContext';
import FeedbackForm from '../components/feedback/FeedbackForm';

export default function Feedback() {
  const { t } = useLang();

  return (
    <main className="px-4 max-w-3xl mx-auto pt-6 animate-fade-in">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">
          {t('feedback')}
        </h1>
        <p className="text-sm text-ink/50 mt-1">{t('feedbackSubtitle')}</p>
      </div>

      <FeedbackForm />
    </main>
  );
}