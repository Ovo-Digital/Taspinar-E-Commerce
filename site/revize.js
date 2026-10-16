/* Eda Taşpınar — Revize Modu
 *
 * Ekip siteyi gezerken bir öğeye tıklayıp not bırakır: kalsın / kaldırılsın /
 * değiştirilsin / buraya eklensin, öncelik, serbest not ve görsel. Notlar
 * tarayıcıda birikir (sayfa değişse de kaybolmaz); "Gönder" denince
 * /api/revize'ye gider ve revize reposunda GitHub issue olur.
 *
 * Düğme yalnızca sunucuda GITHUB_TOKEN tanımlıysa görünür (/api/revize "acik"
 * der). Yerelde denemek için adrese ?revize eklenir; o zaman gönderim çalışmaz.
 * Mod kapalıyken hiçbir olay dinlenmez, site normal çalışır.
 */
(() => {
  const DEPO = 'eda-revize-v1', EN_FAZLA_GORSEL = 3;
  /* Not bırakılabilecek öğeler: tıklanan yere en yakın anlamlı blok seçilir */
  const SECILEBILIR = [
    'header', 'footer', 'section', 'article', 'nav', 'aside', 'button', 'a', 'input', 'select', 'textarea', 'form',
    'h1', 'h2', 'h3', 'h4', 'img', 'picture', 'video', 'table', 'li', 'p',
    '.by-card', '.by-info', '.by-pc', '.by-bar', '.by-sub', '.by-qty', '.by-size', '.by-buy',
  ].join(',');
  const KENDI = '[data-revize]';
  const EYLEMLER = [['kalsin', 'Kalsın'], ['kaldir', 'Kaldırılsın'], ['degistir', 'Değiştirilsin'], ['ekle', 'Buraya eklensin']];
  const TUR = {
    h1: 'başlık', h2: 'başlık', h3: 'başlık', h4: 'başlık', button: 'düğme', a: 'bağlantı', img: 'görsel', picture: 'görsel', video: 'video',
    input: 'alan', select: 'seçim', textarea: 'alan', section: 'bölüm', header: 'üst menü', footer: 'alt bilgi', nav: 'menü', aside: 'yan panel',
    table: 'tablo', li: 'liste öğesi', p: 'yazı', form: 'form', article: 'kart',
  };
  const SINIF_TUR = [['.by-card', 'ürün kartı (sepete ekle)'], ['.by-info', 'açıklamalar'], ['.by-pc', 'ürün kartı'], ['.by-bar', 'alt sepet barı'],
    ['.by-sub', 'abonelik kutusu'], ['.by-qty', 'adet seçici'], ['.by-size', 'boyut'], ['.by-buy', 'adet + sepete ekle']];
  const SAYFA = { '': 'Ana sayfa', 'index.html': 'Ana sayfa', 'koleksiyon.html': 'Koleksiyon', 'urun.html': 'Ürün detay', 'urun-eski.html': 'Eski ürün detay', 'sepet.html': 'Sepet', 'pdp-secenek.html': 'Ürün detay seçenekleri' };

  const esc = (s = '') => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const oku = () => { try { const d = JSON.parse(localStorage.getItem(DEPO)); return { kisi: d && d.kisi || null, notlar: d && Array.isArray(d.notlar) ? d.notlar : [] }; } catch (e) { return { kisi: null, notlar: [] }; } };
  const yaz = () => { try { localStorage.setItem(DEPO, JSON.stringify({ kisi: S.kisi, notlar: S.notlar })); return true; } catch (e) { durumGoster('Tarayıcı hafızası doldu; birkaç görseli silip tekrar dene.'); return false; } };

  const S = { acik: false, ...oku(), secilen: null, taslak: null, liste: false, durum: null, gonderiliyor: false, sunucu: false };
  let kok, vurgulu = null;

  /* ---------- öğeyi tanı ---------- */
  function sayfaAdi() {
    const dosya = location.pathname.split('/').pop(), q = new URLSearchParams(location.search), E = window.EDA || {};
    const ad = SAYFA[dosya] || dosya;
    const ek = q.get('p') ? (E.BOMBS && E.BOMBS[q.get('p')] ? E.BOMBS[q.get('p')].name : q.get('p')) : q.get('c') ? (E.CATS && E.CATS[q.get('c')] ? E.CATS[q.get('c')].name : q.get('c')) : '';
    return ek ? `${ad} › ${ek}` : ad;
  }
  function secici(el) {
    const p = []; let n = el;
    for (let i = 0; n && n !== document.body && i < 4; i++) {
      if (n.id) { p.unshift('#' + n.id); break; }
      const s = [...n.classList].filter(c => !c.startsWith('rv-')).slice(0, 2).join('.');
      p.unshift(n.tagName.toLowerCase() + (s ? '.' + s : ''));
      n = n.parentElement;
    }
    return p.join(' > ').slice(0, 200);
  }
  function hedef(el) {
    const sinif = SINIF_TUR.find(([s]) => el.matches(s));
    const tur = (sinif && sinif[1]) || el.getAttribute('aria-label') || TUR[el.tagName.toLowerCase()] || el.tagName.toLowerCase();
    const metin = (el.innerText || el.getAttribute('alt') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    return { tur, metin, secici: secici(el) };
  }

  /* ---------- görsel: küçült, JPEG'e çevir ---------- */
  function gorselOku(dosyalar) {
    const t = S.taslak; if (!t) return;
    [...dosyalar].filter(f => f.type.startsWith('image/')).slice(0, EN_FAZLA_GORSEL - t.gorseller.length).forEach(f => {
      const url = URL.createObjectURL(f), img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        if (S.taslak && S.taslak.gorseller.length < EN_FAZLA_GORSEL) { notuTut(); S.taslak.gorseller.push(c.toDataURL('image/jpeg', .8)); ciz(); }
      };
      img.src = url;
    });
  }

  /* ---------- seçim ---------- */
  function vurguTemizle() { if (vurgulu) vurgulu.classList.remove('rv-vurgu'); vurgulu = null; }
  function uzerinde(e) {
    if (S.secilen || !S.kisi) return;
    const h = e.target; if (!h || !h.closest || h.closest(KENDI)) return;
    const el = h.closest(SECILEBILIR);
    if (el === vurgulu) return;
    vurguTemizle(); if (el) { el.classList.add('rv-vurgu'); vurgulu = el; }
  }
  function tikla(e) {
    const h = e.target; if (!h || !h.closest || h.closest(KENDI)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (!S.kisi || S.secilen) return;
    const el = h.closest(SECILEBILIR); if (!el) return;
    vurguTemizle(); el.classList.add('rv-vurgu'); vurgulu = el;
    S.secilen = hedef(el); S.taslak = { eylem: 'degistir', oncelik: 'normal', not: '', gorseller: [] }; S.liste = false;
    ciz(); setTimeout(() => { const t = kok.querySelector('.rv-metin'); t && t.focus(); }, 30);
  }
  // Mod açıkken sitenin kendi tıklamaları (menü, sepete ekle, bağlantılar) çalışmasın
  const engelle = e => { const h = e.target; if (h && h.closest && !h.closest(KENDI)) { e.preventDefault(); e.stopPropagation(); } };
  function yapistir(e) {
    if (!S.taslak) return;
    const d = [...(e.clipboardData && e.clipboardData.files || [])].filter(f => f.type.startsWith('image/'));
    if (d.length) { e.preventDefault(); gorselOku(d); }
  }
  function modu(ac) {
    S.acik = ac; S.secilen = S.taslak = null; S.liste = false;
    const yon = ac ? 'addEventListener' : 'removeEventListener';
    document[yon]('mouseover', uzerinde, true);
    document[yon]('click', tikla, true);
    ['pointerdown', 'mousedown', 'submit'].forEach(t => document[yon](t, engelle, true));
    document[yon]('paste', yapistir);
    document.body.classList.toggle('rv-acik', ac);
    if (!ac) vurguTemizle();
    ciz();
  }

  /* ---------- notlar ---------- */
  function notuTut() { const t = kok && kok.querySelector('.rv-metin'); if (t && S.taslak) S.taslak.not = t.value; }
  function notEkle() {
    notuTut(); const t = S.taslak;
    if (t.eylem !== 'kalsin' && !t.not.trim() && !t.gorseller.length) { durumGoster('Ne olmasını istediğini kısaca yaz.'); return; }
    S.notlar.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      eylem: t.eylem, oncelik: t.oncelik, not: t.not.trim(), gorseller: t.gorseller,
      yol: location.pathname + location.search, sayfa: sayfaAdi(), hedef: S.secilen,
      ekran: innerWidth <= 768 ? 'telefon' : 'bilgisayar',
    });
    if (!yaz()) { S.notlar.pop(); return; }
    S.secilen = S.taslak = null; vurguTemizle(); ciz(); durumGoster('Not eklendi.');
  }
  function notSil(id) { S.notlar = S.notlar.filter(n => n.id !== id); yaz(); ciz(); }

  async function gonder() {
    if (!S.kisi || !S.notlar.length || S.gonderiliyor) return;
    S.gonderiliyor = true; S.durum = null; ciz();
    try {
      // Görseller önce tek tek yüklenir; yüklenen görselin yerel kopyası linkle değişir
      for (const n of S.notlar) {
        for (let i = 0; i < n.gorseller.length; i++) {
          if (typeof n.gorseller[i] !== 'string') continue;
          const r = await fetch('/api/revize-gorsel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: n.gorseller[i] }) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.error || 'Görsel yüklenemedi');
          n.gorseller[i] = { url: j.url }; yaz();
        }
      }
      const r = await fetch('/api/revize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kisi: S.kisi, notlar: S.notlar }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Gönderilemedi (' + r.status + ')');
      S.notlar = []; yaz();
      S.gonderiliyor = false; ciz(); durumGoster(`Teşekkürler! Revizelerin iletildi (${j.acilan} kayıt).`);
    } catch (e) {
      S.gonderiliyor = false; ciz();
      durumGoster(`Gönderilemedi, notların bu tarayıcıda duruyor. ${String(e.message || e)}`, true);
    }
  }
  // Yedek: sunucuya ulaşılamazsa notlar WhatsApp / e-posta ile gönderilebilecek metin olur
  function kopyala() {
    const ad = Object.fromEntries(EYLEMLER);
    const s = [`EDA TAŞPINAR SİTESİ — REVİZE`, `${S.kisi.ad} (${S.kisi.rol})`, ''];
    S.notlar.forEach((n, i) => s.push(`${i + 1}. [${ad[n.eylem]}${n.oncelik === 'yuksek' ? ' · Olmazsa olmaz' : ''}] ${n.sayfa} › ${n.hedef.tur}${n.hedef.metin ? ` "${n.hedef.metin.slice(0, 50)}"` : ''}${n.not ? `\n   ${n.not}` : ''}${n.gorseller.length ? `\n   (${n.gorseller.length} görsel — ayrıca gönder)` : ''}`));
    navigator.clipboard.writeText(s.join('\n')).then(() => durumGoster('Kopyalandı; WhatsApp ya da e-postayla gönderebilirsin.'));
  }

  let durumZaman;
  function durumGoster(m, hata) { S.durum = { m, hata }; ciz(); clearTimeout(durumZaman); if (!hata) durumZaman = setTimeout(() => { S.durum = null; ciz(); }, 3200); }

  /* ---------- arayüz ---------- */
  function ciz() {
    if (!kok) return;
    const ad = Object.fromEntries(EYLEMLER), n = S.notlar.length;
    let panel = '';
    if (S.acik && !S.kisi) panel = `
      <div class="rv-panel"><p class="rv-baslik">Revize modu</p><p class="rv-aciklama">Notların bu isimle iletilecek.</p>
        <input class="rv-alan" id="rvAd" placeholder="Ad soyad" autocomplete="name">
        <input class="rv-alan" id="rvRol" placeholder="Görevin (ör. Pazarlama)">
        <div class="rv-dugmeler"><button type="button" class="rv-btn rv-btn--sade" data-k="kapat">Vazgeç</button><button type="button" class="rv-btn" data-k="basla" disabled>Başla</button></div></div>`;
    else if (S.acik && S.secilen) {
      const t = S.taslak, h = S.secilen;
      panel = `
      <div class="rv-panel"><p class="rv-baslik">${esc(h.tur)}</p>${h.metin ? `<p class="rv-alinti">“${esc(h.metin.slice(0, 120))}”</p>` : ''}
        <div class="rv-eylemler">${EYLEMLER.map(([k, l]) => `<button type="button" class="rv-sec rv-sec--${k}${t.eylem === k ? ' rv-sec--aktif' : ''}" data-eylem="${k}">${l}</button>`).join('')}</div>
        <label class="rv-satir"><input type="checkbox" data-k="oncelik" ${t.oncelik === 'yuksek' ? 'checked' : ''}> Olmazsa olmaz</label>
        <textarea class="rv-metin" rows="3" placeholder="Ne olsun? Örn: bu yazı daha büyük olsun">${esc(t.not)}</textarea>
        ${t.gorseller.length ? `<div class="rv-gorseller">${t.gorseller.map((g, i) => `<span class="rv-gorsel"><img src="${typeof g === 'string' ? g : g.url}" alt=""><button type="button" data-gsil="${i}" aria-label="Görseli sil">×</button></span>`).join('')}</div>` : ''}
        ${t.gorseller.length < EN_FAZLA_GORSEL ? `<label class="rv-gorsel-ekle">+ Görsel ekle<input type="file" accept="image/*" multiple hidden data-k="dosya"><span class="rv-ipucu">ya da ekran görüntüsünü yapıştır (⌘V)</span></label>` : ''}
        <div class="rv-dugmeler"><button type="button" class="rv-btn rv-btn--sade" data-k="vazgec">Vazgeç</button><button type="button" class="rv-btn" data-k="ekle">Not ekle</button></div></div>`;
    } else if (S.acik && S.liste && n) panel = `
      <div class="rv-panel rv-panel--liste"><p class="rv-baslik">Notların · ${esc(S.kisi.ad)} <button type="button" class="rv-link" data-k="kimlik">değiştir</button></p>
        ${S.notlar.map(x => `<div class="rv-kayit"><i class="rv-nokta rv-nokta--${x.eylem}"></i><span><b>${ad[x.eylem]}${x.oncelik === 'yuksek' ? ' · olmazsa olmaz' : ''}</b><small>${esc(x.sayfa)} › ${esc(x.hedef.tur)}</small>${x.not ? `<em>${esc(x.not)}</em>` : ''}${x.gorseller.length ? `<small>${x.gorseller.length} görsel</small>` : ''}</span><button type="button" data-sil="${x.id}" aria-label="Notu sil">×</button></div>`).join('')}</div>`;

    const cubuk = S.acik && S.kisi && !S.secilen ? `
      <span class="rv-cubuk-yazi">${n ? `${n} not` : 'Bir yere tıkla'}</span>
      ${n ? `<button type="button" class="rv-btn rv-btn--sade" data-k="liste">${S.liste ? 'Gizle' : 'Notlar'}</button><button type="button" class="rv-btn rv-btn--altin" data-k="gonder" ${S.gonderiliyor ? 'disabled' : ''}>${S.gonderiliyor ? 'Gönderiliyor…' : 'Gönder'}</button>` : ''}` : '';

    kok.innerHTML = `
      ${panel}
      ${S.durum ? `<div class="rv-durum${S.durum.hata ? ' rv-durum--hata' : ''}">${esc(S.durum.m)}${S.durum.hata && n ? ` <button type="button" class="rv-link" data-k="kopyala">Metin olarak kopyala</button> <button type="button" class="rv-link" data-k="gonder">Tekrar dene</button>` : ''}<button type="button" class="rv-durum-x" data-k="durumx" aria-label="Kapat">×</button></div>` : ''}
      <div class="rv-cubuk${S.acik ? ' rv-cubuk--acik' : ''}">
        <button type="button" class="rv-fab" data-k="ac"><i class="rv-isik"></i>${S.acik ? '<span class="rv-uzun">Revizeyi kapat</span><span class="rv-kisa">Kapat</span>' : '<span class="rv-uzun">Revize modu</span><span class="rv-kisa">Revize</span>'}${!S.acik && n ? `<span class="rv-rozet">${n}</span>` : ''}</button>${cubuk}
      </div>`;

    const ad1 = kok.querySelector('#rvAd'), rol1 = kok.querySelector('#rvRol');
    if (ad1) {
      const kontrol = () => { kok.querySelector('[data-k="basla"]').disabled = !(ad1.value.trim().length > 1 && rol1.value.trim().length > 1); };
      ad1.addEventListener('input', kontrol); rol1.addEventListener('input', kontrol);
      rol1.addEventListener('keydown', e => { if (e.key === 'Enter' && !kok.querySelector('[data-k="basla"]').disabled) kok.querySelector('[data-k="basla"]').click(); });
      setTimeout(() => ad1.focus(), 30);
    }
    const dosya = kok.querySelector('[data-k="dosya"]');
    if (dosya) dosya.addEventListener('change', e => { gorselOku(e.target.files); e.target.value = ''; });
  }

  function tiklama(e) {
    const b = e.target.closest('button,input[type=checkbox]'); if (!b) return;
    const k = b.dataset.k;
    if (b.dataset.eylem) { notuTut(); S.taslak.eylem = b.dataset.eylem; ciz(); return; }
    if (b.dataset.gsil) { notuTut(); S.taslak.gorseller.splice(+b.dataset.gsil, 1); ciz(); return; }
    if (b.dataset.sil) { notSil(b.dataset.sil); return; }
    if (k === 'ac') { modu(!S.acik); return; }
    if (k === 'kapat') { modu(false); return; }
    if (k === 'basla') { S.kisi = { ad: kok.querySelector('#rvAd').value.trim(), rol: kok.querySelector('#rvRol').value.trim() }; yaz(); ciz(); durumGoster('Hazırsın. Not bırakmak istediğin yere tıkla.'); return; }
    if (k === 'kimlik') { S.kisi = null; S.liste = false; ciz(); return; }
    if (k === 'oncelik') { notuTut(); S.taslak.oncelik = b.checked ? 'yuksek' : 'normal'; return; }
    if (k === 'vazgec') { S.secilen = S.taslak = null; vurguTemizle(); ciz(); return; }
    if (k === 'ekle') { notEkle(); return; }
    if (k === 'liste') { S.liste = !S.liste; ciz(); return; }
    if (k === 'gonder') { gonder(); return; }
    if (k === 'kopyala') { kopyala(); return; }
    if (k === 'durumx') { S.durum = null; ciz(); }
  }

  function kur() {
    if (kok) return;
    kok = document.createElement('div');
    kok.setAttribute('data-revize', '');
    kok.className = 'rv';
    document.body.appendChild(kok);
    kok.addEventListener('click', tiklama);
    addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !S.acik) return;
      if (S.secilen) { S.secilen = S.taslak = null; vurguTemizle(); ciz(); } else if (S.liste) { S.liste = false; ciz(); }
    });
    ciz();
  }

  /* Düğme yalnızca sunucu gönderebilecekse görünür; yerelde ?revize ile zorlanır */
  const zorla = new URLSearchParams(location.search).has('revize');
  fetch('/api/revize', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : null))
    .then(j => { if ((j && j.acik) || zorla) kur(); })
    .catch(() => { if (zorla) kur(); });
})();
