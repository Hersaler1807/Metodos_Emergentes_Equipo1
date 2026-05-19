from flask import Blueprint, request, jsonify, current_app, send_file
import mysql.connector
import jwt
import os
from werkzeug.utils import secure_filename
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

# Definir el Blueprint para reportes
reports_bp = Blueprint('reports', __name__)

# Configurar la carpeta donde se guardarán las fotos de los reportes
UPLOAD_FOLDER = 'static/evidencias'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
   

    asunto = datos.get('asunto')
    descripcion = datos.get('descripcion')
    equipo_id = datos.get('equipo_id')
    categoria = datos.get('categoria')
    prioridad = datos.get('prioridad')
    evidencia = datos.get('evidencia')

    # Validación básica en el servidor
    if not all([usuario_id, asunto, descripcion, equipo_id, categoria, prioridad]):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        
        # ====================================================
        # 🤖 MAGIA DE AUTO-ASIGNACIÓN INTELIGENTE
        # Buscamos al técnico con menos reportes activos (Pendientes = 1 o En Proceso = 2)
        # ====================================================
        query_tecnico = """
            SELECT u.id 
            FROM usuarios u
            LEFT JOIN reportes r ON u.id = r.tecnico_id AND r.estado_id IN (1, 2)
            WHERE u.rol_id = 2
            GROUP BY u.id
            ORDER BY COUNT(r.id) ASC
            LIMIT 1
        """
        cursor.execute(query_tecnico)
        tecnico_ideal = cursor.fetchone()
        
        if not tecnico_ideal:
            return jsonify({"error": "No hay técnicos disponibles en el sistema."}), 400
            
        tecnico_asignado_id = tecnico_ideal[0] # Sacamos el ID del técnico menos ocupado

        # ====================================================
        # Insertar el reporte (AÑADIENDO EL TÉCNICO GANADOR)
        # ====================================================
        query = """
            INSERT INTO reportes 
            (usuario_id, asunto, descripcion, equipo_id, categoria_id, prioridad_id, estado_id, evidencia, tecnico_id)
            VALUES (%s, %s, %s, %s, 
                    (SELECT id FROM categorias WHERE nombre = %s), 
                    (SELECT id FROM prioridades WHERE nombre = %s), 
                    1, %s, %s)
        """
        valores = (usuario_id, asunto, descripcion, equipo_id, categoria, prioridad, evidencia, tecnico_asignado_id)
        cursor.execute(query, valores)
        
        conexion.commit()
        
        # Obtener el ID del reporte recién creado
        reporte_id = cursor.lastrowid
        
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "¡Reporte creado y asignado con éxito!", "reporte_id": reporte_id, "tecnico_asignado": tecnico_asignado_id}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500


# Ruta para OBTENER LOS REPORTES DE UN USUARIO
@reports_bp.route('/mis_reportes/<int:usuario_id>', methods=['GET', 'OPTIONS'])
def obtener_mis_reportes(usuario_id):
    # --- TRUCO PARA VENCER AL CORS ---
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, OPTIONS'
        }
    # ---------------------------------

    try:
        conexion = conectar_db()
        # dictionary=True hace que los datos salgan con el nombre de la columna
        cursor = conexion.cursor(dictionary=True) 
        
        # Buscamos los reportes del usuario
        query = """
            SELECT r.id, r.asunto, r.equipo_id, 
                   c.nombre as categoria, p.nombre as prioridad, e.nombre as estado,
                   r.solucion_texto, r.evidencia_url,
                   DATE_FORMAT(r.fecha_creacion, '%d/%m/%Y %H:%i') as fecha_formateada,
                   t.nombre as tecnico_asignado
            FROM reportes r
            LEFT JOIN categorias c ON r.categoria_id = c.id
            LEFT JOIN prioridades p ON r.prioridad_id = p.id
            LEFT JOIN estados e ON r.estado_id = e.id
            LEFT JOIN usuarios t ON r.tecnico_id = t.id
            WHERE r.usuario_id = %s
            ORDER BY r.fecha_creacion DESC
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
            SELECT e.nombre as estado, COUNT(*) as total 
            FROM reportes r
            JOIN estados e ON r.estado_id = e.id
            WHERE r.usuario_id = %s
            GROUP BY e.nombre
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
            SELECT r.id, r.asunto, r.equipo_id, 
                   p.nombre as prioridad, e.nombre as estado,
                   r.solucion_texto, r.evidencia_url,
                   DATE_FORMAT(r.fecha_creacion, '%d/%m/%Y %H:%i') as fecha_formateada,
                   u.nombre as nombre_usuario,
                   t.nombre as tecnico_asignado
            FROM reportes r
            JOIN usuarios u ON r.usuario_id = u.id
            LEFT JOIN prioridades p ON r.prioridad_id = p.id
            LEFT JOIN estados e ON r.estado_id = e.id
            LEFT JOIN usuarios t ON r.tecnico_id = t.id
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
        query = "SELECT e.nombre as estado, COUNT(*) as total FROM reportes r JOIN estados e ON r.estado_id = e.id GROUP BY e.nombre"
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
    try:
        # ⚠️ IMPORTANTE: Como el frontend ahora envía un FormData (con archivos),
        # ya no usamos request.json, usamos request.form
        nuevo_estado = request.form.get('estado')

        if not nuevo_estado:
            return jsonify({"error": "Falta indicar el nuevo estado"}), 400

        conexion = conectar_db()
        cursor = conexion.cursor()

        # Si el técnico eligió "resuelto", procesamos el texto y las fotos
        if nuevo_estado == 'resuelto':
            solucion_texto = request.form.get('solucion_texto')
            archivos = request.files.getlist('evidencias') # Extraemos las imágenes
            rutas_evidencias = []

            for archivo in archivos:
                if archivo.filename != '':
                    # Limpiamos el nombre original de la foto
                    nombre_seguro = secure_filename(archivo.filename)
                    # Le pegamos el ID del reporte para identificar de qué ticket es
                    nombre_final = f"folio_{reporte_id}_{nombre_seguro}"
                    ruta_guardado = os.path.join(UPLOAD_FOLDER, nombre_final)
                    
                    # Guardamos la foto en la computadora
                    archivo.save(ruta_guardado)
                    
                    # Guardamos la ruta web para que el Frontend pueda mostrarla luego
                    rutas_evidencias.append(f"http://localhost:5000/static/evidencias/{nombre_final}")
            
            # Convertimos la lista de rutas en un texto separado por comas
            evidencia_url = ",".join(rutas_evidencias) if rutas_evidencias else None

            # Actualizamos la base de datos con los 3 campos
            query = """
                UPDATE reportes 
                SET estado_id = (SELECT id FROM estados WHERE nombre = %s), 
                    solucion_texto = %s, evidencia_url = %s 
                WHERE id = %s
            """
            cursor.execute(query, (nuevo_estado, solucion_texto, evidencia_url, reporte_id))

        else:
            # Si es pendiente o en proceso, solo actualizamos el estado normal
            query = "UPDATE reportes SET estado_id = (SELECT id FROM estados WHERE nombre = %s) WHERE id = %s"
            cursor.execute(query, (nuevo_estado, reporte_id))

        conexion.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conexion.close()
            return jsonify({"error": "No se encontró el reporte o el estado es el mismo"}), 404

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "¡Estado actualizado correctamente!"}), 200

    except Exception as e:
        return jsonify({"error": f"Error al actualizar el reporte: {str(e)}"}), 500
    
# =======================================================
# EDITAR UN REPORTE (Exclusivo para Administradores)
# =======================================================
@reports_bp.route('/editar_admin/<int:reporte_id>', methods=['PUT'])
def editar_reporte_admin(reporte_id):
    try:
        datos = request.json
        nuevo_asunto = datos.get('asunto')
        nueva_categoria = datos.get('categoria')
        nueva_prioridad = datos.get('prioridad')

        if not all([nuevo_asunto, nueva_categoria, nueva_prioridad]):
            return jsonify({"error": "Faltan datos para modificar el reporte"}), 400

        conexion = conectar_db()
        cursor = conexion.cursor()

        query = """
            UPDATE reportes 
            SET asunto = %s, 
                categoria_id = (SELECT id FROM categorias WHERE nombre = %s), 
                prioridad_id = (SELECT id FROM prioridades WHERE nombre = %s)
            WHERE id = %s
        """
        cursor.execute(query, (nuevo_asunto, nueva_categoria, nueva_prioridad, reporte_id))
        conexion.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conexion.close()
            return jsonify({"error": "No se encontró el reporte"}), 404

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "¡Reporte modificado exitosamente!"}), 200

    except Exception as e:
        return jsonify({"error": f"Error al modificar el reporte: {str(e)}"}), 500   

# Ruta para EXPORTAR REPORTE EN PDF (Exclusivo para Admin)
@reports_bp.route('/exportar', methods=['GET'])
def exportar_pdf():
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Traemos todos los reportes para el gerente
        cursor.execute("""
            SELECT r.id, r.asunto, r.equipo_id, p.nombre as prioridad, e.nombre as estado 
            FROM reportes r
            LEFT JOIN prioridades p ON r.prioridad_id = p.id
            LEFT JOIN estados e ON r.estado_id = e.id
            ORDER BY r.id DESC
        """)
        reportes = cursor.fetchall()
        
        cursor.close()
        conexion.close()

        # 1. Crear el PDF en memoria (sin guardarlo en el disco duro)
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elementos = []

        # 2. Agregar un Título
        estilos = getSampleStyleSheet()
        titulo = Paragraph("Reporte Gerencial de Soporte Técnico", estilos['Title'])
        elementos.append(titulo)

        # 3. Armar los datos de la tabla (La primera fila son los encabezados)
        datos_tabla = [["Folio", "Asunto", "ID Equipo", "Prioridad", "Estado"]]
        
        for r in reportes:
            # Damos formato al folio (ej. T-014)
            folio = f"T-{r['id']:03d}"
            datos_tabla.append([folio, r['asunto'], r['equipo_id'], r['prioridad'], r['estado']])

        # 4. Crear y darle diseño a la tabla
        tabla = Table(datos_tabla)
        tabla.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0d6efd')), # Azulito chido para el encabezado
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8f9fa')),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elementos.append(tabla)

        # 5. Construir el PDF
        doc.build(elementos)
        buffer.seek(0)

        # 6. Enviarlo directo al navegador para descarga
        return send_file(buffer, as_attachment=True, download_name="Reporte_Gerencial.pdf", mimetype='application/pdf')

    except Exception as e:
        return jsonify({"error": f"Error al generar PDF: {str(e)}"}), 500

# =======================================================
# BITÁCORA: OBTENER COMENTARIOS DE UN REPORTE
# =======================================================
@reports_bp.route('/obtener_comentarios/<int:reporte_id>', methods=['GET'])
def obtener_comentarios(reporte_id):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Traemos el comentario, la fecha y el nombre del autor
        query = """
            SELECT c.comentario, DATE_FORMAT(c.fecha_creacion, '%d/%m/%Y %H:%i') as fecha, u.nombre as autor
            FROM comentarios_reporte c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.reporte_id = %s
            ORDER BY c.fecha_creacion ASC
        """
        cursor.execute(query, (reporte_id,))
        comentarios = cursor.fetchall()
        
        cursor.close()
        conexion.close()
        return jsonify(comentarios), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =======================================================
# BITÁCORA: AGREGAR UN NUEVO COMENTARIO
# =======================================================
@reports_bp.route('/agregar_comentario', methods=['POST'])
def agregar_comentario():
    try:
        datos = request.json
        reporte_id = datos.get('reporte_id')
        comentario = datos.get('comentario')
        
        # Extraemos el ID del usuario del token (igual que en crear_reporte)
        token = request.headers.get('Authorization').split(" ")[1]
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        usuario_id = data['id']

        if not comentario:
            return jsonify({"error": "El comentario no puede estar vacío"}), 400

        conexion = conectar_db()
        cursor = conexion.cursor()
        
        query = "INSERT INTO comentarios_reporte (reporte_id, usuario_id, comentario) VALUES (%s, %s, %s)"
        cursor.execute(query, (reporte_id, usuario_id, comentario))
        
        conexion.commit()
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "Comentario agregado correctamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
