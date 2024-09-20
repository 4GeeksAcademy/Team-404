import os
from flask import Blueprint, jsonify, request, current_app
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from api.models import Direccion, db, User, ContactMessage


api = Blueprint('api', __name__)
CORS(api, support_credentials=True)

SECRET_KEY = 'tu_clave_secreta'  # Cambia esto a una clave secreta más segura
RESET_SECRET_KEY = 'tu_clave_secreta_reset'  # Otra clave secreta para la recuperación
MAIL_SENDER = 'your-email@example.com'

mail = Mail()
serializer = URLSafeTimedSerializer(RESET_SECRET_KEY)

# @api.before_app_first_request //ESTO QUEDA COMENTADAO HASTA SOLUCIONAR O CAMBIARLO DE MANERA QUE NO DE FALLO
def configure_mail():
    current_app.config['MAIL_SERVER'] = 'smtp.example.com'  # Cambia esto por tu servidor SMTP
    current_app.config['MAIL_PORT'] = 587  # O 465 para SSL
    current_app.config['MAIL_USERNAME'] = 'your-email@example.com'
    current_app.config['MAIL_PASSWORD'] = 'your-password'
    current_app.config['MAIL_USE_TLS'] = True  # O False si usas SSL
    current_app.config['MAIL_USE_SSL'] = False  # O True si usas SSL
    mail.init_app(current_app)

# Endpoint para decir hola
@api.route('/api/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# Obtener todos los usuarios
@api.route('/api/usuarios', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        print(f"Error en /api/usuarios: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Registrar un nuevo usuario
@api.route('/api/register', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        last_name = data.get('lastName')
        company = data.get('company')
        location = data.get('location')

        if not email or not password:
            return jsonify({"error": "Email y contraseña son requeridos"}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "El usuario ya está registrado"}), 409

        new_user = User(
            email=email,
            password_hash=generate_password_hash(password),
            name=name,
            last_name=last_name,
            company=company,
            location=location
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Usuario registrado exitosamente"}), 201

    except Exception as e:
        print(f"Error en /api/register: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Iniciar sesión (sin cambios)
@api.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email y contraseña son requeridos"}), 400

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, SECRET_KEY, algorithm='HS256')
            return jsonify({'token': token}), 200
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401

    except Exception as e:
        print(f"Error en /api/login: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Obtener datos del usuario autenticado (con JWT)
@api.route('/api/user', methods=['GET'])
def get_user_profile():
    try:
        # Obtener el token JWT de la cabecera Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Token de autorización faltante o inválido"}), 401
        
        token = auth_header.split(" ")[1]
        
        try:
            # Decodificar el token JWT para obtener el ID del usuario
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "El token ha expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        # Consultar el usuario en la base de datos
        user = User.query.get(user_id)
        if user:
            return jsonify(user.serialize()), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404

    except Exception as e:
        print(f"Error en /api/user: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Solicitar recuperación de contraseña
@api.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Email es requerido"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "No se encontró el usuario con ese email"}), 404

        token = serializer.dumps(email, salt='password-reset-salt')
        reset_link = f'{os.getenv("BACKEND_URL")}/reset-password/{token}'

        print (reset_link)

    except Exception as e:
        print(f"Error en /api/forgot-password: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Restablecer contraseña
@api.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        data = request.get_json()
        new_password = data.get('password')

        if not new_password:
            return jsonify({"error": "Contraseña es requerida"}), 400

        try:
            email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
        except SignatureExpired:
            return jsonify({"error": "El enlace de recuperación ha expirado"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "No se encontró el usuario con ese email"}), 404

        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message": "Contraseña restablecida exitosamente"}), 200

    except Exception as e:
        print(f"Error en /api/reset-password: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


@api.route('/api/direcciones', methods=['GET'])
def get_direcciones():
    direcciones = Direccion.query.all()
    return jsonify([direccion.serialize() for direccion in direcciones]), 200

# Define el blueprint para las direcciones
direcciones_bp = Blueprint('direcciones', __name__)

@direcciones_bp.route('/api/direcciones', methods=['POST'])
def add_direccion():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        direccion = data.get('direccion')
        categoria = data.get('categoria')
        contacto = data.get('contacto', '')
        comentarios = data.get('comentarios', '')

        if not nombre or not direccion or not categoria:
            return jsonify({"error": "Nombre, dirección y categoría son requeridos"}), 400

        nueva_direccion = Direccion(
            nombre=nombre,
            direccion=direccion,
            categoria=categoria,
            contacto=contacto,
            comentarios=comentarios
        )
        db.session.add(nueva_direccion)
        db.session.commit()

        return jsonify(nueva_direccion.serialize()), 201

    except Exception as e:
        print(f"Error en /api/direcciones: {e}")  # Esto imprimirá el error en la consola
        return jsonify({"error": str(e)}), 500  # Muestra el error real en la respuesta
# Contact
@api.route('/api/contact', methods=['POST'])
def submit_contact_form():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        email = data.get('email')
        telefono = data.get('telefono')
        mensaje = data.get('mensaje')

        if not nombre or not email or not mensaje:
            return jsonify({"error": "Nombre, email y mensaje son requeridos"}), 400

        new_message = ContactMessage(
            nombre=nombre,
            email=email,
            telefono=telefono,
            mensaje=mensaje
        )
        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Mensaje de contacto recibido exitosamente"}), 201

    except Exception as e:
        print(f"Error en /api/contact: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

