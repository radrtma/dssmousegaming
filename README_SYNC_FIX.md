# Perbaikan Sinkronisasi Backend dan Frontend

Masalah 404 terjadi karena frontend memanggil `/api/alternatives.php`, lalu Vite proxy meneruskannya ke path backend tertentu. Jika folder backend di XAMPP tidak sama dengan path proxy, Apache akan membalas `404 Not Found`.

## Struktur yang disarankan

Letakkan folder project ini di:

```text
D:\Software_Belajar\XAMPP\htdocs\git\dssmousegaming
```

Sehingga endpoint backend bisa dibuka melalui browser:

```text
http://localhost/git/git/dssmousegaming/backend/api/health.php
http://localhost/git/git/dssmousegaming/backend/api/alternatives.php
http://localhost/git/git/dssmousegaming/backend/api/kriteria.php
http://localhost/git/git/dssmousegaming/backend/api/rankings.php
```

Jika `health.php` masih 404, berarti folder backend belum berada di path tersebut, Apache belum aktif, atau project diletakkan di folder lain.

## Database

1. Buka phpMyAdmin.
2. Buat database bernama `webdss`.
3. Import file:

```text
backend/db/webdss.sql
```

4. Pastikan konfigurasi di `backend/config/db.php` sesuai dengan XAMPP lokal:

```php
DB_HOST = localhost
DB_NAME = webdss
DB_USER = root
DB_PASS = ''
```

## Menjalankan frontend

```bash
cd D:\Software_Belajar\XAMPP\htdocs\git\dssmousegaming\frontend
npm install
npm run dev
```

Buka:

```text
http://localhost:5173
```

## Jika folder backend bukan `dssmousegaming`

Misalnya project berada di:

```text
D:\Software_Belajar\XAMPP\htdocs\git\dssmousegaming
```

Edit atau buat file `frontend/.env`, lalu isi:

```env
VITE_BACKEND_PROXY_PATH=/webdss/backend/api
```

Setelah mengubah `.env` atau `vite.config.js`, matikan server Vite dengan `Ctrl + C`, lalu jalankan lagi:

```bash
npm run dev
```

## Catatan penting

- Folder `frontend/src/data` dan file mock sudah dihapus.
- Frontend tidak lagi memakai data dummy.
- Jika tabel `alternatif` kosong, UI akan kosong.
- Jika tambah alternatif masih 404, cek URL `health.php` terlebih dahulu.
