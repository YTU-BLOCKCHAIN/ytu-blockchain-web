// Slider sırası. `three` içermez; bileşen sayfa yüklenirken de okuyabilir.

export type StickerDef = { id: string; src?: string };

/** `src` yoksa kulüp logosu `/logo/mark.svg`'den çizilir. */
export const STICKERS: StickerDef[] = [
  { id: 'logo' },
  { id: 'cat', src: '/stickers/cat.webp' },
  { id: 'laptop', src: '/stickers/laptop.webp' },
  { id: 'dog', src: '/stickers/dog.webp' },
  { id: 'seal', src: '/stickers/seal.webp' },
];
