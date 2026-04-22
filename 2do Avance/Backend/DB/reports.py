from flask import Blueprint, request, jsonify, current_app
import mysql.connector
import jwt

# Definir el Blueprint para reportes
reports_bp = Blueprint('reports', __name__)

# Configuración de la conexión a XAMPP
def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",      # Usuario por defecto de XAMPP
        password="",      # Contraseña por defecto de XAMPP
        database="sistema_soporte"
    )

# Ruta para CREAR UN NUEVO REPORTE
@reports_bp.route('/crear_reporte', methods=['POST'])
def crear_reporte():
    datos = request.json
    
    # ==========================================
    # Extraemos el ID del Token, NO del navegador
    # ==========================================
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
            
    if not token:
        return jsonify({'error': 'Acceso denegado. Falta el token de seguridad.'}), 401
        
    try:
        # Desciframos la pulsera usando la clave maestra de app
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        usuario_id = data['id'] 
    except Exception as e:
        return jsonify({'error': 'Token inválido o expirado'}), 401
    # ==========================================

    # A partir de aquí, todo sigue normal
    asunto = datos.get('asunto')
    descripcion = datos.get('descripcion')
    equipo_id = datos.get('equipo_id')
    categoria = datos.get('categoria')
    prioridad = datos.get('prioridad')
    evidencia = datos.get('evidencia') # Ruta del archivo

    # Validación básica en el servidor
    if not all([usuario_id, asunto, descripcion, equipo_id, categoria, prioridad]):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # Insertar en la tabla reportes
        query = """
            INSERT INTO reportes 
            (usuario_id, asunto, descripcion, equipo_id, categoria, prioridad, evidencia) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        valores = (usuario_id, asunto, descripcion, equipo_id, categoria, prioridad, evidencia)
        cursor.execute(query, valores)
        
        conexion.commit()
        
        # Obtener el ID del reporte recién creado
        reporte_id = cursor.lastrowid
        
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "¡Reporte creado con éxito!", "reporte_id": reporte_id}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500


# Ruta para OBTENER LOS REPORTES DE UN USUARIO (/reports/mis_reportes/<usuario_id>)
@reports_bp.route('/mis_reportes/<int:usuario_id>', methods=['GET'])
def obtener_mis_reportes(usuario_id):
    try:
        conexion = conectar_db()
        # dictionary=True hace que los datos salgan con el nombre de la columna
        cursor = conexion.cursor(dictionary=True) 
        
        # Buscamos los reportes del usuario
        query = """
            SELECT 
                id, 
                asunto, 
                equipo_id, 
                categoria, 
                prioridad, 
                estado, 
                DATE_FORMAT(fecha_creacion, '%d/%m/%Y %H:%i') as fecha_formateada
            FROM reportes 
            WHERE usuario_id = %s 
            ORDER BY fecha_creacion DESC
        """
        cursor.execute(query, (usuario_id,))
        reportes = cursor.fetchall() # Traemos TODOS los resultados que coincidan
        
        cursor.close()
        conexion.close()
        
        # Devolvemos la lista de reportes al frontend
        return jsonify({"reportes": reportes}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al buscar reportes: {err}"}), 500
    

# Ruta para OBTENER LAS ESTADÍSTICAS DEL USUARIO
@reports_bp.route('/estadisticas/<int:usuario_id>', methods=['GET'])
def obtener_estadisticas(usuario_id):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Usamos GROUP BY para contar cuántos reportes hay de cada estado
        query = """
            SELECT estado, COUNT(*) as total
            FROM reportes
            WHERE usuario_id = %s
            GROUP BY estado
        """
        cursor.execute(query, (usuario_id,))
        resultados = cursor.fetchall()
        
        cursor.close()
        conexion.close()
        
        # Preparamos un diccionario con contadores en cero por defecto
        estadisticas = {
            "pendiente": 0,
            "en_proceso": 0,
            "resuelto": 0
        }
        
        # Llenamos el diccionario con los resultados reales de la base de datos
        for fila in resultados:
            estado = fila['estado']
            total = fila['total']
            if estado in estadisticas:
                estadisticas[estado] = total
                
        return jsonify(estadisticas), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al buscar estadísticas: {err}"}), 500
    

# Ruta para OBTENER TODOS LOS REPORTES (Exclusivo para Técnicos)
@reports_bp.route('/todos_los_reportes', methods=['GET'])
def obtener_todos_reportes():
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Usamos JOIN para unir la tabla reportes con la tabla usuarios
        # Así el técnico sabrá exactamente quién reportó la falla
        query = """
            SELECT 
                r.id, 
                r.asunto, 
                r.equipo_id, 
                r.prioridad, 
                r.estado, 
                DATE_FORMAT(r.fecha_creacion, '%d/%m/%Y %H:%i') as fecha_formateada,
                u.nombre as nombre_usuario
            FROM reportes r
            JOIN usuarios u ON r.usuario_id = u.id
            ORDER BY r.fecha_creacion DESC
        """
        cursor.execute(query)
        reportes = cursor.fetchall() 
        
        cursor.close()
        conexion.close()
        
        return jsonify({"reportes": reportes}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al buscar todos los reportes: {err}"}), 500
    
    # Ruta para OBTENER ESTADÍSTICAS GLOBALES (Exclusivo para Técnicos)
@reports_bp.route('/estadisticas_globales', methods=['GET'])
def estadisticas_globales():
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Contamos TODOS los reportes agrupados por estado, sin filtrar por usuario
        query = "SELECT estado, COUNT(*) as total FROM reportes GROUP BY estado"
        cursor.execute(query)
        resultados = cursor.fetchall()
        
        # También necesitamos el total absoluto de todos los reportes
        cursor.execute("SELECT COUNT(*) as gran_total FROM reportes")
        total_absoluto = cursor.fetchone()['gran_total']
        
        cursor.close()
        conexion.close()
        
        estadisticas = {
            "total": total_absoluto,
            "pendiente": 0,
            "en_proceso": 0,
            "resuelto": 0
        }
        
        for fila in resultados:
            estado = fila['estado']
            if estado in estadisticas:
                estadisticas[estado] = fila['total']
                
        return jsonify(estadisticas), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al buscar estadísticas globales: {err}"}), 500
    

# Ruta para ACTUALIZAR EL ESTADO DE UN REPORTE (Exclusivo para Técnicos)
@reports_bp.route('/actualizar_estado/<int:reporte_id>', methods=['PUT'])
def actualizar_estado(reporte_id):
    datos = request.json
    nuevo_estado = datos.get('estado') # Recibimos el nuevo estado (ej. 'en_proceso')

    if not nuevo_estado:
        return jsonify({"error": "Falta indicar el nuevo estado"}), 400

    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # Le decimos a MySQL: "Actualiza la tabla reportes, pon este nuevo estado, 
        # pero SOLO en la fila que tenga este ID exacto"
        query = "UPDATE reportes SET estado = %s WHERE id = %s"
        cursor.execute(query, (nuevo_estado, reporte_id))
        
        conexion.commit()
        
        # Verificamos si realmente se modificó alguna fila
        if cursor.rowcount == 0:
            cursor.close()
            conexion.close()
            return jsonify({"error": "No se encontró el reporte o el estado es el mismo"}), 404
            
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "¡Estado actualizado correctamente!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al actualizar el reporte: {err}"}), 500
