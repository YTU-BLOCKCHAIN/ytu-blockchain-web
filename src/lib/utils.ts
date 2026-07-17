import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn/ui standart yardımcısı: koşullu sınıfları birleştirir ve Tailwind çakışmalarını çözer. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
