/* Eda Taşpınar — prototip etkileşimleri */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const { BOMBS, ORDER, raysFor, lum, fmt } = window.EDA;
  // İngilizce marka metinleri Türkçe büyük harf kuralına (i→İ) takılmasın
  const EN = '.rt b,.mk b,.srch__it b,.citem__name,.glowtype,.foot__line,.gang__title,.gang__name,.gang__dest,.pcard__name,.pdp__name,.dsc__name,.acc__label,.acc__p b,.acc__motto,.lhead__t,.chno,.meet__idx,.ditem b,.pdp-bar b,.dsc__pair span,.mm__pk b,.chips button,.crumbs,.pdp__label b,.foot__nav a[href*=koleksiyon],.sec-tag';
  const markEn = () => document.querySelectorAll(EN).forEach(el => el.lang = 'en');
  markEn(); new MutationObserver(markEn).observe(document.body, { childList: true, subtree: true });

  const img = k => `assets/bomb/${k}.webp`;
  const thumb = k => `assets/thumb/${k}.webp`; // küçük kartlar için hafif kopya
  const root = document.documentElement;

  /* ---------- Arka plan paleti (deneme): ?bg=kum veya son seçilen ---------- */
  const BGS = [['krem', '#f6f2ec', 'Krem'], ['kum', '#ede3d4', 'Kum'], ['pudra', '#f5e8e3', 'Pudra'], ['sampanya', '#f3ead8', 'Şampanya'], ['tas', '#e7e1d8', 'Taş'], ['karamel', '#e8d3b8', 'Karamel']];
  let hideP = false; try { hideP = localStorage.getItem('eda-pal-off') === '1'; } catch (e) {}
  if (!hideP) {
    document.body.insertAdjacentHTML('beforeend', `<div class="palette" role="group" aria-label="Arka plan rengi (deneme)"><span class="palette__label">Arka plan:</span>${BGS.map(b => `<button data-bg="${b[0]}"><i style="background:${b[1]}"></i><span>${b[2]}</span></button>`).join('')}<button class="palette__x" aria-label="Paleti gizle">✕</button></div>`);
    const mark = () => $$('.palette [data-bg]').forEach(b => b.setAttribute('aria-pressed', b.dataset.bg === (root.dataset.bg || 'krem')));
    $('.palette').addEventListener('click', e => {
      if (e.target.closest('.palette__x')) { $('.palette').remove(); try { localStorage.setItem('eda-pal-off', '1'); } catch (er) {} return; }
      const b = e.target.closest('[data-bg]'); if (!b) return;
      root.dataset.bg = b.dataset.bg; try { localStorage.setItem('eda-bg', b.dataset.bg); } catch (er) {} mark();
    });
    mark();
  }

  /* ---------- Açılış animasyonu yok: site direkt açılır ---------- */
  document.body.classList.add('is-ready');

  /* ---------- Header: şeffaf → sticky; aşağı inerken gizlen, yukarı çıkınca gel ---------- */
  const header = $('#header');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-stuck', y > 10);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Menü: orijinal sitenin kategorileri ---------- */
  const KL = 'koleksiyon.html', KB = KL + '?c=bronzing', KP = KL + '?c=parfum', KI = KL + '?c=illusion', KF = KL + '?c=fragrance';
  const MENU = [
    { t: 'Güneş', href: KB, img: 'assets/img/panel-bronze.jpg', m: ['You are', 'the golden hour'], picks: ['gold', 'miami', 'ibiza'],
      subs: [['Bomb Gang', KB], ['Bronzlaştırıcılar', KB], ['Güneş Koruyucular'], ['Güneşsiz Bronzlaştırıcı'], ['Seyahat Boy']] },
    { t: 'Parfüm', href: KP, img: 'assets/img/panel-fragrance.webp', m: ['Command', 'the spotlight'], picks: ['caprice', 'chaoselixir', 'asha'],
      subs: [['Parfüm', KP], ['Fragrance Intense', KF], ['Body Mist', KF], ['Parfüm Mist', KF]] },
    { t: 'Make Up', img: 'assets/img/disc-fragrance.jpg', m: ['Own', 'your glow'],
      subs: [['Bronzer'], ['BB'], ['Kontür'], ['Highlighter'], ['Allık']] },
    { t: 'Cilt', href: KI, img: 'assets/img/disc-illusion-b.jpg', m: ['Glow louder', 'than the rest'], picks: ['illusion', 'intenseoil'],
      subs: [['Stick'], ['Simli Vücut Yağı', KI], ['Maske']] },
    { t: 'Saç Bakım', img: 'assets/img/panel-body.jpg', m: ['Glow runs', 'through our veins'],
      subs: [['Saç Bakım'], ['Şampuan'], ['Saç Parfüm']] },
    { t: 'Vücut & Banyo', img: 'assets/img/disc-illusion-a.jpg', m: ['Soak up', 'the stares'], picks: ['dryspray'],
      subs: [['Body Milk'], ['Duş Jeli'], ['Deodorant'], ['Peeling'], ['El Kremi']] },
    { t: 'Ev & Yaşam', img: 'assets/img/sg-gold.jpg', m: ['Outshine', 'everyone'],
      subs: [['Mum'], ['Oda Kokusu']] },
    { t: 'Kampanyalar', hot: true, img: 'assets/img/panel-best.jpg', m: ['Born to', 'bronze'], picks: ['miami', 'chaoselixir', 'illusion'],
      subs: [['Avantajlı Setler'], ['Güneş Ürünleri Setleri'], ['2 Al 1 Öde Kampanyaları'], ['3 Al 2 Öde Kampanyaları']] },
  ];
  const mm = $('#mmenu'), burger = $('#burger');
  const arrow = '<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
  const subsHtml = c => `<a class="mm__all" href="${c.href || KL}" style="--i:0">Tümünü gör ${arrow}</a>` +
    c.subs.map(([t, h], i) => `<a href="${h || c.href || KL}" style="--i:${i + 1}">${t}</a>`).join('');
  const picksHtml = c => !c.picks ? '' : `<p class="mm__h">${c.hot ? 'Fırsattakiler' : 'Çok sevilenler'}</p><div class="mm__pks">` +
    c.picks.map((k, i) => { const B = BOMBS[k]; return `<a class="mm__pk" href="urun.html?p=${k}" style="--i:${i + 1};--c:${B.c}"><img src="assets/thumb/${k}.webp" alt=""><span><b>${B.name}</b><i>${B.old ? `<del>${fmt(B.old)}</del>` : ''}${fmt(B.price)}</i></span></a>`; }).join('') + '</div>';
  const mottoHtml = c => `<em>${c.m[0]}</em> ${c.m[1]}`;
  if (mm && burger) {
    mm.innerHTML = `<div class="mm__bg" data-mclose></div>
      <div class="mm__panel" role="dialog" aria-modal="true" aria-label="Menü">
        <div class="mm__top">
          <button class="mm__x" data-mclose aria-label="Menüyü kapat"><i><span></span><span></span></i><b>Kapat</b></button>
          <button class="mm__srch" type="button"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><span class="mm__lg">Ürün, koku ya da destinasyon ara</span><span class="mm__sm">Ürün ya da koku ara</span></button>
        </div>
        <div class="mm__body">
          <ul class="mm__cats">${MENU.map((c, i) => `
            <li style="--i:${i}"><a class="mm__cat${c.hot ? ' is-hot' : ''}${i ? '' : ' is-on'}" href="${c.href || KL}" data-i="${i}"><span data-t="${c.t}">${c.t}</span><svg class="mm__plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></a>
              <div class="mm__in"><div>${subsHtml(c)}${picksHtml(c)}</div></div></li>`).join('')}
          </ul>
          <div class="mm__subs" id="mmSubs">${subsHtml(MENU[0])}${picksHtml(MENU[0])}</div>
          <a class="mm__vis" id="mmVis" href="${MENU[0].href}">
            ${MENU.map((c, i) => `<img data-src="${c.img}" alt="" class="${i ? '' : 'is-on'}">`).join('')}
            <span class="mm__cap"><span class="mm__motto" lang="en">${mottoHtml(MENU[0])}</span><span class="mm__go">Keşfet ${arrow}</span></span>
          </a>
        </div>
        <div class="mm__foot">
          <nav><a href="index.html#eda">Eda Hakkında</a><a href="#">Hesabım</a><a href="#">Sipariş takibi</a><a href="#">İletişim</a></nav>
          <nav><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">YouTube</a></nav>
        </div>
      </div>`;
    const cats = $$('.mm__cat', mm), subs = $('#mmSubs'), vis = $('#mmVis'), imgs = $$('img', vis), motto = $('.mm__motto', vis);
    const narrow = matchMedia('(max-width:900px)');
    let cur = 0, tid, loaded = false;
    const act = i => {
      if (i === cur) return; cur = i; const c = MENU[i];
      cats.forEach((a, j) => a.classList.toggle('is-on', j === i));
      imgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
      subs.innerHTML = subsHtml(c) + picksHtml(c);
      motto.innerHTML = mottoHtml(c); vis.href = c.href || KL;
      vis.classList.remove('swap'); void vis.offsetWidth; vis.classList.add('swap');
    };
    const setMenu = open => {
      if (open && !loaded) { imgs.forEach(im => im.src = im.dataset.src); loaded = true; }
      document.body.classList.toggle('menu-open', open);
      document.documentElement.classList.toggle('pop-lock', open);
      burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
      mm.setAttribute('aria-hidden', !open);
      if (open) setTimeout(() => $('.mm__x', mm).focus({ preventScroll: true }), 300); else burger.focus({ preventScroll: true });
    };
    window.edaMenu = setMenu;
    burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    mm.addEventListener('click', e => {
      if (e.target.closest('[data-mclose]')) return setMenu(false);
      const cat = e.target.closest('.mm__cat');
      if (cat && narrow.matches) {      // telefonda kategori: alt listeyi aç/kapat
        e.preventDefault(); const li = cat.parentElement, open = !li.classList.contains('is-open');
        $$('.mm__cats li', mm).forEach(x => x.classList.toggle('is-open', x === li && open));
        return;
      }
      if (e.target.closest('a')) document.body.classList.remove('menu-open'), document.documentElement.classList.remove('pop-lock');
    });
    cats.forEach(a => {
      const i = +a.dataset.i;
      a.addEventListener('mouseenter', () => { clearTimeout(tid); tid = setTimeout(() => act(i), 60); });
      a.addEventListener('mouseleave', () => clearTimeout(tid));
      a.addEventListener('focus', () => act(i));
    });
    $('.mm__srch', mm).addEventListener('click', () => { setMenu(false); const b = $('.header__tools [aria-label="Ara"]'); b && setTimeout(() => b.click(), 200); });
  }

  /* ---------- Hero video duraklat ---------- */
  const vid = $('#heroVideo') || document.createElement('video'), pauseBtn = $('#heroPause') || document.createElement('button');
  pauseBtn.addEventListener('click', () => {
    const paused = vid.paused;
    paused ? vid.play() : vid.pause();
    pauseBtn.classList.toggle('is-paused', !paused);
    pauseBtn.setAttribute('aria-label', paused ? 'Videoyu durdur' : 'Videoyu oynat');
  });

  /* ---------- Sepet ---------- */
  const item = key => {
    if (key.startsWith('set:')) {
      const ks = key.slice(4).split(','), tot = ks.reduce((t, x) => t + BOMBS[x].price, 0);
      return { name: 'Ritüel seti', sub: ks.map(x => BOMBS[x].name).join(' + ') + ' · %10 set indirimi', price: Math.round(tot * .9), bg: BOMBS[ks[0]].bg, img: img(ks[0]) };
    }
    const [k, f] = key.split('@'), b = BOMBS[k];
    const base = b.sub || (b.dest.includes('·') ? b.dest : '200 ml · ' + b.dest);
    if (f) return { name: b.name, sub: `Abonelik · ${f === '1' ? 'her ay' : f + ' ayda bir'} · %15 indirim`, price: Math.round(b.price * .85), bg: b.bg, img: img(k) };
    return { name: b.name, sub: base, price: b.price, bg: b.bg, img: img(k) };
  };
  let bag = {};
  try { bag = JSON.parse(localStorage.getItem('eda-bag') || '{}'); } catch (e) {}
  const save = () => { try { localStorage.setItem('eda-bag', JSON.stringify(bag)); } catch (e) {} };
  const FREE = 1500; // ücretsiz kargo sınırı (TL) — yer tutucu
  const renderBag = () => {
    save();
    const keys = Object.keys(bag);
    const count = keys.reduce((n, k) => n + bag[k], 0);
    const total = keys.reduce((n, k) => n + bag[k] * item(k).price, 0);
    const cnt = $('#bagCount');
    cnt.textContent = count; cnt.classList.toggle('has', count > 0);
    $('#drawerTotal').textContent = fmt(total);
    const left = FREE - total;
    $('#drawerShip').innerHTML = (left > 0 ? `Ücretsiz kargoya <b>${fmt(left)}</b> kaldı` : `<b>Ücretsiz kargo</b> kazandın`) +
      `<i><b style="width:${Math.min(100, total / FREE * 100)}%"></b></i>`;
    $('#drawerItems').innerHTML = keys.length ? keys.map(k => { const it = item(k); return `
      <div class="ditem">
        <div class="ditem__img" style="background:${it.bg}"><img src="${it.img.replace('/bomb/','/thumb/')}" alt=""></div>
        <div><b>${it.name}</b><small>${it.sub}</small>
          <div class="ditem__qty"><button data-q="-1" data-k="${k}" aria-label="Azalt">−</button>${bag[k]}<button data-q="1" data-k="${k}" aria-label="Artır">+</button></div></div>
        <strong>${fmt(bag[k] * it.price)}</strong>
      </div>`; }).join('') : `<p class="drawer__empty">Sepetin ışıltısını bekliyor.</p>`;
  };
  const openBag = () => document.body.classList.add('bag-open');
  const closeBag = () => document.body.classList.remove('bag-open');
  const add = k => {
    bag[k] = (bag[k] || 0) + 1; renderBag(); openBag();
    const c = $('#bagCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  };
  $('#bagBtn').addEventListener('click', () => { renderBag(); openBag(); });
  $('#drawerClose').addEventListener('click', closeBag);
  $('#drawerBg').addEventListener('click', closeBag);
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeBag(); document.body.classList.contains('menu-open') && window.edaMenu && edaMenu(false); } });
  $('#drawerItems').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    const k = b.dataset.k; bag[k] += +b.dataset.q; if (bag[k] <= 0) delete bag[k]; renderBag();
  });
  renderBag();
  window.EDA.add = add;
  // sepet sayfası için ortak sepet fonksiyonları
  Object.assign(window.EDA, {
    item, FREE, getBag: () => bag,
    setQty: (k, q) => { if (q <= 0) delete bag[k]; else bag[k] = q; renderBag(); document.dispatchEvent(new Event('eda:bag')); },
  });
  const _render = renderBag;

  /* ---------- Arama: üstten açılan katman, yazdıkça sonuç ---------- */
  const norm = t => t.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  document.body.insertAdjacentHTML('beforeend', `
    <div class="srch" id="srch" role="dialog" aria-modal="true" aria-label="Arama">
      <div class="srch__box">
        <div class="srch__bar">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
          <input id="srchIn" type="search" placeholder="Ürün, koku ya da destinasyon ara" autocomplete="off">
          <button id="srchX" aria-label="Aramayı kapat">Kapat</button>
        </div>
        <div class="srch__sug" id="srchSug">
          <p>Popüler aramalar</p>
          <div>${['Bronzing Bomb', 'Miami', 'Parfüm', 'Illusion', 'Chaos', 'Mist'].map(t => `<button>${t}</button>`).join('')}</div>
          <p>Kategoriler</p>
          <div>${Object.keys(window.EDA.CATS).map(c => `<a href="koleksiyon.html?c=${c}">${window.EDA.CATS[c].name}</a>`).join('')}</div>
        </div>
        <div class="srch__res" id="srchRes"></div>
      </div>
    </div>`);
  const srch = $('#srch'), sIn = $('#srchIn');
  const openS = () => { srch.classList.add('is-open'); root.classList.add('pop-lock'); setTimeout(() => sIn.focus(), 60); };
  const closeS = () => { srch.classList.remove('is-open'); root.classList.remove('pop-lock'); };
  const doSearch = () => {
    const q = norm(sIn.value.trim());
    $('#srchSug').hidden = !!q;
    if (!q) { $('#srchRes').innerHTML = ''; return; }
    const CATS = window.EDA.CATS, catOf = window.EDA.catOf;
    const hits = Object.keys(BOMBS).filter(k => { const b = BOMBS[k]; return norm([b.name, b.dest, b.sub || '', b.note || '', CATS[catOf(k)]?.name || ''].join(' ')).includes(q); });
    $('#srchRes').innerHTML = hits.length ? `<p class="srch__n">${hits.length} sonuç</p>` + hits.slice(0, 8).map(k => `
      <a class="srch__it" href="urun.html?p=${k}"><span><img src="${thumb(k)}" alt=""></span><div><b>${BOMBS[k].name}</b><small>${BOMBS[k].sub || BOMBS[k].dest}</small></div><em>${fmt(BOMBS[k].price)}</em></a>`).join('')
      : `<p class="srch__none">“${sIn.value}” için sonuç bulunamadı. Başka bir kelime dene.</p>`;
  };
  sIn.addEventListener('input', doSearch);
  $('#srchSug').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { sIn.value = b.textContent; doSearch(); } });
  $('#srchX').addEventListener('click', closeS);
  srch.addEventListener('click', e => { if (e.target === srch) closeS(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeS(); if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); openS(); } });
  $$('.header__tools [aria-label="Ara"]').forEach(b => b.addEventListener('click', openS));
  // çekmeceden sepet sayfasına
  $$('.drawer__foot .btn').forEach(b => b.addEventListener('click', () => location.href = 'sepet.html'));

  /* ---------- Ürün şeritleri (Bomb Gang yapısı, tüm kategorilerde aynı) ----------
     Liste 3 kopya dizilir; ortadaki kopyada gezilir, kenara gelince animasyonsuz
     ortaya atlanır, böylece şerit sonsuz döner. Az ürünlü listeler ekranı
     dolduracak kadar çoğaltılır. Seçilen ürün zemini kendi tonuna boyar. */
  function makeGang(sec) {
    const keys = sec.dataset.keys.split(',');
    let base = keys.slice(); while (base.length < 7) base = base.concat(keys);
    const N = base.length;
    const track = $('.gang__track', sec), viewport = $('.gang__viewport', sec), info = $('.gang__info', sec);
    track.innerHTML = [0, 1, 2].map(() => base.map(k => `
      <div class="gang__item" data-k="${k}" role="button" tabindex="-1" aria-label="${BOMBS[k].name}">
        <img src="${img(k)}" alt="" draggable="false" loading="lazy">
      </div>`).join('')).join('');
    const items = $$('.gang__item', track);
    let pos = N, dragged = false, startX = null;
    const slotW = () => items[0].getBoundingClientRect().width;
    const place = anim => {
      sec.style.setProperty('--vw', viewport.clientWidth + 'px');
      track.classList.toggle('is-anim', !!anim && !reduced);
      track.style.transform = `translate3d(${viewport.clientWidth / 2 - (pos + .5) * slotW()}px,0,0)`;
      items.forEach((el, i) => el.classList.toggle('is-active', i === pos));
    };
    const current = () => base[((pos % N) + N) % N];
    const theme = k => {
      const b = BOMBS[k];
      const [r1, r2, w] = raysFor(k);
      sec.style.setProperty('--r1', r1); sec.style.setProperty('--r2', r2);
      sec.style.setProperty('--g-fg', lum(r1) > .45 ? '#170e09' : '#fff');
      sec.style.setProperty('--g-soft', `color-mix(in oklab, ${b.c} 36%, #170e09)`); // sade zemin: ürün rengi + espresso
      info.classList.add('is-swap'); sec.classList.add('is-swap');
      setTimeout(() => {
        $('.gang__name', sec).textContent = b.name;
        $('.gang__dest', sec).textContent = b.dest;
        $('.gang__note', sec).textContent = b.note || b.sub || '';
        $('.gang__price', sec).textContent = fmt(b.price);
        info.classList.remove('is-swap'); sec.classList.remove('is-swap');
      }, reduced ? 0 : 200);
    };
    const go = (to, anim = true) => { pos = to; place(anim); theme(current()); };
    track.addEventListener('transitionend', e => {
      if (e.target === track && (pos < N || pos >= 2 * N)) { pos = N + ((pos % N) + N) % N; place(false); }
    });
    $('.gang__arrow--prev', sec).addEventListener('click', () => go(pos - 1));
    $('.gang__arrow--next', sec).addEventListener('click', () => go(pos + 1));
    items.forEach((el, i) => el.addEventListener('click', () => { if (!dragged && i !== pos) go(i); }));
    $('.gang__add', sec).addEventListener('click', () => add(current()));
    $('.gang__more', sec).addEventListener('click', e => { e.preventDefault(); location.href = 'urun.html?p=' + current(); });
    sec.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(pos + 1); if (e.key === 'ArrowLeft') go(pos - 1); });
    viewport.addEventListener('pointerdown', e => { startX = e.clientX; dragged = false; });
    viewport.addEventListener('pointermove', e => { if (startX !== null && Math.abs(e.clientX - startX) > 8) dragged = true; });
    viewport.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 45) go(pos + (dx < 0 ? 1 : -1));
      setTimeout(() => dragged = false, 0);
    });
    addEventListener('resize', () => place(false));
    new IntersectionObserver(([en]) => sec.classList.toggle('is-live', en.isIntersecting)).observe(sec);
    go(N, false);
    // dışarıdan bir ürünü seç — en kısa yoldan döner
    const select = (k, scroll) => {
      let d = base.indexOf(k) - (((pos % N) + N) % N);
      if (d > N / 2) d -= N; if (d < -N / 2) d += N;
      go(pos + d, !scroll);
      if (scroll) sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    };
    return { sec, keys, select };
  }
  const gangs = $$('.gang').map(makeGang);
  /* ---------- Zemin seçici: sade (eski) / canlı (key visual) — markaya iki seçenek ---------- */
  let rayMode = 'soft';
  try { rayMode = localStorage.getItem('eda-rays') || 'soft'; } catch (e) {}
  const setRays = m => {
    rayMode = m;
    document.documentElement.dataset.rays = m; // iç sayfalar (liste, ürün) aynı seçimi kullanır
    $$('.gang').forEach(g => g.classList.toggle('is-soft', m === 'soft'));
    $$('.rays-pick button').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === m));
    try { localStorage.setItem('eda-rays', m); } catch (e) {}
  };
  $$('.gang, [data-rays-pick]').forEach(g => g.insertAdjacentHTML('beforeend', `<div class="rays-pick" role="group" aria-label="Zemin">
    <button data-m="soft" aria-label="Sade zemin" title="Sade"></button><button data-m="vivid" aria-label="Canlı zemin" title="Canlı"></button></div>`));
  document.addEventListener('click', e => { const b = e.target.closest('.rays-pick button'); if (b) setRays(b.dataset.m); });
  setRays(rayMode);
  const SECTION_OF = { caprice: 'd-parfum', chaoselixir: 'd-parfum', mondieu: 'd-parfum', regina: 'd-parfum', illusion: 'd-illusion', intenseoil: 'd-illusion', dryspray: 'd-illusion' };
  const selectProduct = (k, scroll) => {
    const g = gangs.find(g => g.keys.includes(k)); if (g) return g.select(k, scroll);
    if (ILLS.includes(k)) setIll(k);
    const sec = document.getElementById(SECTION_OF[k] || 'ch-scent');
    if (scroll && sec) sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  /* ---------- Discover · Illusion: noktalarla ürün değişir ---------- */
  const ILLS = ['illusion', 'intenseoil', 'dryspray'];
  function setIll(k) {
    const b = BOMBS[k], im = $('#illImg'); if (!im) return;
    $$('#illDots button').forEach(d => d.setAttribute('aria-selected', d.dataset.k === k));
    im.style.opacity = 0;
    setTimeout(() => { im.src = img(k); im.alt = b.name; im.style.opacity = 1; }, reduced ? 0 : 200);
    $('#illName').textContent = b.name; $('#illMeta').textContent = `${b.sub} · ${fmt(b.price)}`;
  }
  if ($('#illDots')) {
  $('#illDots').innerHTML = ILLS.map(k => `<button role="tab" aria-selected="false" aria-label="${BOMBS[k].name}" data-k="${k}"></button>`).join('');
  $('#illDots').addEventListener('click', e => { const d = e.target.closest('button'); if (d) setIll(d.dataset.k); });
  setIll('illusion');
  }
  // görünmeyen animasyonları durdur (ışınlar, hero video)
  if ($('#heroVideo')) new IntersectionObserver(([en]) => { if (pauseBtn.classList.contains('is-paused')) return; en.isIntersecting ? vid.play().catch(() => {}) : vid.pause(); }).observe(vid);

  /* ---------- Koleksiyon akordiyonu (Augustinus Bader yapısı) ---------- */
  const acc = $('#acc'), cards = acc ? $$('.acc__card', acc) : [];
  if (acc) {
  const bagIcon = '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg>';
  cards.forEach(card => {
    const keys = card.dataset.tray.split(',');
    card.insertAdjacentHTML('beforeend', `
      <p class="acc__motto">${card.dataset.motto}</p>
      <div class="acc__tray">
        <a class="acc__all" href="koleksiyon.html?c=${card.dataset.cat}">${card.dataset.all}</a>
        <div class="acc__products">${keys.map(k => `
          <div class="acc__p" role="link" tabindex="0" data-k="${k}">
            <button class="acc__quick" data-add="${k}" aria-label="${BOMBS[k].name} sepete ekle">${bagIcon}</button>
            <img src="${thumb(k)}" alt="" width="154" height="154" decoding="async">
            <b>${BOMBS[k].name}</b><small>${fmt(BOMBS[k].price)}</small>
          </div>`).join('')}
        </div>
      </div>`);
  });
  const setActive = card => cards.forEach(c => c.classList.toggle('is-active', c === card));
  if (canHover && innerWidth > 760) {
    cards.forEach(c => c.addEventListener('mouseenter', () => setActive(c)));
    acc.addEventListener('mouseleave', () => setActive(null)); // fare çıkınca ilk haline döner
  }
  // bölüm ekrandan çıkınca kartlar kapanır (Bader ile aynı)
  new IntersectionObserver(([en]) => { if (!en.isIntersecting) setActive(null); }).observe(acc);
  cards.forEach(c => c.addEventListener('click', e => {
    if (e.target.closest('.acc__p, .acc__all')) return;
    setActive(c.classList.contains('is-active') && !canHover ? null : c);
  }));
  acc.addEventListener('click', e => {
    const q = e.target.closest('[data-add]');
    if (q) { e.preventDefault(); e.stopPropagation(); add(q.dataset.add); return; }
    const p = e.target.closest('.acc__p');
    if (p) { location.href = 'urun.html?p=' + p.dataset.k; return; }
    const all = e.target.closest('.acc__all');
    if (all) return;
  });

  }

  /* ---------- Shop the glow: oklarla dörtlü setler, karta gelince soldaki büyük görsel değişir ---------- */
  const sg = $('#sgGrid');
  if (sg) {
    const SETS = [
      { title: 'Illusion & vücut', keys: ['illusion', 'intenseoil', 'dryspray', 'maximizer'] },
      { title: 'Destinasyonlar', keys: ['miami', 'ibiza', 'copacabana', 'tulum'] },
      { title: 'İmza bombalar', keys: ['gold', 'chaos', 'mykonos', 'sttropez'] },
    ];
    const hero = $('#sgHero'), bgs = $$('.sg__bg', hero), bottle = $('#sgBottle'), tag = $('#sgTag');
    let set = 0, shown = 'illusion', front = 0, hoverT;
    const showHero = k => {
      if (k === shown) return; shown = k;
      const next = bgs[1 - front];
      next.onload = () => { bgs[front].classList.remove('is-on'); next.classList.add('is-on'); front = 1 - front; };
      next.src = `assets/sg/${k}.jpg`;
      const def = k === 'illusion';
      hero.classList.toggle('is-product', !def);
      bottle.classList.toggle('is-hidden', !def);
      tag.innerHTML = `<b lang="en">${BOMBS[k].name}</b><span>İncele →</span>`;
      hero.href = def ? 'koleksiyon.html?c=illusion' : 'urun.html?p=' + k;
    };
    const paintCard = (c, k) => {
      const [r1, r2] = raysFor(k);
      c.style.setProperty('--r1', r1); c.style.setProperty('--r2', r2);
      c.style.setProperty('--fg', lum(r1) > .45 ? '#170e09' : '#fff');
    };
    const render = dir => {
      const S = SETS[set];
      sg.classList.add('is-out'); sg.style.setProperty('--dir', dir || 1);
      setTimeout(() => {
        sg.innerHTML = S.keys.map(k => `
          <article class="sgp" data-k="${k}">
            <a class="sgp__img" href="urun.html?p=${k}"><img src="${img(k)}" alt="${BOMBS[k].name}" loading="lazy"></a>
            <div><a href="urun.html?p=${k}" class="sgp__name" lang="en">${BOMBS[k].name}</a>
            <p class="sgp__sub">${BOMBS[k].sub || BOMBS[k].dest}</p>
            <p class="sgp__price">${fmt(BOMBS[k].price)} <s>${fmt(BOMBS[k].old)}</s></p></div>
            <button class="sgp__btn" data-add="${k}">Sepete ekle</button>
          </article>`).join('');
        $$('.sgp', sg).forEach(c => paintCard(c, c.dataset.k));
        $('#sgCount').textContent = `0${set + 1} / 0${SETS.length}`;
        $('#sgTitle').textContent = S.title;
        sg.classList.remove('is-out');
        showHero(S.keys[0]);
      }, dir ? 320 : 0);
    };
    sg.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) add(b.dataset.add); });
    sg.addEventListener('pointerover', e => {
      const c = e.target.closest('.sgp'); if (!c) return;
      clearTimeout(hoverT); hoverT = setTimeout(() => showHero(c.dataset.k), 60);
    });
    sg.addEventListener('pointerenter', e => {}, true);
    sg.addEventListener('pointermove', e => {
      const c = e.target.closest('.sgp'); if (!c) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      if (!c.dataset.in) { c.dataset.in = 1; c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
      c.style.setProperty('--tx', (x * 10).toFixed(2) + 'deg'); c.style.setProperty('--ty', (-y * 10).toFixed(2) + 'deg');
    });
    sg.addEventListener('pointerout', e => {
      const c = e.target.closest('.sgp'); if (!c || c.contains(e.relatedTarget)) return;
      delete c.dataset.in; c.style.setProperty('--tx', '0deg'); c.style.setProperty('--ty', '0deg');
    });
    $('#sgPrev').addEventListener('click', () => { set = (set + SETS.length - 1) % SETS.length; render(-1); });
    $('#sgNext').addEventListener('click', () => { set = (set + 1) % SETS.length; render(1); });
    // görselleri önceden yükle
    SETS.flatMap(x => x.keys).forEach(k => { const i = new Image(); i.src = `assets/sg/${k}.jpg`; });
    render(0);
  }


  /* ---------- Hoş geldin pop-up'ı: kremi sil, %15 indirimi bul (yalnızca anasayfa, bir kez) ---------- */
  // pop-up bir kez kendiliğinden açılır; sonra her sayfada sol alttaki "%15 indirim" sekmesiyle tekrar açılır
  const buildPop = auto => {
    if ($('#pop')) { $('#pop').classList.add('is-open'); document.documentElement.classList.add('pop-lock'); return; }
    document.body.insertAdjacentHTML('beforeend', `
      <div class="pop" id="pop" role="dialog" aria-modal="true" aria-labelledby="popT">
        <div class="pop__card">
          <button class="pop__x" id="popX" aria-label="Kapat"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
          <div class="pop__art">
            <span class="pop__rays" aria-hidden="true"></span>
            <span lang="en" class="pop__w pop__w--tl">Faster</span><span lang="en" class="pop__w pop__w--tr">and</span>
            <span lang="en" class="pop__w pop__w--bl">darker</span><span lang="en" class="pop__w pop__w--br">tanning</span>
            <div class="pop__win">
              <img src="assets/pop/beach.jpg" alt="">
              <div class="pop__prize"><small>Hoş geldin hediyen</small><b>%15</b><span>indirim</span></div>
              <canvas class="pop__cream" id="popCream" aria-label="Kremi silerek indirimini bul"></canvas>
              <span class="pop__hint" id="popHint" hidden></span>
            </div>
          </div>
          <div class="pop__form">
            <h2 class="pop__t" id="popT">%15 indirim kazan*</h2>
            <p class="pop__t2">&amp; özel kulübümüze katıl!</p>
            <p class="pop__lede" id="popLede">İlk siparişinde <b>%15 indirim*</b>, yeni ürünlere ilk erişim, özel kampanyalar ve Eda'nın bronzluk sırları.</p>
            <form id="popF" novalidate>
              <div class="pop__row"><input name="ad" placeholder="Ad" autocomplete="given-name" required><input name="soyad" placeholder="Soyad" autocomplete="family-name" required></div>
              <input name="email" type="email" placeholder="E-posta" autocomplete="email">
              <p class="pop__or">ve / veya</p>
              <div class="pop__tel"><select aria-label="Ülke kodu"><option>+90</option><option>+1</option><option>+44</option><option>+49</option></select><input name="tel" type="tel" placeholder="Telefon numarası" autocomplete="tel-national" inputmode="tel"></div>
              <p class="pop__legal">Kaydolarak <a href="#">KVKK Aydınlatma Metni</a>'ni okuduğunu ve kampanya iletileri almayı kabul etmiş olursun. Dilediğin zaman ayrılabilirsin.</p>
              <button type="submit" id="popBtn">Gönder</button>
            </form>
            <div class="pop__done" id="popDone" hidden>
              <p>İndirim kodun</p><b>BOMB15</b><span>Kodun e-postana da gönderildi. Güneşte görüşürüz.</span>
              <button id="popGo">Alışverişe başla</button>
            </div>
            <p class="pop__note">*İlk siparişte geçerlidir.</p>
          </div>
        </div>
      </div>`);
    const pop = $('#pop'), cv = $('#popCream'), ctx = cv.getContext('2d');
    let revealed = false, moves = 0, last = null;
    const paintCream = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2);
      cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const W = r.width, H = r.height;
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#fbf3e6'); g.addColorStop(.5, '#f3e3c8'); g.addColorStop(1, '#efd9b6');
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // krem dokusu: yumuşak sürülmüş izler
      ctx.lineCap = 'round';
      for (let i = 0; i < 26; i++) {
        ctx.strokeStyle = `rgba(255,255,255,${.25 + Math.random() * .35})`; ctx.lineWidth = 8 + Math.random() * 26;
        ctx.beginPath(); const y = Math.random() * H; ctx.moveTo(-20, y);
        ctx.bezierCurveTo(W * .3, y + (Math.random() - .5) * 80, W * .7, y + (Math.random() - .5) * 80, W + 20, y + (Math.random() - .5) * 40); ctx.stroke();
      }
      for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = `rgba(214,170,110,${.12 + Math.random() * .12})`; ctx.lineWidth = 2 + Math.random() * 6;
        ctx.beginPath(); const y = Math.random() * H; ctx.moveTo(-10, y); ctx.quadraticCurveTo(W / 2, y + (Math.random() - .5) * 60, W + 10, y + (Math.random() - .5) * 30); ctx.stroke();
      }
      // aksiyona çağıran yazı (silindikçe o da gider)
      ctx.textAlign = 'center'; ctx.fillStyle = '#8f2219';
      ctx.font = `600 ${Math.round(W * .055)}px Outfit, sans-serif`; ctx.fillText('HEDİYEN BURADA', W / 2, H * .36);
      ctx.font = `800 ${Math.round(W * .2)}px "Big Shoulders Display", Impact, sans-serif`; ctx.fillText('KAZI', W / 2, H * .55);
      ctx.font = `500 ${Math.round(W * .055)}px Outfit, sans-serif`; ctx.fillStyle = '#7a4a2a';
      ctx.fillText('Farenle ya da parmağınla', W / 2, H * .66); ctx.fillText('kremi sil', W / 2, H * .72);
      // küçük el ikonu yerine ok
      ctx.strokeStyle = '#8f2219'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(W * .36, H * .8); ctx.quadraticCurveTo(W * .5, H * .86, W * .64, H * .8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W * .6, H * .77); ctx.lineTo(W * .64, H * .8); ctx.lineTo(W * .6, H * .83); ctx.stroke();
    };
    const wipe = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(34, cv.getBoundingClientRect().width * .11);
      ctx.beginPath(); ctx.moveTo(last ? last[0] : x, last ? last[1] : y); ctx.lineTo(x, y); ctx.stroke();
      last = [x, y];
      $('#popHint').classList.add('is-gone');
      if (++moves % 10 === 0) check(); // sadece silinen yer açılır; çoğu silinince kalanı erir
    };
    const check = () => {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, n = 0;
      for (let i = 3; i < d.length; i += 4 * 40) { n++; if (d[i] < 40) clear++; }
      if (clear / n > .62) reveal();
    };
    const reveal = () => {
      if (revealed) return; revealed = true;
      cv.classList.add('is-gone'); $('.pop__win').classList.add('is-won');
    };
    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    let down = false;
    cv.addEventListener('pointerdown', e => { down = true; last = null; cv.setPointerCapture(e.pointerId); wipe(...pos(e)); });
    cv.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || down) wipe(...pos(e)); });
    cv.addEventListener('pointerup', () => { down = false; last = null; check(); });
    cv.addEventListener('pointerleave', () => { last = null; });
    const close = () => {
      pop.classList.remove('is-open'); document.documentElement.classList.remove('pop-lock');
      try { localStorage.setItem('eda-pop', '1'); } catch (e) {}
      setTimeout(() => pop.remove(), 500);
      showTease();
    };
    $('#popX').addEventListener('click', close);
    pop.addEventListener('click', e => { if (e.target === pop) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.contains(pop)) close(); });
    $('#popGo').addEventListener('click', close);
    $('#popF').addEventListener('submit', e => {
      e.preventDefault(); const f = e.currentTarget;
      if (!f.checkValidity()) { f.classList.add('is-tried'); f.reportValidity(); return; }
      if (!f.email.value && !f.tel.value) { f.email.focus(); return; }
      f.hidden = true; $('#popDone').hidden = false; $('#popLede').hidden = true;
      $('#popT').textContent = 'Kazandın!'; $('.pop__t2').textContent = 'Kulübe hoş geldin.';
      try { localStorage.setItem('eda-pop', '1'); } catch (e) {}
    });
    const open = () => {
      pop.classList.add('is-open'); document.documentElement.classList.add('pop-lock');
      requestAnimationFrame(paintCream);
    };
    setTimeout(open, auto ? (reduced ? 300 : 1400) : 30);
    addEventListener('resize', () => { if (!revealed && pop.classList.contains('is-open')) paintCream(); });
  };
  const showTease = () => {
    if ($('#popTease')) return;
    document.body.insertAdjacentHTML('beforeend', '<button class="pop-tease" id="popTease" aria-label="%15 indirim kazan"><b>%15</b> indirim</button>');
    $('#popTease').addEventListener('click', () => { $('#popTease').remove(); buildPop(false); });
  };
  {
    let seenPop = false;
    try { seenPop = localStorage.getItem('eda-pop') === '1'; } catch (e) {}
    if (new URLSearchParams(location.search).has('pop')) seenPop = false;
    if (!seenPop && $('.hero')) buildPop(true); else showTease();
  }

  /* ---------- Görseller ekrana girerken açılır ---------- */
  const rv = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); rv.unobserve(en.target); } }), { threshold: .18 });
  $$('.reveal').forEach(el => reduced ? el.classList.add('is-in') : rv.observe(el));

  const scrollTo2 = el => el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  function goChapter(id) { scrollTo2(document.getElementById(id)); }
  function goProduct(k) { selectProduct(k, true); }
  // kart açıkken karta tıklamak o bölüme götürür
  cards.forEach(c => c.addEventListener('click', e => {
    if (e.target.closest('.acc__p, .acc__all')) return;
    if (c.classList.contains('is-active') && canHover) goChapter(c.dataset.ch);
  }));
})();
