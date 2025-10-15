# Notes-App: Aplikasi Berbagi Cerita

Notes-App adalah sebuah Single-Page Application (SPA) yang memungkinkan pengguna untuk berbagi cerita atau momen menarik mereka, lengkap dengan gambar dan lokasi geografis. Proyek ini dibangun sebagai submission untuk kelas "Belajar Pengembangan Web Intermediate" dari Dicoding.

Aplikasi ini di-deploy menggunakan GitHub Pages dan dapat diakses melalui link berikut:
**[Kunjungi Notes-App](https://kalvinangelitoang.github.io/Notes-App/)**

---
## Fitur Unggulan

Aplikasi ini dilengkapi dengan berbagai fitur:

* **Arsitektur SPA & MVP**: Navigasi antar halaman terasa instan tanpa *reload*, dengan kode yang terstruktur rapi menggunakan pola *Model-View-Presenter* (MVP).
* **Transisi Halaman Kustom**: Setiap perpindahan halaman diiringi dengan animasi *slide-in* yang halus untuk pengalaman visual yang lebih baik.
* **Peta Interaktif**:
    * **Multiple Tile Layers**: Pengguna dapat memilih tiga jenis tampilan peta (Street, Satellite, dan Topographic).
    * **Sinkronisasi Peta & Daftar**: Arahkan kursor ke sebuah cerita, dan *marker* di peta akan aktif. Klik *marker* di peta, dan halaman akan otomatis menggulir ke cerita yang sesuai.
    * **Filter Cerita**: Cari cerita berdasarkan nama atau deskripsi secara *real-time*.
* **Tambah Cerita Fleksibel**:
    * **Akses Kamera Langsung**: Ambil foto langsung dari kamera perangkat Anda untuk diunggah.
    * **Mode Tamu**: Pengguna dapat mem-posting cerita tanpa perlu membuat akun atau *login*.
    * **Pemilihan Lokasi**: Tandai lokasi cerita Anda dengan mudah hanya dengan mengklik peta.
* **Aksesibilitas Penuh (A11y)**:
    * Dapat dioperasikan sepenuhnya dengan *keyboard*.
    * Dilengkapi fitur *skip-to-content* dan *ARIA live regions* untuk pengguna pembaca layar.
    * Desain responsif untuk semua ukuran perangkat.

---
## Struktur Proyek

Proyek ini menggunakan Webpack untuk *bundling* dan Babel untuk transpiling JavaScript. Strukturnya dirancang agar modular dan mudah dikelola.

```text
notes-app/
├── .github/workflows/      # Konfigurasi GitHub Actions untuk auto-deploy
├── dist/                   # Hasil build untuk production (dihasilkan otomatis)
├── src/
│   ├── public/             # Aset statis (gambar, favicon)
│   ├── scripts/
│   │   ├── data/           # Modul untuk interaksi dengan API
│   │   ├── pages/          # Komponen halaman (View & Presenter)
│   │   ├── routes/         # Konfigurasi routing
│   │   ├── utils/          # Fungsi bantuan
│   │   └── index.js        # Entry point utama aplikasi
│   ├── styles/
│   │   └── styles.css      # Styling global
│   └── index.html          # Template HTML utama
├── .gitignore
├── package.json
├── README.md               # Dokumentasi ini
└── webpack.config.js       # (webpack.common, webpack.dev, webpack.prod)
