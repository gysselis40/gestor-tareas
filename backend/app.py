from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import psycopg2

app = Flask(__name__)

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

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
        (data['username'], data['email'], data['password'])
    )
    conn.commit()
    return jsonify({"message": "Usuario creado exitosamente"})

# Endpoint para crear tareas en MongoDB
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    mongo.db.tasks.insert_one(data)
    return jsonify({"message": "Tarea creada exitosamente"})

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = mongo.db.tasks.find()
    result = []
    for task in tasks:
        result.append({
            'title': task['title'],
            'description': task['description'],
            'status': task['status']
        })
    return jsonify(result)

