// 1. IMPORTAR LAS HERRAMIENTAS
// Express es para crear el servidor, Mysql2 para la DB y Cors para permitir la conexión
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// 2. CONFIGURACIONES DE SEGURIDAD Y DATOS
app.use(cors()); // Permite que tu HTML (que corre en un puerto) hable con el servidor (que corre en otro)
app.use(express.json()); // Permite que el servidor entienda cuando le envías texto en formato JSON

// 3. CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
// Estos datos deben coincidir con lo que ves en tu panel de XAMPP
const db = mysql.createConnection({
    host: 'localhost',      // Tu propia computadora
    user: 'root',           // Usuario por defecto de XAMPP
    password: '',           // Contraseña por defecto (vacía)
    database: 'soporte_tecnico' // El nombre que le diste a la DB en phpMyAdmin
});

// Verificar si la conexión funciona
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL con éxito.');
});

// 4. CREAR LA "RUTA" DE RECEPCIÓN
// Esta es la dirección a la que tu HTML le enviará los datos
app.post('/nuevo-reporte', (req, res) => {
    // Extraemos los datos que vienen desde el formulario del HTML
    const { titulo, descripcion, area } = req.body;

    // Consulta SQL (Usamos '?' para evitar ataques de Inyección SQL, muy importante en sistemas)
    const sql = "INSERT INTO reportes (titulo, descripcion, area) VALUES (?, ?, ?)";
    
    db.query(sql, [titulo, descripcion, area], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al guardar en la base de datos" });
        }
        // Si todo sale bien, le respondemos al HTML
        res.json({ mensaje: "Reporte creado correctamente en la base de datos", id: result.insertId });
    });
});

// 5. ENCENDER EL SERVIDOR
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});