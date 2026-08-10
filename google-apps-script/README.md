# google-apps-script/

Sitedeki formların arka ucu. [`Code.gs`](Code.gs) bir **Google Apps Script Web
App**'i olarak yayınlanır; Next.js sunucusu form gönderimlerini oraya POST eder.

```text
Tarayıcı ──form──▶ Next.js Server Action ──JSON+secret──▶ Apps Script Web App
                    (doğrulama, spam)                      ├─ Sheets'e satır
                                                           ├─ kulübe bildirim
                                                           └─ dolduran kişiye onay
```

Kod burada versiyonlanır, Google tarafına kopyalanır. Değişiklik yaptığında
**yeniden deploy etmen gerekir** (aşağıda 6. adım).

## Kurulum

### 1. Tabloyu oluştur

Kulüp Google hesabıyla yeni bir Google Sheets dosyası aç — örn.
`YTÜ Blockchain — Form Kayıtları`. Sekme açmana gerek yok; script `İletişim` ve
`Başvurular` sekmelerini ilk kayıtta başlıklarıyla birlikte kendisi oluşturur.

### 2. Script'i bağla

Tabloda **Uzantılar → Apps Script**. Açılan editörde `Code.gs` içeriğini bu
depodaki [`Code.gs`](Code.gs) ile değiştir. Projeye bir ad ver
(`ytu-blockchain-forms`).

`CONFIG` bloğundaki üç değeri kontrol et:

| Alan           | Ne işe yarar                              |
| -------------- | ----------------------------------------- |
| `NOTIFY_EMAIL` | Yeni kayıt bildirimlerinin gideceği adres |
| `SENDER_NAME`  | Onay e-postasında görünen gönderen adı    |
| `SITE_URL`     | Onay e-postasındaki site linki            |

### 3. Paylaşılan gizli anahtarı üret

**Neden gerekiyor?** Web App'i birazdan "erişimi olan: herkes" olarak
yayınlayacaksın (4. adım). Bu zorunlu — isteği gönderen Vercel sunucusunun
Google hesabı yok, kimliğini Google'a kanıtlayamıyor. Yani kapı herkese açık
kalıyor ve URL'i ele geçiren biri doğrudan oraya istek atıp tabloya istediği
satırı ekleyebilir.

Gizli anahtar bu kapının parolası: site her gönderimde anahtarı isteğin içine
koyar, script bendekiyle aynı mı diye bakar, tutmuyorsa reddeder. Anahtar
**iki yerde** durur ve birebir aynı olmalıdır — Apps Script'te (kontrol eden
taraf) ve Vercel'de (gönderen taraf). Koda yazılmaz, çünkü bu depo herkese açık.

**Üret.** Rastgele 64 karakter; tahmin edilemez olması tek şart:

```bash
openssl rand -hex 32
```

```powershell
# PowerShell alternatifi
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
```

**Kaydet.** Apps Script editöründe sol menüden **⚙ Proje Ayarları**, sayfanın en
altında **Komut dosyası özellikleri** → **Komut dosyası özelliği ekle**:

| Özellik              | Değer                     |
| -------------------- | ------------------------- |
| `FORM_SHARED_SECRET` | Az önce ürettiğin anahtar |

Script özellikleri Google tarafında kalır; kodla birlikte kopyalanmaz, depoya
girmez. Aynı değeri 5. adımda Vercel'e de gireceksin.

> **`SPREADSHEET_ID` gerekir mi?** Script'i tablonun içinden (Uzantılar → Apps
> Script) açtıysan **hayır** — script zaten o tabloya bağlı, hangi dosyaya
> yazacağını kendi bulur. Bu özellik yalnızca script'i ayrı/bağımsız bir proje
> olarak oluşturduysan gerekir; o durumda ikinci bir özellik olarak tablonun
> ID'sini (tablo URL'indeki `/d/` ile `/edit` arasındaki uzun kod) ekle.

### 4. Web App olarak yayınla

**Dağıt → Yeni dağıtım → Tür: Web uygulaması**

| Ayar         | Değer                  |
| ------------ | ---------------------- |
| Yürüten      | **Ben** (kulüp hesabı) |
| Erişimi olan | **Herkes**             |

"Herkes" ürkütücü görünüyor ama gerekli: istek Vercel sunucusundan geliyor,
Google hesabı yok. Yetkilendirmeyi gizli anahtar sağlıyor.

İlk dağıtımda Google izin isteyecek (Sheets'e yazma + e-posta gönderme).
"Gelişmiş → …projesine git" diyerek onayla — kendi yazdığın script olduğu için
"doğrulanmamış uygulama" uyarısı normaldir.

Dağıtım sonunda verilen **Web app URL**'ini kopyala
(`https://script.google.com/macros/s/…/exec`).

### 5. Vercel tarafını bağla

Vercel → proje → **Settings → Environment Variables**. Üçü de Production +
Preview ortamlarına eklenir:

| Değişken             | Değer                     |
| -------------------- | ------------------------- |
| `FORM_ENDPOINT_URL`  | 4. adımdaki Web app URL'i |
| `FORM_SHARED_SECRET` | 3. adımdaki anahtar       |

Yerelde denemek için aynı ikisini `.env.local` dosyasına yaz (bkz.
[`.env.example`](../.env.example)). İkisi de tanımlı değilse formlar
"şu an gönderilemiyor" hatası verir — sessizce kaybolmaz.

### 6. Doğrula

```bash
curl -s "<web-app-url>"
# {"ok":true,"service":"ytu-blockchain-forms"}
```

Sonra sitedeki `/tr/contact` formunu doldur: tabloda satır belirmeli, kulüp
adresine bildirim ve doldurduğun adrese onay e-postası düşmeli.

## Bakım

**Kod değişince yeniden dağıt.** Apps Script'te kaydetmek yetmez:
**Dağıt → Dağıtımları yönet → (kalem) → Sürüm: Yeni sürüm → Dağıt**. URL aynı
kalır, Vercel tarafında bir şey değişmez. Yeni dağıtım yerine "Yeni dağıtım"
seçilirse URL değişir — o zaman `FORM_ENDPOINT_URL` da güncellenmeli.

**E-posta kotası.** Apps Script günlük mail sınırına tabidir: ücretsiz Gmail
hesaplarında 100/gün, Google Workspace hesaplarında 1.500/gün. Her gönderim iki
mail harcar (bildirim + onay). Kulüp hacmi için fazlasıyla yeterli, ama kota
dolarsa kayıt yine tabloya düşer — sadece e-postalar gitmez.

**Loglar.** Apps Script editöründe **Yürütmeler** sekmesi her isteği ve hatayı
gösterir. Bir gönderim tabloya düşmediyse buraya bak.

**Gizli anahtarı değiştirmek.** Script özelliğini ve Vercel değişkenini birlikte
güncelle; ikisi eşleşmediği anda tüm gönderimler reddedilir.
