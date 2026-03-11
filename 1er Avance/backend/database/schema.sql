-- ===========================================
-- Base de Datos: Sistema de Control de Equipos
-- ===========================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS control_equipos_db;
USE control_equipos_db;

-- ===========================================
-- TABLA: users
-- Almacena los usuarios del sistema
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Technician', 'User') NOT NULL DEFAULT 'User',
    area ENUM('Biblioteca', 'Sistemas', 'Recursos Humanos', 'Recursos Financieros', 'Edificio Q', 'Edificio R') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_area (area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: equipments
-- Almacena el inventario de equipos
-- ===========================================
CREATE TABLE IF NOT EXISTS equipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serialNumber VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('Activo', 'En reparación', 'Baja') NOT NULL DEFAULT 'Activo',
    area ENUM('Biblioteca', 'Sistemas', 'Recursos Humanos', 'Recursos Financieros', 'Edificio Q', 'Edificio R') NOT NULL,
    hardwareDetails LONGTEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_serialNumber (serialNumber),
    INDEX idx_status (status),
    INDEX idx_area (area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: tickets
-- Almacena los tickets/reportes de problemas
-- ===========================================
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    status ENUM('Pendiente', 'En proceso', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Pendiente',
    category ENUM('Hardware', 'Software', 'Red', 'Impresoras', 'Monitor', 'Teclado/Ratón', 'Correo', 'Sistema Operativo', 'Otro') NOT NULL DEFAULT 'Otro',
    priority ENUM('Baja', 'Media', 'Alta', 'Crítica') NOT NULL DEFAULT 'Media',
    evidenceText LONGTEXT,
    reportedById INT NOT NULL,
    assignedToId INT,
    equipmentId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    CONSTRAINT fk_ticket_reportedBy FOREIGN KEY (reportedById) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_assignedTo FOREIGN KEY (assignedToId) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_ticket_equipment FOREIGN KEY (equipmentId) REFERENCES equipments(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_priority (priority),
    INDEX idx_reportedById (reportedById),
    INDEX idx_assignedToId (assignedToId),
    INDEX idx_equipmentId (equipmentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: ticket_comments (Futura)
-- Almacena comentarios en los tickets
-- ===========================================
CREATE TABLE IF NOT EXISTS ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text LONGTEXT NOT NULL,
    ticketId INT NOT NULL,
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    CONSTRAINT fk_comment_ticket FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_ticketId (ticketId),
    INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: ticket_evidence (Futura)
-- Almacena evidencias (imágenes, archivos) de tickets
-- ===========================================
CREATE TABLE IF NOT EXISTS ticket_evidence (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    ticketId INT NOT NULL,
    uploadedBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    CONSTRAINT fk_evidence_ticket FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_evidence_user FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_ticketId (ticketId),
    INDEX idx_uploadedBy (uploadedBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- INSERTAR USUARIO ADMINISTRADOR INICIAL
-- Nota: Contraseña por defecto (cambiar en producción)
-- Email: admin@tecnm.mx
-- Contraseña: Admin123! (hasheada con bcrypt)
-- ===========================================
INSERT INTO users (email, passwordHash, role, area) VALUES 
('admin@tecnm.mx', '$2b$10$YourHashedPasswordHere', 'Admin', 'Sistemas');

-- Nota: Para generar el hash de contraseña, usar Node.js:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('Admin123!', 10).then(hash => console.log(hash));

-- ===========================================
-- PROCEDIMIENTO ALMACENADO: Obtener histórico de un equipo
-- ===========================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_equipment_history(IN equipId INT)
BEGIN
    SELECT 
        t.id as ticketId,
        t.title,
        t.description,
        t.status,
        t.createdAt,
        u.email as reportedBy,
        tech.email as assignedTo
    FROM tickets t
    LEFT JOIN users u ON t.reportedById = u.id
    LEFT JOIN users tech ON t.assignedToId = tech.id
    WHERE t.equipmentId = equipId
    ORDER BY t.createdAt DESC;
END //

DELIMITER ;

-- ===========================================
-- PROCEDIMIENTO ALMACENADO: Reporte de rendimiento por técnico
-- ===========================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_technician_performance(IN startDate DATE, IN endDate DATE)
BEGIN
    SELECT 
        u.id,
        u.email,
        COUNT(t.id) as total_tickets,
        SUM(CASE WHEN t.status = 'Resuelto' THEN 1 ELSE 0 END) as resolved_tickets,
        SUM(CASE WHEN t.status = 'Cerrado' THEN 1 ELSE 0 END) as closed_tickets,
        SUM(CASE WHEN t.status = 'En proceso' THEN 1 ELSE 0 END) as in_progress_tickets,
        ROUND(
            (SUM(CASE WHEN t.status IN ('Resuelto', 'Cerrado') THEN 1 ELSE 0 END) / 
            COUNT(t.id) * 100), 2
        ) as completion_rate
    FROM users u
    LEFT JOIN tickets t ON u.id = t.assignedToId 
        AND t.createdAt BETWEEN startDate AND endDate
    WHERE u.role = 'Technician'
    GROUP BY u.id, u.email
    ORDER BY completion_rate DESC;
END //

DELIMITER ;

-- ===========================================
-- COMENTARIOS Y NOTAS
-- ===========================================
/*
INSTRUCCIONES DE USO:

1. Crear la BD desde cero (con script Node.js):
   node setup-db.js

2. O importar el archivo SQL manualmente:
   mysql -u root -p < database/schema.sql

3. Crear usuario Admin inicial (con script Node.js):
   node create-admin.js

4. Actualizar BD con nuevas columnas (si es necesario):
   node update-db.js

5. Generar hash de contraseña en Node.js:
   const bcrypt = require('bcrypt');
   bcrypt.hash('TuContraseña', 10).then(hash => console.log(hash));

6. Verificar tablas y relaciones:
   DESCRIBE users;
   DESCRIBE equipments;
   DESCRIBE tickets;
   DESCRIBE ticket_comments;
   DESCRIBE ticket_evidence;

ENUMS DISPONIBLES:

UserRole:
  - 'Admin' (Administrador)
  - 'Technician' (Técnico)
  - 'User' (Usuario)

WorkArea:
  - 'Biblioteca'
  - 'Sistemas'
  - 'Recursos Humanos'
  - 'Recursos Financieros'
  - 'Edificio Q'
  - 'Edificio R'

EquipmentStatus:
  - 'Activo'
  - 'En reparación'
  - 'Baja'

TicketStatus:
  - 'Pendiente'
  - 'En proceso'
  - 'Resuelto'
  - 'Cerrado'

TicketCategory:
  - 'Hardware'
  - 'Software'
  - 'Red'
  - 'Impresoras'
  - 'Monitor'
  - 'Teclado/Ratón'
  - 'Correo'
  - 'Sistema Operativo'
  - 'Otro'

TicketPriority:
  - 'Baja'
  - 'Media' (por defecto)
  - 'Alta'
  - 'Crítica'

USUARIO ADMIN INICIAL:
  Email: admin@tecnm.mx
  Contraseña: Admin123!
  Rol: Admin
  Área: Sistemas

*/

-- ===========================================
-- PROCEDIMIENTO ALMACENADO: Reportes por Categoría
-- ===========================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_tickets_by_category(IN categoryName VARCHAR(100))
BEGIN
    SELECT 
        id,
        title,
        description,
        category,
        priority,
        status,
        u.email as reportedBy,
        tech.email as assignedTo,
        createdAt
    FROM tickets t
    LEFT JOIN users u ON t.reportedById = u.id
    LEFT JOIN users tech ON t.assignedToId = tech.id
    WHERE category = categoryName
    ORDER BY priority DESC, createdAt DESC;
END //

DELIMITER ;

-- ===========================================
-- PROCEDIMIENTO ALMACENADO: Reportes por Prioridad
-- ===========================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_tickets_by_priority(IN priorityName VARCHAR(100))
BEGIN
    SELECT 
        id,
        title,
        description,
        category,
        priority,
        status,
        u.email as reportedBy,
        tech.email as assignedTo,
        createdAt
    FROM tickets t
    LEFT JOIN users u ON t.reportedById = u.id
    LEFT JOIN users tech ON t.assignedToId = tech.id
    WHERE priority = priorityName AND status != 'Cerrado'
    ORDER BY createdAt DESC;
END //

DELIMITER ;

-- ===========================================
-- EJEMPLOS DE CONSULTAS ÚTILES
-- ===========================================
/*

-- Tickets críticos sin asignar
SELECT * FROM tickets 
WHERE priority = 'Crítica' AND assignedToId IS NULL AND status != 'Cerrado'
ORDER BY createdAt DESC;

-- Tickets por categoría Hardware ordenados por prioridad
SELECT id, title, category, priority, status, u.email as reportedBy
FROM tickets t
LEFT JOIN users u ON t.reportedById = u.id
WHERE category = 'Hardware' 
ORDER BY priority DESC, createdAt DESC;

-- Total de tickets por categoría
SELECT category, COUNT(*) as total, 
       SUM(CASE WHEN status = 'Resuelto' THEN 1 ELSE 0 END) as resueltos,
       SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) as pendientes
FROM tickets 
GROUP BY category 
ORDER BY total DESC;

-- Tickets asignados a un técnico específico
SELECT id, title, category, priority, status, createdAt
FROM tickets 
WHERE assignedToId = 2 AND status != 'Cerrado'
ORDER BY priority DESC, createdAt DESC;

-- Tiempo promedio de resolución por categoría
SELECT category, AVG(TIMESTAMPDIFF(HOUR, createdAt, updatedAt)) as avg_hours_to_resolve
FROM tickets 
WHERE status IN ('Resuelto', 'Cerrado')
GROUP BY category
ORDER BY avg_hours_to_resolve ASC;

-- Tickets por estado y categoría
SELECT status, category, COUNT(*) as total
FROM tickets
GROUP BY status, category
ORDER BY status, total DESC;

-- Ejecutar procedimientos almacenados
CALL sp_equipment_history(1);
CALL sp_technician_performance('2024-01-01', '2026-03-04');
CALL sp_tickets_by_category('Hardware');
CALL sp_tickets_by_priority('Alta');

