const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Conectar a MySQL sin especificar BD
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Sin contraseña
      multipleStatements: true,
    });

    console.log('Conectado a MySQL');

    // Crear BD
    await connection.query('CREATE DATABASE IF NOT EXISTS control_equipos_db;');
    console.log('Base de datos creada');

    // Usar BD
    await connection.query('USE control_equipos_db;');
    console.log('BD seleccionada');

    // Crear tablas
    const sqlScript = `
      -- Tabla users
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      -- Tabla equipments
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      -- Tabla tickets
      CREATE TABLE IF NOT EXISTS tickets (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description LONGTEXT NOT NULL,
          status ENUM('Pendiente', 'En proceso', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Pendiente',
          evidenceText LONGTEXT,
          reportedById INT NOT NULL,
          assignedToId INT,
          equipmentId INT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_ticket_reportedBy FOREIGN KEY (reportedById) REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT fk_ticket_assignedTo FOREIGN KEY (assignedToId) REFERENCES users(id) ON DELETE SET NULL,
          CONSTRAINT fk_ticket_equipment FOREIGN KEY (equipmentId) REFERENCES equipments(id) ON DELETE SET NULL,
          INDEX idx_status (status),
          INDEX idx_reportedById (reportedById),
          INDEX idx_assignedToId (assignedToId),
          INDEX idx_equipmentId (equipmentId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      -- Tabla ticket_comments
      CREATE TABLE IF NOT EXISTS ticket_comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          text LONGTEXT NOT NULL,
          ticketId INT NOT NULL,
          userId INT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_comment_ticket FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE,
          CONSTRAINT fk_comment_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_ticketId (ticketId),
          INDEX idx_userId (userId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      -- Tabla ticket_evidence
      CREATE TABLE IF NOT EXISTS ticket_evidence (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fileName VARCHAR(255) NOT NULL,
          filePath VARCHAR(500) NOT NULL,
          fileType VARCHAR(50) NOT NULL,
          ticketId INT NOT NULL,
          uploadedBy INT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_evidence_ticket FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE,
          CONSTRAINT fk_evidence_user FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_ticketId (ticketId),
          INDEX idx_uploadedBy (uploadedBy)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(sqlScript);
    console.log(' Tablas creadas exitosamente');

    await connection.end();
    console.log(' Conexión cerrada - Setup completado');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
