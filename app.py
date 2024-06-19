from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder='templates')
app.secret_key = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = 'uploads'

def get_db_connection():
    conn = sqlite3.connect('BD/appjobs_data.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with open('BD/init_db.sql', 'r') as f:
        conn = get_db_connection()
        conn.executescript(f.read())
        conn.close()

def get_vacantes_activas():
    conn = get_db_connection()
    vacantes = conn.execute('SELECT * FROM vacantes WHERE estado = "activa"').fetchall()
    conn.close()
    return vacantes

def get_vacantes_terminadas():
    conn = get_db_connection()
    vacantes = conn.execute('SELECT * FROM vacantes WHERE estado = "terminada"').fetchall()
    conn.close()
    return vacantes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    user_type = request.form['user_type']
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ? AND user_type = ?', (email, password, user_type)).fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user['id']
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
            conn.execute('INSERT INTO users (name, email, password, user_type, representante_legal, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
                         (nombre, correo, clave, user_type, representante_legal, direccion, telefono))
        else:
            conn.execute('INSERT INTO users (name, email, password, user_type, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
                         (nombre, correo, clave, user_type, direccion, telefono))
        conn.commit()
        response = jsonify(success=True, message='Usuario registrado exitosamente', redirect_url=url_for(user_type))
        return response
    except sqlite3.IntegrityError:
        response = jsonify(success=False, message='El correo ya está registrado')
        return response
    except Exception as e:
        response = jsonify(success=False, message=f'Error en el registro: {str(e)}')
        return response
    finally:
        conn.close()
        
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    flash('Sesión cerrada exitosamente', 'info')
    return jsonify(success=True, redirect_url=url_for('index'))

@app.route('/empresa')
def empresa():
    return render_template('empresa.html')

@app.route('/persona')
def persona():
    return render_template('persona.html')

@app.route('/vacantes_activas')
def vacantes_activas():
    vacantes = get_vacantes_activas()
    return jsonify([dict(vacante) for vacante in vacantes])

@app.route('/sugerir_vacantes/<profession>', methods=['GET'])
def sugerir_vacantes(profession):
    conn = get_db_connection()
    vacantes = conn.execute('SELECT * FROM vacantes WHERE profession LIKE ?', ('%' + profession + '%',)).fetchall()
    conn.close()
    return jsonify([dict(vacante) for vacante in vacantes])

@app.route('/vacantes_terminadas', methods=['GET'])
def vacantes_terminadas():
    vacantes = get_vacantes_terminadas()
    return render_template('vacantes_terminadas.html', vacantes=vacantes)

@app.route('/candidatos', methods=['GET'])
def candidatos():
    conn = get_db_connection()
    candidatos = conn.execute('SELECT * FROM candidatos').fetchall()
    conn.close()
    return jsonify([dict(candidato) for candidato in candidatos])

@app.route('/create_hv_modal', methods=['POST'])
def create_hv():
    name = request.form['name']
    surname = request.form['surname']
    id_number = request.form['id_number']
    address = request.form['address']
    email = request.form['email']
    profession = request.form['profession']
    cv_file = request.files['cv_file']

    if cv_file:
        filename = secure_filename(cv_file.filename)
        cv_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO hojas_vida (user_id, name, surname, id_number, address, email, profession, cv_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                         (session['user_id'], name, surname, id_number, address, email, profession, filename))
            conn.commit()
            flash('Hoja de vida creada exitosamente', 'success')
        except Exception as e:
            flash(f'Error al crear hoja de vida: {str(e)}', 'danger')
        finally:
            conn.close()
    else:
        flash('Error al subir el archivo', 'danger')

    return redirect(url_for('persona'))

@app.route('/vacantes', methods=['GET'])
def buscar_vacantes():
    conn = get_db_connection()
    vacantes = conn.execute('SELECT * FROM vacantes').fetchall()
    conn.close()
    return jsonify([dict(vacante) for vacante in vacantes])

@app.route('/get_message', methods=['POST'])
def mensaje():
    message = request.form['message']
    type = request.form['type']
    message_html = render_template('mensaje.html', message=message, type=type)
    return jsonify({'messageHtml': message_html})

if __name__ == '__main__':
    if not os.path.exists('BD/appjobs_data.db'):
        init_db()
    app.run(debug=False)
