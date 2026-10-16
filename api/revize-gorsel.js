// Revize görselini revize reposuna uploads/ altına yükler, issue'da gömülecek adresi döner.
// Token izni: Contents okuma/yazma (aynı repo).

const REPO = process.env.REVIZE_REPO || "volkankockan-ovo/eda-taspinar-revizeler";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST." });
  const token = process.env.GITHUB_TOKEN;
  if (!token || process.env.REVIZE_KAPALI === "1") return res.status(503).json({ error: "Revize modu kapalı: sunucuda GITHUB_TOKEN tanımlı değil." });

  let govde = req.body;
  if (typeof govde === "string") { try { govde = JSON.parse(govde); } catch { govde = null; } }
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec((govde && govde.data) || "");
  if (!m) return res.status(400).json({ error: "Geçersiz görsel." });
  if (m[2].length > 3000000) return res.status(413).json({ error: "Görsel çok büyük." });

  const uzanti = m[1] === "jpeg" ? "jpg" : m[1];
  const gun = new Date().toISOString().slice(0, 10);
  const yol = `uploads/${gun}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${uzanti}`;
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${yol}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "eda-revize", "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Revize görseli", content: m[2] }),
  });
  if (!r.ok) return res.status(502).json({ error: `GitHub ${r.status}` });
  return res.status(200).json({ ok: true, url: `https://github.com/${REPO}/raw/main/${yol}` });
};
