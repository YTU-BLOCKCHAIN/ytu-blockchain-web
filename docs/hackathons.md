# Hackathon derecesi nasıl eklenir?

Ana sayfadaki **"Kazandığımız hackathonlar"** karuselini besleyen kayıtlar
Sanity Studio'da tutulur. Kod bilmeye ve GitHub'a girmeye gerek yok — görsel
dahil her şey Studio'dan giriliyor.

> Blog yazısı yazacaksan farklı bir rehber var:
> **[`docs/blog.md`](blog.md)**.

## İlk kez giriyorsan

1. **[ytublockchain.com/studio](https://ytublockchain.com/studio)** adresine git.
2. Sana verilen yöntemle giriş yap (Google / GitHub / e-posta).
3. Sol menüde **Hackathonlar**'ı seç.

## Yeni kayıt eklemek

Sağ üstteki **+** (yeni doküman) düğmesine bas ve alanları doldur.

| Alan                  | Zorunlu | Ne yazılır                                                          |
| --------------------- | ------- | ------------------------------------------------------------------- |
| **Etkinlik adı**      | ✅      | Markadır, **çevrilmez**: iki dilde de aynı. Örn. `ETHIstanbul`.     |
| **Yıl**               | ✅      | Kartın üstünde küçük yazıyla görünür ve **sıralamayı belirler**.    |
| **Derece**            | —       | Derece aldıysanız. Örn. `1.'lik` / `1st place`. Boşsa rozet çıkmaz. |
| **Not**               | —       | Takım, track ya da tek cümlelik hikâye. Türkçe + İngilizce.         |
| **Kare görseli**      | —       | Yatay (16:10 civarı) bir kare en iyi oturur.                        |
| **Duyuru bağlantısı** | —       | Haber, X paylaşımı veya etkinlik sayfası. `https://` ile başlamalı. |

Zorunlu olan yalnızca **Etkinlik adı** ve **Yıl**. Her hackathon'da derece
almak gerekmiyor — bölüm takımın yer aldığı etkinlikleri listeliyor, derece
girilmezse kartta rozet hiç görünmez.

Bitince sağ alttaki **Publish**'e bas. Kayıt birkaç saniye içinde ana sayfada.

### Dil alanları

**Derece** ve **Not** alanlarının içinde `Türkçe` ve `İngilizce` diye iki kutu
var. İkisi de isteğe bağlı; ama **birini doldurursan diğerini de doldurman
gerekiyor** — Studio yarım çeviriyi yayınlatmaz.

Blog yazılarından farklı olarak burada **her dil için ayrı kayıt açılmaz**. Tek
kayıt iki dili birden taşır; görseli ve yılı bir kez girersin. Böylece bir
çeviri eksik kaldı diye kart o dilde kaybolmaz.

## Sıralama

Kareler **yıla göre yeniden eskiye** dizilir; Studio'daki sıra önemsiz, elle
sıralamakla uğraşmıyorsun. Aynı yıla ait iki derece varsa sonra eklenen üstte
görünür.

## Görseller için

- **Yatay** kare seç: kart görseli 16:10 oranında kırpıyor.
- Studio'da görsele tıklayıp **hotspot** (odak noktası) ayarlayabilirsin —
  kırpma o noktayı merkezde tutar, yani takımın yüzü kesilmez.
- Büyük dosya yüklemekten çekinme; siteye küçültülmüş ve modern formata
  çevrilmiş hâli iniyor.
- Görsel yüklemezsen kartta kupa ikonlu bir yer tutucu çıkar — kayıt yine de
  görünür.

## Kaydı düzeltmek veya kaldırmak

- **Düzeltmek:** kaydı aç, değiştir, tekrar **Publish**.
- **Kaldırmak:** kaydı aç → sağ alttaki üç nokta → **Delete**. Karusel kalan
  kayıtlarla devam eder.
- **Hiç kayıt kalmazsa** bölüm kaybolmaz: üç tane "yakında" yer tutucu kare
  çizilir.

## Sık yapılan hatalar

- **Etkinlik adını çevirmek.** `ETHIstanbul` iki dilde de `ETHIstanbul`. Derece
  ve not çevrilir, marka adı çevrilmez.
- **Yılı boş bırakmak.** Zorunlu, çünkü sıralama ona bakıyor.
- **Bağlantıyı `www.` ile yazmak.** `https://` ile başlamalı, yoksa Studio
  kabul etmez.
- **Dikey görsel yüklemek.** Kart yatay kırpar; dikey karede insanların başı
  kesilir.

## Bir şeyler ters gittiğinde

Yayınladın ama ana sayfada görünmüyorsa: sayfayı sert yenile (⌘⇧R). Birkaç
dakika sonra hâlâ yoksa Erdem'e haber ver — büyük ihtimalle tazeleme
webhook'uyla ilgili, senin yaptığın bir şeyle değil.
