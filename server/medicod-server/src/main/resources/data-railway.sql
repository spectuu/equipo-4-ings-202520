-- Datos iniciales para Railway
-- Este script se ejecutará automáticamente cuando Hibernate cree las tablas

-- Insertar medicamentos de prueba
INSERT INTO medicod_medications (name, description, expiration_date, created_at) VALUES
('Ibuprofeno', 'Antiinflamatorio no esteroideo', NULL, NOW()),
('Paracetamol', 'Analgésico y antipirético', NULL, NOW()),
('Aspirina', 'Analgésico y antiinflamatorio', NULL, NOW()),
('Omeprazol', 'Inhibidor de la bomba de protones', NULL, NOW()),
('Acetaminofén', 'Analgésico', NULL, NOW()),
('Indapamida', 'Diurético', NULL, NOW()),
('Dolex', 'Analgésico combinado', NULL, NOW());

-- Insertar usuarios de prueba
INSERT INTO medicod_users (name, email, password_hash, role, created_at, updated_at) VALUES
('Usuario Demo', 'demo@medicod.com', '$2a$10$II.3e3jI94m1Nkf7oS6c5uX9IFAu3ekNJQrfNCjcJJ96IDQsmRmz.', 'USER', NOW(), NULL),
('Admin Demo', 'admin@medicod.com', '$2a$10$OQlakEU6me2mVZyAL/a8WOqMRWaxXfHjRyvZXHzgWYmhc1MLarrxu', 'ADMIN', NOW(), NULL);

-- Insertar inventario de prueba
INSERT INTO medicod_inventory (user_id, medication_id, quantity, unit, lot_code, expires) VALUES
(1, 1, 50, 'tabletas', 'LOT001', '2025-12-31'),
(1, 2, 30, 'tabletas', 'LOT002', '2025-11-30'),
(2, 3, 20, 'tabletas', 'LOT003', '2025-10-31');
