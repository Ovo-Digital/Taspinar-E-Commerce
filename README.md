# Eda Taşpınar — E-ticaret prototipi

Eda Taşpınar (Bronzing Bomb, Bomb Parfum, Illusion, Parfüm Mist, Fragrance Intense) için özel tasarım e-ticaret sitesinin statik prototipi. Daha sonra Shopify'a taşınacak.

## Yerelde açmak

```
python3 serve.py
```

Sonra tarayıcıda: http://127.0.0.1:5173

## Sayfalar

| Sayfa | Dosya |
|---|---|
| Ana sayfa | `site/index.html` |
| Koleksiyon | `site/koleksiyon.html?c=bronzing` (`parfum`, `illusion`, `fragrance`) |
| Ürün detay (Byredo düzeni) | `site/urun.html?p=miami` |
| Sepet | `site/sepet.html` |
| Eski ürün detay | `site/urun-eski.html?p=miami` |

## Dosyalar

- `site/data.js` — ürün verisi (isim, fiyat, renk); tüm sayfalar buradan beslenir
- `site/main.js`, `site/styles.css` — ortak parçalar: üst menü, hamburger menü, sepet çekmecesi, arama, açılış popup'ı
- `site/pdp.js`, `site/pdp.css` — ürün detay sayfası
- `site/shop.js` — koleksiyon ve sepet sayfaları
- `site/secenek.js`, `site/secenek.css` — ürün detay seçenekleri (`pdp-secenek.html`) ve eski ürün detay

## Notlar

- Fiyatlar, yorumlar, etiketler, abonelik ve kargo metinleri yer tutucudur.
- Marka brief'i gizli olduğu için repoda yoktur.
