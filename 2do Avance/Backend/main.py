from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import os
from werkzeug.utils import secure_filename

from reports import reports_bp

app = Flask(__name__)
CORS(app) # Comunicacion HTML entre Python
# Python usará esta clave secreta para firmar los tokens. 
app.config['SECRET_KEY'] = 'mi_secreto_super_seguro_para_el_tecnologico_123'

# Configuración de la conexión a XAMPP
def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",      # Usuario por defecto de XAMPP
        password="",      # Contraseña por defecto de XAMPP
        database="sistema_soporte"
    )

# =========================================================
# EL GUARDIA DE SEGURIDAD (Decorador de Roles)
# =========================================================
def requiere_rol(*roles_permitidos):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            
            # 1. Buscamos si el navegador nos envió el token
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                # Cortamos el token
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(" ")[1]

            # Si no trae pulsera, ¡pa' fuera!
            if not token:
                return jsonify({'error': '¡Alto! Faltan tus credenciales de seguridad.'}), 401

            try:
                # Desciframos la pulsera usando nuestra llave secreta
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                usuario_actual = data # Aquí viene su ID y su Rol reales

                #  Revisamos si su rol tiene permiso de entrar a esta zona
                if usuario_actual['rol'] not in roles_permitidos:
                    return jsonify({'error': 'No tienes permisos suficientes para hacer esto.'}), 403

            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Tu sesión ha expirado. Vuelve a iniciar sesión.'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Token inválido. ¡Intento de seguridad fallido!'}), 401

            # Si pasó todas las pruebas, lo dejamos pasar a la función original
            # Y le pasamos los datos del usuario_actual por si los necesita
            return f(usuario_actual, *args, **kwargs)
        return decorated_function
    return decorator

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
@requiere_rol('admin') 
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

# =======================================================
# Obtener los últimos 3 usuarios (Panel de Inicio Admin)
# =======================================================
@app.route('/admin/usuarios/recientes', methods=['GET'])
@requiere_rol('admin')
def obtener_usuarios_recientes(usuario_actual):
    try:
        conexion = conectar_db()
        # Usamos dictionary=True para que el JSON se arme solito (como lo hiciste en el login)
        cursor = conexion.cursor(dictionary=True) 

        # Ordenamos por ID descendente (los números más altos son los más recientes) y limitamos a 3
        query = "SELECT id, nombre, correo, rol FROM usuarios ORDER BY id DESC LIMIT 3"
        cursor.execute(query)
        usuarios = cursor.fetchall()

        cursor.close()
        conexion.close()
        
        return jsonify({"usuarios": usuarios}), 200

    except Exception as e:
        return jsonify({"error": f"Error al obtener usuarios recientes: {str(e)}"}), 500


# Actualizar el rol o cambiar la contraseña de un usuario
@app.route('/admin/usuarios/<int:id_usuario>', methods=['PUT'])
@requiere_rol('admin') 
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
@requiere_rol('admin') 
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


# =======================================================
# RUTAS PÚBLICAS (DIRECTORIO DE TÉCNICOS)
# =======================================================
@app.route('/tecnicos/publico', methods=['GET'])
@requiere_rol('usuario_basico', 'tecnico', 'admin') # Todos los usuarios logueados pueden ver esto
def obtener_tecnicos_publico(usuario_actual):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True) 

        # Hacemos un JOIN usando los nombres EXACTOS de tus columnas
        query = """
            SELECT 
                u.id, 
                u.nombre AS nombre_original,
                u.correo, 
                p.nombre_publico, 
                p.foto_url, 
                p.carrera, 
                p.especialidad,
                p.area_asignada
            FROM usuarios u
            INNER JOIN perfiles_tecnicos p ON u.id = p.usuario_id
            WHERE u.rol = 'tecnico'
        """
        cursor.execute(query)
        tecnicos = cursor.fetchall()

        cursor.close()
        conexion.close()

        # Retornamos la lista de técnicos en formato JSON
        return jsonify({"tecnicos": tecnicos}), 200

    except Exception as e:
        return jsonify({"error": f"Error al obtener el directorio de técnicos: {str(e)}"}), 500
    
# =======================================================
# SUBIR FOTO DE PERFIL
# =======================================================
@app.route('/usuarios/subir_foto/<int:usuario_id>', methods=['POST'])
def subir_foto_perfil(usuario_id):
    try:
        # 1. Verificamos si viene el archivo
        if 'foto' not in request.files:
            return jsonify({"error": "No se envió ninguna foto"}), 400
            
        archivo = request.files['foto']
        if archivo.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400

        # 2. Creamos la carpeta si no existe
        carpeta_destino = os.path.join('static', 'profile_pics')
        if not os.path.exists(carpeta_destino):
            os.makedirs(carpeta_destino)

        # 3. Guardamos el archivo con un nombre seguro
        nombre_seguro = secure_filename(f"user_{usuario_id}_{archivo.filename}")
        ruta_guardado = os.path.join(carpeta_destino, nombre_seguro)
        archivo.save(ruta_guardado)

        # La URL que el frontend usará para mostrar la foto
        url_foto = f"http://localhost:5000/static/profile_pics/{nombre_seguro}"

        # 4. Actualizamos la base de datos
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # ⚠️ IMPORTANTE: Tu tabla 'usuarios' debe tener una columna 'foto_url' de tipo VARCHAR(255)
        query = "UPDATE usuarios SET foto_url = %s WHERE id = %s"
        cursor.execute(query, (url_foto, usuario_id))
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Foto actualizada", "foto_url": url_foto}), 200

    except Exception as e:
        return jsonify({"error": f"Error al subir foto: {str(e)}"}), 500
    
# =======================================================
# OBTENER DETALLE DE USUARIO (Para el panel flotante)
# =======================================================
@app.route('/usuarios/detalle/<int:usuario_id>', methods=['GET'])
def obtener_detalle_usuario(usuario_id):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        # ⚠️ AQUÍ ESTÁ EL CAMBIO: Quitamos 'especialidad' de la consulta
        query = "SELECT id, nombre, rol, area, foto_url FROM usuarios WHERE id = %s"
        cursor.execute(query, (usuario_id,))
        usuario = cursor.fetchone()

        cursor.close()
        conexion.close()

        if usuario:
            # Limpiamos valores nulos
            if not usuario['foto_url']: usuario['foto_url'] = ''
            if not usuario['area']: usuario['area'] = ''
            # ⚠️ AQUÍ TAMBIÉN: Borramos la línea que limpiaba 'especialidad'
            
            return jsonify(usuario), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": f"Error en la base de datos: {str(e)}"}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
