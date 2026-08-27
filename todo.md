# Revisi Pengalaman Mobile, Scroll, dan Musik

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
