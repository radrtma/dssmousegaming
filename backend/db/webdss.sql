-- Database DSS Mouse Gaming
-- Schema sinkron dengan backend dan frontend terbaru

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `webdss` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `webdss`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `nilai_preferensi`;
DROP TABLE IF EXISTS `penilaian`;
DROP TABLE IF EXISTS `kriteria`;
DROP TABLE IF EXISTS `alternatif`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `alternatif` (
  `id_alternatif` int(11) NOT NULL AUTO_INCREMENT,
  `nama_alternatif` varchar(100) NOT NULL,
  `harga_acuan` decimal(12,2) NOT NULL,
  `dpi_maks` int(11) NOT NULL,
  `tombol` int(11) NOT NULL,
  `material` varchar(255) NOT NULL,
  `berat` decimal(6,2) NOT NULL,
  PRIMARY KEY (`id_alternatif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `alternatif` (`id_alternatif`, `nama_alternatif`, `harga_acuan`, `dpi_maks`, `tombol`, `material`, `berat`) VALUES
(1, 'Logitech G102 LIGHTSYNC', 255000.00, 8000, 6, 'Build entry-level Logitech, kabel 2.1 m', 85.00),
(2, 'Logitech G502 HERO', 669000.00, 25600, 11, 'Onboard memory, adjustable weight, PTFE feet', 121.00),
(3, 'Razer Cobra Wired', 569000.00, 8500, 6, 'Optical Mouse Switches Gen-3, PTFE feet, Speedflex', 58.00),
(4, 'Razer DeathAdder V3 Wired', 1239000.00, 30000, 6, 'Optical Mouse Switches Gen-3, PTFE feet, Speedflex', 59.00),
(5, 'SteelSeries Rival 3 Gen 2 Wired', 730000.00, 8500, 6, 'Super Mesh paracord, PTFE feet, 60M click durability', 77.00),
(6, 'HyperX Pulsefire Haste 2 Wired', 749000.00, 26000, 6, 'HyperFlex 2 cable, HyperX Switch 100M clicks, grip', 53.00),
(7, 'Corsair KATAR PRO XT', 648248.00, 18000, 6, 'Quickstrike buttons, Omron switch, paracord cable', 73.00),
(8, 'Corsair SABRE RGB PRO Champion Series', 939000.00, 18000, 6, 'Omron 50M, paracord cable, PTFE glide pads', 74.00),
(9, 'Cooler Master MM730', 513000.00, 16000, 6, 'Rubber/PTFE material, ultraweave cable, 70M switch', 48.00),
(10, 'Glorious Model O 2 Mini Wired', 889378.00, 26000, 6, '80M mechanical switches, PTFE G-Skates, Ascended cable', 49.00);

CREATE TABLE `kriteria` (
  `id_kriteria` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kriteria` varchar(100) NOT NULL,
  `jenis` enum('Benefit','Cost') NOT NULL,
  `bobot` decimal(4,2) NOT NULL,
  PRIMARY KEY (`id_kriteria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `kriteria` (`id_kriteria`, `nama_kriteria`, `jenis`, `bobot`) VALUES
(1, 'Harga', 'Cost', 3.00),
(2, 'DPI', 'Benefit', 4.00),
(3, 'Jumlah Tombol', 'Benefit', 3.00),
(4, 'Material & Build Quality', 'Benefit', 4.00),
(5, 'Berat / Bobot Mouse', 'Cost', 1.00);

CREATE TABLE `nilai_preferensi` (
  `id_preferensi` int(11) NOT NULL AUTO_INCREMENT,
  `id_alternatif` int(11) NOT NULL,
  `nilai_preferensi` decimal(10,6) NOT NULL,
  `peringkat` int(11) NOT NULL,
  PRIMARY KEY (`id_preferensi`),
  UNIQUE KEY `id_alternatif` (`id_alternatif`),
  CONSTRAINT `fk_preferensi_alternatif` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `penilaian` (
  `id_penilaian` int(11) NOT NULL AUTO_INCREMENT,
  `id_alternatif` int(11) NOT NULL,
  `id_kriteria` int(11) NOT NULL,
  `nilai` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_penilaian`),
  KEY `fk_penilaian_alternatif` (`id_alternatif`),
  KEY `fk_penilaian_kriteria` (`id_kriteria`),
  CONSTRAINT `fk_penilaian_alternatif` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_penilaian_kriteria` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria` (`id_kriteria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
