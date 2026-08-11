import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { imageDimensions, imageUrlByWidth } from '@/sanity/lib/image';
import type { BlockContent } from '@/sanity/types';

/**
 * Yazı gövdesinin (Portable Text) HTML karşılığı.
 *
 * Buradaki eşleme `src/sanity/schemaTypes/blockContent.ts` ile bire bir
 * yürümek zorunda: şemaya izinli yeni bir biçim eklenip buraya karşılığı
 * yazılmazsa içerik sessizce kaybolur (Portable Text bilinmeyen tipi atlar).
 *
 * `h1` bilerek yok — sayfadaki tek `h1` yazının başlığı.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-muted-foreground mt-6 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-foreground mt-12 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-foreground mt-8 text-lg font-semibold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-primary text-foreground mt-6 border-l-2 pl-4 italic">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground mt-6 list-disc space-y-2 pl-6">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground mt-6 list-decimal space-y-2 pl-6">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-grid-line text-foreground rounded px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = typeof value?.href === 'string' ? value.href : '';

      // Kendi sayfalarımıza giden bağlantı dil ön ekini almalı ve istemci
      // tarafı geçişini kullanmalı; dış bağlantı yeni sekmede açılır.
      if (href.startsWith('/')) {
        return (
          <Link
            href={href}
            className="text-primary underline underline-offset-4"
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-primary underline underline-offset-4"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      const dimensions = imageDimensions(value?.asset?._ref);
      if (!dimensions) return null;

      const alt = typeof value?.alt === 'string' ? value.alt : '';
      const caption = typeof value?.caption === 'string' ? value.caption : null;

      return (
        <figure className="mt-8">
          <Image
            src={imageUrlByWidth(value, 1400)}
            alt={alt}
            width={dimensions.width}
            height={dimensions.height}
            sizes="(min-width: 1024px) 44rem, 100vw"
            className="h-auto w-full rounded"
          />
          {caption ? (
            <figcaption className="text-muted-foreground mt-3 text-center text-sm">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PostBody({ value }: { value: BlockContent }) {
  return <PortableText value={value} components={components} />;
}
