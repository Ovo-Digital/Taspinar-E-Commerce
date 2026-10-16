/* Eda Taşpınar — ürün detay (Jolie ürün sayfası düzeni, sitenin renkleriyle) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { BOMBS, CATS, catOf, img, thumb, fmt } = window.EDA;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = new URLSearchParams(location.search);
  let k = BOMBS[q.get('p')] ? q.get('p') : 'gold', qty = 1;
  const root = $('#jp');

  // ---- yer tutucu içerik (markanın gerçek bilgileriyle değişecek) ----
  const NOTES = {
    gold: 'Hindistan cevizi, vanilya, amber', miami: 'Ananas, hindistan cevizi, deniz tuzu', mykonos: 'Bergamot, incir, beyaz misk', copacabana: 'Mango, çarkıfelek, vanilya',
    ibiza: 'Tropik meyve, neroli, amber', tulum: 'Hindistan cevizi sütü, tonka, sandal ağacı', sttropez: 'Pembe biber, gül, amber', chaos: 'Bergamot, deri, oud',
    maximizer: 'Narenciye, neroli, misk', cooling: 'Nane, salatalık, aloe', caprice: 'Frambuaz, gül, vanilya', chaoselixir: 'Kakule, lavanta, tonka',
    mondieu: 'Safran, yasemin, amber', regina: 'Mandalina, portakal çiçeği, bal', illusion: 'Hindistan cevizi, tiare, vanilya', intenseoil: 'Hindistan cevizi, karamel, amber',
    dryspray: 'Narenciye, monoi, misk', asha: 'Armut, şakayık, misk', myra: 'Böğürtlen, menekşe, paçuli', groove: 'Greyfurt, zencefil, vetiver', root: 'Yeşil yapraklar, iris, sedir',
    enigma: 'Siyah frenk üzümü, gül, paçuli', noble: 'Biber, sedir, vetiver', honour: 'Limon, lavanta, misk', nova: 'Elma, frezya, misk',
  };
  const T = {
    bronzing: {
      desc: 'Bronzing Bomb, kuru dokunuşlu formülüyle cilde hızla emilir; ilk uygulamada derin ve eşit bir bronz verir. Roucou ve havuç yağı bronzlaşmayı hızlandırırken hindistan cevizi yağı cildi besler. Her Bomb, ilham aldığı destinasyonun kokusunu taşır.',
      badges: [['sun', 'Hızlı bronz'], ['drop', 'Kuru dokunuş'], ['leaf', 'Doğal yağlar']],
      kinetic: ['Bronzlaştırır', 'Besler', 'Işıltı verir'],
      ben: [['Anında bronz', 'İlk uygulamada görünen, gün geçtikçe derinleşen eşit bir renk.'], ['Kuru dokunuş', 'Saniyeler içinde emilir; yapışmaz, havluya ve kıyafete bulaşmaz.'], ['İmza koku', 'Her destinasyonun kendine özgü, gün boyu süren kokusu.']],
      tex: ['Doku', 'İpeksi kuru yağ', 'BRONZE'],
      ing: [['Roucou yağı', 'Doğal pigment kaynağı; bronzlaşmayı destekler ve hızlandırır.'], ['Havuç yağı', 'Beta karoten ile tene sıcak, altın bir ton verir.'], ['Hindistan cevizi yağı', 'Cildi besler, yumuşatır ve ipeksi bir bitiş bırakır.']],
      how: 'İyice çalkala. Cilde 20 cm uzaktan uzun, eşit hareketlerle sık, avuçlarınla yay. Denize girdikten sonra yenile. SPF içermez.',
    },
    parfum: {
      desc: 'El bombası formundaki imza şişede konsantre eau de parfum. İlk sıkıştan iz bırakır, akşama kadar seninle kalır. Odaya girdiğin an fark edilmek için.',
      badges: [['drop', 'Eau de Parfum'], ['clock', '8+ saat kalıcı'], ['gift', 'Hediye kutulu']],
      kinetic: ['İz bırakır', 'Kalıcıdır', 'Fark edilir'],
      ben: [['Konsantre esans', 'Eau de parfum yoğunluğunda; ilk sıkıştan güçlü bir açılış.'], ['Akşama kadar', 'Tende saatlerce kalan, yumuşayarak derinleşen bir iz.'], ['Koleksiyonluk şişe', 'El bombası formundaki imza şişe.']],
      tex: ['Koku', 'Odaya girişin', 'PARFUM'],
      ing: [['Üst notalar', 'Parlak ve taze bir açılış.'], ['Kalp notalar', 'Kokunun karakteri, saatlerce süren orta katman.'], ['Dip notalar', 'Tende kalan sıcak ve kalıcı iz.']],
      how: 'Nabız noktalarına sık: bilekler, boyun ve kulak arkası. Ovma. Daha kalıcı iz için Illusion vücut yağının üzerine uygula.',
    },
    illusion: {
      desc: 'Illusion, ince mineral simleriyle bronz tenin üzerinde ışığı yakalar. Hafif yağ formu yapışmadan emilir, ten ipeksi ve ışıltılı kalır.',
      badges: [['spark', 'Işıltılı bitiş'], ['drop', 'Hafif yağ'], ['leaf', 'Besleyici']],
      kinetic: ['Işıldar', 'Besler', 'Yumuşatır'],
      ben: [['Sıvı ışık', 'İnce simler ışığı yakalar, ten parlak görünür.'], ['Hafif yağ', 'Yağlı his bırakmadan emilir.'], ['Katman katman', 'İstediğin kadar ışıltı için katman ekle.']],
      tex: ['Doku', 'Işıltılı vücut yağı', 'GLOW'],
      ing: [['Mineral simler', 'Işığı yansıtan ince parçacıklar.'], ['Jojoba yağı', 'Cildi yumuşatır ve nemlendirir.'], ['Tatlı badem yağı', 'Besleyici, ipeksi bakım.']],
      how: 'Temiz ve kuru cilde uygula, masaj yaparak yedir. Daha fazla ışıltı için katman ekle.',
    },
    fragrance: {
      desc: 'Gün içinde tazelemek için hafif mist, akşam için daha yoğun intense. Vücuda ve saça uygulanabilir; sen gittikten sonra bile kalan bir koku.',
      badges: [['drop', 'Vücut & saç'], ['clock', 'Gün boyu'], ['leaf', 'Ferah formül']],
      kinetic: ['Tazeler', 'Sarar', 'İz bırakır'],
      ben: [['Gündüz mist', 'Hafif ve tazeleyici; çantada taşı, gün içinde yenile.'], ['Gece intense', 'Daha derin, daha kalıcı bir iz.'], ['Vücut ve saç', 'Saçta kokusu daha uzun kalır.']],
      tex: ['Koku', 'Gündüzden geceye', 'MIST'],
      ing: [['Çiçek akorları', 'Yumuşak ve feminen bir kalp.'], ['Odunsu notalar', 'Kalıcı ve sıcak bir dip.'], ['Nemlendirici baz', 'Cildi kurutmaz.']],
      how: 'Tüm vücuda ve saçlara sık. Gün içinde tazele.',
    },
  };
  const ICON = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-3-5-1s5 1 5 1 4 1 5-1-3-3-5 1"/>',
    spark: '<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
    check: '<circle cx="12" cy="12" r="8"/><path d="M8.5 12.5l2.3 2.3 4.7-5"/>',
  };
  const ic = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
  const SHOTS = ['after/a3.jpg', 'after/a1.jpg', 'after/a7.jpg', 'after/a2.jpg', 'after/a8.jpg'];

  const render = () => {
    const b = BOMBS[k], c = catOf(k) || 'bronzing', C = CATS[c], t = T[c];
    const off = b.old ? Math.round((1 - b.price / b.old) * 100) : 0;
    document.title = `${b.name} — Eda Taşpınar`;
    const related = Object.keys(CATS).map(x => CATS[x].keys.find(y => y !== k)).concat(C.keys.filter(y => y !== k)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
    root.innerHTML = `
    <!-- 1 · ÜRÜN -->
    <section class="jp-top">
      <div class="jp-media"><figure class="jp-img"><img src="${img(k)}" alt="${b.name}"></figure></div>
      <div class="jp-sum">
        <nav class="jp-crumb"><a href="index.html">Anasayfa</a> / <a href="koleksiyon.html?c=${c}">${C.name}</a> / <span lang="en">${b.name}</span></nav>
        <h1 class="jp-title" lang="en">${b.name}</h1>
        <div class="jp-attr">
          <label>${c === 'bronzing' ? 'Destinasyon' : 'Koku'}</label>
          <select id="jpVar" lang="en">${C.keys.map(x => `<option value="${x}" ${x === k ? 'selected' : ''}>${BOMBS[x].name}</option>`).join('')}</select>
        </div>
        <div class="jp-attr jp-attr--static"><label>Boyut</label><span>${(b.sub || b.dest).match(/\d+ ml/)?.[0] || '200 ml'}</span></div>
        <p class="jp-price">${b.old ? `<del>${fmt(b.old)}</del>` : ''}<ins>${fmt(b.price)}</ins></p>
        <p class="jp-desc">${t.desc}</p>
        <ul class="jp-badges">${t.badges.map(x => `<li>${ic(x[0])}${x[1]}</li>`).join('')}</ul>
        <div class="jp-cart" id="jpCart">
          <div class="jp-qty"><input id="jpQty" type="number" min="1" max="9" value="1" aria-label="Adet"></div>
          <button class="jp-add" id="jpAdd">Sepete ekle</button>
        </div>
        <p class="jp-pay">Peşin fiyatına <b>3 taksit</b> imkânı <a href="#">Detay</a></p>
        <p class="jp-ship">₺1.500 üzeri siparişlerde <b>ücretsiz kargo</b></p>
        <div class="jp-share">
          <a href="#" aria-label="Facebook'ta paylaş"><svg viewBox="0 0 24 24"><path d="M14 8h2V5h-2.5C11 5 10 6.6 10 8.7V10H8v3h2v6h3v-6h2.3l.5-3H13V9c0-.6.4-1 1-1z"/></svg></a>
          <a href="#" aria-label="X'te paylaş"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke-width="1.8"/></svg></a>
          <a href="#" aria-label="Pinterest'te paylaş"><svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 00-2.9 15.5c-.1-.7-.1-1.7 0-2.4l1-4.1s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.7 0 1.1.6 1.1 1.2 0 .8-.5 1.9-.7 2.9-.2.9.4 1.6 1.3 1.6 1.6 0 2.8-1.7 2.8-4.1 0-2.1-1.5-3.6-3.7-3.6-2.5 0-4 1.9-4 3.8 0 .8.3 1.6.7 2l.1.3-.3 1c0 .2-.1.2-.3.1-1.1-.5-1.8-2.1-1.8-3.4 0-2.8 2-5.3 5.8-5.3 3 0 5.4 2.2 5.4 5.1 0 3.1-1.9 5.5-4.6 5.5-.9 0-1.7-.5-2-1l-.6 2.1c-.2.8-.7 1.7-1 2.3A8 8 0 1012 4z"/></svg></a>
          <a href="#" aria-label="E-posta ile paylaş"><svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 7l8 6 8-6"/></svg></a>
        </div>
        <div class="jp-acc">
          <details><summary>Detaylar</summary><p>${b.note || ''} ${NOTES[k] ? 'Koku notaları: ' + NOTES[k] + '.' : ''}</p></details>
          <details><summary>İçerikler</summary><p>${t.ing.map(x => x[0]).join(', ')}. Tam içerik listesi ambalajda yer alır.</p></details>
          <details><summary>Kullanım</summary><p>${t.how}</p></details>
          <details><summary>Kargo</summary><p>1–2 iş günü içinde kargoya verilir. ₺1.500 üzeri siparişlerde kargo ücretsiz. Açılmamış ürünler 30 gün içinde iade edilebilir.</p></details>
        </div>
      </div>
    </section>

    <!-- 2 · FAYDALAR (kayan başlık + elips) -->
    <section class="jp-kin">
      <svg class="jp-oval" viewBox="0 0 400 600" aria-hidden="true"><ellipse cx="200" cy="300" rx="120" ry="290" transform="rotate(35 200 300)"/></svg>
      <h2 class="jp-kin__t jr">${t.kinetic.map((x, i) => `<span style="--i:${i}">${x}</span>`).join('')}</h2>
      <div class="jp-kin__row">
        <div class="jp-kin__ben jr">
          <i class="jp-star">✱</i><h3>Faydaları</h3>
          ${t.ben.map(x => `<h6>${x[0]}</h6><p>${x[1]}</p>`).join('')}
        </div>
        <figure class="jp-kin__img jr"><img src="assets/pop/beach.jpg" alt="" loading="lazy"></figure>
      </div>
    </section>

    <!-- 3 · DOKU (kayan yazı + parallax) -->
    <section class="jp-tex" id="jpTex">
      <div class="jp-tex__marq" aria-hidden="true"><span>${Array(8).fill(` ~ ${t.tex[2]}`).join('')}</span></div>
      <div class="jp-tex__blob" aria-hidden="true"><img src="assets/img/sg-gold.jpg" alt=""></div>
      <div class="jp-tex__c jr"><h2>${t.tex[0]}</h2><p>${t.tex[1]}</p></div>
    </section>

    <!-- 4 · İÇERİKLER -->
    <section class="jp-ing">
      <h2 class="jp-ing__t jr"><span>Etkin</span><span>İçerikler</span></h2>
      <div class="jp-ing__row">
        <figure class="jp-ing__img jr"><img src="assets/img/story-eda.jpg" alt="" loading="lazy"></figure>
        <div class="jp-ing__list jr">
          <i class="jp-star">✱</i><h3>Daha iyi sonuç için seçilmiş içerikler</h3>
          ${t.ing.map(x => `<h6>${x[0]}</h6><p>${x[1]}</p>`).join('')}
        </div>
      </div>
    </section>

    <!-- 5 · YORUMLAR -->
    <section class="jp-rev">
      <h2 class="jp-h jr">Yorumlar <em>~</em></h2>
      <p class="jp-rev__none">Henüz yorum yok.</p>
      <h3 class="jp-rev__t"><span lang="en">“${b.name}”</span> için ilk yorumu sen yaz</h3>
      <p class="jp-rev__n">E-posta adresin yayınlanmayacak. Zorunlu alanlar * ile işaretlidir.</p>
      <form class="jp-form" id="jpForm">
        <div class="jp-rate">Puanın <span id="jpStars">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-s="${i}" aria-label="${i} yıldız">☆</button>`).join('')}</span></div>
        <label>Yorumun *<textarea required rows="2"></textarea></label>
        <label class="jp-half">Ad *<input required></label>
        <label class="jp-half">E-posta *<input type="email" required></label>
        <label class="jp-check"><input type="checkbox"> Bir dahaki yorumum için adımı ve e-postamı bu tarayıcıda kaydet.</label>
        <button class="jp-add jp-submit">Gönder</button>
        <p class="jp-thanks" hidden>Teşekkürler! Yorumun onaylandıktan sonra yayınlanacak.</p>
      </form>
    </section>

    <!-- 6 · İLGİLİ ÜRÜNLER -->
    <section class="jp-rel">
      <h2 class="jp-h jp-h--stag jr"><span>İlgili <em>~</em></span><span>Ürünler</span></h2>
      <div class="jp-rel__grid">${related.map((x, i) => `
        <a class="jp-card jr" style="--i:${i}" href="pdp-jolie.html?p=${x}">
          ${BOMBS[x].old ? '<span class="jp-sale">İndirim!</span>' : ''}
          <span class="jp-card__img"><img src="${thumb(x)}" alt="" loading="lazy"><button class="jp-card__add" data-add="${x}">Sepete ekle</button></span>
          <b lang="en">${BOMBS[x].name}</b>
          <span class="jp-card__p">${BOMBS[x].old ? `<del>${fmt(BOMBS[x].old)}</del> ` : ''}<ins>${fmt(BOMBS[x].price)}</ins></span>
        </a>`).join('')}</div>
    </section>

    <!-- 7 · #BRONZESQUAD + GÜVEN -->
    <section class="jp-ig">
      <h5>#BronzeSquad</h5>
      <div class="jp-ig__row">${SHOTS.map(x => `<a href="#"><img src="assets/${x}" alt="" loading="lazy"></a>`).join('')}</div>
      <div class="jp-trust">
        <div>${ic('card')}<div><b>Taksit imkânı</b><span>Peşin fiyatına 3 taksit, tüm kartlara 12 taksit.</span></div></div>
        <div>${ic('heart')}<div><b>Uzman müşteri hizmeti</b><span>Bronzluk ve koku seçiminde sana yardımcı oluyoruz.</span></div></div>
        <div>${ic('check')}<div><b>%100 orijinal ürün</b><span>Tüm ürünler doğrudan Eda Taşpınar’dan gönderilir.</span></div></div>
      </div>
    </section>

    <!-- yapışkan sepet çubuğu (aşağı kayınca) -->
    <div class="jp-bar" id="jpBar" aria-hidden="true">
      <img src="${thumb(k)}" alt="">
      <b lang="en">${b.name}</b>
      <span class="jp-bar__p">${off ? `<em>%${off} indirim</em>` : ''}${b.old ? `<del>${fmt(b.old)}</del>` : ''}<ins>${fmt(b.price)}</ins></span>
      <div class="jp-bar__q"><button data-d="-1" aria-label="Azalt">−</button><span id="jpBarQ">${qty}</span><button data-d="1" aria-label="Artır">+</button></div>
      <button class="jp-bar__add" id="jpBarAdd">Sepete ekle</button>
    </div>
    <a class="jp-top-btn" href="#" aria-label="Yukarı çık"><svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg></a>`;
    wire();
  };

  const setQty = v => { qty = Math.max(1, Math.min(9, v)); $('#jpQty').value = qty; $('#jpBarQ').textContent = qty; };
  const addNow = () => { for (let i = 0; i < qty; i++) window.EDA.add(k); };
  let io, rvObs;
  const wire = () => {
    $('#jpVar').addEventListener('change', e => { k = e.target.value; qty = 1; history.replaceState(null, '', '?p=' + k); render(); scrollTo(0, 0); });
    $('#jpQty').addEventListener('input', e => setQty(+e.target.value || 1));
    $('#jpAdd').addEventListener('click', addNow);
    $('#jpBarAdd').addEventListener('click', addNow);
    $('.jp-bar__q').addEventListener('click', e => { const d = e.target.closest('[data-d]'); if (d) setQty(qty + +d.dataset.d); });
    $('.jp-top-btn').addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });
    $('#jpStars').addEventListener('click', e => { const s = e.target.closest('[data-s]'); if (!s) return; $$('#jpStars button').forEach(x => { const on = +x.dataset.s <= +s.dataset.s; x.textContent = on ? '★' : '☆'; x.classList.toggle('on', on); }); });
    $('#jpForm').addEventListener('submit', e => { e.preventDefault(); $('.jp-thanks').hidden = false; e.target.reset(); });
    $$('.jp-card__add').forEach(x => x.addEventListener('click', e => { e.preventDefault(); window.EDA.add(x.dataset.add); }));
    // yapışkan çubuk: sepete ekle butonu ekrandan çıkınca alttan gelir
    io && io.disconnect();
    io = new IntersectionObserver(([en]) => $('#jpBar').classList.toggle('on', !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 });
    io.observe($('#jpCart'));
    // ekrana girince yukarı kayarak belirme
    rvObs && rvObs.disconnect();
    rvObs = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rvObs.unobserve(en.target); } }), { threshold: .15 });
    $$('.jr', root).forEach(el => reduced ? el.classList.add('in') : rvObs.observe(el));
    onScroll();
  };

  // kaydırmaya bağlı: elips çizilir, kayan yazı akar, doku lekesi yavaş kayar
  const onScroll = () => {
    const kin = $('.jp-kin'), tex = $('#jpTex'); if (!kin) return;
    const r = kin.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height * .6)));
    $('.jp-oval').style.setProperty('--d', (1 - p) * 1400);
    const t = tex.getBoundingClientRect(), tp = (innerHeight - t.top) / (innerHeight + t.height);
    tex.style.setProperty('--mx', (-tp * 40) + '%');
    tex.style.setProperty('--by', ((tp - .5) * -160) + 'px');
    $('.jp-top-btn').classList.toggle('on', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });

  // imleci takip eden küçük bronz nokta (Jolie'deki gibi)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
    const dot = document.createElement('i'); dot.className = 'jp-cursor'; document.body.appendChild(dot);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.classList.toggle('big', !!e.target.closest('a,button,select,input,textarea,summary,label')); });
    const loop = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; dot.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
  }
  render();
})();
