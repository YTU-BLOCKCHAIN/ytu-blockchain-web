/**
 * YTÜ Blockchain — form alıcı (Google Apps Script Web App).
 *
 * Sitedeki iletişim ve üyelik başvurusu formları, Next.js sunucusu üzerinden
 * (asla tarayıcıdan doğrudan değil) buraya POST eder. Bu script üç iş yapar:
 *
 *   1. Kaydı ilgili Sheets sekmesine satır olarak yazar,
 *   2. kulübe bildirim e-postası atar,
 *   3. formu dolduran kişiye onay e-postası atar (TR/EN).
 *
 * Sıra bilinçli: Sheets yazımı kritik (başarısızsa istek hata döner), e-postalar
 * best-effort — mail kotası dolsa bile başvuru kaydı kaybolmaz.
 *
 * Kurulum ve deploy adımları: google-apps-script/README.md
 */

/** Kurulumda kulübün kendi değerleriyle güncellenir. */
const CONFIG = {
  /** Yeni kayıt bildirimlerinin düşeceği kulüp adresi. */
  NOTIFY_EMAIL: 'dev@ytublockchain.com',
  /** Onay e-postasında görünen gönderen adı. */
  SENDER_NAME: 'YTÜ Blockchain',
  /** Onay e-postasındaki site linki. */
  SITE_URL: 'https://ytublockchain.com',
};

/**
 * Form tanımları. `columns` hem Sheets başlık satırını hem sütun sırasını
 * belirler: [görünen başlık, kayıt alanı].
 */
const FORMS = {
  contact: {
    sheet: 'İletişim',
    columns: [
      ['Tarih', 'timestamp'],
      ['Ad Soyad', 'name'],
      ['E-posta', 'email'],
      ['Mesaj', 'message'],
      ['Dil', 'locale'],
      ['KVKK Onayı', 'consent'],
    ],
  },
  join: {
    sheet: 'Başvurular',
    columns: [
      ['Tarih', 'timestamp'],
      ['Ad Soyad', 'name'],
      ['E-posta', 'email'],
      ['Bölüm / Sınıf', 'department'],
      ['Motivasyon', 'motivation'],
      ['Dil', 'locale'],
      ['KVKK Onayı', 'consent'],
    ],
  },
};

/** Formu dolduran kişiye giden onay e-postası metinleri. */
const CONFIRMATION = {
  contact: {
    tr: {
      subject: 'Mesajını aldık — YTÜ Blockchain',
      heading: 'Mesajın bize ulaştı',
      body: 'Merhaba {name}, yazdığın için teşekkürler. Mesajını aldık ve en kısa sürede sana geri döneceğiz.',
      note: 'Bu e-posta otomatik gönderildi; yanıtlayarak bize doğrudan ulaşabilirsin.',
    },
    en: {
      subject: 'We received your message — YTÜ Blockchain',
      heading: 'Your message reached us',
      body: 'Hi {name}, thanks for writing. We received your message and will get back to you as soon as possible.',
      note: 'This is an automated email; you can reply to it to reach us directly.',
    },
  },
  join: {
    tr: {
      subject: 'Başvurunu aldık — YTÜ Blockchain',
      heading: 'Başvurun bize ulaştı',
      body: 'Merhaba {name}, aramıza katılmak istediğin için teşekkürler. Başvurunu aldık; değerlendirip en kısa sürede sana geri döneceğiz.',
      note: 'Bu e-posta otomatik gönderildi; yanıtlayarak bize doğrudan ulaşabilirsin.',
    },
    en: {
      subject: 'We received your application — YTÜ Blockchain',
      heading: 'Your application reached us',
      body: 'Hi {name}, thanks for your interest in joining us. We received your application and will review it and get back to you soon.',
      note: 'This is an automated email; you can reply to it to reach us directly.',
    },
  },
};

/**
 * Web App girişi. Next.js sunucusundan JSON gövdeli POST bekler:
 * `{ secret, form: 'contact' | 'join', locale: 'tr' | 'en', data: {...} }`
 */
function doPost(e) {
  try {
    const secret =
      PropertiesService.getScriptProperties().getProperty(
        'FORM_SHARED_SECRET',
      ) || '';
    if (!secret) return jsonResponse({ ok: false, error: 'not_configured' });

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'empty_body' });
    }

    const payload = JSON.parse(e.postData.contents);
    if (payload.secret !== secret) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const form = FORMS[payload.form];
    if (!form) return jsonResponse({ ok: false, error: 'unknown_form' });

    const locale = payload.locale === 'tr' ? 'tr' : 'en';
    const record = Object.assign({}, payload.data, {
      timestamp: new Date(),
      locale: locale,
      consent: payload.data && payload.data.consent ? 'Evet' : 'Hayır',
    });

    // Kritik adım: kayıt kaybolmasın diye e-postalardan önce.
    appendRow(form, record);

    // E-postalar best-effort — biri patlarsa istek yine başarılı sayılır.
    trySend(function () {
      notifyClub(payload.form, record);
    }, 'notifyClub');
    trySend(function () {
      sendConfirmation(payload.form, locale, record);
    }, 'sendConfirmation');

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('doPost failed: ' + error);
    return jsonResponse({ ok: false, error: 'server_error' });
  }
}

/** Deploy'un ayakta olduğunu doğrulamak için; hiçbir veri döndürmez. */
function doGet() {
  return jsonResponse({ ok: true, service: 'ytu-blockchain-forms' });
}

/** Kaydı forma ait sekmeye ekler; sekme yoksa başlıklarıyla birlikte oluşturur. */
function appendRow(form, record) {
  const sheet = getOrCreateSheet(form);
  const row = form.columns.map(function (column) {
    const value = record[column[1]];
    return value === undefined || value === null ? '' : value;
  });
  sheet.appendRow(row);
}

/** Sekmeyi döndürür; ilk çağrıda oluşturup başlık satırını sabitler. */
function getOrCreateSheet(form) {
  const spreadsheet = openSpreadsheet();
  let sheet = spreadsheet.getSheetByName(form.sheet);
  if (sheet) return sheet;

  sheet = spreadsheet.insertSheet(form.sheet);
  const headers = form.columns.map(function (column) {
    return column[0];
  });
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

/**
 * Hedef tabloyu açar. Script bir Sheets dosyasına bağlıysa (container-bound)
 * aktif dosya kullanılır; standalone kurulumda `SPREADSHEET_ID` script
 * özelliği gerekir.
 */
function openSpreadsheet() {
  const id =
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      'Tablo bulunamadı: script bir Sheets dosyasına bağlı değil ve SPREADSHEET_ID tanımlı değil.',
    );
  }
  return active;
}

/** Kulübe yeni kayıt bildirimi — yanıtla dendiğinde doğrudan kişiye gider. */
function notifyClub(formKey, record) {
  const form = FORMS[formKey];
  const title = formKey === 'join' ? 'Yeni üyelik başvurusu' : 'Yeni iletişim mesajı';
  const lines = form.columns
    .filter(function (column) {
      return column[1] !== 'timestamp';
    })
    .map(function (column) {
      return column[0] + ': ' + (record[column[1]] || '—');
    });

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: '[' + CONFIG.SENDER_NAME + '] ' + title + ' — ' + record.name,
    replyTo: record.email,
    name: CONFIG.SENDER_NAME,
    body: lines.join('\n'),
  });
}

/** Formu dolduran kişiye onay e-postası (sitedeki diline göre TR/EN). */
function sendConfirmation(formKey, locale, record) {
  const copy = CONFIRMATION[formKey][locale];
  const body = copy.body.replace('{name}', record.name);

  MailApp.sendEmail({
    to: record.email,
    subject: copy.subject,
    replyTo: CONFIG.NOTIFY_EMAIL,
    name: CONFIG.SENDER_NAME,
    body: body + '\n\n' + copy.note + '\n' + CONFIG.SITE_URL,
    htmlBody: confirmationHtml(copy, body),
  });
}

/** Onay e-postasının HTML gövdesi — istemci uyumu için satır içi stil. */
function confirmationHtml(copy, body) {
  return [
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;',
    'max-width:560px;margin:0 auto;padding:32px 24px;color:#111827;line-height:1.6">',
    '<p style="margin:0 0 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280">',
    CONFIG.SENDER_NAME,
    '</p>',
    '<h1 style="margin:0 0 16px;font-size:22px;font-weight:600">',
    escapeHtml(copy.heading),
    '</h1>',
    '<p style="margin:0 0 24px;font-size:15px">',
    escapeHtml(body),
    '</p>',
    '<p style="margin:0 0 32px">',
    '<a href="' + CONFIG.SITE_URL + '" ',
    'style="color:#111827;font-size:15px;font-weight:500">',
    CONFIG.SITE_URL.replace(/^https?:\/\//, ''),
    '</a></p>',
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 16px">',
    '<p style="margin:0;font-size:13px;color:#6b7280">',
    escapeHtml(copy.note),
    '</p>',
    '</div>',
  ].join('');
}

/** Kullanıcı girdisi HTML gövdeye girmeden önce kaçırılır. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** E-posta gönderimini yutar: hata loglanır ama isteği düşürmez. */
function trySend(send, label) {
  try {
    send();
  } catch (error) {
    console.error(label + ' failed: ' + error);
  }
}

/** Apps Script'in JSON dönüş biçimi. */
function jsonResponse(payload) {
  return ContentService.createTextOutput(
    JSON.stringify(payload),
  ).setMimeType(ContentService.MimeType.JSON);
}
