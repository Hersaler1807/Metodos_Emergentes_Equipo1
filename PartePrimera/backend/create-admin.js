const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    // Conectar a MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'control_equipos_db',
    });

    console.log(' Conectado a la base de datos');

    // Generar hash de contraseña
    const plainPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(' Contraseña hasheada');

    // Verificar si el admin ya existe
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@tecnm.mx']
    );

    if (existing.length > 0) {
      console.log('  El usuario admin ya existe');
      await connection.end();
      return;
    }

    // Insertar usuario admin
    await connection.query(
      'INSERT INTO users (email, passwordHash, role, area) VALUES (?, ?, ?, ?)',
      ['admin@tecnm.mx', hashedPassword, 'Admin', 'Sistemas']
    );

    console.log('Usuario Admin creado exitosamente');
    console.log('Email: admin@tecnm.mx');
    console.log('Contraseña: Admin123!');
    console.log(' Rol: Admin');
    console.log(' Área: Sistemas');

    await connection.end();
    console.log(' Conexión cerrada');
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
