const mysql = require('mysql2/promise');

async function updateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'control_equipos_db',
    });

    console.log(' Conectado a la base de datos');

    // Agregar columnas a tabla tickets si no existen
    const sqlUpdates = `
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS category ENUM('Hardware', 'Software', 'Red', 'Impresoras', 'Monitor', 'Teclado/Ratón', 'Correo', 'Sistema Operativo', 'Otro') NOT NULL DEFAULT 'Otro' AFTER status;
      
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS priority ENUM('Baja', 'Media', 'Alta', 'Crítica') NOT NULL DEFAULT 'Media' AFTER category;
    `;

    const statements = sqlUpdates.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          console.log(' Columna agregada:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('  Columna ya existe');
          } else {
            throw error;
          }
        }
      }
    }

    await connection.end();
    console.log(' Base de datos actualizada exitosamente');
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
}

updateDatabase();
