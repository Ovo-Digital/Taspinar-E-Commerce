// Revize Modu — notları özel revize reposuna GitHub issue olarak yazar (Marmara B2C'deki akışın aynısı).
//
// Vercel ortam değişkenleri:
//   GITHUB_TOKEN  (zorunlu) — fine-grained, yalnızca revize reposu: Issues + Contents okuma/yazma
//   REVIZE_REPO   (ops.)    — "kullanici/repo"
//   REVIZE_KAPALI (ops.)    — "1" ise düğme hiç görünmez
//
// GET: sitedeki düğme "açık mıyım?" diye sorar; token yoksa düğme çizilmez,
// böylece "bastım bir şey olmadı" durumu oluşmaz. Token tarayıcıya hiç gitmez.

const REPO = process.env.REVIZE_REPO || "volkankockan-ovo/eda-taspinar-revizeler";

const EYLEM = {
  kalsin: { etiket: null, baslik: "Kalsın", metin: "Kalsın" },
  kaldir: { etiket: "kaldir", baslik: "Kaldır", metin: "Kaldırılsın" },
  degistir: { etiket: "degistir", baslik: "Değiştir", metin: "Değiştirilsin" },
  ekle: { etiket: "ekle", baslik: "Ekle", metin: "Buraya eklensin" },
};

// Serbest yazılan rolden bölüm etiketi
function bolum(rol = "") {
  const r = rol.toLocaleLowerCase("tr");
  if (/satış|satis|sales|e-ticaret|eticaret/.test(r)) return "satis";
  if (/pazarlama|marketing|reklam|sosyal|marka|brand/.test(r)) return "pazarlama";
  if (/tasarım|tasarim|design|grafik|art/.test(r)) return "tasarim";
  if (/yazılım|yazilim|developer|geliştirici|gelistirici/.test(r)) return "yazilim";
  if (/yönetim|yonetim|müdür|mudur|genel|ceo|kurucu|sahip|direkt/.test(r)) return "yonetim";
  return "diger";
}

// Kullanıcı metni issue gövdesine giriyor: @ ile kimse etiketlenmesin, markdown bozulmasın
const temiz = (s = "", max = 2000) => String(s).replace(/@/g, "@​").replace(/\r/g, "").slice(0, max).trim();
const alinti = (s) => temiz(s).split("\n").map((l) => "> " + l).join("\n");
// Yalnızca kendi yüklediğimiz GitHub adresleri gömülür
const gorselMd = (liste = []) => liste.filter((x) => x && /^https:\/\/github\.com\//.test(x.url || "")).map((x, i) => `![görsel ${i + 1}](${x.url})`).join("\n");

module.exports = async (req, res) => {
  const token = process.env.GITHUB_TOKEN;
  const kapali = process.env.REVIZE_KAPALI === "1";

  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ acik: Boolean(token) && !kapali });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST." });
  if (!token || kapali) return res.status(503).json({ error: "Revize modu kapalı: sunucuda GITHUB_TOKEN tanımlı değil." });

  let govde = req.body;
  if (typeof govde === "string") { try { govde = JSON.parse(govde); } catch { govde = null; } }
  if (!govde || JSON.stringify(govde).length > 300000) return res.status(400).json({ error: "Geçersiz veri." });

  const kim = temiz(govde.kisi && govde.kisi.ad, 80);
  const rol = temiz(govde.kisi && govde.kisi.rol, 60);
  const notlar = Array.isArray(govde.notlar) ? govde.notlar : [];
  if (!kim) return res.status(400).json({ error: "İsim zorunlu." });
  if (!notlar.length) return res.status(400).json({ error: "Gönderilecek not yok." });

  const bolumEtiketi = bolum(rol);
  const zaman = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });

  const gh = async (yol, veri) => {
    const r = await fetch(`https://api.github.com/repos/${REPO}${yol}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "eda-revize", "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    });
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return r.json();
  };

  // "Kalsın" dışındakiler ayrı issue olur; kalsın notları özet issue'da kalır
  const issuelar = notlar.filter((n) => EYLEM[n.eylem] && EYLEM[n.eylem].etiket).map((n) => {
    const e = EYLEM[n.eylem], h = n.hedef || {};
    return {
      title: `[${e.baslik}] ${temiz(n.sayfa, 60)} › ${temiz(h.tur, 50)}${h.metin ? ` — "${temiz(h.metin, 40)}"` : ""}`,
      labels: [e.etiket, bolumEtiketi, ...(n.oncelik === "yuksek" ? ["oncelik-yuksek"] : [])],
      body: [
        `**Sayfa:** ${temiz(n.sayfa, 100)} — \`${temiz(n.yol, 120)}\``,
        `**Öğe:** ${temiz(h.tur, 40)}${h.metin ? ` · metin: "${temiz(h.metin, 160)}"` : ""}`,
        `**İstek:** ${e.metin}`,
        `**Öncelik:** ${n.oncelik === "yuksek" ? "Olmazsa olmaz" : "Olsa iyi olur"}`,
        n.not ? `**Not:**\n${alinti(n.not)}` : "**Not:** —",
        n.gorseller && n.gorseller.length ? `**Görseller:**\n${gorselMd(n.gorseller)}` : "",
        `**Ekran:** ${temiz(n.ekran, 40) || "—"}`,
        `**Kimden:** ${kim} (${rol || "—"}) · ${zaman}`,
        `<sub>seçici: \`${temiz(h.secici, 200)}\`</sub>`,
      ].filter(Boolean).join("\n\n"),
    };
  });

  const kalsin = notlar.filter((n) => n.eylem === "kalsin");
  const ozet = [
    `**Kimden:** ${kim} (${rol || "—"}) · ${zaman}`,
    `**Toplam:** ${notlar.length} not · ${issuelar.length} aksiyon · ${kalsin.length} "kalsın"`,
    kalsin.length ? `### Kalsın dedikleri\n${kalsin.map((n) => `- ${temiz(n.sayfa, 60)} › ${temiz(n.hedef && n.hedef.tur, 60)}${n.hedef && n.hedef.metin ? ` — "${temiz(n.hedef.metin, 40)}"` : ""}${n.not ? ` — _${temiz(n.not, 200)}_` : ""}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");

  try {
    const o = await gh("/issues", { title: `Revize gönderimi — ${kim} (${rol || "—"}) — ${zaman}`, labels: ["ozet", bolumEtiketi], body: ozet });
    let acilan = 0;
    for (const i of issuelar) {
      await gh("/issues", { ...i, body: `${i.body}\n\n_Özet: #${o.number}_` });
      acilan++;
    }
    return res.status(200).json({ ok: true, ozet: o.number, acilan });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
