# İçerik dosyaları

Bu klasördeki dosyalar sitenin **sık değişen içeriğini** tutar. Kod bilmeye gerek
yok; GitHub üzerinden düzenlenebilirler.

| Dosya        | Nereyi besler                                        |
| ------------ | ---------------------------------------------------- |
| `links.json` | `/links` (linktree) sayfasındaki butonlar, iki dilde |
| `posts.json` | Ana sayfadaki "öne çıkan X paylaşımları" bölümü      |

Her ikisinde de akış aynı: GitHub'da dosyayı düzenle → pull request aç → kontrol
yeşile dönünce birleştirilir.

> **Blog yazıları burada değil.** Onlar Sanity'de tutulur ve `/studio`
> adresinden yazılır — GitHub'a hiç uğramazsın. Rehber:
> **[`docs/blog.md`](../docs/blog.md)**.
>
> Buradaki `posts.json` blog değil, ana sayfadaki **X paylaşımları** bölümüdür.

---

## `links.json` nasıl güncellenir?

`/links`, Instagram biyografisine koyduğumuz "linktree" sayfasıdır. **İki dilde
yayınlanıyor** ve ziyaretçi hangi dili göreceğine karar vermek zorunda değil:
[`ytublockchain.com/links`](https://ytublockchain.com/links) adresi tarayıcının
diline bakıp Türkçeyi ya da İngilizceyi gösteriyor. Yani linki paylaşırken tek
bir adres yetiyor — Türk bir öğrenciye de yabancı bir sponsora da aynı link
gidiyor, ikisi de kendi dilinde açıyor. (Sayfanın üstündeki TR/EN düğmesi de
duruyor: tahmin tutmazsa ziyaretçi elle değiştirebiliyor.)

Her iki dil de bu dosyadan besleniyor, yani bir butonu eklerken **iki dilde de**
yazman gerekiyor.

Oradaki butonları değiştirmek için:

1. GitHub'da bu dosyayı aç:
   [`content/links.json`](https://github.com/YTU-BLOCKCHAIN/ytu-blockchain-web/blob/dev/content/links.json)
2. Sağ üstteki **kalem (✏️ Edit this file)** ikonuna tıkla.
3. Değişikliği yap (aşağıdaki örneklere bak).
4. Sayfanın altındaki **Commit changes...** düğmesine bas.
5. Açılan kutuda **"Create a new branch for this commit and start a pull
   request"** seçili olsun → **Propose changes** → **Create pull request**.
6. Pull request'te otomatik kontroller çalışır. Yeşile döndüğünde Erdem birleştirir
   ve değişiklik yayına alınır.

> **Not:** Adım 5'te doğrudan `dev` dalına yazamazsın — bu kasıtlı. Her değişiklik
> pull request'ten geçer ki hatalı bir düzenleme siteyi bozmasın.

### Yeni link eklemek

`links` listesine yeni bir blok ekle. Bloklar arasında **virgül** olmalı, son
bloktan sonra virgül **olmamalı**:

```json
{
  "label": { "tr": "Etkinlik Kaydı", "en": "Event Registration" },
  "url": "https://lu.ma/ytublockchain",
  "note": {
    "tr": "12 Şubat, YTÜ Davutpaşa",
    "en": "February 12, YTÜ Davutpaşa"
  }
}
```

Gözünü korkutmasın: `tr` Türkçe sayfada, `en` İngilizce sayfada görünen yazı.
**İkisi de zorunlu** — biri eksik kalırsa pull request kontrolü kırmızı yanar ve
hangi satırda hangi dilin eksik olduğunu yazar. (Bu kasıtlı: yarım çevrilmiş bir
sayfa, Türkçe bilmeyen ziyaretçinin anlamadığı bir butona basması demek.)
İngilizcesinden emin değilsen Türkçesini yaz, pull request'te sor — kimse
makine çevirisi beklemiyor.

### Alanlar

| Alan       | Zorunlu | Ne işe yarar                                                                   |
| ---------- | ------- | ------------------------------------------------------------------------------ |
| `label`    | ✅      | Butonun üzerindeki yazı. İki dilde: `{ "tr": "...", "en": "..." }`             |
| `url`      | ✅      | Adres. Tek bir değer — dile göre değişmiyor, aşağıya bakın.                    |
| `note`     | —       | Butonun altındaki küçük gri açıklama. Yazılacaksa iki dilde de.                |
| `featured` | —       | `true` yaparsan buton dolu/vurgulu çizilir. **Yalnızca başvuru satırlarında.** |
| `hidden`   | —       | `true` yaparsan link sayfada görünmez. Silmeden gizlemek için.                 |

### `url` nasıl yazılır?

- **Dış bağlantı** `https://` ile başlar: `https://lu.ma/ytublockchain`
- **Kendi sitemizdeki sayfa** `/` ile başlar ve **dil öneki ALMAZ**:
  `/projects`, `/contact`, `/join`, anasayfa için yalnızca `/`.

Öneki bilerek yazmıyorsun: sayfa ziyaretçinin diline göre kendisi koyuyor
(Türkçe sayfadaki buton `/tr/projects`e, İngilizce sayfadaki `/en/projects`e
gidiyor). Yanlışlıkla `/tr/projects` yazarsan kontrol kırmızı yanar ve ne
yazman gerektiğini söyler — eskiden öyle yazılıydı ve İngilizce sayfadan gelen
ziyaretçi Türkçe siteye düşüyordu.

> **İstisna:** `/roadmap`, `/brand` ve `/logos` birer sayfa değil,
> yönlendirme (hedefleri Notion ve Drive). Onlar dil öneki almıyor, olduğu gibi
> yazılıyor.

### Sıralama

Butonlar dosyadaki sırayla görünür. Yukarı taşımak istediğin bloğu kes-yapıştır.

### Sık yapılan hatalar

Bunlardan biri olursa pull request'teki kontrol **kırmızı** yanar ve hata satırı
yazar — panik yok, düzeltip tekrar commit'le. Site bozulmaz.

- Bloklar arasında virgül unutmak veya sonuncudan sonra fazladan virgül bırakmak.
- Tırnak işaretini kapatmamak.
- `url` alanını `www.` veya `http://` ile başlatmak → `https://` olmalı.
- Türkçe tırnak (`"`) kullanmak → düz tırnak (`"`) olmalı.
- `label` veya `note`u tek dilde bırakmak → `tr` ve `en` birlikte yazılmalı.
- İç adrese dil öneki yazmak (`/tr/projects`) → öneksiz yazılmalı (`/projects`).

### Sosyal medya hesapları

Instagram / X / GitHub satırları (listenin en altındaki üç bağlantı) bu dosyadan
**değil**, `src/lib/site.ts` içindeki `siteConfig.social` alanından gelir — çünkü aynı adresler sitenin başka
yerlerinde de kullanılıyor ve tek yerden yönetilmesi gerekiyor. Hesap adresi
değişirse orayı güncellemek lazım (kod dosyası, bir geliştiriciye söyleyin).

### Sayfanın geri kalan yazıları

Logonun altındaki `// bağlantılar` satırı ve sekme başlığındaki "Bağlantılar"
kelimesi bu dosyada değil, sitenin diğer bütün arayüz metinleriyle birlikte
`messages/tr.json` ve `messages/en.json` içindeki `Links` bölümünde. Buton
metinleri burada, kabuk orada.

---

## `posts.json` nasıl güncellenir?

Ana sayfanın alt kısmında, hackathon karelerinin altında **"X'ten — Kulüpten öne
çıkan paylaşımlar"** bölümü var. Oradaki kartları bu dosya belirler.

**Sadece paylaşımın adresini yapıştırıyorsun.** Metin, tarih ve hesap adı X'ten
otomatik çekilir — kopyalamana gerek yok, yazım hatası riski yok, kartta yazan
şey gerçek paylaşımla birebir aynı kalır.

### Paylaşımın adresi nasıl alınır?

1. X'te paylaşımı aç.
2. Altındaki **paylaş ikonu** → **Kopyala / Copy link**.
3. Elinde şuna benzer bir adres olur:
   `https://x.com/BlockchainYtu/status/1234567890123456789`

### Dosyaya eklemek

[`content/posts.json`](https://github.com/YTU-BLOCKCHAIN/ytu-blockchain-web/blob/dev/content/posts.json)
→ kalem ikonu → adresi listeye ekle → Commit changes → pull request aç.

```json
{
  "posts": [
    "https://x.com/BlockchainYtu/status/1111111111111111111",
    "https://x.com/BlockchainYtu/status/2222222222222222222",
    "https://x.com/BlockchainYtu/status/3333333333333333333"
  ]
}
```

- Adresler **tırnak içinde**, aralarında **virgül**, sonuncudan sonra virgül
  **yok**.
- Kartlar dosyadaki sırayla görünür — en yeniyi en üste koy.
- **3 tane öneririm.** Daha fazlası ana sayfayı uzatır.
- Bir paylaşımı kaldırmak için satırını sil.
- Liste boş bırakılırsa (`"posts": []`) bölüm ana sayfada hiç görünmez.

### Bilmen gereken üç şey

1. **Canlı değil.** Yeni attığın paylaşım kendiliğinden düşmez; buraya
   eklenmesi ve pull request'in birleştirilmesi gerekir. (X'in otomatik akış
   servisi bize kapalı olduğu için bu yol seçildi.)
2. **Bayat kalmasın.** Ana sayfada aylar öncesine ait paylaşımlar durursa kulüp
   sessizmiş gibi görünür — bölümün hiç olmamasından kötüdür. Ayda bir göz at.
3. **Silinen paylaşım sorun çıkarmaz.** X'ten silinen ya da çekilemeyen bir
   paylaşım sessizce atlanır, site bozulmaz. Hiçbiri çekilemezse bölüm gizlenir.

### Hata yaparsan

Adres X paylaşım biçiminde değilse pull request kontrolü kırmızı yanar ve hangi
satırın hatalı olduğunu yazar. Site bozulmaz — düzeltip tekrar commit'lemen
yeterli.
