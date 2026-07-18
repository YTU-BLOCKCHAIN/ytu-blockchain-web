import { ArrowRight, Code2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import type { ProjectStatus } from '@/data/projects';
import { cn } from '@/lib/utils';
import { Container } from '@/components/container';
import { getProjects } from '@/lib/content';
import { localize } from '@/lib/localized';

export function ProjectsHeader() {
  const t = useTranslations('Projects');

  return (
    <section className="overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div
            data-grid-content
            className="@4xl:p-12 col-span-full p-6 sm:col-span-8"
          >
            <span className="text-primary font-mono text-xs tracking-widest lowercase">
              {'//'} {t('eyebrow')}
            </span>
            <h1 className="text-foreground mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
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
    </section>
  );
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  live: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  wip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  archived: 'bg-muted text-muted-foreground',
};

export function ProjectsGrid() {
  const t = useTranslations('Projects');
  const locale = useLocale();
  const projects = getProjects();

  if (projects.length === 0) {
    return (
      <section>
        <Container asGrid>
          <div className="grid grid-cols-10 gap-px">
            <div aria-hidden className="max-sm:hidden">
              <div data-grid-content />
            </div>

            <div
              data-grid-content
              className="col-span-full flex flex-col items-center gap-3 p-12 text-center sm:col-span-8"
            >
              <h2 className="text-foreground text-balance text-xl font-medium">
                {t('empty.title')}
              </h2>
              <p className="text-muted-foreground max-w-md text-balance">
                {t('empty.body')}
              </p>
            </div>

            <div aria-hidden className="max-sm:hidden">
              <div data-grid-content />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const statusLabel: Record<ProjectStatus, string> = {
    live: t('status.live'),
    wip: t('status.wip'),
    archived: t('status.archived'),
  };

  return (
    <section>
      <Container asGrid className="sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.slug} className="group relative">
            <div
              data-grid-content
              className="@4xl:p-8 hover:bg-card! flex h-full flex-col gap-4 p-6 transition-colors"
            >
              <div>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    STATUS_STYLES[project.status],
                  )}
                >
                  {statusLabel[project.status]}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-foreground font-semibold">
                  {project.title}
                </h2>
                <p className="text-muted-foreground">
                  {localize(project.summary, locale)}
                </p>
              </div>

              {project.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {(project.repoUrl || project.liveUrl) && (
                <div className="mt-auto flex flex-wrap gap-4 pt-2">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
                    >
                      <Code2 className="size-4" />
                      {t('links.repo')}
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary hover:text-foreground inline-flex items-center gap-1 text-sm font-medium"
                    >
                      {t('links.live')}
                      <ArrowRight className="size-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </Container>
    </section>
  );
}
