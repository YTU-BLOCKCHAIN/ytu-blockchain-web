import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// Locale-aware navigasyon yardımcıları (Link, useRouter, usePathname...)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
