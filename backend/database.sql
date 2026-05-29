-- ============================================================
-- DSS Gaming Mouse Recommendation System
-- Database: webdss
-- ============================================================

CREATE DATABASE IF NOT EXISTS `webdss` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `webdss`;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- Table: criteria
-- ============================================================
DROP TABLE IF EXISTS `criteria`;
CREATE TABLE `criteria` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL,
  `weight` DECIMAL(4,2) NOT NULL,
  `type` ENUM('benefit','cost') NOT NULL DEFAULT 'benefit',
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `criteria` (`name`, `code`, `weight`, `type`, `description`) VALUES
('Harga',        'C1', 0.20, 'cost',    'Harga mouse dalam ribuan rupiah. Semakin murah semakin baik.'),
('Sensor',       'C2', 0.15, 'benefit', 'Nilai kualitas sensor (1-10). Semakin tinggi semakin baik.'),
('DPI',          'C3', 0.10, 'benefit', 'Nilai fleksibilitas dan jangkauan DPI (1-10). Semakin tinggi semakin baik.'),
('Tombol',       'C4', 0.10, 'benefit', 'Nilai jumlah tombol tambahan dan kustomisasi (1-10). Semakin tinggi semakin baik.'),
('Ergonomi',     'C5', 0.15, 'benefit', 'Nilai kenyamanan genggaman dan bentuk (1-10). Semakin tinggi semakin baik.'),
('Material',     'C6', 0.10, 'benefit', 'Nilai ketahanan dan kualitas material (1-10). Semakin tinggi semakin baik.'),
('Berat',        'C7', 0.10, 'benefit', 'Berat mouse dalam gram. Semakin berat semakin baik sesuai preferensi user.'),
('Tampilan',     'C8', 0.10, 'benefit', 'Nilai estetika visual dan fitur RGB (1-10). Semakin tinggi semakin baik.');

-- ============================================================
-- Table: alternatives
-- ============================================================
DROP TABLE IF EXISTS `alternatives`;
CREATE TABLE `alternatives` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `brand` VARCHAR(100),
  `price` DECIMAL(10,0) NOT NULL COMMENT 'Harga dalam ribuan rupiah',
  `sensor_score` DECIMAL(4,1) NOT NULL COMMENT 'Nilai sensor 1-10',
  `dpi_score` DECIMAL(4,1) NOT NULL COMMENT 'Nilai DPI 1-10',
  `button_score` DECIMAL(4,1) NOT NULL COMMENT 'Nilai tombol 1-10',
  `ergonomic_score` DECIMAL(4,1) NOT NULL COMMENT 'Nilai ergonomi 1-10',
  `material_score` DECIMAL(4,1) NOT NULL COMMENT 'Nilai material 1-10',
  `weight_g` DECIMAL(6,1) NOT NULL COMMENT 'Berat dalam gram',
  `appearance_score` DECIMAL(4,1) NOT NULL COMMENT 'Nilai visual/RGB 1-10',
  `image_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `alternatives`
  (`name`, `brand`, `price`, `sensor_score`, `dpi_score`, `button_score`, `ergonomic_score`, `material_score`, `weight_g`, `appearance_score`, `image_url`)
VALUES
  ('Logitech G502 HERO', 'Logitech', 799, 9.5, 10.0, 10.0, 9.0, 9.0, 121.0, 8.5, NULL),
  ('SteelSeries Rival 3 Gen 2 Wired', 'SteelSeries', 449, 8.0, 8.0, 7.0, 8.0, 8.0, 77.0, 9.0, NULL),
  ('Razer Cobra Wired', 'Razer', 599, 8.5, 8.0, 7.0, 8.0, 8.5, 58.0, 9.5, NULL),
  ('Corsair KATAR PRO XT', 'Corsair', 399, 8.5, 9.0, 7.0, 7.5, 8.0, 73.0, 7.5, NULL),
  ('Razer DeathAdder V3 Wired', 'Razer', 1099, 10.0, 10.0, 7.0, 10.0, 9.5, 59.0, 7.0, NULL),
  ('HyperX Pulsefire Haste 2 Wired', 'HyperX', 799, 9.0, 10.0, 7.0, 8.5, 8.5, 53.0, 8.0, NULL),
  ('Cooler Master MM730', 'Cooler Master', 499, 8.5, 9.0, 7.0, 8.5, 8.5, 48.0, 8.0, NULL),
  ('Glorious Model O 2 Mini Wired', 'Glorious', 849, 9.0, 10.0, 7.0, 8.0, 8.0, 57.0, 9.0, NULL),
  ('Logitech G102 LIGHTSYNC', 'Logitech', 299, 7.5, 8.0, 7.0, 8.0, 7.0, 85.0, 9.0, NULL),
  ('Corsair SABRE RGB PRO Champion Series', 'Corsair', 749, 9.0, 9.5, 7.0, 9.0, 8.5, 74.0, 8.5, NULL);

-- ============================================================
-- Table: rankings
-- ============================================================
DROP TABLE IF EXISTS `rankings`;
CREATE TABLE `rankings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `alternative_id` INT UNSIGNED NOT NULL,
  `topsis_score` DECIMAL(8,6) NOT NULL,
  `rank_position` INT UNSIGNED NOT NULL,
  `d_plus` DECIMAL(10,8),
  `d_minus` DECIMAL(10,8),
  `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`alternative_id`) REFERENCES `alternatives`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Table: calculation_logs (optional — audit trail)
-- ============================================================
DROP TABLE IF EXISTS `calculation_logs`;
CREATE TABLE `calculation_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `triggered_by` VARCHAR(50) DEFAULT 'system',
  `alternatives_count` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
