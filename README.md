# DSS Gaming Mouse Recommendation System (TOPSIS Method)

Sistem Pendukung Keputusan (DSS / SPK) untuk rekomendasi mouse gaming terbaik menggunakan metode **TOPSIS** (Technique for Order Preference by Similarity to Ideal Solution). Aplikasi ini dibangun dengan React, Tailwind CSS, dan PHP (REST API) + MySQL database.

## 🚀 Fitur Utama
1. **Dashboard Modern**: Vibe modern dashboard SaaS gelap (dark mode) dengan metrik performa, top 3 rekomendasi mouse, dan leaderboard peringkat.
2. **Kelola Alternatif (CRUD)**: Menambah, mengubah, mencari, dan menghapus alternatif mouse gaming secara dinamis dengan 8 kriteria komprehensif.
3. **Detail Perhitungan TOPSIS**: Visualisasi interaktif setiap langkah dari 6 tahapan metode TOPSIS:
   - Matriks Keputusan ($X$)
   - Matriks Normalisasi ($R$)
   - Matriks Normalisasi Terbobot ($V$)
   - Solusi Ideal Positif ($A^+$) & Negatif ($A^-$)
   - Jarak Solusi Ideal ($D^+$ & $D^-$) dan
   - Nilai Preferensi ($V_i$)
   - Peringkat/Ranking Akhir
4. **Offline Fallback**: Aplikasi secara otomatis beralih ke mode offline dengan data simulasi (mock data) dan penyimpanan local state jika backend PHP/MySQL tidak tersedia.

---

## 🛠️ Tech Stack & Struktur Project

### Frontend
- **Framework & Build Tool**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Language**: PHP (REST API Sederhana)
- **Database**: MySQL via PDO

### Struktur Direktori
```text
webdss/
├── backend/
│   ├── api/             # File REST API Endpoint (alternatives, criteria, rankings)
│   ├── config/          # Konfigurasi database PDO
│   ├── controllers/     # Logika controller CRUD & TOPSIS
│   ├── models/          # Model query database (Alternative, Criteria, Ranking)
│   ├── utils/           # Helper Response & Algoritma TOPSIS
│   └── database.sql     # Skema database MySQL + Seed data
├── frontend/
│   ├── src/
│   │   ├── components/  # Komponen UI (Leaderboard, Modal, Sidebar, dll.)
│   │   ├── data/        # Mock data awal (untuk mode offline)
│   │   ├── hooks/       # Custom hooks (useAlternatives, useTopsis)
│   │   ├── pages/       # Halaman Dashboard, Alternatives, Calculation
│   │   ├── services/    # Service Axios untuk API call
│   │   └── utils/       # Engine TOPSIS client-side (JS)
└── README.md            # Dokumentasi panduan setup
```

---

## ⚙️ Cara Menjalankan Project

### 1. Prasyarat (Prerequisites)
Pastikan Anda memiliki tools berikut di komputer Anda:
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [XAMPP](https://www.apachefriends.org/) (mengandung Apache & MySQL / MariaDB)

### 2. Setup Database (MySQL)
1. Buka **XAMPP Control Panel** dan jalankan **Apache** dan **MySQL**.
2. Taruh folder `webdss` ini di dalam direktori `C:\xampp\htdocs\webdss`.
3. Buka browser dan pergi ke **phpMyAdmin** (`http://localhost/phpmyadmin`).
4. Buat database baru bernama `webdss`.
5. Klik tab **Import**, pilih file `backend/database.sql` dari folder project, lalu tekan **Go/Import**.
   - *Alternatif:* Anda juga bisa mengimpor via command line:
     ```bash
     C:\xampp\mysql\bin\mysql.exe -u root webdss < backend/database.sql
     ```

### 3. Jalankan Backend (PHP)
- Karena ditaruh di `C:\xampp\htdocs\webdss`, backend REST API Anda otomatis dapat diakses di `http://localhost/webdss/backend/api/`.
- Anda dapat mengujinya dengan membuka: `http://localhost/webdss/backend/api/criteria.php`.

### 4. Jalankan Frontend (React)
1. Buka terminal (CMD / PowerShell / Git Bash) di dalam folder `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka browser pada alamat yang diberikan oleh Vite (biasanya `http://localhost:5173`).

---

## 📐 Kriteria & Bobot TOPSIS (8 Kriteria Baru)

Sistem ini mengevaluasi mouse gaming berdasarkan 8 kriteria berikut secara menyeluruh:
1. **Harga (C1)** - *Cost* (Bobot: 20%) - Harga mouse dalam ribuan rupiah. Semakin murah harga mouse, semakin baik nilainya.
2. **Sensor (C2)** - *Benefit* (Bobot: 15%) - Kualitas sensor (skala 1-10), semakin tinggi kualitas pelacakan semakin baik.
3. **DPI (C3)** - *Benefit* (Bobot: 10%) - Fleksibilitas dan jangkauan sensitivitas DPI (skala 1-10), semakin tinggi semakin baik.
4. **Tombol (C4)** - *Benefit* (Bobot: 10%) - Jumlah tombol tambahan dan kemampuan kustomisasi tombol (skala 1-10), semakin tinggi semakin baik.
5. **Ergonomi (C5)** - *Benefit* (Bobot: 15%) - Tingkat kenyamanan bentuk & grip mouse saat digenggam lama (skala 1-10), semakin tinggi semakin nyaman.
6. **Material (C6)** - *Benefit* (Bobot: 10%) - Kualitas build, ketahanan bodi, dan keawetan switch mouse (skala 1-10), semakin tinggi semakin tahan lama.
7. **Berat (C7)** - *Benefit* (Bobot: 10%) - Berat mouse dalam gram. Diukur sebagai benefit (menampilkan preferensi bobot solid/kustomisasi user).
8. **Tampilan (C8)** - *Benefit* (Bobot: 10%) - Estetika visual, desain bentuk, dan keindahan fitur RGB lighting (skala 1-10), semakin tinggi semakin menarik.
