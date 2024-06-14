from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
import os

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
        if user_type == 'empresa':
            return redirect(url_for('empresa'))
        else:
            return redirect(url_for('persona'))
    else:
        flash('Usuario o contraseña incorrecta', 'danger')
        return redirect(url_for('index'))

@app.route('/registro', methods=['POST'])
def registro():
    nombre = request.form['name']
    tipo_usuario = request.form['tipo_usuario']
    correo = request.form['email']
    clave = request.form['password']
    confirmar_clave = request.form['confirm_password']
    representante_legal = request.form.get('representante_legal', '')
    direccion = request.form['direccion']
    telefono = request.form['telefono']

    if clave != confirmar_clave:
        flash('Las contraseñas no coinciden', 'danger')
        return redirect(url_for('index'))

    conn = get_db_connection()
    try:
        if tipo_usuario == 'empresa':
            conn.execute('INSERT INTO users (name, email, password, type, representante_legal) VALUES (?, ?, ?, ?, ?)',
                         (nombre, correo, clave, tipo_usuario, representante_legal))
        else:
            conn.execute('INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
                         (nombre, correo, clave, tipo_usuario))
        conn.commit()
        flash('Registro exitoso. ¡Bienvenido!', 'success')
    except Exception as e:
        flash(f'Error en el registro: {str(e)}', 'danger')
    finally:
        conn.close()

    return redirect(url_for('index'))

@app.route('/empresa')
def empresa():
    return render_template('empresa.html')

@app.route('/persona')
def persona():
    return render_template('persona.html')

# Inicialización de la base de datos al iniciar la aplicación
if __name__ == '__main__':
    if os.path.exists('BD/appjobs_data.db'):
        os.remove('BD/appjobs_data.db')
    init_db()  # Inicializar la base de datos
    app.run(debug=True)
