import { useTranslation } from '@/context/LanguageContext';

interface Props {
  title: string;
  overview: string;
}

// 'export' ifadesinin tam burada olduğundan emin olun
export const MovieDescription = ({ title, overview }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
        {title}
      </h1>
      <section className="space-y-4 pt- border-t border-white/5">
        <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-sm">
          {t('movie.overview')}
        </h3>
        <p className="text-lg md:text-xl text-black-300 leading-relaxed font-light italic">
          "{overview}"
        </p>
      </section>
    </div>
  );
};