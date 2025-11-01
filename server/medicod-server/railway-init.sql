-- Script de inicialización de base de datos para Railway
-- Este script se ejecutará automáticamente cuando Railway cree la base de datos

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `railway`;

-- Dumping structure for table medicod-inventory
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

-- Dumping structure for table medicod-medications
CREATE TABLE IF NOT EXISTS `medicod-medications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping structure for table medicod-reminders
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

-- Dumping structure for table medicod-users
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

-- Insertar datos de prueba
INSERT INTO `medicod-medications` (`id`, `name`, `description`, `expiration_date`, `created_at`) VALUES
(1, 'Ibuprofeno', 'Antiinflamatorio no esteroideo', NULL, NOW()),
(2, 'Paracetamol', 'Analgésico y antipirético', NULL, NOW()),
(3, 'Aspirina', 'Analgésico y antiinflamatorio', NULL, NOW()),
(4, 'Omeprazol', 'Inhibidor de la bomba de protones', NULL, NOW()),
(5, 'Acetaminofén', 'Analgésico', NULL, NOW()),
(6, 'Indapamida', 'Diurético', NULL, NOW()),
(7, 'Dolex', 'Analgésico combinado', NULL, NOW());

INSERT INTO `medicod-users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Usuario Demo', 'demo@medicod.com', '$2a$10$II.3e3jI94m1Nkf7oS6c5uX9IFAu3ekNJQrfNCjcJJ96IDQsmRmz.', 'USER', NOW(), NULL),
(2, 'Admin Demo', 'admin@medicod.com', '$2a$10$OQlakEU6me2mVZyAL/a8WOqMRWaxXfHjRyvZXHzgWYmhc1MLarrxu', 'ADMIN', NOW(), NULL);

INSERT INTO `medicod-inventory` (`id`, `user_id`, `medication_id`, `quantity`, `unit`, `lot_code`, `expires`) VALUES
(1, 1, 1, 50, 'tabletas', 'LOT001', '2025-12-31'),
(2, 1, 2, 30, 'tabletas', 'LOT002', '2025-11-30'),
(3, 2, 3, 20, 'tabletas', 'LOT003', '2025-10-31');
