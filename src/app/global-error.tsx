'use client';

/**
 * Son savunma hattı: kök layout'un KENDİSİ çizilemediğinde devreye giriyor.
 *
 * Bu yüzden kendi `<html>` ve `<body>` etiketlerini basmak zorunda — layout
 * çalışmadığı için onlar yok. Aynı sebeple burada çeviri, Header/Footer ya da
 * global stil YOK: hepsi çalışmayan katmanın içinde. Metin iki dilde birden
 * yazılı, çünkü `locale` de o katmandan geliyor.
 *
 * Normal sayfa hataları buraya düşmez, `[locale]/error.tsx` yakalar.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 24,
          textAlign: 'center',
          background: '#09090b',
          color: '#fafafa',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
          Bir şeyler ters gitti · Something went wrong
        </h1>
        <p style={{ opacity: 0.6, margin: 0, fontSize: 14 }}>
          Sayfa yüklenemedi. · This page could not be loaded.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 8,
            cursor: 'pointer',
            borderRadius: 999,
            border: '1px solid rgba(250,250,250,0.2)',
            background: 'transparent',
            color: 'inherit',
            padding: '8px 20px',
            fontSize: 14,
          }}
        >
          Tekrar dene · Try again
        </button>
      </body>
    </html>
  );
}
