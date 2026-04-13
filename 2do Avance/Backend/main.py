from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from functools import wraps

from reports import reports_bp

app = Flask(__name__)
CORS(app) # Comunicacion HTML entre Python

# Configuración de la conexión a XAMPP
def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",      # Usuario por defecto de XAMPP
        password="",      # Contraseña por defecto de XAMPP
        database="sistema_soporte"
    )


@app.route('/registro', methods=['POST'])
def registrar_usuario():
    datos = request.json
    nombre = datos.get('nombre')
    correo = datos.get('correo')
    area = datos.get('area')
    password = datos.get('password')
    password_encriptada = generate_password_hash(password)

    # Validaciones de seguridad en el servidor
    if not correo.endswith('@tecnm.mx'):
        return jsonify({"error": "El correo debe ser institucional (@tecnm.mx)"}), 400

    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, area, password, rol) VALUES (%s, %s, %s, %s, %s)",
            (nombre, correo, area, password_encriptada, 'usuario_basico')
        )
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
        cursor = conexion.cursor(dictionary=True)
        
        # Buscamos al usuario por correo
        query = "SELECT * FROM usuarios WHERE correo = %s"
        cursor.execute(query, (correo,))
        usuario = cursor.fetchone()
        
        cursor.close()
        conexion.close()

        # Validación segura con hash
        if usuario and check_password_hash(usuario['password'], password):
            
            # FABRICAMOS LA PULSERA 
            token = jwt.encode({
                'id': usuario['id'],
                'rol': usuario['rol'],
                # Le damos una caducidad de 2 horas por seguridad
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2) 
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({
                "mensaje": "Inicio de sesión exitoso",
                "token": token, 
                "rol": usuario['rol'],
                "nombre": usuario['nombre'], 
                "area": usuario['area'],
                "id": usuario['id']
            }), 200
        else:
            return jsonify({"error": "Correo o contraseña incorrecta"}), 401

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500
    
app.register_blueprint(reports_bp, url_prefix='/reports')

# =========================================================
# RUTAS DEL ADMINISTRADOR (GESTIÓN DE USUARIOS)
# =========================================================

# Obtener la lista de todos los usuarios
@app.route('/admin/usuarios', methods=['GET'])
def obtener_usuarios(usuario_actual): 
    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # Traemos todos los datos excepto la contraseña por seguridad
        cursor.execute("SELECT id, nombre, correo, rol FROM usuarios")
        
        # Convertimos los resultados en una lista de diccionarios 
        usuarios = []
        for (id_user, nombre, correo, rol) in cursor.fetchall():
            usuarios.append({
                "id": id_user,
                "nombre_usuario": nombre,
                "correo": correo,
                "rol": rol
            })
            
        cursor.close()
        conexion.close()
        return jsonify({"usuarios": usuarios}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al obtener usuarios: {str(e)}"}), 500


# Actualizar el rol o cambiar la contraseña de un usuario
@app.route('/admin/usuarios/<int:id_usuario>', methods=['PUT'])
def editar_usuario(usuario_actual, id_usuario): 
    datos = request.json
    nuevo_rol = datos.get('rol')
    nueva_password = datos.get('password') # Si viene vacía, no la cambiamos

    try:
        conexion = conectar_db()
        cursor = conexion.cursor()

        if nueva_password:
            # Encriptamos la nueva contraseña antes de guardarla
            password_encriptada = generate_password_hash(nueva_password)
            
            query = "UPDATE usuarios SET rol = %s, password = %s WHERE id = %s"
            cursor.execute(query, (nuevo_rol, password_encriptada, id_usuario))
        else: 
            # Si la dejó en blanco, SOLO le cambiamos el rol
            query = "UPDATE usuarios SET rol = %s WHERE id = %s"
            cursor.execute(query, (nuevo_rol, id_usuario))

        conexion.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        cursor.close()
        conexion.close()
        return jsonify({"mensaje": "¡Usuario actualizado correctamente!"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al actualizar usuario: {str(e)}"}), 500


# 3. Eliminar un usuario del sistema
@app.route('/admin/usuarios/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(usuario_actual, id_usuario):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # Al eliminar el usuario, gracias al 'ON DELETE CASCADE' que pusimos 
        # en phpMyAdmin, su perfil de técnico también se borrará solito.
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id_usuario,))
        conexion.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        cursor.close()
        conexion.close()
        return jsonify({"mensaje": "Usuario eliminado del sistema"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al eliminar usuario: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
