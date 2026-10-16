/* Eda Taşpınar — ürün detay (Byredo ürün sayfası düzeni) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { BOMBS, CATS, catOf, fmt } = window.EDA;
  const root = $('#byRoot');
  if (!root) return;

  const q = new URLSearchParams(location.search);
  const k = BOMBS[q.get('p')] ? q.get('p') : 'miami';
  const B = BOMBS[k], cat = catOf(k) || 'bronzing';
  const SUB = .85;                                   // abonelik indirimi (%15) — sepet de bunu kullanıyor

  /* ---------- içerik ---------- */
  const NOTES = {
    gold: ['Hindistan cevizi', 'Vanilya', 'Amber'], miami: ['Ananas', 'Hindistan cevizi', 'Deniz tuzu'], mykonos: ['Bergamot', 'İncir', 'Beyaz misk'],
    copacabana: ['Mango', 'Çarkıfelek', 'Vanilya'], ibiza: ['Tropik meyve', 'Neroli', 'Amber'], tulum: ['Hindistan cevizi sütü', 'Tonka', 'Sandal ağacı'],
    sttropez: ['Pembe biber', 'Gül', 'Amber'], chaos: ['Bergamot', 'Deri', 'Oud'], maximizer: ['Narenciye', 'Neroli', 'Misk'], cooling: ['Nane', 'Salatalık', 'Aloe'],
    caprice: ['Frambuaz', 'Gül', 'Vanilya'], chaoselixir: ['Kakule', 'Lavanta', 'Tonka'], mondieu: ['Safran', 'Yasemin', 'Amber'], regina: ['Mandalina', 'Portakal çiçeği', 'Bal'],
    illusion: ['Hindistan cevizi', 'Tiare', 'Vanilya'], intenseoil: ['Hindistan cevizi', 'Karamel', 'Amber'], dryspray: ['Narenciye', 'Monoi', 'Misk'],
    asha: ['Armut', 'Şakayık', 'Misk'], myra: ['Böğürtlen', 'Menekşe', 'Paçuli'], groove: ['Greyfurt', 'Zencefil', 'Vetiver'], root: ['Yeşil yapraklar', 'İris', 'Sedir'],
    enigma: ['Siyah frenk üzümü', 'Gül', 'Paçuli'], noble: ['Biber', 'Sedir', 'Vetiver'], honour: ['Limon', 'Lavanta', 'Misk'], nova: ['Elma', 'Freesia', 'Misk'],
  };
  const TYPE = { bronzing: 'Bronzing Bomb', parfum: 'Eau de Parfum', illusion: 'Vücut Yağı' };
  const typeOf = x => { const c = catOf(x) || 'bronzing'; return c === 'fragrance' ? BOMBS[x].dest.split(' · ')[0] : TYPE[c]; };
  const typeEn = x => (catOf(x) || 'bronzing') !== 'illusion';
  const fullName = x => { const n = BOMBS[x].name, t = typeOf(x); return typeEn(x) && !n.toLowerCase().includes(t.toLowerCase()) ? `${n} ${t}` : n; };
  const mlOf = x => ({ bronzing: 200, parfum: 100, illusion: 200, fragrance: /Mist/.test(BOMBS[x].dest) ? 100 : 150 })[catOf(x) || 'bronzing'];

  const DESC = {
    bronzing: [`${B.name}, Bomb Gang’in ${B.dest} durağı. ${B.note}`, 'Roucou ve havuç yağıyla zenginleştirilmiş formülü, ilk uygulamadan itibaren derin ve eşit bir bronz verir. Yapışmayan dokusu tende hızla emilir; geride yalnızca ışıltı ve destinasyonun kokusu kalır. Güneşin altında en sevdiğin yağ, gölgede en sevdiğin koku.'],
    parfum: [`${B.name}: ${B.note}`, 'Bomb Parfum, bronzlaştırıcı serisinin ikonik şişesini eau de parfum olarak yeniden yorumluyor. Girişin için yaratılmış dört imzadan biri; tende saatlerce kalan, arkanda iz bırakan bir koku.'],
    illusion: [`${B.name}: ${B.note}`, 'Mineral simler ve besleyici yağlarla bronz teni öne çıkaran sıvı ışık. Gündüz doğal bir parıltı, gece göz alan bir ışıltı için katman katman uygulanabilir.'],
    fragrance: [`${B.name}: ${B.note}`, 'Gündüz için mist, gece için intense. Vücuda ve saça sıkılabilen formül, sen gittikten sonra bile kalan bir iz bırakır.'],
  }[cat];
  const KNOW = { bronzing: ['Hızlı bronzlaşma', 'Yapışmayan doku'], parfum: ['Eau de parfum', 'Uzun kalıcı'], illusion: ['Işıltılı bitiş', 'Tüm ten tonları'], fragrance: ['Vücut ve saç', 'Gün boyu tazelik'] }[cat];
  const USE = { bronzing: 'Çalkala, 20 cm’den sık, avuçlarınla yay. Denizden sonra yenile.', parfum: 'Nabız noktalarına sık; ovma.', illusion: 'Temiz, kuru cilde uygula; ışıltı için katman ekle.', fragrance: 'Vücuda ve saça sık; gün içinde tazele.' }[cat];
  const ING = { bronzing: 'Roucou yağı, havuç yağı, hindistan cevizi yağı, E vitamini.', parfum: 'Alkol, parfüm esansı, su. Tam liste ambalajdadır.', illusion: 'Mineral simler, jojoba yağı, tatlı badem yağı, E vitamini.', fragrance: 'Alkol, parfüm esansı, nemlendirici baz.' }[cat];

  /* ---------- yazı tipi ve renk seçenekleri (Jost + siyah kilitli varsayılan) ---------- */
  const FONTS = [
    ['jost', 'Jost', '"Jost",system-ui,sans-serif', 'Varsayılan · kilitli'],
    ['outfit', 'Outfit', '"Outfit",system-ui,sans-serif', 'Sitenin yazısı'],
    ['poppins', 'Poppins', '"Poppins",system-ui,sans-serif', 'Mevcut sitedeki'],
    ['tenor', 'Tenor Sans', '"Tenor Sans",system-ui,sans-serif', 'İnce, lüks'],
    ['josefin', 'Josefin Sans', '"Josefin Sans",system-ui,sans-serif', 'Geometrik, zarif'],
    ['questrial', 'Questrial', '"Questrial",system-ui,sans-serif', 'Sade, yuvarlak'],
    ['kv', 'KV başlık', '"Big Shoulders Display",Impact,sans-serif', 'Banner başlıkları + Jost'],
  ];
  const INKS = [
    ['siyah', 'Siyah', '#000000', 'kilitli'], ['logo', 'Logo kırmızısı', '#d9141e'], ['miami', 'Miami moru', '#650947'], ['pembe', 'Miami pembesi', '#ae1a6e'],
    ['bordo', 'St. Tropez bordosu', '#6a302f'], ['petrol', 'Born to Bronze petrolü', '#2f5f70'], ['kahve', 'Espresso', '#3a200c'], ['bronz', 'Bronz', '#8a4a12'],
  ];
  const store = (n, v) => { try { v === undefined ? 0 : localStorage.setItem(n, v); return localStorage.getItem(n); } catch (e) { return null; } };
  const setFont = id => {
    const f = FONTS.find(x => x[0] === id) || FONTS[0];
    root.dataset.font = f[0];
    root.style.setProperty('--by-f', f[0] === 'kv' ? FONTS[0][2] : f[2]);
    root.style.setProperty('--by-fh', f[2]);
    $$('[data-font]', root).forEach(b => b.setAttribute('aria-pressed', b.dataset.font === f[0]));
    store('eda-pdp-font', f[0]);
  };
  const setInk = id => {
    const c = INKS.find(x => x[0] === id) || INKS[0];
    root.style.setProperty('--by-ink', c[2]);
    $$('[data-ink]', root).forEach(b => b.setAttribute('aria-pressed', b.dataset.ink === c[0]));
    store('eda-pdp-ink', c[0]);
  };

  /* ---------- görseller ---------- */
  const REF = ['gold', 'miami', 'mykonos', 'copacabana', 'ibiza', 'tulum', 'sttropez', 'chaos', 'maximizer', 'cooling'];
  const SG = ['chaos', 'copacabana', 'dryspray', 'gold', 'ibiza', 'illusion', 'intenseoil', 'maximizer', 'miami', 'mykonos', 'sttropez', 'tulum'];
  const KV = ['chaos', 'copacabana', 'ibiza', 'maximizer', 'miami', 'mykonos', 'sttropez', 'tulum'];
  const bottle = x => `assets/bomb/${x}.webp`;
  const photo = x => REF.includes(x) ? `assets/ref/urun/${x}.jpg` : null;
  const life = x => SG.includes(x) ? `assets/sg/${x}.jpg` : 'assets/after/a2.jpg';
  const SLIDES = [
    `<div class="by-sl by-sl--studio"><img src="${bottle(k)}" alt="${B.name}"></div>`,
    `<div class="by-sl by-sl--macro"><img src="${bottle(k)}" alt=""></div>`,
    photo(k) ? `<div class="by-sl by-sl--photo"><img src="${photo(k)}" alt=""></div>` : `<div class="by-sl"><img src="assets/after/a3.jpg" alt=""></div>`,
    `<div class="by-sl"><img src="${life(k)}" alt=""></div>`,
  ];
  const N = SLIDES.length;

  /* ---------- ikonlar ---------- */
  const I = {
    l: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M13.5 8l-4 4 4 4" fill="none" stroke="#000" stroke-width="1"/></svg>',
    r: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M10.5 8l4 4-4 4" fill="none" stroke="#000" stroke-width="1"/></svg>',
    heart: '<svg viewBox="0 0 22 20"><path d="M11 18.6S1.6 13 1.6 6.6A4.9 4.9 0 016.5 1.6c1.9 0 3.5 1 4.5 2.6 1-1.6 2.6-2.6 4.5-2.6a4.9 4.9 0 014.9 5c0 6.4-9.4 12-9.4 12z"/></svg>',
    bag: '<svg viewBox="0 0 16 16"><path d="M2.5 5.5h11l-.8 9h-9.4z"/><path d="M5.5 5.5V4a2.5 2.5 0 015 0v1.5"/></svg>',
    down: '<svg viewBox="0 0 12 12"><path d="M2 4.25l4 4 4-4"/></svg>',
    chev: '<svg viewBox="0 0 12 12"><path d="M4.25 2l4 4-4 4"/></svg>',
    minus: '<svg viewBox="0 0 12 12"><path d="M2 6h8"/></svg>',
    plus: '<svg viewBox="0 0 12 12"><path d="M2 6h8M6 2v8"/></svg>',
    sun: '<i class="by-sun" aria-hidden="true"></i>',
  };
  const heartBtn = (cls, label = 'Favorilere ekle') => `<button class="${cls}" type="button" data-wish aria-label="${label}" aria-pressed="false">${I.heart}</button>`;
  const qtyBox = () => `<div class="by-qty" role="group" aria-label="Adet"><button type="button" data-q="-1" aria-label="Azalt" disabled>${I.minus}</button><i class="by-qn" aria-live="polite">1</i><button type="button" data-q="1" aria-label="Arttır">${I.plus}</button></div>`;
  const addBtn = cls => `<button class="by-add ${cls || ''}" type="button" data-add>${I.sun}<span class="by-add__l">Sepete ekle</span></button>`;

  /* ---------- ürün kartı (koleksiyon / bunları da sevebilirsin) ---------- */
  const TAGS = ['Çok satan', 'Yeni', '', 'Sınırlı sayıda'];
  const card = (x, i) => {
    const P = BOMBS[x], second = photo(x) || life(x);
    return `<a class="by-pc" href="urun.html?p=${x}">
      <div class="by-pc__m">
        ${TAGS[i % 4] ? `<span class="by-pc__tag">${TAGS[i % 4]}</span>` : ''}
        <button class="by-pc__bag" type="button" data-qadd="${x}" aria-label="Sepete ekle">${I.bag}</button>
        <div class="by-pc__tr"><div class="by-pc__im by-pc__im--cut"><img src="${bottle(x)}" alt="${P.name}" loading="lazy"></div><div class="by-pc__im${photo(x) ? ' by-pc__im--photo' : ''}"><img src="${second}" alt="" loading="lazy"></div></div>
        <i class="by-pc__bar"><b></b></i>
      </div>
      <div class="by-pc__t">
        <span class="by-pc__cat" ${typeEn(x) ? 'lang="en"' : ''}>${typeOf(x)}</span>
        <p class="by-pc__name" lang="en">${P.name}</p>
        <span class="by-pc__price">${fmt(P.price)}</span>
        <div class="by-pc__sz"><span>${mlOf(x)} ML</span></div>
        ${heartBtn('by-pc__wish')}
      </div>
    </a>`;
  };
  const sameCat = CATS[cat].keys.filter(x => x !== k);
  const start = Math.max(0, CATS[cat].keys.indexOf(k));
  const COLL = [...sameCat.slice(start), ...sameCat.slice(0, start)].slice(0, 4);
  const others = Object.keys(CATS).filter(c => c !== cat).map(c => CATS[c].keys[0]);
  const YML = [...others, ...sameCat.slice(4)].filter(x => !COLL.includes(x)).slice(0, 4);

  /* ---------- notalar / hediye ---------- */
  const NT = NOTES[k] || NOTES.miami;
  const STAGES = [['Üst notalar', NT[0], 'assets/img/panel-bronze.jpg'], ['Kalp notaları', NT[1], 'assets/plp/bronzing.jpg'], ['Dip notalar', NT[2], 'assets/plp/illusion.jpg']];
  const GIFT = [
    ['Hediye deneyimi', 'Eda Taşpınar Hediye Paketi', 'Her siparişte imza Eda Taşpınar ambalajıyla hediye paketi seçebilirsin. Hediye siparişlerinde faturada ürün ve tutar bilgisi yer almaz.', 'Hediye seçeneklerini keşfet', 'assets/img/story-eda.jpg'],
    ['Hediye deneyimi', 'Kişiye Özel Not', 'Sevdiğin birine gönderdiğin siparişe kendi cümlelerinle hazırlanmış bir not ekleyebilirsin; notun özel kartımıza basılır.', 'Detaylı bilgi', 'assets/img/panel-skin.jpg'],
  ];
  const campImg = KV.includes(k) ? `assets/img/kv-${k}.jpg` : { parfum: 'assets/img/band-parfum.jpg', illusion: 'assets/img/band-illusion.jpg', fragrance: 'assets/img/band-fragrance.jpg' }[cat] || 'assets/img/kv-born.jpg';

  /* ---------- sayfa ---------- */
  const loopSlides = [...SLIDES, ...SLIDES, ...SLIDES].map((s, i) => s.replace('class="by-sl', `data-i="${i % N}" class="by-sl`)).join('');
  root.innerHTML = `
  <section class="by-hero" id="byHero">
    <div class="by-hero__pin" id="byPin">
      <div class="by-stage">
        <div class="by-sw" id="bySw"><div class="by-track" id="byTrack">${loopSlides}</div></div>
        <span class="by-tag">Çok satan</span>
        <button class="by-arr by-arr--l" type="button" id="byPrev" aria-label="Önceki görsel">${I.l}</button>
        <button class="by-arr by-arr--r" type="button" id="byNext" aria-label="Sonraki görsel">${I.r}</button>
        <div class="by-prog"><b id="byProg"></b></div>
      </div>

      <div class="by-card" id="byCard">
        <div class="by-card__top"><h5 class="by-eyebrow" ${typeEn(k) ? 'lang="en"' : ''}>${typeOf(k)}</h5>${heartBtn('by-wish')}</div>
        <h1 class="by-name" lang="en">${fullName(k)}</h1>
        <p class="by-price"><span class="by-pnow">${fmt(B.price)}</span><del class="by-pold"></del></p>
        <div class="by-size"><span>Boyut</span><div><button type="button" aria-pressed="true">${mlOf(k)} ML</button></div></div>
        <div class="by-buy" id="byBuy">${qtyBox()}${addBtn()}</div>
        <div class="by-sub" id="bySub">
          <button class="by-sub__t" type="button" aria-pressed="false"><i class="by-sub__box"></i><span>Her ay gelsin, <b>%15</b> indirim</span><em>${fmt(Math.round(B.price * SUB))}</em></button>
          <div class="by-sub__more"><div>
            <div class="by-sub__f">${[['1', 'Her ay'], ['2', '2 ayda bir'], ['3', '3 ayda bir']].map(([v, t], i) => `<button type="button" data-freq="${v}" aria-pressed="${!i}">${t}</button>`).join('')}</div>
            <p>Abonelikte kargo her zaman ücretsiz. İstediğin zaman değiştir ya da iptal et.</p>
          </div></div>
        </div>
        <p class="by-ship">Ücretsiz kargo &amp; 30 gün ücretsiz iade</p>
      </div>

      <div class="by-info" id="byInfo">
        <div class="by-acc">
          <details open><summary><h2>Açıklama</h2>${I.down}</summary>
            <div class="by-acc__c"><div class="by-desc" id="byDesc"><p>${DESC[0]}</p><p>${DESC[1]}</p></div><button class="by-more" type="button" id="byMore">Devamı...</button></div></details>
          <details open><summary><h2>Bilinmesi gerekenler</h2>${I.down}</summary>
            <div class="by-acc__c"><ul class="by-know">${KNOW.map(x => `<li>${x}</li>`).join('')}</ul></div></details>
          <details><summary><h2>Notalar &amp; akorlar</h2>${I.down}</summary>
            <div class="by-acc__c"><p class="by-notes-l">Üst: ${NT[0]}</p><p class="by-notes-l">Kalp: ${NT[1]}</p><p class="by-notes-l">Dip: ${NT[2]}</p></div></details>
          <details><summary><h2>Kullanım</h2>${I.down}</summary><div class="by-acc__c"><p>${USE}</p></div></details>
          <details><summary><h2>İçerikler</h2>${I.down}</summary><div class="by-acc__c"><p>${ING}</p></div></details>
        </div>
      </div>
    </div>
  </section>

  <section class="by-col">
    <div class="by-col__h"><h2>Koleksiyon</h2></div>
    <div class="by-grid4">${COLL.map(card).join('')}</div>
  </section>

  <section class="by-camp"><img src="${campImg}" alt="" loading="lazy"></section>

  <section class="by-duo">
    <a class="by-media" href="#">
      <video src="assets/img/hero.mp4" muted loop playsinline autoplay preload="none"></video>
      <span class="by-media__h"><small>Yeni</small><b>Kampanya filmi</b></span>
      <span class="by-media__go">Keşfet</span>
    </a>
    <div class="by-txt">
      <h3 lang="en">Outshine everyone</h3>
      <p>Eda Taşpınar’ın dünyasında bronz bir renk değil, bir tavır. Her Bomb bir destinasyonun ruhunu taşır: güneşin, denizin ve gecenin. Kampanya filminde bu ruhu, onu en iyi taşıyanlarla anlatıyoruz.</p>
      <a href="#"><u>Kampanyayı keşfet</u></a>
    </div>
  </section>

  <section class="by-duo by-duo--rev">
    <div class="by-txt">
      <h3 lang="en">Find your glow</h3>
      <p>On destinasyon, on farklı ışıltı. Ten tonuna ve bronzlaşma hedefine göre sana en uygun Bomb’u birkaç adımda bul; ışıltın seni her yerde tanıtsın.</p>
      <a href="koleksiyon.html?c=bronzing"><u>Tonunu bul</u></a>
    </div>
    <a class="by-media" href="koleksiyon.html?c=bronzing">
      <img src="assets/img/panel-body.jpg" alt="" loading="lazy">
      <span class="by-media__h"><b lang="en">Bomb Gang</b></span>
      <span class="by-media__go">Keşfet</span>
    </a>
  </section>

  <section class="by-pin by-pin--notes" id="byNotes" style="--n:3">
    <div class="by-pin__in">
      <div class="by-pin__tr">${STAGES.map(([t, n, im]) => `
        <div class="by-nt"><img src="${im}" alt=""><h2>${t}</h2><ul><li>${n}</li></ul></div>`).join('')}
      </div>
      <i class="by-vbar by-vbar--w"><b></b></i>
    </div>
  </section>

  <section class="by-yml">
    <h2 class="by-yml__t">Bunları da sevebilirsin</h2>
    <div class="by-yml__g">${YML.map((x, i) => card(x, i + 1)).join('')}</div>
  </section>

  <section class="by-pin by-pin--gift" id="byGift" style="--n:2">
    <div class="by-pin__in">
      <div class="by-pin__tr">${GIFT.map(([h, s, p, a, im]) => `
        <div class="by-gf"><div class="by-gf__m"><img src="${im}" alt=""></div>
          <div class="by-gf__t"><div><h3>${h}</h3><h4>${s}</h4><p>${p}</p><a href="#"><u>${a}</u></a></div></div></div>`).join('')}
      </div>
      <i class="by-vbar"><b></b></i>
    </div>
  </section>

  <nav class="by-crumb" aria-label="Sayfa yolu">
    <a href="index.html">Ana sayfa</a>${I.chev}<a href="koleksiyon.html?c=${cat}">${CATS[cat].eyebrow}</a>${I.chev}<a href="koleksiyon.html?c=${cat}" lang="en">${CATS[cat].name}</a>${I.chev}<span lang="en">${B.name}</span>
  </nav>

  <div class="by-bar" id="byBar" aria-hidden="true">
    <img src="assets/thumb/${k}.webp" alt="">
    <div class="by-bar__n"><b lang="en">${B.name}</b><span><span ${typeEn(k) ? 'lang="en"' : ''}>${typeOf(k)}</span> · ${mlOf(k)} ML<span class="by-bar__sub"></span></span></div>
    <p class="by-price by-bar__p"><span class="by-pnow">${fmt(B.price)}</span><del class="by-pold"></del></p>
    ${qtyBox()}
    ${addBtn('by-bar__add')}
  </div>

  <div class="by-ds" id="byDs">
    <button class="by-ds__btn" type="button" aria-expanded="false"><b>Aa</b>Yazı &amp; renk</button>
    <div class="by-ds__p">
      <p class="by-ds__h">Yazı tipi</p>
      <div class="by-ds__fonts">${FONTS.map(([id, n, ff, d]) => `<button type="button" data-font="${id}"><b ${id === 'kv' ? '' : 'lang="en"'} style="font-family:${ff.replace(/"/g, '&quot;')}">${n}</b><small>${d}</small></button>`).join('')}</div>
      <p class="by-ds__h">Yazı rengi</p>
      <div class="by-ds__cols">${INKS.map(([id, n, c, d]) => `<button type="button" data-ink="${id}" style="--c:${c}"><i></i><span>${n}${d ? ` <small>${d}</small>` : ''}</span></button>`).join('')}</div>
    </div>
  </div>

  <div class="by-zoom" id="byZoom" aria-hidden="true"><button type="button" class="by-zoom__x" aria-label="Kapat"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><div class="by-zoom__in"></div></div>`;
  document.title = `${B.name} — Eda Taşpınar`;
  setFont(q.get('font') || store('eda-pdp-font') || 'jost');
  setInk(q.get('renk') || store('eda-pdp-ink') || 'siyah');

  /* ---------- görsel kaydırıcı: döngülü, 300 ms ---------- */
  const track = $('#byTrack'), prog = $('#byProg'), sw = $('#bySw');
  const narrow = matchMedia('(max-width:768px)');
  let idx = N, busy = false;
  const per = () => (narrow.matches ? 1 : 2);
  const setProg = () => { prog.style.transform = `scaleX(${(((idx % N) + N) % N + 1) / N})`; };
  const sync = () => { const w = sw.clientWidth / per(); track.style.transition = 'none'; track.style.transform = `translate3d(${-idx * w}px,0,0)`; };
  const goPx = d => {
    if (busy) return; busy = true; idx += d; const w = sw.clientWidth / per();
    track.style.transition = ''; track.style.transform = `translate3d(${-idx * w}px,0,0)`; setProg();
    setTimeout(() => { if (idx < N) idx += N; else if (idx >= 2 * N) idx -= N; sync(); busy = false; }, 310);
  };
  sync(); setProg(); addEventListener('resize', sync);
  $('#byPrev').addEventListener('click', () => goPx(-1));
  $('#byNext').addEventListener('click', () => goPx(1));
  let sx = null, dx = 0, moved = false;
  sw.addEventListener('pointerdown', e => { if (busy) return; sx = e.clientX; dx = 0; moved = false; });
  addEventListener('pointermove', e => {
    if (sx === null) return; dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true;
    if (moved) { const w = sw.clientWidth / per(); track.style.transition = 'none'; track.style.transform = `translate3d(${-idx * w + dx}px,0,0)`; }
  });
  addEventListener('pointerup', () => {
    if (sx === null) return; sx = null;
    if (moved && Math.abs(dx) > 50) goPx(dx < 0 ? 1 : -1); else if (moved) { track.style.transition = ''; sync(); }
  });
  const zoom = $('#byZoom');
  sw.addEventListener('click', e => {
    if (moved) return; const sl = e.target.closest('.by-sl'); if (!sl) return;
    $('.by-zoom__in', zoom).innerHTML = SLIDES[+sl.dataset.i];
    zoom.classList.add('is-on'); zoom.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('pop-lock');
  });
  const closeZoom = () => { zoom.classList.remove('is-on'); zoom.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('pop-lock'); };
  zoom.addEventListener('click', closeZoom);
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeZoom(); ds.classList.remove('is-open'); } });

  /* ---------- adet, abonelik, sepet ---------- */
  let qty = 1, sub = false, freq = '1';
  const unit = () => sub ? Math.round(B.price * SUB) : B.price;
  const paint = () => {
    $$('.by-pnow', root).forEach(x => { x.textContent = fmt(unit()); });
    $$('.by-pold', root).forEach(x => { x.textContent = sub ? fmt(B.price) : ''; });
    $$('.by-add__l', root).forEach(x => { x.textContent = sub ? 'Abone ol' : 'Sepete ekle'; });
    $('.by-bar__sub').textContent = sub ? ` · Abonelik, ${freq === '1' ? 'her ay' : freq + ' ayda bir'}` : '';
    $$('.by-qn', root).forEach(x => { if (x.textContent !== String(qty)) { x.textContent = qty; x.classList.remove('bump'); void x.offsetWidth; x.classList.add('bump'); } });
    $$('.by-qty [data-q="-1"]', root).forEach(b => { b.disabled = qty <= 1; });
  };
  const subBox = $('#bySub');
  $('.by-sub__t', subBox).addEventListener('click', e => { sub = !sub; subBox.classList.toggle('is-on', sub); e.currentTarget.setAttribute('aria-pressed', sub); paint(); });
  $('.by-sub__f', subBox).addEventListener('click', e => {
    const b = e.target.closest('[data-freq]'); if (!b) return; freq = b.dataset.freq;
    $$('[data-freq]', subBox).forEach(x => x.setAttribute('aria-pressed', x === b)); paint();
  });
  const addToBag = btn => {
    const E = window.EDA, key = sub ? `${k}@${freq}` : k, before = (E.getBag && E.getBag()[key]) || 0;
    E.add && E.add(key); if (qty > 1 && E.setQty) E.setQty(key, before + qty);
    $$('.by-add', root).forEach(b => b.classList.add('is-done')); setTimeout(() => $$('.by-add', root).forEach(b => b.classList.remove('is-done')), 1600);
  };
  root.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) { e.preventDefault(); const on = !w.classList.contains('is-on'); w.classList.toggle('is-on', on); w.setAttribute('aria-pressed', on); w.setAttribute('aria-label', on ? 'Favorilerden çıkar' : 'Favorilere ekle'); return; }
    const qa = e.target.closest('[data-qadd]');
    if (qa) { e.preventDefault(); window.EDA.add && window.EDA.add(qa.dataset.qadd); return; }
    const qb = e.target.closest('.by-qty [data-q]');
    if (qb) { qty = Math.max(1, Math.min(10, qty + +qb.dataset.q)); paint(); return; }
    if (e.target.closest('[data-add]')) addToBag();
  });
  paint();

  /* ---------- yazı tipi / renk paneli ---------- */
  const ds = $('#byDs');
  $('.by-ds__btn', ds).addEventListener('click', e => { const o = ds.classList.toggle('is-open'); e.currentTarget.setAttribute('aria-expanded', o); });
  ds.addEventListener('click', e => {
    const f = e.target.closest('[data-font]'); if (f) setFont(f.dataset.font);
    const c = e.target.closest('[data-ink]'); if (c) setInk(c.dataset.ink);
  });
  document.addEventListener('click', e => { if (!ds.contains(e.target)) ds.classList.remove('is-open'); });

  /* ---------- açıklama: devamı ---------- */
  $('#byMore').addEventListener('click', e => { const open = $('#byDesc').classList.toggle('is-open'); e.currentTarget.textContent = open ? 'Daha az' : 'Devamı...'; });

  /* ---------- kaydırınca: görseller sabit, kart yukarı çıkar, açıklamalar aşağıdan gelir, alt bar belirir ---------- */
  const hero = $('#byHero'), cardEl = $('#byCard'), info = $('#byInfo'), bar = $('#byBar'), buy = $('#byBuy');
  const infoKids = $$('.by-acc > details', info);
  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  let barOn = null;
  const setBar = on => { if (on === barOn) return; barOn = on; bar.classList.toggle('on', on); bar.setAttribute('aria-hidden', !on); document.body.classList.toggle('by-bar-on', on); };
  const onHero = () => {
    if (narrow.matches) {
      cardEl.style.transform = cardEl.style.opacity = info.style.transform = info.style.opacity = '';
      infoKids.forEach(d => { d.style.transform = d.style.opacity = ''; });
      setBar(buy.getBoundingClientRect().bottom < 0);
      return;
    }
    const hh = parseFloat(getComputedStyle(root).paddingTop) || 62;
    const r = hero.getBoundingClientRect(), span = hero.offsetHeight - $('#byPin').offsetHeight;
    const t = span > 0 ? clamp((hh - r.top) / span) : 0;
    const a = ease(clamp(t / .4)), vh = innerHeight / 100;
    cardEl.style.transform = `translate3d(0,calc(-50% - ${a * 95 * vh}px),0) scale(${1 - a * .04})`;
    cardEl.style.opacity = 1 - clamp((t - .1) / .3);
    cardEl.style.pointerEvents = a > .05 ? 'none' : '';
    const b = easeOut(clamp((t - .28) / .42));
    info.style.transform = `translate3d(0,calc(-50% + ${(1 - b) * 85 * vh}px),0)`;
    info.style.opacity = clamp((t - .26) / .18);
    info.style.pointerEvents = b > .85 ? 'auto' : 'none';
    infoKids.forEach((d, i) => { const c = easeOut(clamp((t - .34 - i * .05) / .36)); d.style.transform = `translate3d(0,${(1 - c) * 48}px,0)`; d.style.opacity = c; });
    setBar(t > .3);
  };
  addEventListener('scroll', onHero, { passive: true }); addEventListener('resize', onHero); onHero();

  /* ---------- notalar ve hediye: kaydırdıkça bir sonraki ekran ---------- */
  const pins = $$('.by-pin').map(el => ({ el, n: +getComputedStyle(el).getPropertyValue('--n'), tr: $('.by-pin__tr', el), bar: $('.by-vbar b', el), cur: -1 }));
  const onPin = () => {
    pins.forEach(p => {
      const r = p.el.getBoundingClientRect(), span = r.height - innerHeight;
      const t = span > 0 ? Math.min(.999, Math.max(0, -r.top / span)) : 0;
      const i = Math.floor(t * p.n);
      if (i !== p.cur) { p.cur = i; p.tr.style.transform = `translate3d(0,${-i * 100 / p.n}%,0)`; p.bar.style.transform = `scaleY(${(i + 1) / p.n})`; }
    });
  };
  addEventListener('scroll', onPin, { passive: true }); addEventListener('resize', onPin); onPin();

  /* ---------- video yalnızca görünürken oynasın ---------- */
  const vid = $('.by-media video');
  if (vid) new IntersectionObserver(([en]) => { if (en.isIntersecting) { vid.preload = 'auto'; vid.play().catch(() => {}); } else vid.pause(); }).observe(vid);
})();
