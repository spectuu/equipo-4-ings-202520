-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               11.7.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for medicod
CREATE DATABASE IF NOT EXISTS `medicod` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `medicod`;

-- Dumping structure for table medicod.medicod-inventory
CREATE TABLE IF NOT EXISTS `medicod-inventory` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `medication_id` bigint(20) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `unit` varchar(16) DEFAULT NULL,
  `lot_code` varchar(64) DEFAULT NULL,
  `expires` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_inventory_user_med_lot` (`user_id`,`medication_id`,`lot_code`),
  KEY `idx_inventory_user_id` (`user_id`),
  KEY `idx_inventory_medication_id` (`medication_id`),
  CONSTRAINT `fk_inventory_medication_id` FOREIGN KEY (`medication_id`) REFERENCES `medicod-medications` (`id`),
  CONSTRAINT `fk_inventory_user_id` FOREIGN KEY (`user_id`) REFERENCES `medicod-users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table medicod.medicod-inventory: ~9 rows (approximately)
INSERT INTO `medicod-inventory` (`id`, `user_id`, `medication_id`, `quantity`, `unit`, `lot_code`, `expires`) VALUES
	(1, 3, 2, 0, 'string', 'STRING', '2025-10-15'),
	(2, 3, 1, 1, 'ml', '2', '2025-12-08'),
	(3, 2, 3, 30, 'tabletas', '3', '2027-02-04'),
	(4, 2, 4, 3, 'ml', '4', '2027-02-04'),
	(5, 2, 4, 3, 'ml', '3', '2027-02-04'),
	(6, 4, 1, 16, 'Tabletas', 'LOT A23K7', '2026-02-04'),
	(7, 4, 5, 25, 'ml', 'LOT A23K7', '2025-02-04'),
	(8, 4, 6, 5, 'ml', 'LOT A23K7', '2025-10-17'),
	(9, 4, 7, 5, 'ml', 'LOT A23K7', '2025-10-15');

-- Dumping structure for table medicod.medicod-medications
CREATE TABLE IF NOT EXISTS `medicod-medications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table medicod.medicod-medications: ~7 rows (approximately)
INSERT INTO `medicod-medications` (`id`, `name`, `description`, `expiration_date`, `created_at`) VALUES
	(1, 'Ibuprofeno', 'xxx', NULL, '2025-10-15 13:46:27'),
	(2, 'string', 'string', NULL, '2025-10-15 13:52:57'),
	(3, 'xxx', 'xxx', NULL, '2025-10-15 15:09:09'),
	(4, 'querty', 'querty', NULL, '2025-10-15 15:16:26'),
	(5, 'Acetamifonen', 'xxx', NULL, '2025-10-16 15:53:47'),
	(6, 'Indapamida', 'xx', NULL, '2025-10-16 15:55:11'),
	(7, 'dolex', NULL, NULL, '2025-10-16 21:34:50');

-- Dumping structure for table medicod.medicod-reminders
CREATE TABLE IF NOT EXISTS `medicod-reminders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_id` bigint(20) unsigned NOT NULL,
  `remind_time` time NOT NULL,
  `frequency` enum('once','daily','weekly') NOT NULL DEFAULT 'daily',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `confirmed_at` datetime DEFAULT NULL,
  `last_sent_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reminders_inventory_id` (`inventory_id`),
  CONSTRAINT `fk_reminders_inventory_id` FOREIGN KEY (`inventory_id`) REFERENCES `medicod-inventory` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table medicod.medicod-reminders: ~0 rows (approximately)

-- Dumping structure for table medicod.medicod-users
CREATE TABLE IF NOT EXISTS `medicod-users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table medicod.medicod-users: ~2 rows (approximately)
INSERT INTO `medicod-users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
	(1, 'Juan Carlos', 'juancarlos@gmail.com', '$2a$10$II.3e3jI94m1Nkf7oS6c5uX9IFAu3ekNJQrfNCjcJJ96IDQsmRmz.', 'USER', '2025-10-09 19:22:54', NULL),
	(2, 'Nicolas El Abuelo', 'nicolas@gmail.com', '$2a$10$OQlakEU6me2mVZyAL/a8WOqMRWaxXfHjRyvZXHzgWYmhc1MLarrxu', 'USER', '2025-10-09 20:36:17', NULL),
	(3, 'spectu', 'spectu@gmail.com', '$2a$10$kH9su/CmwVhdIlcuM/DKAOvsrb.G.F7pnum3E3A2ovTBFV1vZPNk6', 'USER', '2025-10-15 13:46:13', NULL),
	(4, 'Santiago Martinez', 'santiago.martinezl@upb.com', '$2a$10$3Al1qPKflli6KjWHVeVaDel2IqsuiCHPd.cPV60yMxCs5ElRK7HnO', 'USER', '2025-10-16 15:50:10', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
