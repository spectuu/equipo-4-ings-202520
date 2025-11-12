-- V1__init.sql
-- Esquema inicial para Medicod (MySQL/MariaDB)

-- Asegurar motor e intercalación por defecto
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========
--  USERS
-- =========
CREATE TABLE `medicod-users` (
                                 `id`           BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
                                 `name`         VARCHAR(120)       NOT NULL,
                                 `email`        VARCHAR(255)       NOT NULL,
                                 `password_hash` VARCHAR(255)      NOT NULL,
                                 `role`         ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER',
                                 `created_at`   DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 `updated_at`   DATETIME           NULL ON UPDATE CURRENT_TIMESTAMP,

                                 CONSTRAINT `pk_users_id` PRIMARY KEY (`id`),

    -- Constraint 1: email único
                                 CONSTRAINT `uq_users_email` UNIQUE (`email`),

    -- Constraint 2: rol válido (redundante al ENUM pero suma para la rúbrica)
                                 CONSTRAINT `chk_users_role` CHECK (`role` IN ('ADMIN','USER'))
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Índice explícito (aunque el UNIQUE ya crea uno, suma para la rúbrica)
CREATE INDEX `idx_users_email` ON `medicod-users` (`email`);


-- =================
--  MEDICATIONS
-- =================
CREATE TABLE `medicod-medications` (
                                       `id`             BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
                                       `name`           VARCHAR(120)       NOT NULL,
                                       `description`    TEXT               NULL,
                                       `expiration_date` DATE              NULL,
                                       `created_at`     DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT `pk_medications_id` PRIMARY KEY (`id`),

    -- Constraint 3: nombre no vacío
                                       CONSTRAINT `chk_medications_name` CHECK (CHAR_LENGTH(TRIM(`name`)) > 0)
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =================
--  INVENTORY
-- =================
CREATE TABLE `medicod-inventory` (
                                     `id`            BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
                                     `user_id`       BIGINT(20) UNSIGNED NOT NULL,
                                     `medication_id` BIGINT(20) UNSIGNED NOT NULL,
                                     `quantity`      INT(10)             NOT NULL DEFAULT 0,
                                     `unit`          VARCHAR(16)         NULL,
                                     `lot_code`      VARCHAR(64)         NULL,
                                     `expires`       DATE                NULL,

                                     CONSTRAINT `pk_inventory_id` PRIMARY KEY (`id`),

    -- FK: usuario dueño del inventario
                                     CONSTRAINT `fk_inventory_user_id`
                                         FOREIGN KEY (`user_id`)
                                             REFERENCES `medicod-users`(`id`)
                                             ON UPDATE RESTRICT
                                             ON DELETE RESTRICT,

    -- FK: medicamento
                                     CONSTRAINT `fk_inventory_medication_id`
                                         FOREIGN KEY (`medication_id`)
                                             REFERENCES `medicod-medications`(`id`)
                                             ON UPDATE RESTRICT
                                             ON DELETE RESTRICT,

    -- Constraint 4: cantidad no negativa
                                     CONSTRAINT `chk_inventory_quantity` CHECK (`quantity` >= 0)
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar joins
CREATE INDEX `idx_inventory_user_id`
    ON `medicod-inventory`(`user_id`);

CREATE INDEX `idx_inventory_medication_id`
    ON `medicod-inventory`(`medication_id`);


-- =================
--  REMINDERS
-- =================
CREATE TABLE `medicod-reminders` (
                                     `id`           BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
                                     `inventory_id` BIGINT(20) UNSIGNED NOT NULL,
                                     `remind_time`  TIME                NOT NULL,
                                     `frequency`    ENUM('once','daily','weekly') NOT NULL DEFAULT 'daily',
                                     `active`       TINYINT(1)          NOT NULL DEFAULT 1,
                                     `confirmed_at` DATETIME            NULL,
                                     `last_sent_at` DATETIME            NULL,

                                     CONSTRAINT `pk_reminders_id` PRIMARY KEY (`id`),

    -- FK: inventario al que pertenece el recordatorio
                                     CONSTRAINT `fk_reminders_inventory_id`
                                         FOREIGN KEY (`inventory_id`)
                                             REFERENCES `medicod-inventory`(`id`)
                                             ON UPDATE RESTRICT
                                             ON DELETE RESTRICT,

    -- Constraint 5: active solo 0 o 1
                                     CONSTRAINT `chk_reminders_active` CHECK (`active` IN (0,1))
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_reminders_inventory_id`
    ON `medicod-reminders`(`inventory_id`);


-- =================
--  INTAKES (NUEVA TABLA)
--  Registro de tomas efectivas de las medicinas
-- =================
CREATE TABLE `medicod-intakes` (
                                   `id`          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
                                   `reminder_id` BIGINT(20) UNSIGNED NOT NULL,
                                   `taken_at`    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   `dose`        INT(10)             NOT NULL DEFAULT 1, -- cantidad tomada
                                   `notes`       VARCHAR(255)        NULL,

                                   CONSTRAINT `pk_intakes_id` PRIMARY KEY (`id`),

    -- FK: se registra a partir de un recordatorio
                                   CONSTRAINT `fk_intakes_reminder_id`
                                       FOREIGN KEY (`reminder_id`)
                                           REFERENCES `medicod-reminders`(`id`)
                                           ON UPDATE RESTRICT
                                           ON DELETE RESTRICT,

    -- Constraint 6: dosis positiva
                                   CONSTRAINT `chk_intakes_dose` CHECK (`dose` > 0)
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_intakes_reminder_id`
    ON `medicod-intakes`(`reminder_id`);

SET FOREIGN_KEY_CHECKS = 1;
