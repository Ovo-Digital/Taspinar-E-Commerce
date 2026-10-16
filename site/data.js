/* Eda Taşpınar — ortak ürün verisi (ana sayfa, liste, ürün sayfası) */
(() => {
  /* ---------- Ürün verisi: tüm bölümler buradan beslenir ----------
   c  = şişe rengi, bg = Bomb Gang şeridinde arka plan (şişenin koyu tonu) */
const BOMBS = {
  gold:       { name: 'Bronzing Bomb',    dest: 'Orijinal · İstanbul', note: 'Her şey burada başladı. Diğer bütün bronzların ölçüldüğü bronz.', price: 1135, old: 1250, c: '#d6a32c', bg: '#8a5d14' },
  miami:      { name: 'Miami Extreme',    dest: 'Miami',      note: 'Kavurucu sıcak. Neon geceler. Hiç mesaiye çıkmayan bir ışıltı.',            price: 1350, old: 1550, c: '#ff3fa4', bg: '#a3215f' },
  mykonos:    { name: 'Mykonos Supreme',  dest: 'Mykonos',    note: 'Bronzlaşmayı hızlandırmasıyla bilinen roucou yağıyla zenginleştirildi.',          price: 1350, old: 1550, c: '#c9ccd1', bg: '#5f666e' },
  copacabana: { name: 'Copacabana',       dest: 'Rio de Janeiro', note: 'Bronzunu derinleştir, ışıltını içten yak.',              price: 1350, old: 1550, c: '#3be04f', bg: '#1d7334' },
  ibiza:      { name: 'Ibiza',            dest: 'Ibiza',      note: 'Güneş öpücüğü DNA’mızda. Gün doğumu setleri, gün batımı yüzüşleri.',                 price: 1350, old: 1550, c: '#f6c81e', bg: '#a47a0c' },
  tulum:      { name: 'Tulum',            dest: 'Tulum',      note: 'Hızlı ve doğal bronzlaşma için özel olarak formüle edildi.',                   price: 1350, old: 1550, c: '#e6dcc6', bg: '#8c7a5c' },
  sttropez:   { name: 'St. Tropez Glow',  dest: 'St. Tropez', note: 'Altın saatte bir çatı partisinden daha fazla ışıltı.',                    price: 1400, old: 1600, c: '#7b2a33', bg: '#4d1820' },
  chaos:      { name: 'Chaos Pour Homme', dest: 'Koordinat bilinmiyor', note: 'Işıltı damarlarımızda akıyor.',                                  price: 1350, old: 1550, c: '#1c1c1c', bg: '#262321' },
  maximizer:  { name: 'Tan Maximizer',    dest: 'Bronzlaşma öncesi ritüel', note: 'Bronzunu bir adım öteye taşımak için ışıltıyı hızlandıran bakım.',      price: 1100, old: 1300, c: '#ff4630', bg: '#a8261a' },
  cooling:    { name: 'Cooling Bomb',     dest: 'Güneş sonrası ritüel', note: 'Güneş battığı an için serinleten jel.',               price: 1100, old: 1300, c: '#dfe8ec', bg: '#5d7682' },
};
// Bomb dışındaki öncelikli seriler (e-ticaret ekibinin listesi) — fiyatlar yer tutucu
Object.assign(BOMBS, {
  illusion:    { name: 'Illusion Glitter Oil', dest: 'Illusion', sub: 'Işıltılı bronzlaştırıcı yağ · 200 ml', note: 'Bronz ten için sıvı ışık.', price: 745, old: 820, c: '#e8c34a', bg: '#8a6a16' },
  intenseoil:  { name: 'Intense Bronzing Oil', dest: 'Illusion', sub: 'Yoğun bronz yağ · 200 ml',      note: 'En yoğun bronzumuz, ışıltısız.', price: 565, old: 620, c: '#3a1d0e', bg: '#3a1d0e' },
  dryspray:    { name: 'Intense Dry Spray',    dest: 'Illusion', sub: 'Kuru dokunuşlu sprey · 200 ml',      note: 'Tek sıkışta hafif bir bronz.', price: 655, old: 720, c: '#f07a2a', bg: '#9c3f0e' },
  caprice:     { name: 'Caprice',     dest: 'Bomb Parfum · EDP 100 ml', note: 'Oyunbaz, tatlı ve görmezden gelinemez.', price: 1715, old: 2400, c: '#ff2f9a', bg: '#9c1760' },
  chaoselixir: { name: 'Chaos Elixir',dest: 'Bomb Parfum · EDP 100 ml', note: 'Derin, çekici, gece için yaratıldı.', price: 1715, old: 2400, c: '#2233d6', bg: '#1a2380' },
  mondieu:     { name: 'Mon Dieu',    dest: 'Bomb Parfum · EDP 100 ml', note: 'Dramatik bitişli sıcak oryantal.', price: 1715, old: 2400, c: '#c41a24', bg: '#7a1016' },
  regina:      { name: 'Regina',      dest: 'Bomb Parfum · EDP 100 ml', note: 'Kraliçe girişi için altın amber.', price: 1715, old: 2400, c: '#e8a23a', bg: '#8a5a12' },
  asha:        { name: 'Asha',   dest: 'Fragrance Intense · 150 ml', note: 'Yumuşak ve sıcak, tene yakın.', price: 1000, old: 1400, c: '#8a3a5a', bg: '#5a2038' },
  myra:        { name: 'Myra',   dest: 'Fragrance Intense · 150 ml', note: 'Yoğun izli kadifemsi çiçekler.', price: 1000, old: 1400, c: '#6a4ab0', bg: '#3e2a70' },
  groove:      { name: 'Groove', dest: 'Fragrance Intense · 150 ml', note: 'Parlak, cesur ve enerji dolu.', price: 1000, old: 1400, c: '#ff6a1a', bg: '#a8400e' },
  root:        { name: 'Root',   dest: 'Fragrance Intense · 150 ml', note: 'Yeşil ve dengeli, kalıcı.', price: 1000, old: 1400, c: '#2f8a4a', bg: '#1c5a30' },
  enigma:      { name: 'Enigma', dest: 'Parfum Mist · 100 ml', note: 'Ardında bir soru bırakan mist.', price: 860, old: 1200, c: '#c41a24', bg: '#7a1016' },
  noble:       { name: 'Noble',  dest: 'Parfum Mist · 100 ml', note: 'Yumuşak, odunsu ve sessizce özgüvenli.', price: 860, old: 1200, c: '#2a2a2a', bg: '#1c1c1c' },
  honour:      { name: 'Honour', dest: 'Parfum Mist · 100 ml', note: 'Klasik dokunuşlu taze ve temiz.', price: 860, old: 1200, c: '#2a3a6a', bg: '#1c2848' },
  nova:        { name: 'Nova',   dest: 'Parfum Mist · 100 ml', note: 'Gün boyu parlak ve ışıl ışıl.', price: 860, old: 1200, c: '#c41a24', bg: '#5a0e12' },
});
const ORDER = ['gold','miami','mykonos','copacabana','ibiza','tulum','sttropez','chaos','maximizer','cooling'];
// key visual renkleri: [ışın 1, ışın 2, arkadaki dev kelime]
const RAYS = {
  gold: ['#ff3a12', '#d9a35a', 'OG'],          miami: ['#ee4fa8', '#7a2266', 'MIAMI'],
  mykonos: ['#e3e3e3', '#a9a9a9', 'MYKONOS'],  copacabana: ['#3fd463', '#1c7a36', 'RIO'],
  ibiza: ['#f6d31d', '#cfa20c', 'IBIZA'],      tulum: ['#ecdcb8', '#c6a978', 'TULUM'],
  sttropez: ['#c98aa0', '#5e2630', 'GLITTER'], chaos: ['#3a3a3a', '#141414', 'CHAOS'],
  maximizer: ['#ff6a4a', '#c11f12', 'MAX'],    cooling: ['#d6e8ee', '#93b6c4', 'COOL'],
};
const lum = h => { const n = parseInt(h.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const shade = (h, f) => '#' + [0, 2, 4].map(i => Math.round(parseInt(h.slice(1 + i, 3 + i), 16) * f).toString(16).padStart(2, '0')).join('');
const raysFor = k => RAYS[k] || [BOMBS[k].c, shade(BOMBS[k].c, .55), BOMBS[k].name.split(' ')[0].toUpperCase()];

const CATS = {
  bronzing:  { name: 'Bronzing Bomb', eyebrow: 'Bronzlaştırıcı', motto: ['You are', 'the golden hour'], lede: 'On destinasyon, tek tutku. Görülmek için tasarlanmış şişede anında bronz.', keys: ORDER, ray: 'gold' },
  parfum:    { name: 'Bomb Parfum', eyebrow: 'Eau de parfum', motto: ['Command', 'the spotlight'], lede: 'Bomba, bu kez eau de parfum olarak. Girişin için yaratılmış dört imza.', keys: ['caprice','chaoselixir','mondieu','regina'], ray: 'caprice' },
  illusion:  { name: 'Illusion Vücut Yağı', eyebrow: 'Vücut ışıltısı', motto: ['Glow louder', 'than the rest'], lede: 'Bronz ten için sıvı ışık. Gündüz ışıltı, gece parıltı.', keys: ['illusion','intenseoil','dryspray'], ray: 'illusion' },
  fragrance: { name: 'Parfüm & Mist', eyebrow: 'Parfüm mist & intense', motto: ['Soak up', 'the stares'], lede: 'Gündüz için mist, gece için intense. Sen gittikten sonra bile kalan bir koku.', keys: ['asha','myra','groove','root','enigma','noble','honour','nova'], ray: 'asha' },
};
const catOf = k => Object.keys(CATS).find(c => CATS[c].keys.includes(k));
const fmt = n => '₺' + Math.round(n).toLocaleString('tr-TR');
window.EDA = { fmt, BOMBS, ORDER, RAYS, CATS, catOf, lum, shade, raysFor, img: k => `assets/bomb/${k}.webp`, thumb: k => `assets/thumb/${k}.webp` };
})();
