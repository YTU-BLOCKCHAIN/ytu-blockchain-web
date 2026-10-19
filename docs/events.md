# Etkinlik nasıl eklenir?

**[`/events`](https://ytublockchain.com/tr/events)** sayfasındaki kartlar ve her
etkinliğin kendi sayfası Sanity Studio'dan beslenir. Kod bilmeye, GitHub'a
girmeye gerek yok.

> Hackathon derecesi için **[`docs/hackathons.md`](hackathons.md)**, blog
> yazısı için **[`docs/blog.md`](blog.md)**.

## Ne zaman, kim

| Ne                       | Kim                    | Ne zaman                     |
| ------------------------ | ---------------------- | ---------------------------- |
| Yeni etkinlik (yaklaşan) | Etkinliği açan ekip    | Luma sayfası açıldığında     |
| Rapor / özet             | Etkinlik ekibi         | Recap paylaşımı atıldığı gün |
| Fotoğraflar              | Sosyal medya ekibi     | Recap ile birlikte           |
| Genel kontrol            | Sosyal medya sorumlusu | Ayda bir                     |

Etkinliği önceden açmak iyi fikir: tarih gelene kadar sayfada **"Yaklaşan"**
bölümünde, Luma bağlantısıyla "Kayıt ol" düğmesiyle durur. Tarih geçince
kendiliğinden geçmiş etkinliklere iner — elle taşımak gerekmiyor.

## Yeni kayıt

1. **[ytublockchain.com/studio](https://ytublockchain.com/studio)** → sol menü
   **Etkinlikler** → sağ üstte **+**.
2. Alanlar sekmelere ayrılmış: **Temel bilgiler**, **Yer**, **Rapor**,
   **Görseller**, **Bağlantılar**.
3. Bitince sağ alttaki **Publish**. Birkaç saniye içinde sitede.

### Zorunlu alanlar

| Alan             | Ne yazılır                                                                            |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Etkinlik adı** | Türkçe + İngilizce. Marka adı çevrilmez: "Blockchain 101" iki dilde aynı.             |
| **Tarih**        | Etkinlik günü. Çok günlüyse **Bitiş tarihi**ni de gir.                                |
| **Adres**        | **Generate**'e bas — tarih ve Türkçe addan üretilir. Yayından sonra değiştirme.       |
| **Tür**          | Eğitim, Workshop, Meetup, Söyleşi/Panel, Sosyal, Stant, Konferans, Hackathon, Online. |
| **Özet**         | İki dilde 2–4 cümle. Kartta ve paylaşım önizlemesinde görünür.                        |
| **Rapor**        | Aşağıya bak.                                                                          |

### İsteğe bağlı ama önemli

- **Saat:** `17:00` biçiminde, İstanbul saati. Bilmiyorsan boş bırak.
- **Seri:** tekrarlanan etkinliklerde ortak ad ("Blockchain 101", "Chit Chat
  Chain"). Aynı serideki etkinlikler sayfada birbirine bağlanır — **her seferinde
  birebir aynı yaz**.
- **Partnerler:** listeden seç. Kurum yoksa önce sol menü **Partnerler** → **+**.
  Aynı kurum için ikinci kayıt açma ("Sui" ve "Sui Network" ayrı görünür).
- **Ülke:** iki harfli kod, büyük harfle: `TR`, `FR`, `BE`, `PT`, `NL`. Sitede
  ziyaretçinin dilinde ad olarak çıkar.
- **Şehir:** yurt dışı şehirleri uluslararası adıyla yaz (`Lisbon`, `Brussels`)
  — alan iki dilde aynı görünüyor.
- **Katılımcı sayısı:** yalnızca biliniyorsa. Tahmin yazma.

## Rapor

**Rapor** alanı sayfadaki rapor bölümünü belirler:

| Seçim         | Sayfada görünen                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------ |
| **Tam rapor** | Yazdığın rapor. Seçince iki dilli zengin metin alanı açılır.                                     |
| **Kısa özet** | Özet alanındaki metin, rapor olarak.                                                             |
| **Rapor yok** | "Bu etkinlik için rapor bulunmuyor." (Yaklaşan etkinlikte: "Rapor etkinlikten sonra eklenecek.") |

Tam rapor için önerilen başlıklar: **Kısaca · Neler yaptık · Konuşmacılar ·
Katılım ve öne çıkanlar · Partnerler · Materyaller**.

**Özetin kaynağı** "Paylaşımlardan derlendi" ise sayfada küçük bir not çıkar.
Etkinlik sonrası özeti elle düzelttiysen "Elle yazıldı"ya çevir.

## Bu kayıtlar herkese açık

Sanity'deki her şey herkes tarafından okunabilir. **Bütçe, katılımcı isim
listesi, telefon/e-posta, iç notlar buraya girilmez** — onların yeri Notion.
Konuşmacı adı gibi zaten herkese duyurulmuş bilgiler sorun değil.

## Düzeltmek, gizlemek

- **Düzeltmek:** kaydı aç, değiştir, **Publish**.
- **Gizlemek:** **Sitede gizle** kutusunu işaretle. Kayıt Studio'da kalır.
- **Silmek:** üç nokta → **Delete**. Geri dönüşü yok; önce gizlemeyi düşün.

## Bir şeyler ters gittiğinde

Yayınladın ama sitede yoksa sayfayı sert yenile (⌘⇧R). Beş dakika sonra hâlâ
yoksa Erdem'e haber ver — büyük ihtimalle tazeleme webhook'uyla ilgili.
