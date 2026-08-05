# İçerik dosyaları

Bu klasördeki dosyalar sitenin **sık değişen içeriğini** tutar. Kod bilmeye gerek
yok; GitHub üzerinden düzenlenebilirler.

| Dosya        | Nereyi besler                                  |
| ------------ | ---------------------------------------------- |
| `links.json` | `ytublockchain.com/links` sayfasındaki linkler |

---

## `links.json` nasıl güncellenir?

`/links`, Instagram biyografisine koyduğumuz "linktree" sayfasıdır. Oradaki
butonları değiştirmek için:

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
  "label": "Etkinlik Kaydı",
  "url": "https://lu.ma/ytublockchain",
  "note": "12 Şubat, YTÜ Davutpaşa"
}
```

### Alanlar

| Alan       | Zorunlu | Ne işe yarar                                                             |
| ---------- | ------- | ------------------------------------------------------------------------ |
| `label`    | ✅      | Butonun üzerindeki yazı.                                                 |
| `url`      | ✅      | Dış bağlantı `https://` ile, kendi sayfamız `/` ile başlar (`/tr/join`). |
| `note`     | —       | Butonun altındaki küçük gri açıklama.                                    |
| `featured` | —       | `true` yaparsan buton dolu/vurgulu çizilir. **Yalnızca bir tanede.**     |
| `hidden`   | —       | `true` yaparsan link sayfada görünmez. Silmeden gizlemek için.           |

### Sıralama

Butonlar dosyadaki sırayla görünür. Yukarı taşımak istediğin bloğu kes-yapıştır.

### Sık yapılan hatalar

Bunlardan biri olursa pull request'teki kontrol **kırmızı** yanar ve hata satırı
yazar — panik yok, düzeltip tekrar commit'le. Site bozulmaz.

- Bloklar arasında virgül unutmak veya sonuncudan sonra fazladan virgül bırakmak.
- Tırnak işaretini kapatmamak.
- `url` alanını `www.` veya `http://` ile başlatmak → `https://` olmalı.
- Türkçe tırnak (`"`) kullanmak → düz tırnak (`"`) olmalı.

### Sosyal medya hesapları

Instagram / X / GitHub ikonları bu dosyadan **değil**, `src/lib/site.ts`
içindeki `siteConfig.social` alanından gelir — çünkü aynı adresler sitenin başka
yerlerinde de kullanılıyor ve tek yerden yönetilmesi gerekiyor. Hesap adresi
değişirse orayı güncellemek lazım (kod dosyası, bir geliştiriciye söyleyin).
