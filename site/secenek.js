/* Eda Taşpınar — 5 farklı ürün detay seçeneği (deneme sayfası) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { BOMBS, CATS, catOf, raysFor, img, thumb, fmt } = window.EDA;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = new URLSearchParams(location.search);
  let k = BOMBS[q.get('p')] ? q.get('p') : 'gold';
  const onPdp = !document.getElementById('psTabs'); // urun.html: seçilen düzen (4)
  let qty = 1, barCheck = () => {};
  let concept = onPdp ? '4' : (q.get('s') || 'a');
  // yer tutucu içerik
  const NOTES = {
    gold: ['Hindistan cevizi', 'Vanilya', 'Amber'], miami: ['Ananas', 'Hindistan cevizi', 'Deniz tuzu'], mykonos: ['Bergamot', 'İncir', 'Beyaz misk'],
    copacabana: ['Mango', 'Çarkıfelek', 'Vanilya'], ibiza: ['Tropik meyve', 'Neroli', 'Amber'], tulum: ['Hindistan cevizi sütü', 'Tonka', 'Sandal ağacı'],
    sttropez: ['Pembe biber', 'Gül', 'Amber'], chaos: ['Bergamot', 'Deri', 'Oud'], maximizer: ['Narenciye', 'Neroli', 'Misk'], cooling: ['Nane', 'Salatalık', 'Aloe'],
    caprice: ['Frambuaz', 'Gül', 'Vanilya'], chaoselixir: ['Kakule', 'Lavanta', 'Tonka'], mondieu: ['Safran', 'Yasemin', 'Amber'], regina: ['Mandalina', 'Portakal çiçeği', 'Bal'],
    illusion: ['Hindistan cevizi', 'Tiare', 'Vanilya'], intenseoil: ['Hindistan cevizi', 'Karamel', 'Amber'], dryspray: ['Narenciye', 'Monoi', 'Misk'],
    asha: ['Armut', 'Şakayık', 'Misk'], myra: ['Böğürtlen', 'Menekşe', 'Paçuli'], groove: ['Greyfurt', 'Zencefil', 'Vetiver'], root: ['Yeşil yapraklar', 'İris', 'Sedir'],
    enigma: ['Siyah frenk üzümü', 'Gül', 'Paçuli'], noble: ['Biber', 'Sedir', 'Vetiver'], honour: ['Limon', 'Lavanta', 'Misk'], nova: ['Elma', 'Freesia', 'Misk'],
  };
  const PLACE = { gold: 'İstanbul', miami: 'Miami', mykonos: 'Mykonos', copacabana: 'Rio de Janeiro', ibiza: 'Ibiza', tulum: 'Tulum', sttropez: 'St. Tropez', chaos: 'Bilinmeyen', maximizer: 'Ritüel', cooling: 'Ritüel' };
  const COORD = { gold: '41.00° N · 28.97° E', miami: '25.76° N · 80.19° W', mykonos: '37.44° N · 25.32° E', copacabana: '22.97° S · 43.18° W', ibiza: '38.90° N · 1.42° E', tulum: '20.21° N · 87.46° W', sttropez: '43.27° N · 6.64° E', chaos: '— · —', maximizer: '— · —', cooling: '— · —' };
  const FACT = { bronzing: [['Bitiş', 'Kuru dokunuş, hafif ışıltı'], '200 ml · SPF 0'], parfum: [['Tür', 'Eau de Parfum'], '100 ml'], illusion: [['Bitiş', 'Işıltılı, hafif yağ'], '200 ml'], fragrance: [['Tür', 'Vücut ve saç spreyi'], (BOMBS[k] && BOMBS[k].dest.split(' · ')[1]) || '100 ml'] };
  const place = x => PLACE[x] || CATS[catOf(x)].name;
  const coord = x => COORD[x] || '— · —';
  const BEN = [['Anında bronz', 'İlk uygulamada derin, eşit bir renk.'], ['Kuru dokunuş', 'Yapışmaz, havluya bulaşmaz.'], ['Destinasyon kokusu', 'Her Bomb bir yerin kokusunu taşır.']];
  const SHOTS = ['after/a3.jpg', 'after/a6.jpg', 'after/a2.jpg', 'plp/bronzing.jpg', 'after/a1.jpg', 'after/a7.jpg'];
  const keysOf = () => CATS[catOf(k) || 'bronzing'].keys;
  const short = x => BOMBS[x].name.replace(/ (Bomb|Extreme|Supreme|Glow|Pour Homme)$/, '');
  const price = x => `<b>${fmt(BOMBS[x].price)}</b>${BOMBS[x].old ? `<s>${fmt(BOMBS[x].old)}</s>` : ''}`;
  const scentPick = cls => `<div lang="en" class="${cls}" role="radiogroup" aria-label="Koku">${keysOf().map(x => `<button data-k="${x}" aria-pressed="${x === k}">${short(x)}</button>`).join('')}</div>`;
  const addBtn = (label = 'Sepete ekle') => `<button class="cx-add" data-add>${label} <span>${fmt(BOMBS[k].price)}</span></button>`;
  const stars = '<span class="cx-st">★★★★★</span>';
  const b = () => BOMBS[k];

  /* ---------- 1 · EDİTORYAL GALERİ (Byredo / Aesop): solda üst üste büyük görseller, sağda yapışık sade satın alma ---------- */
  const c1 = () => `
  <section class="c1">
    <div class="c1__gal">
      <figure class="c1__hero"><img src="${img(k)}" alt="${b().name}"></figure>
      ${SHOTS.slice(0, 3).map(x => `<figure class="rv-up"><img src="assets/${x}" alt="" loading="lazy"></figure>`).join('')}
    </div>
    <aside class="c1__buy">
      <p class="cx-eye">Bronzing Bomb · ${place(k)}</p>
      <h1 class="c1__name" lang="en">${b().name}</h1>
      <p class="c1__notes">${NOTES[k].join(', ')}</p>
      <p class="c1__price">${price(k)}</p>
      <p class="c1__lab">Koku</p>${scentPick('c1__pick')}
      ${addBtn()}
      <p class="c1__ship">Ücretsiz kargo ₺1.500 üzeri · 30 gün iade</p>
      <details open><summary>Ürün</summary><p>${b().note} Kuru dokunuşlu bronzlaştırıcı yağ, SPF 0, 200 ml.</p></details>
      <details><summary>Kullanım</summary><p>Çalkala, 20 cm’den sık, avuçlarınla yay. Denizden sonra yenile.</p></details>
      <details><summary>İçerik</summary><p>Roucou yağı, havuç yağı, hindistan cevizi yağı, E vitamini.</p></details>
    </aside>
  </section>
  <section class="c1__notesband rv-up">
    <p class="cx-eye">Notalar</p>
    <div>${['Üst', 'Kalp', 'Dip'].map((t, i) => `<p><small>${t}</small>${NOTES[k][i]}</p>`).join('')}</div>
  </section>
  <section class="c1__split">
    <img class="rv-zoom" src="assets/plp/bronzing.jpg" alt="" loading="lazy">
    <div class="rv-up"><p class="cx-eye">Hikâye</p><h2 class="c1__h">Güneşi şişeye koyduk.</h2><p>Akdeniz’in sıcak öğleden sonraları, tuzlu ten ve altın saat. Her Bomb bir destinasyondan ilham alıyor; kokusu da bronzu da oradan geliyor.</p></div>
  </section>`;

  /* ---------- 2 · SAHNE (Apple tarzı): ürün tam ekran ortada, kaydırdıkça büyür ve faydalar çevresinde belirir ---------- */
  const c2 = () => {
    const [r1, r2] = raysFor(k);
    return `
  <section class="c2" style="--r1:${r1};--r2:${r2}">
    <div class="c2__stick">
      <div class="c2__bg"></div>
      <p class="c2__eye">Eda Taşpınar · ${place(k)}</p>
      <h1 class="c2__name" lang="en">${b().name}</h1>
      <img class="c2__p" src="${img(k)}" alt="${b().name}">
      ${BEN.map((x, i) => `<div class="c2__b c2__b--${i}"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}
      <div class="c2__dock">
        <div><b>${b().name}</b><span>${stars} 4.8 · 200 ml</span></div>
        ${scentPick('c2__pick')}
        <p class="c2__price">${price(k)}</p>${addBtn()}
      </div>
    </div>
  </section>
  <section class="c2__after">
    <video src="assets/img/hero.mp4" autoplay muted loop playsinline></video>
    <div class="rv-up"><h2>Tanning for the bold.</h2><p>${NOTES[k].join(' · ')}</p></div>
  </section>`;
  };

  /* ---------- 3 · DERGİ (Jacquemus / SSENSE): dev tipografi arkada, ürün önde, yatay kampanya şeridi ---------- */
  const c3 = () => `
  <section class="c3">
    <div class="c3__type" aria-hidden="true" lang="en">${short(k)}</div>
    <img class="c3__p" src="${img(k)}" alt="${b().name}">
    <div class="c3__l"><p class="cx-eye">N°0${keysOf().indexOf(k) + 1} · ${place(k)}</p><p class="c3__coord">${coord(k)}</p></div>
    <div class="c3__r">
      <h1 lang="en">${b().name}</h1><p class="c3__n">${NOTES[k].join(' / ')}</p>
      <p class="c3__price">${price(k)}</p>${addBtn('Sepete ekle')}
    </div>
    ${scentPick('c3__pick')}
  </section>
  <section class="c3__strip">
    <div class="c3__track">${SHOTS.concat(SHOTS).map(x => `<img src="assets/${x}" alt="" loading="lazy">`).join('')}</div>
  </section>
  <section class="c3__quote rv-up">
    <p>“İlk gün rengi gördüm, üçüncü gün herkes tatilden mi döndün diye sordu.”</p><span>Ayşe K. · Doğrulanmış alıcı · ${stars}</span>
  </section>`;

  /* ---------- 4 · TEMİZ TİCARİ (Rhode / Glossier): 2x2 görsel ızgara, net bilgi, sekmeli detay ---------- */
  const c4 = () => `
  <section class="c4">
    <div class="c4__grid" id="c4g">
      <figure class="c4__main" data-zoom="${img(k)}"><div class="c4__float"><img src="${img(k)}" alt="${b().name}"></div></figure>
      ${SHOTS.slice(0, 5).map((x, i) => `<figure class="c4__more" style="--i:${i}" data-zoom="assets/${x}"><img src="assets/${x}" alt="" loading="lazy"></figure>`).join('')}
    </div>
    <aside class="c4__buy">
      <span class="c4__badge">%${BOMBS[k].old ? Math.round((1 - BOMBS[k].price / BOMBS[k].old) * 100) : 0}<small>indirim</small></span><p class="c4__kick" lang="en">${CATS[catOf(k)].name}</p><div class="c4__top"><h1 lang="en">${/[a-e]/.test(concept) ? `<em>${b().name.split(' ')[0]}</em> ${b().name.split(' ').slice(1).join(' ')}` : b().name}</h1><p class="c4__price">${price(k)}</p></div>
      <p class="c4__meta"><a class="c4__rate" href="#">${stars} 4.8 <u>2.841 yorum</u></a><span class="c4__ml">${FACT[catOf(k)][1].split(' · ')[0]}</span></p>
      <p class="c4__lede">${b().note} <span class="c4__notes">${NOTES[k].join(' · ')}</span></p>
      <div class="c4__vars" role="radiogroup" aria-label="Seçenekler">${keysOf().map(x => `<button data-k="${x}" aria-pressed="${x === k}" aria-label="${BOMBS[x].name}" title="${BOMBS[x].name}"><img src="${thumb(x)}" alt=""></button>`).join('')}</div>
      <div class="c4__buyrow">
        <div class="c4__qty" role="group" aria-label="Adet">
          <button data-q="-1" aria-label="Azalt" ${qty <= 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg></button>
          <span class="c4__qn" aria-live="polite"><i id="c4n">${qty}</i></span>
          <button data-q="1" aria-label="Artır"><svg viewBox="0 0 24 24"><path d="M6 12h12M12 6v12"/></svg></button>
        </div>
        <button class="c4__add" data-add>
          <span class="c4__fill" aria-hidden="true"></span>
          <svg class="c4__bag" viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg>
          <span class="c4__addt" id="c4t">Sepete ekle</span>
          <span class="c4__addp" id="c4p">${fmt(BOMBS[k].price * qty)}</span>
        </button>
      </div>
      <div class="c4__acc">
        <details><summary>Öne çıkan faydalar</summary><div>${BEN.map(x => `<p><b>${x[0]}.</b> ${x[1]}</p>`).join('')}</div></details>
        <details><summary>Kanıtlanmış sonuçlar</summary><div><p>Kullanıcı testlerinde katılımcıların çoğu ilk uygulamada daha canlı ve eşit bir ton gördüğünü belirtti.*</p><p class="c4__fn">*Sonuçlar marka testleriyle güncellenecek.</p></div></details>
        <details><summary>Kimler için ideal</summary><div><p>${{ bronzing: 'Buğday, orta ve koyu tenler; hızlı ve yoğun bronz isteyenler.', parfum: 'Akşam davetleri ve iz bırakan kokuları sevenler.', illusion: 'Işıltılı bir bitiş isteyen, bronz teni öne çıkarmak isteyenler.', fragrance: 'Gün boyu tazelenmek isteyenler; vücut ve saç için.' }[catOf(k)]}</p></div></details>
        <details><summary>İçerikler</summary><div><p>${{ bronzing: 'Roucou yağı, havuç yağı, hindistan cevizi yağı, E vitamini.', parfum: 'Alkol, parfüm esansı, su. Tam liste ambalajdadır.', illusion: 'Mineral simler, jojoba yağı, tatlı badem yağı, E vitamini.', fragrance: 'Alkol, parfüm esansı, nemlendirici baz.' }[catOf(k)]}</p></div></details>
        <details><summary>Kullanım</summary><div><p>${{ bronzing: 'Çalkala, 20 cm’den sık, avuçlarınla yay. Denizden sonra yenile.', parfum: 'Nabız noktalarına sık; ovma.', illusion: 'Temiz, kuru cilde uygula; ışıltı için katman ekle.', fragrance: 'Vücuda ve saça sık; gün içinde tazele.' }[catOf(k)]}</p></div></details>
      </div>
    </aside>
  </section>
  <div class="c4bar" id="c4bar" aria-hidden="true">
    <img src="${thumb(k)}" alt=""><b lang="en">${b().name}</b>
    <span class="c4bar__p">${BOMBS[k].old ? `<em>%${Math.round((1 - BOMBS[k].price / BOMBS[k].old) * 100)} indirim</em><del>${fmt(BOMBS[k].old)}</del>` : ''}${fmt(BOMBS[k].price)}</span>
    <div class="c4__qty" role="group" aria-label="Adet"><button data-q="-1" aria-label="Azalt"><svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg></button><span class="c4__qn"><i class="c4bn">${qty}</i></span><button data-q="1" aria-label="Artır"><svg viewBox="0 0 24 24"><path d="M6 12h12M12 6v12"/></svg></button></div>
    <button class="c4__add" data-add><span class="c4__fill" aria-hidden="true"></span><svg class="c4__bag" viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg><span class="c4__addt">Sepete ekle</span><span class="c4__addp c4bp">${fmt(BOMBS[k].price * qty)}</span></button>
  </div>
  <section class="c4__ben">
    ${BEN.map((x, i) => `<div class="rv-up" style="transition-delay:${i * 90}ms"><img src="assets/${SHOTS[i + 3]}" alt="" loading="lazy"><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}
  </section>`;

  /* ---------- 5 · DESTİNASYON: her koku bir yer; kaydırarak gezilir, zemin ve ürün o yere döner ---------- */
  const c5 = () => {
    const [r1, r2] = raysFor(k);
    return `
  <section class="c5" style="--r1:${r1};--r2:${r2}">
    <div class="c5__rays"></div>
    <header class="c5__head"><p>Destinasyon seç</p>${scentPick('c5__pick')}</header>
    <div class="c5__body">
      <div class="c5__place"><span>${coord(k)}</span><h1>${place(k)}</h1></div>
      <img class="c5__p" src="${img(k)}" alt="${b().name}">
      <div class="c5__info">
        <h2 lang="en">${b().name}</h2><p>${b().note}</p>
        <ul>${['Üst', 'Kalp', 'Dip'].map((t, i) => `<li><small>${t}</small>${NOTES[k][i]}</li>`).join('')}</ul>
        <p class="c5__price">${price(k)}</p>${addBtn()}
      </div>
    </div>
  </section>`;
  };

  const C = { 1: c1, 2: c2, 3: c3, 4: c4, 5: c5, a: c4, b: c4, c: c4, d: c4, e: c4 };
  const root = $('#psRoot');
  const draw = () => {
    root.innerHTML = C[concept]();
    root.className = 'ps__root ps--' + concept + (/[a-e]/.test(concept) ? ' ps--4 v-' + concept : '');
    const [g1, g2] = raysFor(k); root.style.setProperty('--tint', `color-mix(in oklab, ${BOMBS[k].c} 22%, #f6f2ec)`); root.style.setProperty('--deep', `color-mix(in oklab, ${BOMBS[k].c} 40%, #170e09)`);
    $$('#psTabs button').forEach(x => x.setAttribute('aria-pressed', x.dataset.c === concept));
    history.replaceState(null, '', onPdp ? `?p=${k}` : `?s=${concept}&p=${k}`);
    document.title = `${BOMBS[k].name} — Eda Taşpınar`;
    // ekrana girince belirme
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15 });
    $$('.rv-up,.rv-zoom', root).forEach(el => reduced ? el.classList.add('in') : io.observe(el));
    requestAnimationFrame(() => root.classList.add('is-ready'));
    const [r1, r2] = raysFor(k); root.style.setProperty('--r1', r1); root.style.setProperty('--r2', r2);
    let fx = 'rays'; try { fx = localStorage.getItem('eda-btnfx') || 'rays'; } catch (e) {}
    root.dataset.fx = fx; $$('.c4__fx [data-fx]', root).forEach(x => x.setAttribute('aria-pressed', x.dataset.fx === fx));
    setTimeout(galScroll, 0);
    const bar = $('#c4bar'), mainBuy = $('.c4__buyrow');
    barCheck = () => { if (!bar || !mainBuy) return; const on = mainBuy.getBoundingClientRect().bottom < 0; if (on !== bar.classList.contains('on')) { bar.classList.toggle('on', on); bar.setAttribute('aria-hidden', !on); } };
    barCheck();
    onScroll();
  };
  // 2 · sahne: kaydırma ilerlemesine bağlı büyüme ve faydalar
  const onScroll = () => {
    const s = $('.c2'); if (!s) return;
    const r = s.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    s.style.setProperty('--p', p.toFixed(3));
    $$('.c2__b', s).forEach((el, i) => el.classList.toggle('on', p > .18 + i * .2));
    s.classList.toggle('dock', p > .82);
  };
  // 4 · galeri: açılışta tek büyük ürün görseli; aşağı kaydırınca küçülüp ızgaraya oturur, diğer görseller gelir (Augustinus Bader)
  // 4 · galeri (Augustinus Bader): beyaz zeminli tek büyük görsel, kaydırdıkça küçülüp ızgaranın ilk hücresine iner,
  // altından diğer görseller açığa çıkar. Hareket kaydırmaya bağlı (ileri-geri akıcı).
  const galScroll = () => {
    const g = $('#c4g'); if (!g) return;
    const main = $('.c4__main', g), fl = $('.c4__float', g); if (!fl) return;
    const W = g.clientWidth, cw = main.clientWidth, ch = main.clientHeight;
    const bigH = Math.max(420, innerHeight - g.getBoundingClientRect().top - scrollY - 24 + Math.min(scrollY, 0));
    const p = reduced ? 1 : Math.min(1, Math.max(0, scrollY / 420));
    const e = 1 - Math.pow(1 - p, 3);
    fl.style.width = (W + (cw - W) * e) + 'px';
    fl.style.height = (bigH + (ch - bigH) * e) + 'px';
    g.style.setProperty('--p', e.toFixed(3));
  };
  addEventListener('resize', galScroll);
  // sepete ekleyince şişe minyatürü sepet simgesine uçar
  const flyToBag = () => {
    if (reduced) return;
    const from = $('.c4__float img') || $('.c4__main img'), to = $('#bagBtn'); if (!from || !to) return;
    const a = from.getBoundingClientRect(), b2 = to.getBoundingClientRect();
    const f = document.createElement('img'); f.src = from.src; f.className = 'fly';
    Object.assign(f.style, { left: a.left + a.width / 2 - 40 + 'px', top: a.top + a.height / 2 - 60 + 'px' });
    document.body.appendChild(f);
    const dx = b2.left + b2.width / 2 - (a.left + a.width / 2), dy = b2.top + b2.height / 2 - (a.top + a.height / 2);
    f.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx * .55}px,${dy * .55 - 120}px) scale(.6) rotate(-12deg)`, opacity: 1, offset: .55 }, { transform: `translate(${dx}px,${dy}px) scale(.12) rotate(-24deg)`, opacity: .3 }],
      { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => f.remove();
  };
  // görsele tıklayınca büyük açılır; oklarla diğerlerine geçilir
  const openZoom = src => {
    const list = $$('[data-zoom]', root).map(x => x.dataset.zoom); let i = list.indexOf(src);
    document.body.insertAdjacentHTML('beforeend', `<div class="zoom" id="zoom"><button class="zoom__x" aria-label="Kapat">✕</button><button class="zoom__a zoom__a--l" aria-label="Önceki">‹</button><img alt=""><button class="zoom__a zoom__a--r" aria-label="Sonraki">›</button><span class="zoom__n"></span></div>`);
    const z = $('#zoom'), im = $('img', z);
    const show = () => { im.src = list[i]; im.classList.toggle('is-p', /bomb\//.test(list[i])); $('.zoom__n', z).textContent = `${i + 1} / ${list.length}`; };
    const close = () => { z.classList.remove('on'); document.documentElement.classList.remove('pop-lock'); setTimeout(() => z.remove(), 300); removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { i = (i + 1) % list.length; show(); } if (e.key === 'ArrowLeft') { i = (i - 1 + list.length) % list.length; show(); } };
    z.addEventListener('click', e => {
      if (e.target.closest('.zoom__a--r')) { i = (i + 1) % list.length; show(); return; }
      if (e.target.closest('.zoom__a--l')) { i = (i - 1 + list.length) % list.length; show(); return; }
      if (e.target === z || e.target.closest('.zoom__x')) close();
    });
    addEventListener('keydown', key);
    show(); document.documentElement.classList.add('pop-lock'); requestAnimationFrame(() => z.classList.add('on'));
  };
  addEventListener('scroll', () => { onScroll(); galScroll(); barCheck(); }, { passive: true });
  $('#psTabs') && $('#psTabs').addEventListener('click', e => { const t = e.target.closest('button'); if (!t) return; concept = t.dataset.c; scrollTo(0, 0); draw(); });
  root.addEventListener('click', e => {
    const s = e.target.closest('[data-k]'); if (s) { k = s.dataset.k; qty = 1; const y = scrollY; draw(); scrollTo(0, concept === '2' ? y : Math.min(y, 200)); return; }
    const z = e.target.closest('[data-zoom]');
    if (z) { openZoom(z.dataset.zoom); return; }
    const f = e.target.closest('button[data-fx]');
    if (f) { root.dataset.fx = f.dataset.fx; try { localStorage.setItem('eda-btnfx', f.dataset.fx); } catch (er) {} $$('.c4__fx [data-fx]').forEach(x => x.setAttribute('aria-pressed', x === f)); return; }
    const qb = e.target.closest('[data-q]');
    if (qb) {
      const d = +qb.dataset.q, nq = Math.max(1, Math.min(9, qty + d)); if (nq === qty) return; qty = nq;
      const box = $('.c4__qn'), old = $('#c4n');
      const nu = document.createElement('i'); nu.textContent = qty; nu.className = d > 0 ? 'in-up' : 'in-dn';
      old.id = ''; old.className = d > 0 ? 'out-up' : 'out-dn'; nu.id = 'c4n'; box.appendChild(nu); setTimeout(() => old.remove(), 350);
      $('[data-q="-1"]').disabled = qty <= 1;
      $('#c4p').textContent = fmt(BOMBS[k].price * qty);
      $$('.c4bn').forEach(x => x.textContent = qty); $$('.c4bp').forEach(x => x.textContent = fmt(BOMBS[k].price * qty));
      const qbtn = $$('[data-q="-1"]'); qbtn.forEach(x => x.disabled = qty <= 1); return;
    }
    const ab = e.target.closest('[data-add]');
    if (ab) {
      if (ab.classList.contains('is-done')) return;
      flyToBag(); const n = qty, kk = k; setTimeout(() => { for (let i = 0; i < n; i++) window.EDA.add(kk); }, reduced ? 0 : 820); // şişe sepete varınca sepet açılır
      ab.classList.add('is-done'); $('#c4t').textContent = qty > 1 ? `${qty} ürün eklendi` : 'Sepete eklendi';
      setTimeout(() => { ab.classList.remove('is-done'); $('#c4t').textContent = 'Sepete ekle'; }, 1800);
      return;
    }
    const t = e.target.closest('.c4__tabs button');
    if (t) {
      $$('.c4__tabs button').forEach(x => x.setAttribute('aria-selected', x === t));
      $('#c4p').innerHTML = [BEN.map(x => `<p><b>${x[0]}.</b> ${x[1]}</p>`).join(''), '<p>Çalkala, 20 cm’den sık, avuçlarınla yay. Denizden sonra yenile.</p>', '<p>Roucou yağı, havuç yağı, hindistan cevizi yağı, E vitamini.</p>'][t.dataset.t];
    }
  });
  draw();
})();
