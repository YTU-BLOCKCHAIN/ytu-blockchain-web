// Slider sırası. `three` içermez; bileşen sayfa yüklenirken de okuyabilir.

export type StickerDef = { id: string; src?: string };

/** `src` yoksa kulüp logosu `/logo/mark.svg`'den çizilir. */
export const STICKERS: StickerDef[] = [
  { id: 'logo' },
  { id: 'sell', src: '/stickers/sell.webp' },
  { id: 'satoshi', src: '/stickers/satoshi.webp' },
  { id: 'own-keys', src: '/stickers/own-keys.webp' },
  { id: 'money-printer', src: '/stickers/money-printer.webp' },
  { id: 'banknote', src: '/stickers/banknote.webp' },
  { id: 'big-type', src: '/stickers/big-type.webp' },
  { id: 'cat', src: '/stickers/cat.webp' },
  { id: 'mouse', src: '/stickers/mouse.webp' },
  { id: 'laptop', src: '/stickers/laptop.webp' },
];
