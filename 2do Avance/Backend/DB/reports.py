
from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Configura aquí tus credenciales de phpMyAdmin
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'tikets'
}

@app.route('/api/reportes', methods=['POST'])
def guardar_reporte():
    datos = request.json
    try:
        conexion = mysql.connector.connect(**db_config)
        cursor = conexion.cursor()
        sql = "INSERT INTO reportes (evidencia, comentarios_tecnico) VALUES (%s, %s)"
        valores = (datos['evidencia'], datos['comentarios'])
        cursor.execute(sql, valores)
        conexion.commit()
        return jsonify({"status": "éxito", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conexion.is_connected():
            cursor.close()
            conexion.close()

if __name__ == '__main__':
    app.run(debug=True)