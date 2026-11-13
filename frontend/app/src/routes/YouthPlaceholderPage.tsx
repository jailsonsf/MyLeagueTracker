import { useCareer } from '../features/careers/careerContext';
import { messages } from '../i18n/pt-BR';

export function YouthPlaceholderPage() {
  const { youthSquad } = useCareer();

  return (
    <section className="px-6 pb-10 pt-2 lg:px-12">
      <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter">
        {messages.youth.title}
      </h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        {youthSquad.length} {messages.youth.countLabel}
      </p>
      <p className="mt-6 text-sm text-on-surface-variant">{messages.youth.comingSoon}</p>
    </section>
  );
}
