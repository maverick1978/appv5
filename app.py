from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os

def check_db_structure():
    conn = sqlite3.connect('BD/appjobs_data.db')
    cursor = conn.cursor()
    
    # Verifica si la tabla vacantes existe
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='vacantes';")
    table_exists = cursor.fetchone()
    
    if table_exists:
        print("La tabla 'vacantes' existe.")
    else:
        print("La tabla 'vacantes' no existe.")
    
    conn.close()

check_db_structure()

app = Flask(__name__, template_folder='templates')
app.secret_key = 'supersecretkey'

# Conexión a la base de datos
def get_db_connection():
    conn = sqlite3.connect('BD/appjobs_data.db')
    conn.row_factory = sqlite3.Row
    return conn

# Función para inicializar la base de datos
def init_db():
    with open('BD/init_db.sql', 'r') as f:
        conn = get_db_connection()
        conn.executescript(f.read())
        conn.close()

# Función para obtener vacantes activas
def get_vacantes_activas():
    conn = get_db_connection()
    try:
        vacantes = conn.execute('SELECT * FROM vacantes WHERE estado = "activa"').fetchall()
    except sqlite3.OperationalError as e:
        print(f"Error en la consulta SQL: {e}")
        vacantes = []
    finally:
        conn.close()
    return vacantes

# Función para obtener vacantes terminadas
def get_vacantes_terminadas():
    conn = get_db_connection()
    vacantes = conn.execute('SELECT * FROM vacantes WHERE estado = "terminada"').fetchall()
    conn.close()
    return vacantes

# Rutas principales
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    user_type = request.form['user_type']
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ? AND type = ?', (email, password, user_type)).fetchone()
    conn.close()
    
    if user:
        flash(f'Bienvenido {user["name"]}!', 'success')
        return jsonify(success=True, name=user["name"], redirect_url=url_for(user_type))
    else:
        return jsonify(success=False, message='Usuario o contraseña incorrecta')

@app.route('/registro', methods=['POST'])
def registro():
    nombre = request.form['name']
    user_type = request.form['user_type']
    correo = request.form['email']
    clave = request.form['password']
    confirmar_clave = request.form['confirm_password']
    representante_legal = request.form.get('representante_legal', '')
    direccion = request.form['direccion']
    telefono = request.form['telefono']

    if clave != confirmar_clave:
        return jsonify(success=False, message='Las contraseñas no coinciden')
    
    conn = get_db_connection()
    try:
        if user_type == 'empresa':
            conn.execute('INSERT INTO users (name, email, password, type, representante_legal, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
                         (nombre, correo, clave, user_type, representante_legal, direccion, telefono))
        else:
            conn.execute('INSERT INTO users (name, email, password, type, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
                         (nombre, correo, clave, user_type, direccion, telefono))
        conn.commit()
        return jsonify(success=True, message='Usuario registrado exitosamente', redirect_url=url_for(user_type))
    except sqlite3.IntegrityError:
        return jsonify(success=False, message='El correo ya está registrado')
    except Exception as e:
        return jsonify(success=False, message=f'Error en el registro: {str(e)}')
    finally:
        conn.close()

# Rutas para la gestión de empresa
@app.route('/empresa')
def empresa():
    return render_template('empresa.html')

@app.route('/persona')
def persona():
    return render_template('persona.html')

# Ruta para vacantes activas
@app.route('/vacantes_activas')
def vacantes_activas():
    vacantes = get_vacantes_activas()
    return jsonify([dict(vacante) for vacante in vacantes])

# Ruta para vacantes terminadas
@app.route('/vacantes_terminadas')
def vacantes_terminadas():
    vacantes = get_vacantes_terminadas()
    return render_template('vacantes_terminadas.html', vacantes=vacantes)

@app.route('/candidatos')
def candidatos():
    conn = get_db_connection()
    candidatos = conn.execute('SELECT * FROM candidatos').fetchall()
    conn.close()
    return jsonify([dict(candidato) for candidato in candidatos])


# Inicialización de la base de datos al iniciar la aplicación
if __name__ == '__main__':
    if not os.path.exists('BD/appjobs_data.db'):
        init_db()
    app.run(debug=True)
