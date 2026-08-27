# Revisi Pengalaman Mobile, Scroll, Musik, dan CTA

## Perubahan Terbaru

## Perubahan Baru

- [x] Perbaiki posisi panel lokasi perayaan agar tidak menutupi konten cover pada mobile maupun desktop.
- [x] Hapus hamburger/menu button pada tampilan mobile dan rapikan navigasi mobile yang tersisa.
- [x] Jalankan musik setelah interaksi pembukaan undangan, dengan fallback graceful bila browser memblokir audio.
- [x] Tambahkan animasi reveal berbasis IntersectionObserver untuk gambar dan teks pada setiap section.
- [x] Pastikan animasi menghormati `prefers-reduced-motion` dan tidak menyebabkan horizontal overflow.
- [x] Jalankan TypeScript check, production build, dan verifikasi screenshot responsive.

- [x] Hapus panel lokasi perayaan dari cover pembukaan.
- [x] Ganti musik dengan sumber YouTube yang diberikan pengguna.
- [x] Aktifkan percobaan autoplay musik dengan fallback jika browser memblokir audio.
- [x] Jalankan ulang check, build, dan verifikasi visual.

- [x] Menerima dan menyimpan file MP3 langsung sebagai aset website.
- [x] Ganti player YouTube dengan elemen audio MP3 langsung.
- [x] Mempertahankan autoplay setelah interaksi pembukaan dengan fallback graceful.
- [x] Menambahkan efek partikel/glow pada tombol Buka Undangan.
- [x] Menghormati reduced-motion dan menguji visual serta production build.

## File MP3 Diterima

- [x] Salin file MP3 ke storage aset web dan gunakan URL aset permanen.
- [x] Ganti IFrame YouTube dengan elemen audio MP3 langsung.
- [x] Uji pemutaran autoplay setelah klik pembukaan undangan dan fallback kontrol musik.
- [x] Verifikasi efek glow/partikel CTA, TypeScript, build, dan screenshot final.
