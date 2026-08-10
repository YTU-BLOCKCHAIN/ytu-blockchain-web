import {
  ArrowRight,
  Code2,
  Flame,
  Lightbulb,
  Unlock,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Container } from '@/components/container';
import { ButtonLink } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export function AboutHero() {
  const t = useTranslations('About.hero');

  const stats = [
    { value: t('stats.members.value'), label: t('stats.members.label') },
    { value: t('stats.projects.value'), label: t('stats.projects.label') },
    { value: t('stats.countries.value'), label: t('stats.countries.label') },
    { value: t('stats.founded.value'), label: t('stats.founded.label') },
  ];

  return (
    <section id="home" className="overflow-hidden">
      {/* Hero metin bloğu — gerçek grid-2-about-one #home markup'ı birebir. */}
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div
            data-grid-content
            className="@4xl:p-12 col-span-full p-6 sm:col-span-8"
          >
            <span className="text-muted-foreground text-sm font-medium">
              {t('eyebrow')}
            </span>
            {/* Mobilde 36px (diğer sayfa hero'larıyla aynı) — 48px telefonda
                başlığı 4 satıra bölüp hero'yu ekranın tamamına şişiriyordu.
                sm ve üstü birebir eskisi gibi. */}
            <h1 className="text-foreground mt-8 text-balance text-4xl font-semibold tracking-tight sm:mt-12 sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-balance text-lg">
              {t('intro')}
            </p>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>

      {/* İstatistik şeridi — template'in stat bloğu, 4 gerçek rakam. Dolgu
          `@max-4xl:` ile veriliyor: hücreler `Container asGrid`'in DOĞRUDAN
          çocuğu olduğu için `*:p-[0.5px]` kuralını da alıyorlar, düz `p-6` ona
          sıralamada yeniliyordu → mobilde her rakam 25px'lik dolgusuz bir
          şeride çöküyordu (masaüstünde `@4xl:p-12` kazandığı için sorunsuzdu).
          Dar ekranda 2×2 (`@xl` konteyner sorgusu telefonda tetiklenmiyor). */}
      <Container
        asGrid
        className="@4xl:grid-cols-10 @xl:grid-cols-2 grid-cols-2 gap-px"
      >
        <div aria-hidden data-grid-content className="@max-4xl:hidden" />
        {stats.map((s) => (
          <div
            key={s.label}
            data-grid-content
            className="@4xl:p-12 @4xl:col-span-2 @max-4xl:p-6"
          >
            <p className="text-muted-foreground">
              <strong className="text-foreground font-medium">{s.value}</strong>{' '}
              {s.label}
            </p>
          </div>
        ))}
        <div aria-hidden data-grid-content className="@max-4xl:hidden" />
      </Container>
    </section>
  );
}

export function AboutMission() {
  const t = useTranslations('About.mission');

  return (
    <section id="mission" className="scroll-mt-24">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <div className="text-muted-foreground mt-6 space-y-4 text-xl font-medium *:text-balance *:leading-relaxed">
                <p>
                  <span className="text-foreground">{t('body1')}</span>
                </p>
                <p>{t('body2')}</p>
              </div>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function AboutValues() {
  const t = useTranslations('About.values');

  const items = [
    {
      icon: Lightbulb,
      title: t('items.curiosity.title'),
      description: t('items.curiosity.description'),
    },
    {
      icon: Users,
      title: t('items.community.title'),
      description: t('items.community.description'),
    },
    {
      icon: Code2,
      title: t('items.building.title'),
      description: t('items.building.description'),
    },
    {
      icon: Unlock,
      title: t('items.openness.title'),
      description: t('items.openness.description'),
    },
  ];

  return (
    <section id="values" className="scroll-mt-24">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@4xl:grid-cols-2 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            {items.map((item) => (
              <div
                key={item.title}
                data-grid-content
                className="@4xl:p-12 flex flex-col gap-3 p-6"
              >
                <item.icon className="text-muted-foreground size-5" />
                <h3 className="text-foreground font-medium">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Ekip fotoğrafları Figma'dan gelene kadar boş slotlara canlılık veren nötr degradeler. */
const TEAM_GRADIENTS = [
  'from-indigo-400 via-blue-400 to-teal-500',
  'from-purple-400 via-sky-400 to-emerald-500',
  'from-pink-400 via-blue-400 to-cyan-500',
  'from-purple-400 via-blue-400 to-amber-500',
  'from-teal-400 via-cyan-400 to-blue-500',
  'from-rose-400 via-violet-400 to-indigo-500',
];

export function AboutTeam() {
  const t = useTranslations('About.team');

  const members = [
    { name: t('roles.board.name'), role: t('roles.board.role') },
    { name: t('roles.software.name'), role: t('roles.software.role') },
    { name: t('roles.events.name'), role: t('roles.events.role') },
    { name: t('roles.content.name'), role: t('roles.content.role') },
    { name: t('roles.academic.name'), role: t('roles.academic.role') },
    {
      name: t('roles.partnerships.name'),
      role: t('roles.partnerships.role'),
    },
  ];

  return (
    <section id="team" className="scroll-mt-24">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@3xl:grid-cols-3 col-span-full grid grid-cols-2 gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            {members.map((member, index) => (
              <div
                key={member.name}
                data-grid-content
                // 2 sütunlu (dar) düzende 6 komite tam 3 satır yapıyor; 6.'yı
                // gizlemek son satırda tek kart + boş hücre bırakıyordu.
                className="@4xl:p-12 p-6 max-sm:p-4"
              >
                <div className="before:border-foreground/6.5 before:z-1 aspect-5/6 bg-muted relative w-24 overflow-hidden rounded-2xl shadow-md shadow-black/[0.03] before:absolute before:inset-0 before:rounded-2xl before:border max-sm:w-20">
                  <div
                    aria-hidden
                    className={cn(
                      'bg-linear-to-r z-1 pointer-events-none absolute inset-0 size-40 rounded-full opacity-25 mix-blend-overlay blur-2xl md:size-72',
                      TEAM_GRADIENTS[index % TEAM_GRADIENTS.length],
                    )}
                  />
                </div>
                <div className="space-y-0.5 pt-3">
                  <p className="text-foreground font-medium">{member.name}</p>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Gerçek sponsor logoları Figma'dan gelene kadar nötr yer tutucu slot sayısı. */
const SPONSOR_SLOTS = 6;

export function AboutSponsors() {
  const t = useTranslations('About.sponsors');

  return (
    <section id="sponsors" className="scroll-mt-24">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@md:grid-cols-3 col-span-full grid grid-cols-2 gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
              <Link
                href="/contact"
                className="text-foreground mt-6 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
              >
                {t('cta')}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {Array.from({ length: SPONSOR_SLOTS }).map((_, i) => (
              <div
                key={i}
                data-grid-content
                className="@4xl:px-12 flex items-center justify-center p-6"
              >
                <span className="text-muted-foreground/50 text-sm">
                  {t('placeholder')}
                </span>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function AboutJoin() {
  const t = useTranslations('About.join');

  const tracks = [
    t('tracks.software'),
    t('tracks.events'),
    t('tracks.content'),
    t('tracks.academic'),
    t('tracks.design'),
  ];

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 p-6">
              <div className="flex items-center gap-2">
                <Flame className="text-muted-foreground size-4" />
                <h2 className="text-muted-foreground text-balance">
                  {t('eyebrow')}
                </h2>
              </div>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('heading')}
              </p>
              <p className="text-muted-foreground mt-4 max-w-2xl text-balance">
                {t('intro')}
              </p>
            </div>

            <div className="grid gap-px">
              {tracks.map((track) => (
                <div
                  key={track}
                  data-grid-content
                  className="@4xl:px-12 hover:bg-card! hover:z-1 group relative flex items-center gap-2 rounded-xl p-4 px-6 shadow-lg shadow-transparent transition-shadow hover:shadow-blue-900/5"
                >
                  <Link
                    href="/join"
                    className="font-medium after:absolute after:inset-0"
                  >
                    {track}
                  </Link>
                  <div className="ring-border bg-card ml-auto flex h-6 items-center rounded-full px-2 shadow shadow-black/[0.06] ring-1">
                    <ArrowRight className="not-group-hover:opacity-50 group-hover:text-primary size-3.5" />
                  </div>
                </div>
              ))}
            </div>

            <div data-grid-content className="@4xl:p-12 p-6">
              <p className="text-muted-foreground">
                {t('note')}{' '}
                <Link
                  href="/contact"
                  className="text-foreground inline-flex items-center gap-1 underline underline-offset-4"
                >
                  {t('contactCta')}
                  <ArrowRight className="size-3.5" />
                </Link>
              </p>
            </div>

            <div data-grid-content className="@4xl:p-12 p-6">
              <ButtonLink href="/join" withArrow>
                {t('button')}
              </ButtonLink>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
