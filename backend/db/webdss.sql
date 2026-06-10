-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 10 Jun 2026 pada 17.41
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdss`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `alternatif`
--

CREATE TABLE `alternatif` (
  `id_alternatif` int(11) NOT NULL,
  `nama_alternatif` varchar(100) NOT NULL,
  `harga_acuan` decimal(12,2) NOT NULL,
  `dpi_maks` int(11) NOT NULL,
  `tombol_customization` int(11) NOT NULL,
  `material` varchar(50) NOT NULL,
  `berat` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `alternatif`
--

INSERT INTO `alternatif` (`id_alternatif`, `nama_alternatif`, `harga_acuan`, `dpi_maks`, `tombol_customization`, `material`, `berat`) VALUES
(1, 'Logitech G102 LIGHTSYNC', 255000.00, 8000, 6, 'standar', 85.00),
(2, 'Logitech G502 HERO', 669000.00, 25600, 11, 'cukup', 121.00),
(3, 'Razer Cobra Wired', 569000.00, 8500, 6, 'standar', 58.00),
(4, 'Razer DeathAdder V3 Wired', 1239000.00, 30000, 6, 'sangat_baik', 59.00),
(5, 'SteelSeries Rival 3 Gen 2 Wired', 730000.00, 8500, 6, 'cukup', 77.00),
(6, 'HyperX Pulsefire Haste 2 Wired', 749000.00, 26000, 6, 'standar', 53.00),
(7, 'Corsair KATAR PRO XT', 648248.00, 18000, 6, 'baik', 73.00),
(8, 'Corsair SABRE RGB PRO Champion Series', 939000.00, 18000, 6, 'standar', 74.00),
(9, 'Cooler Master MM730', 513000.00, 16000, 6, 'premium', 48.00),
(10, 'Glorious Model O 2 Mini Wired', 889378.00, 26000, 6, 'cukup', 49.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kriteria`
--

CREATE TABLE `kriteria` (
  `id_kriteria` int(11) NOT NULL,
  `nama_kriteria` varchar(100) NOT NULL,
  `jenis` enum('Benefit','Cost') NOT NULL,
  `bobot` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kriteria`
--

INSERT INTO `kriteria` (`id_kriteria`, `nama_kriteria`, `jenis`, `bobot`) VALUES
(1, 'Harga', 'Cost', 3.00),
(2, 'DPI', 'Benefit', 4.00),
(3, 'Jumlah Tombol', 'Benefit', 3.00),
(4, 'Material & Build Quality', 'Benefit', 4.00),
(5, 'Berat / Bobot Mouse', 'Cost', 1.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `nilai_preferensi`
--

CREATE TABLE `nilai_preferensi` (
  `id_preferensi` int(11) NOT NULL,
  `id_alternatif` int(11) NOT NULL,
  `nilai_preferensi` decimal(10,6) NOT NULL,
  `peringkat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `nilai_preferensi`
--

INSERT INTO `nilai_preferensi` (`id_preferensi`, `id_alternatif`, `nilai_preferensi`, `peringkat`) VALUES
(1, 4, 0.563000, 1),
(2, 9, 0.561800, 2),
(3, 2, 0.537900, 3),
(4, 7, 0.459700, 4),
(5, 10, 0.409500, 5),
(6, 6, 0.386100, 6),
(7, 1, 0.294800, 7),
(8, 5, 0.274100, 8),
(9, 8, 0.265800, 9),
(10, 3, 0.230900, 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `penilaian`
--

CREATE TABLE `penilaian` (
  `id_penilaian` int(11) NOT NULL,
  `id_alternatif` int(11) NOT NULL,
  `id_kriteria` int(11) NOT NULL,
  `nilai` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `alternatif`
--
ALTER TABLE `alternatif`
  ADD PRIMARY KEY (`id_alternatif`);

--
-- Indeks untuk tabel `kriteria`
--
ALTER TABLE `kriteria`
  ADD PRIMARY KEY (`id_kriteria`);

--
-- Indeks untuk tabel `nilai_preferensi`
--
ALTER TABLE `nilai_preferensi`
  ADD PRIMARY KEY (`id_preferensi`),
  ADD UNIQUE KEY `id_alternatif` (`id_alternatif`);

--
-- Indeks untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  ADD PRIMARY KEY (`id_penilaian`),
  ADD KEY `fk_penilaian_alternatif` (`id_alternatif`),
  ADD KEY `fk_penilaian_kriteria` (`id_kriteria`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `alternatif`
--
ALTER TABLE `alternatif`
  MODIFY `id_alternatif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id_kriteria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `nilai_preferensi`
--
ALTER TABLE `nilai_preferensi`
  MODIFY `id_preferensi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  MODIFY `id_penilaian` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `nilai_preferensi`
--
ALTER TABLE `nilai_preferensi`
  ADD CONSTRAINT `fk_preferensi_alternatif` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  ADD CONSTRAINT `fk_penilaian_alternatif` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_penilaian_kriteria` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria` (`id_kriteria`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
