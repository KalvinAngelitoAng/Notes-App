export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About Notes-App</h1>
        <div class="about-content" style="margin-top: 20px; line-height: 1.6;">
          <p>
            <strong>Notes-App</strong> adalah sebuah platform sederhana yang dibangun untuk memenuhi submission kelas "Belajar Pengembangan Web Intermediate" dari Dicoding. 
            Aplikasi ini memungkinkan pengguna untuk berbagi cerita atau momen menarik mereka, lengkap dengan gambar dan lokasi di peta.
          </p>
          <br>
          <p>
            Proyek ini mengadopsi arsitektur <strong>Single-Page Application (SPA)</strong>, yang berarti semua navigasi antar halaman terjadi secara dinamis tanpa perlu me-reload halaman. 
            Hal ini memberikan pengalaman pengguna yang lebih cepat dan mulus.
          </p>
          <br>
          <h3>Fitur Utama:</h3>
          <ul>
            <li><strong>Berbagi Cerita:</strong> Pengguna dapat membuat dan mempublikasikan cerita baru dengan deskripsi dan foto.</li>
            <li><strong>Peta Interaktif:</strong> Semua cerita yang memiliki data lokasi akan ditampilkan sebagai marker di peta, memudahkan untuk melihat di mana sebuah momen terjadi.</li>
            <li><strong>Akses Kamera:</strong> Pengguna dapat langsung mengambil foto menggunakan kamera perangkat saat akan membuat cerita baru.</li>
            <li><strong>Desain Responsif:</strong> Tampilan aplikasi dapat menyesuaikan diri dengan berbagai ukuran layar, mulai dari mobile, tablet, hingga desktop.</li>
          </ul>
        </div>
      </section>
    `;
  }

  async afterRender() {
    
  }
}