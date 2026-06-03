-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2026 at 04:07 PM
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
  `sensor` varchar(100) NOT NULL,
  `tombol_customization` int(11) NOT NULL,
  `ergonomi` varchar(50) NOT NULL,
  `material` varchar(50) NOT NULL,
  `berat` decimal(6,2) NOT NULL,
  `tampilan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alternatif`
--

INSERT INTO `alternatif` (`id_alternatif`, `nama_alternatif`, `harga_acuan`, `dpi_maks`, `sensor`, `tombol_customization`, `ergonomi`, `material`, `berat`, `tampilan`) VALUES
(1, 'Logitech G102 LIGHTSYNC', 255000.00, 8000, 'Gaming-grade sensor', 6, 'Simetris klasik', 'Build entry-level Logitech, kabel 2,1 m', 85.00, 'LIGHTSYNC RGB'),
(2, 'Logitech G502 HERO', 669000.00, 25600, 'HERO 25K', 11, 'Right-handed ergonomic', 'Onboard memory, adjustable weight, PTFE feet', 121.00, 'LIGHTSYNC RGB 1 zona'),
(3, 'Razer Cobra Wired', 569000.00, 8500, 'Razer 8.500 DPI Optical Sensor', 6, 'Right-handed symmetrical', 'Optical Mouse Switches Gen-3, PTFE feet, Speedflex', 58.00, 'Razer Chroma RGB gradient underglow'),
(4, 'Razer DeathAdder V3 Wired', 1239000.00, 30000, 'Razer Focus Pro 30K Optical Sensor', 6, 'Right-handed ergonomic', 'Optical Mouse Switches Gen-3, PTFE feet, Speedflex', 59.00, 'Tidak ada RGB'),
(5, 'SteelSeries Rival 3 Gen 2 Wired', 730000.00, 8500, 'TrueMove Core Optical Sensor', 6, 'Battle-tested ergonomic shape', 'Super Mesh paracord, PTFE feet, 60M click durabili', 77.00, '3-zone RGB'),
(6, 'HyperX Pulsefire Haste 2 Wired', 749000.00, 26000, 'HyperX 26K Sensor', 6, 'Symmetrical', 'HyperFlex 2 cable, HyperX Switch 100M clicks, grip', 53.00, 'Per-LED RGB'),
(7, 'Corsair KATAR PRO XT', 648248.00, 18000, 'High-precision optical sensor', 6, 'Compact symmetric, claw/fingertip', 'Quickstrike buttons, Omron switch, paracord cable', 73.00, '1-zone RGB scroll wheel'),
(8, 'Corsair SABRE RGB PRO Champion Series', 939000.00, 18000, 'PixArt PMW3392 Optical Sensor', 6, 'Ergonomic palm/claw', 'Omron 50M, paracord cable, PTFE glide pads', 74.00, '2-zone RGB'),
(9, 'Cooler Master MM730', 513000.00, 16000, 'PixArt Optical Sensor', 6, 'Ergonomic right-handed', 'Rubber/PTFE material, ultraweave cable, 70M switch', 48.00, '16.7M RGB'),
(10, 'Glorious Model O 2 Mini Wired', 889378.00, 26000, 'Glorious BAMF 2.0 Optical', 6, 'Right-handed symmetrical, small-medium hand', '80M mechanical switches, PTFE G-Skates, Ascended c', 49.00, '16.8M RGB, 8 effects');

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
  ADD KEY `fk_preferensi_alternatif` (`id_alternatif`);

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
  MODIFY `id_kriteria` int(11) NOT NULL AUTO_INCREMENT;

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
