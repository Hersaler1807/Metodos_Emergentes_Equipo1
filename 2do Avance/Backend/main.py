from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) # Esto permite que tu HTML se comunique con Python

# 1. Configuración de la conexión a XAMPP
def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",      # Usuario por defecto de XAMPP
        password="",      # Contraseña por defecto de XAMPP (vacía)
        database="sistema_soporte"
    )

@app.route('/registro', methods=['POST'])
def registrar_usuario():
    datos = request.json
    nombre = datos.get('nombre')
    correo = datos.get('correo')
    area = datos.get('area')
    password = datos.get('password')

    # Validaciones de seguridad en el servidor
    if not correo.endswith('@tecnm.mx'):
        return jsonify({"error": "El correo debe ser institucional (@tecnm.mx)"}), 400

    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # Insertar en la tabla que creamos en phpMyAdmin
        query = "INSERT INTO usuarios (nombre, correo, area, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (nombre, correo, area, password))
        
        conexion.commit()
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "¡Usuario registrado con éxito!"}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/login', methods=['POST'])
def login():
    datos = request.json
    correo = datos.get('correo')
    password = datos.get('password')

    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True) # dictionary=True nos da los datos con nombres de columna
        
        # Buscamos al usuario por correo
        query = "SELECT * FROM usuarios WHERE correo = %s"
        cursor.execute(query, (correo,))
        usuario = cursor.fetchone()
        
        cursor.close()
        conexion.close()

        # Validación: ¿Existe el usuario y la contraseña coincide?
        # Nota: Por ahora comparamos texto plano, luego te enseñaré a encriptar
        if usuario and usuario['password'] == password:
            return jsonify({
                "mensaje": "Inicio de sesión exitoso",
                "rol": usuario['rol'],
                "nombre": usuario['nombre']
            }), 200
        else:
            return jsonify({"error": "Correo o contraseña incorrecta"}), 401

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)