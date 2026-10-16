/* Eda Taşpınar — liste (koleksiyon.html) ve ürün (urun.html) sayfaları */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { BOMBS, CATS, catOf, raysFor, lum, img, thumb, fmt } = window.EDA;
  const q = new URLSearchParams(location.search);
  const sub = k => BOMBS[k].sub || BOMBS[k].dest;
  // yorum sayıları yer tutucu
  const reviews = k => 120 + (k.split('').reduce((n, ch) => n + ch.charCodeAt(0), 0) * 7) % 2600;
  // ürün renkleri: canlı ışınlar (r1/r2), sade zemin (soft), kart tonu (tint)
  const paint = (el, k) => {
    const [r1, r2] = raysFor(k), c = BOMBS[k].c;
    el.style.setProperty('--r1', r1); el.style.setProperty('--r2', r2);
    el.style.setProperty('--g-fg', lum(r1) > .45 ? '#170e09' : '#fff');
    el.style.setProperty('--soft', `color-mix(in oklab, ${c} 36%, #170e09)`);
    el.style.setProperty('--tint', `color-mix(in oklab, ${c} 16%, #f3ece2)`);
  };
  const price = k => `${fmt(BOMBS[k].price)}${BOMBS[k].old ? ` <s>${fmt(BOMBS[k].old)}</s>` : ''}`;
  // ürün türü (filtre için)
  const typeOf = k => {
    const c = catOf(k);
    if (c === 'bronzing') return ['maximizer', 'cooling'].includes(k) ? 'Bakım' : 'Bronzing Bomb';
    if (c === 'parfum') return 'Eau de Parfum';
    if (c === 'fragrance') return BOMBS[k].dest.split(' · ')[0];
    return (BOMBS[k].sub || '').split(' · ')[0];
  };

  /* ---------- Ürün kartı (Sol de Janeiro düzeni): açık zemin, ürün ortada; üstüne gelince
     kullanım sonrası ten fotoğrafı (yer tutucu — markanın gerçek "önce/sonra" çekimleri gelecek) */
  const AFTER = k => `assets/after/a${(Object.keys(BOMBS).indexOf(k) % 8) + 1}.jpg`;
  const off = k => BOMBS[k].old ? Math.round((1 - BOMBS[k].price / BOMBS[k].old) * 100) : 0;
  const card = (k, i = 0) => `
    <article class="pcard" data-k="${k}" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <a class="pcard__media" href="urun.html?p=${k}">
        <img class="pcard__p" src="${img(k)}" alt="${BOMBS[k].name}" loading="lazy" decoding="async">
        <img class="pcard__a" src="${AFTER(k)}" alt="" loading="lazy" decoding="async">
        <button class="pcard__fav" data-fav="${k}" aria-label="Favorilere ekle"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg></button>
        ${off(k) ? `<span class="pcard__off"><small>İndirim</small><b>%${off(k)}</b></span>` : ''}
        <span class="pcard__after">Kullanım sonrası</span>
        <button class="pcard__quick" data-add="${k}">Hızlı ekle</button>
      </a>
      <div class="pcard__info">
        <a href="urun.html?p=${k}" class="pcard__name">${BOMBS[k].name}</a>
        <p class="pcard__rating"><i>★★★★★</i> ${reviews(k).toLocaleString('tr-TR')}</p>
        <p class="pcard__price">${fmt(BOMBS[k].price)}${BOMBS[k].old ? ` <s>${fmt(BOMBS[k].old)}</s>` : ''}</p>
      </div>
    </article>`;
  const wireCards = root => {
    $$('.pcard', root).forEach(c => paint($('.pcard__media', c), c.dataset.k));
    root.addEventListener('click', e => {
      const f = e.target.closest('[data-fav]');
      if (f) { e.preventDefault(); f.classList.toggle('is-on'); return; }
      const a = e.target.closest('[data-add]'); if (!a) return;
      e.preventDefault(); window.EDA.add(a.dataset.add);
    });
  };

  /* ================= LİSTE ================= */
  if ($('#plpGrid')) {
    const cat = CATS[q.get('c')] ? q.get('c') : 'bronzing', C = CATS[cat];
    const hero = $('#plpHero');
    let sort = 'feat';
    const sel = { type: new Set(), price: new Set() };
    const BANDS = [['lo', '₺1.000 altı', p => p < 1000], ['mid', '₺1.000 – ₺1.500', p => p >= 1000 && p <= 1500], ['hi', '₺1.500 üzeri', p => p > 1500]];
    document.title = `${C.name} — Eda Taşpınar`;
    $('#plpImg').src = `assets/plp/${cat}.jpg`;
    hero.style.setProperty('--kv', { bronzing: '#f6d94a', parfum: '#e8337f', illusion: '#ffd27a', fragrance: '#ff8fc4' }[cat]); // KV'lerdeki gibi kategori rengi
    $('#plpEye').textContent = C.eyebrow;
    $('#plpTitle').innerHTML = `<span>${C.motto[0]}</span><b>${C.motto[1]}</b>`;
    $('#plpLede').textContent = C.lede;
    $('#plpCrumb').textContent = C.name;
    // filtre seçenekleri: sadece bu kategoride gerçekten olanlar
    const types = [...new Set(C.keys.map(typeOf))];
    const bands = BANDS.filter(b => C.keys.some(k => b[2](BOMBS[k].price)));
    const chip = (g, v, l) => `<button class="fchip" data-g="${g}" data-v="${v}" aria-pressed="false">${l}</button>`;
    $('#fltType .flt__chips').innerHTML = types.map(t => chip('type', t, t)).join('');
    $('#fltType').hidden = types.length < 2;
    $('#fltPrice .flt__chips').innerHTML = bands.map(b => chip('price', b[0], b[1])).join('');
    $('#fltPrice').hidden = bands.length < 2;
    const render = () => {
      let keys = C.keys.filter(k =>
        (!sel.type.size || sel.type.has(typeOf(k))) &&
        (!sel.price.size || bands.some(b => sel.price.has(b[0]) && b[2](BOMBS[k].price))));
      if (sort === 'low') keys.sort((a, b) => BOMBS[a].price - BOMBS[b].price);
      if (sort === 'high') keys.sort((a, b) => BOMBS[b].price - BOMBS[a].price);
      if (sort === 'az') keys.sort((a, b) => BOMBS[a].name.localeCompare(BOMBS[b].name, 'tr'));
      $('#plpCount').textContent = `${keys.length} ürün`;
      const n = sel.type.size + sel.price.size;
      $('#fltN').textContent = n || ''; $('#fltN').hidden = !n;
      $('#plpGrid').innerHTML = keys.map(card).join('');
      $$('.pcard', $('#plpGrid')).forEach(c => paint($('.pcard__media', c), c.dataset.k));
      $('#plpEmpty').hidden = keys.length > 0;
      // kartlar ekrana girdikçe sırayla belirir
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.style.transitionDelay = (en.target.dataset.i % 4) * 70 + 'ms'; en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: .12 });
      $$('.pcard', $('#plpGrid')).forEach((c, i) => { c.dataset.i = i; io.observe(c); });
      $$('.fchip').forEach(b => b.setAttribute('aria-pressed', sel[b.dataset.g].has(b.dataset.v)));
    };
    $('#fltBtn').addEventListener('click', e => {
      const open = $('#plpTools').classList.toggle('is-flt');
      e.currentTarget.setAttribute('aria-expanded', open);
    });
    $('#flt').addEventListener('click', e => {
      const b = e.target.closest('.fchip'); if (!b) return;
      const s = sel[b.dataset.g]; s.has(b.dataset.v) ? s.delete(b.dataset.v) : s.add(b.dataset.v); render();
    });
    const clear = () => { sel.type.clear(); sel.price.clear(); render(); };
    $('#fltClear').addEventListener('click', clear); $('#fltClear2').addEventListener('click', clear);
    const dd = $('#sortDd');
    $('#sortBtn').addEventListener('click', e => { e.stopPropagation(); const o = dd.classList.toggle('is-open'); e.currentTarget.setAttribute('aria-expanded', o); });
    $('.dd__menu', dd).addEventListener('click', e => {
      const li = e.target.closest('li'); if (!li) return;
      sort = li.dataset.v; $('#sortLbl').textContent = li.textContent;
      $$('li', dd).forEach(x => x.classList.toggle('is-on', x === li));
      dd.classList.remove('is-open'); render();
    });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) dd.classList.remove('is-open'); });
    $('li', dd).classList.add('is-on');
    wireCards($('#plpGrid'));
    render();
  }

  /* ================= ÜRÜN ================= */
  if ($('.pdp')) {
    let k = BOMBS[q.get('p')] ? q.get('p') : 'gold', n = 1, mode = 'once', revF = 'all';
    const SUB = .85;
    // --- içerikler yer tutucudur; markanın gerçek ürün bilgileriyle değiştirilecek ---
    const NOTES = {
      gold: ['Hindistan cevizi', 'Vanilya', 'Amber'], miami: ['Ananas', 'Hindistan cevizi', 'Deniz tuzu'], mykonos: ['Bergamot', 'İncir', 'Beyaz misk'],
      copacabana: ['Mango', 'Çarkıfelek', 'Vanilya'], ibiza: ['Tropik meyve', 'Neroli', 'Amber'], tulum: ['Hindistan cevizi sütü', 'Tonka', 'Sandal ağacı'],
      sttropez: ['Pembe biber', 'Gül', 'Amber'], chaos: ['Bergamot', 'Deri', 'Oud'], maximizer: ['Narenciye', 'Neroli', 'Misk'], cooling: ['Nane', 'Salatalık', 'Aloe'],
      caprice: ['Frambuaz', 'Gül', 'Vanilya'], chaoselixir: ['Kakule', 'Lavanta', 'Tonka'], mondieu: ['Safran', 'Yasemin', 'Amber'], regina: ['Mandalina', 'Portakal çiçeği', 'Bal'],
      illusion: ['Hindistan cevizi', 'Tiare', 'Vanilya'], intenseoil: ['Hindistan cevizi', 'Karamel', 'Amber'], dryspray: ['Narenciye', 'Monoi', 'Misk'],
      asha: ['Armut', 'Şakayık', 'Misk'], myra: ['Böğürtlen', 'Menekşe', 'Paçuli'], groove: ['Greyfurt', 'Zencefil', 'Vetiver'], root: ['Yeşil yapraklar', 'İris', 'Sedir'],
      enigma: ['Siyah frenk üzümü', 'Gül', 'Paçuli'], noble: ['Biber', 'Sedir', 'Vetiver'], honour: ['Limon', 'Lavanta', 'Misk'], nova: ['Elma', 'Freesia', 'Misk'],
    };
    const PROF = {
      bronzing: [['Bronz yoğunluğu', 4], ['Koku yoğunluğu', 3], ['Kalıcılık', 4], ['Işıltı', 2]],
      parfum: [['Yoğunluk', 5], ['Kalıcılık', 5], ['İz bırakma', 4], ['Tatlılık', 3]],
      illusion: [['Işıltı', 5], ['Bronz tonu', 3], ['Koku yoğunluğu', 3], ['Hafiflik', 4]],
      fragrance: [['Yoğunluk', 3], ['Kalıcılık', 3], ['Ferahlık', 4], ['Tatlılık', 3]],
    };
    const CHIPS = { bronzing: ['Yoğun bronz', 'Kuru dokunuş', 'SPF 0'], parfum: ['Eau de Parfum', 'Gece', 'Unisex'], illusion: ['Işıltılı', 'Hafif yağ', 'Vücut'], fragrance: ['Gün boyu', 'Vücut & saç', 'Taze'] };
    const STORY = {
      bronzing: ['<em>Güneşi</em> şişeye koyduk', 'Akdeniz’in sıcak öğleden sonraları, tuzlu ten ve altın saat. Her Bomb bir destinasyondan ilham alıyor; kokusu da bronzu da oradan geliyor.'],
      parfum: ['<em>Odaya</em> girişin', 'El bombası formundaki şişe, iddialı bir girişin simgesi. Konsantre esans ilk sıkıştan iz bırakır, akşama kadar seninle kalır.'],
      illusion: ['<em>Işığı</em> tenine taşı', 'İnce mineral simler bronz tenin üzerinde ışığı yakalar. Hafif yağ formu yapışmadan emilir.'],
      fragrance: ['<em>Gündüzden</em> geceye', 'Mist gün boyu tazelemek için, intense akşam için daha derin bir iz bırakmak için.'],
    };
    const STATS = {
      bronzing: [['%94', 'daha parlak ten görünümü'], ['%91', 'ilk uygulamada eşit bronz'], ['%88', 'yapışmadan nem']],
      parfum: [['8+ saat', 'kalıcılık'], ['%92', 'gün sonunda iz fark edildi'], ['%89', 'iltifat aldı']],
      illusion: [['%96', 'ışıltılı ten görünümü'], ['%90', 'pürüzsüz bitiş'], ['%87', 'gün boyu ışıltı']],
      fragrance: [['6+ saat', 'kalıcılık (intense)'], ['%91', 'tazeleyici his'], ['%88', 'saçta kalıcılık']],
    };
    const RIT = { bronzing: [['maximizer', 'Hazırla', 'Bronzlaşmayı başlatır'], [null, 'Bronzlaş', 'Derin, eşit renk'], ['cooling', 'Serinle', 'Teni rahatlatır']],
      parfum: [['illusion', 'Işılda', 'Teni hazırla'], [null, 'Koku', 'Nabız noktalarına'], ['enigma', 'Tazele', 'Gün içinde']],
      illusion: [['gold', 'Bronzlaş', 'Önce renk'], [null, 'Işılda', 'Sonra ışıltı'], ['caprice', 'Koku', 'Son dokunuş']],
      fragrance: [['illusion', 'Işılda', 'Teni hazırla'], [null, 'Koku', 'Vücut ve saç'], ['caprice', 'Gece', 'Daha derin iz']] };
    const FAQ = {
      bronzing: [['Turuncu yapar mı?', 'Hayır. Formül altın-bronz tonda kalacak şekilde dengelendi; buğday ve koyu tenlerde doğal görünür.'], ['Kıyafete ya da havluya bulaşır mı?', 'Kuru dokunuşlu yağ hızla emilir. Uyguladıktan sonra birkaç dakika beklemen yeterli.'], ['Güneş koruması var mı?', 'Hayır, SPF 0’dır. Güneşe uzun süre çıkacaksan koruyucu ile birlikte kullan.'], ['Ne sıklıkla uygulamalıyım?', 'Güneşe çıkmadan önce ve denizden sonra yenile.']],
      parfum: [['Ne kadar kalıcı?', 'Tende 8 saate kadar iz bırakır.'], ['Hediye paketi var mı?', 'Tüm parfümler kutulu gönderilir; ödeme adımında hediye notu ekleyebilirsin.'], ['Hangi kokuyla başlamalıyım?', 'Tatlı sevenler için Caprice, daha derin bir iz için Chaos Elixir.']],
      illusion: [['Simler dökülür mü?', 'Yağ bazı sayesinde simler tende kalır, dökülmez.'], ['Yüze uygulanabilir mi?', 'Vücut için tasarlandı; yüzde göz çevresinden uzak tut.']],
      fragrance: [['Mist ile intense farkı ne?', 'Mist hafif ve tazeleyicidir; intense daha yoğun ve kalıcıdır.'], ['Saça sıkılabilir mi?', 'Evet, saçta kokusu daha uzun kalır.']],
    };
    // örnek yorumlar — canlıda yorum uygulamasından gelecek
    const REV = [
      { n: 'Ayşe K.', t: 'Buğday', a: '25–34', r: 5, h: 'Tatilden mi döndün dediler', b: 'İlk gün rengi gördüm, üçüncü gün herkes tatilden mi döndün diye sordu. Kokusu da çok güzel, akşama kadar üstümde kaldı.', p: ['after/a2.jpg'], d: '12 Eylül 2026', y: 24 },
      { n: 'Selin T.', t: 'Orta', a: '35–44', r: 5, h: 'Yapışmıyor, havluya bulaşmıyor', b: 'Kuru yağ dedikleri gerçekten öyle. Sürdükten beş dakika sonra giyinebildim. Şişesi de banyoda çok şık duruyor.', p: ['after/a7.jpg', 'after/a5.jpg'], d: '3 Eylül 2026', y: 18 },
      { n: 'Deniz A.', t: 'Koyu', a: '25–34', r: 5, h: 'Koyu tende turuncu durmuyor', b: 'Daha önce denediklerim hep turuncuya kaçıyordu. Bu altın bir ton veriyor, ışıltısı da tam kararında.', p: ['after/a1.jpg'], d: '28 Ağustos 2026', y: 31 },
      { n: 'Merve Y.', t: 'Açık', a: '18–24', r: 4, h: 'Açık ten için az az', b: 'Tenim açık olduğu için ilk gün az uyguladım. Üç günde güzel bir altın ton aldım. Bir yıldızı kokusu biraz yoğun olduğu için kırdım.', p: [], d: '19 Ağustos 2026', y: 9 },
      { n: 'Ece B.', t: 'Orta', a: '25–34', r: 5, h: 'Miami ile sırayla', b: 'Miami Extreme ile sırayla kullanıyorum. Kokusu yüzünden herkes ne sürdüğümü soruyor.', p: ['after/a3.jpg'], d: '2 Ağustos 2026', y: 12 },
      { n: 'Zeynep D.', t: 'Buğday', a: '35–44', r: 5, h: 'Tekrar aldım', b: 'İkinci şişem. Bodrum’da bir hafta kullandım, eşit ve doğal bir bronz oldu.', p: [], d: '21 Temmuz 2026', y: 7 },
    ];
    const UGC = [['after/a3.jpg', '@aysekaya', 'Buğday ten · 3. gün'], ['after/a1.jpg', '@denizz', 'Koyu ten · 2. gün'], ['after/a7.jpg', '@selintt', 'Orta ten · 5. gün'], ['after/a8.jpg', '@merve.y', 'Açık ten · 4. gün'], ['after/a2.jpg', '@ecebronz', 'Orta ten · 1. hafta'], ['after/a6.jpg', '@zeynep.d', 'Buğday ten · 3. gün']];
    const WHY = {
      bronzing: [['after/a3.jpg', 'Anında bronz', 'İlk uygulamada görünen, derin ve eşit bir renk. Günler içinde daha da koyulaşır.'], ['after/a6.jpg', 'Kuru dokunuş', 'Saniyeler içinde emilir; yapışmaz, havluya ve kıyafete bulaşmaz.'], ['after/a2.jpg', 'Bir destinasyon kokusu', 'Her Bomb ilham aldığı yerin kokusunu taşır. Bronzun gibi kokun da akılda kalır.']],
      parfum: [['pop/beach.jpg', 'Konsantre esans', 'Eau de parfum yoğunluğunda; ilk sıkıştan iz bırakır.'], ['after/a8.jpg', 'Akşama kadar', 'Tende saatlerce kalan, yumuşayarak derinleşen bir iz.'], ['plp/parfum.jpg', 'Koleksiyonluk şişe', 'El bombası formundaki imza şişe, makyaj masanın yıldızı.']],
      illusion: [['sg/illusion.jpg', 'Sıvı ışık', 'İnce mineral simler bronz tenin üzerinde ışığı yakalar.'], ['after/a1.jpg', 'Hafif yağ', 'Yağlı his bırakmadan emilir, ten ipeksi kalır.'], ['after/a7.jpg', 'Katman katman', 'Gündüz hafif, gece daha yoğun ışıltı için katman ekle.']],
      fragrance: [['plp/fragrance.jpg', 'Gündüz mist', 'Hafif ve tazeleyici; çantada taşı, gün içinde yenile.'], ['after/a8.jpg', 'Gece intense', 'Daha derin, daha kalıcı bir iz.'], ['pop/beach.jpg', 'Vücut ve saç', 'Saçta kokusu daha uzun kalır.']],
    };
    const PROFW = { bronzing: 'Sıcak · Gurme · Güneşli', parfum: 'Oryantal · Yoğun · Gece', illusion: 'Tropik · Yumuşak · Işıltılı', fragrance: 'Taze · Çiçeksi · Gündüz' };
    let revN = 4, revS = 'new';
    const how = {
      bronzing: 'İyice çalkala. Cilde 20 cm uzaktan uzun, eşit hareketlerle sık, avuçlarınla yay. Denize girdikten sonra yenile.',
      parfum: 'Nabız noktalarına sık: bilekler, boyun ve kulak arkası. Ovma.',
      illusion: 'Temiz ve kuru cilde uygula, masaj yaparak yedir. Daha fazla ışıltı için katman ekle.',
      fragrance: 'Tüm vücuda ve saçlara sık. Gün içinde tazele.',
    };
    const stars = n => '★★★★★'.slice(0, n) + '<span>' + '★★★★★'.slice(n) + '</span>';
    const priceNow = () => mode === 'sub' ? Math.round(BOMBS[k].price * SUB) : BOMBS[k].price;
    const updPrice = () => { $('#pdpAddPrice').textContent = fmt(priceNow() * n); $('#addLbl').textContent = mode === 'sub' ? 'Abone ol' : 'Sepete ekle'; };
    let rit = [];
    const renderReviews = () => {
      let list = REV.filter(r => revF === 'all' || r.t === revF);
      if (revS === 'help') list = list.slice().sort((a, b) => b.y - a.y);
      if (revS === 'photo') list = list.filter(r => r.p.length);
      $('#revList').innerHTML = list.slice(0, revN).map(r => `
        <article class="rw__it">
          <aside><b>${r.n}</b><span class="rw__ok">✓ Doğrulanmış alıcı</span><dl><div><dt>Ten</dt><dd>${r.t}</dd></div><div><dt>Yaş</dt><dd>${r.a}</dd></div></dl></aside>
          <div>
            <header><span class="rv__st">${stars(r.r)}</span><time>${r.d}</time></header>
            <h3>${r.h}</h3><p>${r.b}</p>
            ${r.p.length ? `<div class="rw__ph">${r.p.map(x => `<img src="assets/${x}" alt="" loading="lazy">`).join('')}</div>` : ''}
            <footer>Faydalı mı? <button data-y>Evet (${r.y})</button><button>Hayır</button></footer>
          </div>
        </article>`).join('') || '<p class="px-foot">Bu seçim için henüz yorum yok.</p>';
      $('#rwMore').hidden = list.length <= revN;
    };
    const render = () => {
      const b = BOMBS[k], c = catOf(k) || 'bronzing', C = CATS[c], rv = reviews(k);
      document.title = `${b.name} — Eda Taşpınar`;
      paint($('#pdpStage'), k); paint($('.pdp__gallery'), k); paint(document.body, k);
      const im = $('#pdpImg'); im.classList.add('is-out');
      setTimeout(() => { im.src = img(k); im.alt = b.name; im.classList.remove('is-out'); }, 180);
      $('#pdpCat').textContent = C.name; $('#pdpCat').href = 'koleksiyon.html?c=' + c;
      $('#pdpCrumb').textContent = b.name; $('#pdpEye').textContent = C.name;
      $('#pdpName').textContent = b.name;
      $('#pdpMood').textContent = (NOTES[k] || []).join(' · ');
      $('#pdpRev').textContent = `(${rv.toLocaleString('tr-TR')} değerlendirme)`;
      $('#pdpNote').textContent = b.note || '';
      $('#pdpChips').innerHTML = CHIPS[c].map(x => `<li>${x}</li>`).join('');
      $('#pOnce').textContent = fmt(b.price); $('#pOld').textContent = b.old ? fmt(b.old) : '';
      $('#pSub').textContent = fmt(Math.round(b.price * SUB));
      $('#pdpDesc').textContent = C.lede; $('#pdpHow').textContent = how[c];
      $('#pdpPickLbl').textContent = c === 'bronzing' ? 'Destinasyon' : 'Koku';
      $('#pdpPickName').textContent = b.name;
      $('#pdpSw').innerHTML = C.keys.map(x => `<a href="?p=${x}" data-k="${x}" role="radio" aria-checked="${x === k}">${BOMBS[x].name.replace(/ (Bomb|Extreme|Supreme|Glow|Pour Homme)$/, '')}</a>`).join('');
      $('#pdpThumbs').innerHTML = [0, 1].map(i => `<button data-v="${i}" aria-pressed="${i === 0}"><img src="${thumb(k)}" alt=""></button>`).join('');
      $('#barImg').src = thumb(k); $('#barName').textContent = b.name; $('#barPrice').textContent = fmt(b.price);
      updPrice();
      // neden sevilir: görsel sabit, bölümler akar
      const W = WHY[c];
      $('#zzFrame').innerHTML = W.map((x, i) => `<img src="assets/${x[0]}" alt="" class="${i ? '' : 'is-on'}" loading="lazy">`).join('');
      $('#zzText').innerHTML = `<p class="nt__eye">Neden sevilir</p>` + W.map((x, i) => `<div class="zz__ch" data-i="${i}"><span>${b.name}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('');
      watchZZ();
      // hikâye bandı
      $('#storyImg').src = `assets/plp/${c}.jpg`; $('#storyT').innerHTML = STORY[c][0]; $('#storyP').textContent = STORY[c][1];
      // notalar: tipografik
      const N = NOTES[k] || ['—', '—', '—'];
      $('#ntRow').innerHTML = [['Üst', N[0]], ['Kalp', N[1]], ['Dip', N[2]]].map(x => `<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('');
      $('#ntProf').innerHTML = `Koku profili <em>${PROFW[c]}</em>`;
      const HL = { bronzing: [['Hissi', 'Kuru, ipeksi yağ'], ['Bitişi', 'Hafif ışıltılı bronz'], ['Ne zaman', 'Güneşe çıkmadan önce'], ['Ten tipi', 'Buğday, orta ve koyu tenler']],
        parfum: [['Yoğunluk', 'Eau de parfum'], ['Kalıcılık', 'Akşama kadar'], ['Ne zaman', 'Gece ve özel anlar'], ['Kimin için', 'Kadın ve erkek']],
        illusion: [['Hissi', 'Hafif, yapışmayan yağ'], ['Bitişi', 'İnce mineral ışıltı'], ['Ne zaman', 'Gece ve davetler'], ['Nereye', 'Omuz, köprücük, bacak']],
        fragrance: [['Hissi', 'Ferah sprey'], ['Kalıcılık', 'Mist: gün içi · Intense: akşam'], ['Ne zaman', 'Her an'], ['Nereye', 'Vücut ve saç']] };
      $('#hlGrid').innerHTML = HL[c].map(x => `<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('');
      // ritüel
      rit = RIT[c].map(x => x[0] || k).filter((x, i, a) => a.indexOf(x) === i);
      if (rit.length < 3) rit.push(c === 'bronzing' ? 'illusion' : 'gold');
      $('#ritRow').innerHTML = RIT[c].map((x, i) => { const key = rit[i]; return `
        <a class="r2${key === k ? ' is-this' : ''}" href="urun.html?p=${key}">
          <span class="r2__img"><img src="${img(key)}" alt="" loading="lazy"></span>
          <small>${x[1]}</small><b>${BOMBS[key].name}</b><span class="r2__d">${x[2]}</span><em>${fmt(BOMBS[key].price)}</em>
        </a>`; }).join('<span class="r2__plus" aria-hidden="true">+</span>');
      const tot = rit.reduce((t, x) => t + BOMBS[x].price, 0);
      $('#ritOld').textContent = fmt(tot); $('#ritNow').textContent = fmt(Math.round(tot * .9));
      // müşteri fotoğrafları
      $('#ugcRow').innerHTML = UGC.map(x => `<figure><img src="assets/${x[0]}" alt="" loading="lazy"><figcaption><b>${x[1]}</b><span>${x[2]}</span></figcaption></figure>`).join('');
      // yorum başlığı
      const dist = [82, 12, 4, 1, 1];
      $('#rwSt').innerHTML = stars(5); $('#rwN').textContent = `${rv.toLocaleString('tr-TR')} değerlendirme`;
      $('#rwHist').innerHTML = dist.map((d, i) => `<li><span>${5 - i}</span><i><b style="width:${d}%"></b></i><em>${Math.round(rv * d / 100)}</em></li>`).join('');
      $('#revFilters').innerHTML = ['all', 'Açık', 'Buğday', 'Orta', 'Koyu'].map(f => `<button role="tab" data-f="${f}" aria-selected="${f === revF}">${f === 'all' ? 'Tüm tenler' : f + ' ten'}</button>`).join('');
      renderReviews();
      // diğer kokular
      $('#moreAll').href = 'koleksiyon.html?c=' + c;
      $('#moreRow').innerHTML = C.keys.filter(x => x !== k).slice(0, 6).map(x => `
        <a class="mk" href="urun.html?p=${x}"><span class="mk__img"><img src="${img(x)}" alt="" loading="lazy"></span><b>${BOMBS[x].name}</b><small>${(NOTES[x] || []).join(' · ')}</small><em>${fmt(BOMBS[x].price)}</em></a>`).join('');
      // SSS
      $('#faq').innerHTML = FAQ[c].map(x => `<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('');
    };
    $('#rwSort').addEventListener('change', e => { revS = e.target.value; renderReviews(); });
    $('#rwMore').addEventListener('click', () => { revN += 4; renderReviews(); });
    $('#revList').addEventListener('click', e => { const b = e.target.closest('[data-y]'); if (b && !b.dataset.done) { b.dataset.done = 1; b.textContent = b.textContent.replace(/\d+/, m => +m + 1); b.classList.add('is-on'); } });
    // neden sevilir: hangi bölüm ekranın ortasındaysa o görsel
    let zzObs;
    function watchZZ() {
      zzObs && zzObs.disconnect();
      const chs = $$('.zz__ch'), imgs = $$('#zzFrame img');
      zzObs = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return;
        const i = +en.target.dataset.i;
        imgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
        chs.forEach((ch, j) => ch.classList.toggle('is-on', j === i));
        $('#zzBar').style.width = ((i + 1) / chs.length * 100) + '%';
      }), { rootMargin: '-45% 0px -45% 0px' });
      chs.forEach(ch => zzObs.observe(ch));
    }
    $('#revFilters').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; revF = b.dataset.f; $$('#revFilters button').forEach(x => x.setAttribute('aria-selected', x === b)); renderReviews(); });
    $('#revWrite').addEventListener('click', () => alert('Yorum formu yorum uygulaması (Judge.me / Yotpo) bağlanınca açılacak.'));
    $('#ritAdd').addEventListener('click', () => window.EDA.add('set:' + rit.join(',')));
    $('#pdpSw').addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a) return;
      e.preventDefault(); k = a.dataset.k; n = 1; $('#qVal').textContent = 1;
      history.replaceState(null, '', '?p=' + k); render();
    });
    $('#pdpThumbs').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      $$('#pdpThumbs button').forEach(x => x.setAttribute('aria-pressed', x === t));
      $('#pdpStage').classList.toggle('is-plain', t.dataset.v === '1');
    });
    $('#buyOpts').addEventListener('change', e => { mode = e.target.value; $$('.buy__opt').forEach(l => l.classList.toggle('is-on', $('input', l).checked)); updPrice(); });
    const setN = v => { n = Math.max(1, Math.min(9, v)); $('#qVal').textContent = n; updPrice(); };
    $('#qMinus').addEventListener('click', () => setN(n - 1));
    $('#qPlus').addEventListener('click', () => setN(n + 1));
    const addN = () => { const key = mode === 'sub' ? `${k}@${$('#subFreq').value}` : k; for (let i = 0; i < n; i++) window.EDA.add(key); };
    $('#pdpAdd').addEventListener('click', addN);
    $('#barAdd').addEventListener('click', addN);
    new IntersectionObserver(([en]) => $('#pdpBar').classList.toggle('is-on', !en.isIntersecting && en.boundingClientRect.top < 0)).observe($('#pdpAdd'));
    render();
  }

  /* ================= SEPET ================= */
  if ($('#cart')) {
    const E = window.EDA, SHIP = 79.9, CODES = { BOMB15: .15 };
    let code = null; try { code = sessionStorage.getItem('eda-code'); } catch (e) {}
    const render = () => {
      const bag = E.getBag(), keys = Object.keys(bag);
      const count = keys.reduce((n, k) => n + bag[k], 0);
      $('#cartN').textContent = count ? `(${count})` : '';
      $('#cart').hidden = !keys.length; $('#cartEmpty').hidden = !!keys.length;
      const sub = keys.reduce((t, k) => t + bag[k] * E.item(k).price, 0);
      const disc = code ? Math.round(sub * CODES[code]) : 0;
      const ship = sub - disc >= E.FREE || !sub ? 0 : SHIP;
      const tot = sub - disc + ship;
      const left = E.FREE - (sub - disc);
      $('#cartShip').innerHTML = (left > 0 ? `Ücretsiz kargoya <b>${fmt(left)}</b> kaldı` : `<b>Ücretsiz kargo</b> kazandın`) + `<i><b style="width:${Math.min(100, (sub - disc) / E.FREE * 100)}%"></b></i>`;
      $('#cartItems').innerHTML = keys.map(k => { const it = E.item(k), base = k.split(/[@:]/)[k.startsWith('set:') ? 1 : 0].split(',')[0]; return `
        <article class="citem">
          <a class="citem__img" href="urun.html?p=${base}"><img src="${it.img}" alt=""></a>
          <div class="citem__info"><a href="urun.html?p=${base}" class="citem__name">${it.name}</a><p>${it.sub}</p>
            <div class="citem__row"><div class="qty"><button data-k="${k}" data-d="-1" aria-label="Azalt">−</button><span>${bag[k]}</span><button data-k="${k}" data-d="1" aria-label="Artır">+</button></div>
            <button class="citem__rm" data-rm="${k}">Kaldır</button></div></div>
          <p class="citem__p">${fmt(bag[k] * it.price)}</p>
        </article>`; }).join('');
      $('#sSub').textContent = fmt(sub);
      $('#sDiscRow').hidden = !disc; $('#sDisc').textContent = '−' + fmt(disc); $('#sCode').textContent = code ? `(${code})` : '';
      $('#sShip').textContent = ship ? fmt(ship) : 'Ücretsiz';
      $('#sTot').textContent = $('#sTot2').textContent = fmt(tot);
      // öneriler: sepette olmayan, farklı kategorilerden
      const inBag = new Set(keys.map(k => k.split('@')[0]));
      const rec = Object.keys(CATS).map(c => CATS[c].keys.find(k => !inBag.has(k))).filter(Boolean).slice(0, 4);
      $('#recGrid').innerHTML = rec.map(card).join('');
      $$('.pcard', $('#recGrid')).forEach(c => c.classList.add('is-in'));
    };
    $('#cartItems').addEventListener('click', e => {
      const bag = E.getBag();
      const d = e.target.closest('[data-d]'); if (d) { E.setQty(d.dataset.k, bag[d.dataset.k] + +d.dataset.d); return; }
      const r = e.target.closest('[data-rm]'); if (r) E.setQty(r.dataset.rm, 0);
    });
    $('#codeF').addEventListener('submit', e => {
      e.preventDefault(); const v = $('#codeIn').value.trim().toUpperCase();
      if (CODES[v]) { code = v; $('#codeMsg').textContent = `${v} uygulandı: %${CODES[v] * 100} indirim.`; $('#codeMsg').className = 'cart__msg is-ok'; try { sessionStorage.setItem('eda-code', v); } catch (er) {} }
      else { $('#codeMsg').textContent = 'Bu kod geçerli değil.'; $('#codeMsg').className = 'cart__msg is-err'; }
      render();
    });
    $('#goPay').addEventListener('click', () => alert('Ödeme adımı Shopify bağlantısıyla gelecek.'));
    document.addEventListener('eda:bag', render);
    wireCards($('#recGrid'));
    render();
  }
})();
