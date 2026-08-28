# Panduan Kustomisasi Website Undangan Digital

Dokumen ini menjelaskan cara menyesuaikan website undangan pernikahan **Raka & Anjani** untuk pasangan, acara, dan aset Anda sendiri. Website dibangun sebagai aplikasi React + TypeScript + Vite satu halaman dengan cover pembukaan, personalisasi nama tamu, countdown, galeri, RSVP, guestbook lokal, detail hadiah, musik, serta animasi berbasis scroll.

> **Prinsip utama:** ubah data dan aset dari sumber terpusat terlebih dahulu. Hindari mengganti teks yang sama di banyak tempat karena dapat membuat isi undangan tidak konsisten.

## 1. Persiapan Lokal

Pastikan Node.js dan pnpm tersedia, kemudian jalankan perintah berikut dari root repository:

```bash
pnpm install
pnpm dev
```

Buka URL lokal yang ditampilkan Vite. Untuk memeriksa hasil produksi, gunakan:

```bash
pnpm check
pnpm build
```

`pnpm check` memeriksa TypeScript, sedangkan `pnpm build` membuat build frontend dan memverifikasi bahwa project dapat dikompilasi untuk deployment.

## 2. Mengganti Data Utama Pasangan dan Acara

Semua data utama berada di objek `CONFIG` pada file berikut:

```text
client/src/pages/Home.tsx
```

Cari objek `CONFIG`, lalu ubah nilai-nilai berikut:

| Field | Fungsi | Contoh nilai |
| --- | --- | --- |
| `couple` | Nama pasangan untuk metadata atau copy | `Dimas & Laras` |
| `shortNames` | Nama singkat pada footer | `Dimas · Laras` |
| `dateLabel` | Tanggal yang ditampilkan kepada tamu | `Sabtu, 12 Juni 2027` |
| `eventDate` | Waktu countdown dalam format ISO dengan timezone | `2027-06-12T16:00:00+07:00` |
| `venue` | Nama gedung atau tempat acara | `Pendopo Ndalem` |
| `address` | Alamat lengkap venue | `Jl. ...` |
| `mapsUrl` | Tautan arah Google Maps | `https://maps.google.com/?q=...` |
| `walletProvider` | Nama e-wallet untuk tanda kasih | `GoPay` |
| `walletNumber` | Nomor e-wallet | `0812...` |
| `accountBank` | Nama bank | `Bank Mandiri` |
| `accountNumber` | Nomor rekening | `14000...` |
| `accountName` | Nama pemilik rekening | `Nama Pasangan` |
| `paymentLink` | Tautan pembayaran opsional | `https://...` |
| `ambientTrack` | URL aset MP3 langsung | `/manus-storage/audio-final.mp3` |

Gunakan format ISO lengkap pada `eventDate`, terutama ketika acara berlangsung di Indonesia. Contoh `+07:00` berarti waktu Indonesia Barat. Pastikan tanggal yang tampil pada `dateLabel` sesuai dengan nilai countdown.

## 3. Personalisasi Nama Tamu

Undangan membaca parameter query `to` dari URL. Contoh:

```text
https://domain-anda.manus.space/?to=Keluarga%20Besar%20Pratama
```

Nama tersebut akan muncul pada sapaan cover. Gunakan `encodeURIComponent` atau URL encoding ketika nama tamu memiliki spasi dan karakter khusus. Jika parameter `to` tidak diberikan, website menggunakan sapaan umum `Tamu undangan`.

## 4. Mengganti Foto dan Aset Visual

Foto galeri dan gambar utama didefinisikan di `client/src/pages/Home.tsx`. Ganti URL gambar satu per satu, dan jangan menggunakan gambar yang sama untuk semua section. Setiap gambar sebaiknya memiliki tujuan visual berbeda: cover, cerita pasangan, detail acara, dan galeri.

Untuk file lokal berukuran besar, simpan salinan sumber di luar directory project dan unggah melalui storage aset web. Gunakan URL storage permanen yang dikembalikan setelah upload. Jangan meletakkan foto, video, atau audio besar di `client/public/` atau `client/src/assets/` karena dapat memperlambat deployment.

Saat mengganti gambar, periksa tiga hal berikut:

1. Kontras teks terhadap latar aktual, terutama pada cover.
2. Rasio crop di mobile dan desktop.
3. Teks alternatif pada elemen gambar agar tetap informatif bagi pengguna pembaca layar.

## 5. Mengganti Musik MP3

Website menggunakan elemen audio native, bukan YouTube. Nilai `CONFIG.ambientTrack` harus menunjuk ke file MP3 yang dapat diakses publik, misalnya:

```ts
ambientTrack: "/manus-storage/nama-file-audio.mp3",
```

Player memiliki `autoPlay`, `loop`, dan `preload="auto"`. Website juga memanggil `audio.play()` ketika pengguna menekan tombol **Buka Undangan**. Autoplay bersuara tidak dapat dijamin karena browser dapat memblokir pemutaran audio sebelum interaksi pengguna; fallback tombol pembukaan dan kontrol Musik tetap diperlukan [1].

Jika musik tidak terdengar, periksa URL file, format MP3, volume perangkat, dan apakah browser menolak autoplay. Jangan menghapus kontrol Musik karena kontrol tersebut adalah jalur pemulihan ketika autoplay ditolak.

## 6. Mengubah Teks, Tipografi, dan Warna

Teks section berada di komponen-komponen dalam `client/src/pages/Home.tsx`. Sistem warna, font, layout, animasi, dan breakpoint berada di:

```text
client/src/index.css
```

Pertahankan pasangan font display dan body yang sudah dipilih apabila ingin menjaga identitas Modern Javanese. Jika ingin mengubah arah visual, ubah secara menyeluruh: warna signature, treatment gambar, emblem, panel, border, dan aturan motion harus tetap terasa sebagai satu sistem.

Tambahkan Google Fonts baru di `client/index.html`, lalu ubah variabel font di `client/src/index.css`. Hindari menggunakan satu font standar untuk seluruh halaman. Pastikan warna teks tetap memiliki kontras yang memadai di atas gambar dan panel.

### Efek tombol Buka Undangan

Efek glow, sweep highlight, dan partikel tombol diatur di bagian akhir `client/src/index.css`. Anda dapat menyesuaikan:

| Selector atau keyframe | Yang dapat diubah |
| --- | --- |
| `.open-button` | Intensitas glow dan durasi napas tombol |
| `.open-button::before` | Warna dan arah sweep highlight |
| `.open-button::after` | Jumlah, posisi, dan opasitas partikel |
| `@keyframes cta-breathe` | Irama glow luar |
| `@keyframes cta-glow-sweep` | Kecepatan cahaya melintas |
| `@keyframes cta-particles` | Gerak partikel |

Jangan menghilangkan `pointer-events: none` pada pseudo-element karena partikel dan glow tidak boleh menghalangi klik. Aturan `prefers-reduced-motion` juga harus dipertahankan agar dekorasi bergerak dapat dinonaktifkan [2].

## 7. Mengubah Detail Acara dan Tautan

Komponen acara menggunakan data dari `CONFIG`. Ubah nama acara, waktu, venue, alamat, dan tautan kalender atau Maps secara bersamaan. Untuk tautan eksternal, pertahankan atribut keamanan berikut:

```tsx
<a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
  Buka Google Maps
</a>
```

Pastikan tautan kalender menggunakan timezone dan rentang waktu yang benar. Jangan memakai tautan contoh pada undangan final.

## 8. RSVP dan Guestbook

RSVP memvalidasi nama, status kehadiran, dan pesan sebelum menampilkan state berhasil. Pada project frontend-only, guestbook disimpan melalui `localStorage`, sehingga data hanya tersedia pada browser/perangkat yang sama. Data tidak dikirim ke server.

Untuk penyimpanan lintas perangkat, upgrade project ke backend lalu ganti handler submit dengan endpoint atau database. Jangan menambahkan data testimonial, rating, ulasan, atau pesan tamu palsu. Semua isi guestbook harus berasal dari pengguna yang benar-benar mengirimkan formulir.

## 9. Mengganti Galeri dan Lightbox

Galeri mendukung pembukaan lightbox, tombol sebelumnya/berikutnya, tombol tutup, tombol Escape, serta tombol panah kiri/kanan. Setelah mengganti daftar foto, pastikan setiap item memiliki:

- URL gambar yang valid.
- Caption yang sesuai.
- `alt` text yang menjelaskan isi foto.
- Urutan yang masuk akal untuk narasi pasangan.

Jika menambah atau mengurangi foto, periksa logika index pada komponen galeri dan lightbox agar navigasi tidak melewati batas array.

## 10. Responsif dan Animasi Scroll

Website menggunakan `IntersectionObserver` untuk menambahkan class `is-visible` ketika teks, gambar, panel acara, dan tile galeri masuk viewport. Pendekatan ini menjaga animasi tetap ringan dan tidak mengubah layout secara tiba-tiba [2].

Uji setidaknya pada ukuran berikut:

| Ukuran | Fokus pengujian |
| --- | --- |
| 375×812 | Cover sempit, CTA, teks nama, dan tidak ada overflow horizontal |
| 430×932 | Spacing cover dan posisi elemen dekoratif |
| 768×1024 | Layout tablet dan transisi menuju desktop |
| 1280×720 | Komposisi hero, navigasi, dan keterbacaan teks |

Jika menambah animasi, prioritaskan `transform` dan `opacity`. Jangan menganimasikan `width`, `height`, `margin`, atau `top/left` kecuali benar-benar diperlukan. Pertahankan media query reduced-motion.

## 11. Checklist Sebelum Publikasi

Sebelum membuat checkpoint atau meminta review, lakukan pemeriksaan berikut:

| Pemeriksaan | Status yang diharapkan |
| --- | --- |
| `pnpm check` | Tidak ada error TypeScript |
| `pnpm build` | Build berhasil |
| Cover | Nama pasangan, tanggal, tamu, dan CTA benar |
| Musik | File MP3 dapat dimuat; fallback klik tersedia |
| RSVP | Validasi dan state berhasil bekerja |
| Guestbook | Empty state tersedia; tidak ada data palsu |
| Galeri | Semua URL, caption, alt text, dan lightbox valid |
| Tautan eksternal | Menggunakan target dan rel yang aman |
| Mobile | Tidak ada overflow; tombol mudah disentuh |
| Aksesibilitas | Focus ring, label form, Escape lightbox, reduced-motion |

## 12. File Penting

| File | Peran |
| --- | --- |
| `client/src/pages/Home.tsx` | Data CONFIG, komponen halaman, interaksi, galeri, audio, RSVP, guestbook |
| `client/src/index.css` | Design system, layout, breakpoint, motif, motion, CTA glow/partikel |
| `client/index.html` | Metadata halaman dan import font |
| `ideas.md` | Keputusan art direction dan prinsip desain |
| `CUSTOMIZATION.md` | Panduan ini |

## Referensi

[1]: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay "MDN: Autoplay guide for media and Web Audio APIs"

[2]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API "MDN: Intersection Observer API"
