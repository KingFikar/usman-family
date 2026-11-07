# Usman Baco Family - Website Keluarga

Situs statis multi-halaman untuk Usman Baco Family. HTML, CSS, dan JavaScript
vanilla tanpa dependency, tanpa build step.

## Struktur

```
├── index.html          Beranda
├── keluarga.html       Pohon keluarga + anggota per generasi
├── cerita.html         Linimasa (timeline) + kutipan
├── galeri.html         Galeri foto + filter + lightbox
├── kontak.html         Info kontak + form
├── vercel.json         Konfigurasi deploy Vercel
├── robots.txt
└── assets/
    ├── css/style.css   Sistem design, layout responsif, dark mode
    ├── js/main.js      Theme, nav, reveal, counter, filter, lightbox, form
    └── img/*.svg       Ilustrasi lokal (tanpa request eksternal)
```

## Jalankan lokal

```bash
# Python
python -m http.server 4321

# atau Node
npx serve .
```

Buka `http://localhost:4321`.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel, pilih **Add New -> Project** lalu import repo tersebut.
3. Framework Preset: **Other**. Build Command kosongkan. Output Directory: `.`
4. Deploy.

`vercel.json` sudah menyertakan header cache untuk aset statis. Konfigurasi
domain dan environment variable atur sendiri di dashboard Vercel.

## Cara customize

| Yang diubah | Lokasi |
| --- | --- |
| Nama anggota keluarga | `keluarga.html`, kartu `.person` |
| Isi linimasa | `cerita.html`, kartu `.tl-card` |
| Foto galeri | `galeri.html`, `<figure class="shot">` + `assets/img/` |
| Warna tema | `assets/css/style.css`, blok `:root` |
| Kontak (email/telp) | `kontak.html` + footer tiap halaman |
| Link media sosial | blok `.socials` di footer tiap halaman |
| Alamat di footer | blok "Kontak" di footer tiap halaman |

Nama, foto, nomor HP, dan tautan sosial di bawah ini adalah data contoh.
Ganti dengan data asli keluarga sebelum dipublikasikan.

Ganti ilustrasi SVG di `assets/img/` dengan foto asli. Format yang disarankan:
WebP atau JPG, lebar maks 1600px, nama file deskriptif, dan perbarui atribut
`src`, `width`, `height`, serta `alt` di HTML.

## Fitur

- Layout responsif (320px sampai layar lebar), tanpa overflow horizontal.
- Dark mode dengan tombol toggle, mengikuti preferensi sistem, disimpan di `localStorage`.
- Navigasi mobile dengan panel slide dan tombol tutup.
- Animasi reveal saat scroll, angka statistik beranimasi.
- Galeri dengan filter kategori dan lightbox (keyboard: `Esc`, `←`, `→`).
- Form kontak dengan validasi sisi klien dan pesan status.
- Aksesibilitas: skip link, `aria-*`, fokus terlihat, dukungan `prefers-reduced-motion`.
- Tanpa request eksternal selain font Google Fonts.
