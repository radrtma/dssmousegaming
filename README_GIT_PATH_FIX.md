# DSS Mouse Gaming - Fix Path git

Project ini disesuaikan untuk lokasi folder:

D:\Software_Belajar\XAMPP\htdocs\git\dssmousegaming

Dengan URL backend:

http://localhost/git/dssmousegaming/backend/api

## Cara cek backend

1. Jalankan Apache dan MySQL dari XAMPP.
2. Buka:
   http://localhost/git/dssmousegaming/backend/api/health.php
3. Buka:
   http://localhost/git/dssmousegaming/backend/api/alternatives.php

Jika health.php tidak muncul, berarti folder project belum terbaca oleh Apache atau path folder tidak sama.
Jika alternatives.php muncul error database, cek nama database di backend/config/db.php.

## Cara cek database

Default database pada backend/config/db.php:

DB_NAME = webdss
DB_USER = root
DB_PASS = kosong

Jika kamu import SQL ke database dengan nama lain, ubah DB_NAME di backend/config/db.php.

## Cara menjalankan frontend

Masuk folder frontend:

cd D:\Software_Belajar\XAMPP\htdocs\git\dssmousegaming\frontend
npm install
npm run dev

Buka:

http://localhost:5173

Jika masih 404, matikan terminal Vite, jalankan ulang npm run dev, lalu tekan Ctrl + F5 di browser.
