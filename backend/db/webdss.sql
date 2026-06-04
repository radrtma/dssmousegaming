-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2026 at 10:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `alternatif`
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
-- Dumping data for table `alternatif`
--

INSERT INTO alternatif
(nama_alternatif, harga_acuan, dpi_maks, tombol_customization, material, berat)
VALUES
('Logitech G102 LIGHTSYNC', 255000, 8000, 6, 'Build entry-level Logitech, kabel 2.1 m', 85),

('Logitech G502 HERO', 669000, 25600, 11, 'Onboard memory, adjustable weight, PTFE feet', 121),

('Razer Cobra Wired', 569000, 8500, 6, 'Optical Mouse Switches Gen-3, PTFE feet, Speedflex cable', 58),

('Razer DeathAdder V3 Wired', 1239000, 30000, 6, 'Optical Mouse Switches Gen-3, PTFE feet, Speedflex cable', 59),

('SteelSeries Rival 3 Gen 2 Wired', 730000, 8500, 6, 'Super Mesh paracord, PTFE feet, 60M click durability', 77),

('HyperX Pulsefire Haste 2 Wired', 749000, 26000, 6, 'HyperFlex 2 cable, HyperX Switch 100M clicks, grip tape', 53),

('Corsair KATAR PRO XT', 648248, 18000, 6, 'Quickstrike buttons, Omron switch, paracord cable', 73),

('Corsair SABRE RGB PRO Champion Series', 939000, 18000, 6, 'Omron 50M, paracord cable, PTFE glide pads', 74),

('Cooler Master MM730', 513000, 16000, 6, 'Rubber/PTFE material, ultraweave cable, 70M switch', 48),

('Glorious Model O 2 Mini Wired', 889378, 26000, 6, '80M mechanical switches, PTFE G-Skates, Ascended cable', 49);

-- --------------------------------------------------------

--
-- Table structure for table `kriteria`
--

CREATE TABLE `kriteria` (
  `id_kriteria` int(11) NOT NULL,
  `nama_kriteria` varchar(100) NOT NULL,
  `jenis` enum('Benefit','Cost') NOT NULL,
  `bobot` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kriteria`
--

INSERT INTO `kriteria` (`id_kriteria`, `nama_kriteria`, `jenis`, `bobot`) VALUES
(1, 'Harga', 'Cost', 3.00),
(2, 'DPI', 'Benefit', 4.00),
(3, 'Jumlah Tombol / Customization', 'Benefit', 3.00),
(4, 'Material & Build Quality', 'Benefit', 4.00),
(5, 'Berat / Bobot Mouse', 'Cost', 1.00);

-- --------------------------------------------------------

--
-- Table structure for table `nilai_preferensi`
--

CREATE TABLE `nilai_preferensi` (
  `id_preferensi` int(11) NOT NULL,
  `id_alternatif` int(11) NOT NULL,
  `nilai_preferensi` decimal(10,6) NOT NULL,
  `peringkat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penilaian`
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
-- Indexes for table `alternatif`
--
ALTER TABLE `alternatif`
  ADD PRIMARY KEY (`id_alternatif`);

--
-- Indexes for table `kriteria`
--
ALTER TABLE `kriteria`
  ADD PRIMARY KEY (`id_kriteria`);

--
-- Indexes for table `nilai_preferensi`
--
ALTER TABLE `nilai_preferensi`
  ADD PRIMARY KEY (`id_preferensi`),
  ADD UNIQUE KEY `id_alternatif` (`id_alternatif`);

--
-- Indexes for table `penilaian`
--
ALTER TABLE `penilaian`
  ADD PRIMARY KEY (`id_penilaian`),
  ADD KEY `fk_penilaian_alternatif` (`id_alternatif`),
  ADD KEY `fk_penilaian_kriteria` (`id_kriteria`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alternatif`
--
ALTER TABLE `alternatif`
  MODIFY `id_alternatif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id_kriteria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `nilai_preferensi`
--
ALTER TABLE `nilai_preferensi`
  MODIFY `id_preferensi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penilaian`
--
ALTER TABLE `penilaian`
  MODIFY `id_penilaian` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `nilai_preferensi`
--
ALTER TABLE `nilai_preferensi`
  ADD CONSTRAINT `fk_preferensi_alternatif` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `penilaian`
--
ALTER TABLE `penilaian`
  ADD CONSTRAINT `fk_penilaian_alternatif` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_penilaian_kriteria` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria` (`id_kriteria`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
