from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import psycopg2
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Permitir solicitudes desde otros orígenes

# Configuración de MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/gestor_tareas"
mongo = PyMongo(app)

# Configuración PostgreSQL
conn = psycopg2.connect(
    dbname="gestor_usuarios",
    user="postgres",
    password="Pruebas10",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Ruta principal (raíz) para verificar el funcionamiento del servidor
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "¡El servidor está funcionando correctamente!"})

# Endpoint para crear usuarios en PostgreSQL
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
        (data['username'], data['email'], data['password'])
    )
    conn.commit()
    return jsonify({"message": "Usuario creado exitosamente"})

# Endpoint combinado para manejar tareas en MongoDB (GET y POST)
@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    if request.method == 'GET':
        # Obtener tareas de MongoDB
        tasks = mongo.db.tasks.find()
        result = []
        for task in tasks:
            result.append({
                'id': str(task['_id']),  # Convertir ObjectId a string para el JSON
                'title': task.get('title', 'Sin título'),
                'description': task.get('description', 'Sin descripción'),
                'status': task.get('status', 'Sin estado')
            })
        return jsonify(result)

    if request.method == 'POST':
        # Crear nueva tarea en MongoDB
        data = request.json
        mongo.db.tasks.insert_one(data)
        return jsonify({"message": "Tarea creada exitosamente"})

# Endpoint para actualizar tareas en MongoDB
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    mongo.db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": data})
    return jsonify({"message": "Tarea actualizada exitosamente"})

# Endpoint para eliminar tareas en MongoDB
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    mongo.db.tasks.delete_one({"_id": ObjectId(task_id)})
    return jsonify({"message": "Tarea eliminada exitosamente"})

# Ejecutar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
