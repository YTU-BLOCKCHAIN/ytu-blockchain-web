# Blog yazısı nasıl yazılır?

Blog yazıları **Sanity Studio** üzerinden yazılır. Kod bilmeye, GitHub'a girmeye
ya da pull request açmaya gerek yok — yazıp **Publish**'e basıyorsun, birkaç
saniye içinde sitede oluyor.

> Studio adresi: **`<site-adresi>/studio`**
> Şu an: `https://ytu-blockchain-web.vercel.app/studio`
> (Alan adı bağlandığında `ytublockchain.com/studio` olacak.)

---

## İlk kez giriyorsan

1. Erdem'in seni Sanity projesine davet etmesi gerekiyor — e-postana davet gelir.
2. Studio adresini aç, **Google** ya da **GitHub** ile giriş yap. Davetin
   gönderildiği e-posta adresiyle giriş yaptığından emin ol.
3. Sol menüde **Blog yazıları** ve **Yazarlar** göreceksin. Göremiyorsan davet
   henüz kabul edilmemiş demektir.

---

## Yeni yazı yazmak

### 1. Dili seç

Sol menü: **Blog yazıları → Türkçe** (ya da **English**). Yazının dilini bu seçim
belirliyor — Türkçe listeden açtığın yazı sitenin Türkçe tarafında görünür.

> Yanlış listeden başlarsan yazı yanlış dilde kaydolur. Sonradan düzeltmek
> uğraştırıcı, baştan doğru listeyi seç.

Sağ üstteki **+** ile yeni yazı oluştur.

### 2. Alanları doldur

| Alan              | Zorunlu | Ne yazılır                                                                |
| ----------------- | ------- | ------------------------------------------------------------------------- |
| **Başlık**        | ✅      | Yazının başlığı. En fazla 90 karakter.                                    |
| **Adres**         | ✅      | Yazının site üzerindeki adresi. **Generate düğmesine bas** — aşağıya bak. |
| **Yayın tarihi**  | ✅      | Bugünün tarihi hazır gelir; ileri/geri alabilirsin.                       |
| **Özet**          | ✅      | 1–2 cümle. Kartlarda, Google'da ve paylaşım önizlemesinde bu görünür.     |
| **Kapak görseli** | ✅      | Yatay (16:9) görsel. Altındaki **Alternatif metin** de zorunlu.           |
| **Yazar**         | ✅      | Listeden seç. Yoksa önce yazar oluştur (aşağıda).                         |
| **Etiketler**     | —       | En fazla dört tane, örn. `etkinlik`, `ethereum`.                          |
| **İçerik**        | ✅      | Yazının gövdesi.                                                          |

### 3. Adres alanına dikkat

Başlığı yazdıktan sonra **Generate** düğmesine bas — adres başlıktan otomatik
üretilir ve Türkçe karakterler doğru çevrilir:

```
"YTÜ Blockchain ile Şubat Etkinliği"  →  ytu-blockchain-ile-subat-etkinligi
"Kripto Güvenliği: Cüzdan İpuçları"   →  kripto-guvenligi-cuzdan-ipuclari
```

Elle yazacaksan **yalnızca küçük harf, rakam ve tire** kullan. Boşluk, büyük harf
ya da Türkçe karakter girersen yayınlamana izin verilmez.

> **Yayına aldıktan sonra adresi değiştirme.** Paylaşılmış bağlantılar kırılır.

### 4. İçeriği yaz

Gövde alanında kullanabileceklerin:

- **Paragraf**, **Başlık**, **Alt başlık**, **Alıntı**
- Madde işaretli ve numaralı liste
- **Kalın**, _italik_, `satır içi kod`
- Bağlantı (metni seç → zincir ikonu). Kendi sayfalarımız için `/join` gibi
  yaz, dış siteler için `https://` ile başla.
- Görsel (satır aralarına eklenebilir; **alternatif metin** zorunlu, açıklama
  isteğe bağlı)

Çok satırlı kod bloğu **yok** — kulüp içeriği etkinlik duyurusu ve tanıtım
yazısı ağırlıklı olduğu için eklenmedi. Gerekirse söyleyin, eklenir.

### 5. Yayınla

Sağ alttaki **Publish** düğmesi. Zorunlu bir alan eksikse düğme uyarı verir ve
hangi alanın sorunlu olduğunu gösterir.

Yazı **birkaç saniye içinde** sitede görünür. Beş dakikayı geçtiyse bir terslik
var demektir — Erdem'e haber ver.

---

## Görseller için

- **Kapak:** yatay, en az 1200 piksel genişlik. Dikey görsel kartlarda kötü
  kırpılır.
- **Boyut derdi yok:** büyük dosya yükleyebilirsin, siteye küçültülmüş hâli
  iner.
- **Alternatif metin** görseli göremeyen birine görselin ne olduğunu anlatan tek
  cümledir; ekran okuyucular bunu okur. "resim1" yazma, "Etkinlikte konuşan
  Ahmet Yılmaz" yaz.

---

## Yazının çevirisini eklemek

Yazıyı aç, üst çubuktaki **Translations** düğmesine bas, öbür dili seç. Sanity
yazının bir kopyasını o dilde oluşturur; metinleri çevirmen yeterli.

Bir yazının çevirisi **olmak zorunda değil.** Yalnızca Türkçe yazılmış bir yazı
İngilizce blog listesinde hiç görünmez — bu kasıtlı.

---

## Yazıyı düzeltmek veya kaldırmak

- **Düzeltmek:** yazıyı aç, değiştir, tekrar **Publish**. Birkaç saniyede site
  güncellenir.
- **Yayından kaldırmak:** üst sağdaki üç nokta → **Unpublish**. Yazı Studio'da
  durur ama sitede görünmez.
- **Tamamen silmek:** üç nokta → **Delete**. Geri dönüşü yok, önce Unpublish'i
  düşün.

---

## Yeni yazar eklemek

Sol menü **Yazarlar → +**. Ad soyad zorunlu; ünvan, profil fotoğrafı ve kişisel
bağlantı isteğe bağlı. Yazarlar dilden bağımsızdır — aynı kişi hem Türkçe hem
İngilizce yazının altında görünür, iki kez oluşturmaya gerek yok.

---

## Sık yapılan hatalar

| Hata                                       | Ne olur                                     |
| ------------------------------------------ | ------------------------------------------- |
| Adresi elle boşluklu yazmak                | Publish engellenir, alan kırmızı yanar      |
| Yanlış dil listesinden başlamak            | Yazı yanlış dilde kaydolur                  |
| Özeti boş bırakmak                         | Publish engellenir (kartlarda kullanılıyor) |
| Alternatif metni boş bırakmak              | Publish engellenir                          |
| Yayındaki bir yazının adresini değiştirmek | Paylaşılmış bağlantılar kırılır             |
| Dikey kapak görseli                        | Kartlarda kötü kırpılır                     |

---

## Bir şeyler ters gittiğinde

- **Studio açılmıyor / giriş yapamıyorum:** davetin kabul edilmiş mi kontrol et,
  sonra Erdem'e yaz.
- **Yayınladım ama sitede yok:** beş dakika bekle, hâlâ yoksa Erdem'e haber ver
  (site tazeleme bağlantısı kopmuş olabilir).
- **Yanlışlıkla sildim:** hemen söyle, geri getirilebilir olup olmadığına
  bakılır.

Teknik taraf (şema, kurulum, ortam değişkenleri) için ana
[`README.md`](../README.md) dosyasına bakın.
