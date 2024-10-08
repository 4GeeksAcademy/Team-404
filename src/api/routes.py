import os
from sqlite3 import IntegrityError
from flask import Blueprint, abort, jsonify, request, current_app
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from api.models import Direccion, db, User, ContactMessage , Vehiculo, Client, Socio
from flask_jwt_extended import jwt_required, get_jwt_identity

# Habilita CORS para todas las rutas y orígenes
api = Blueprint('api', __name__)
CORS(api)

SECRET_KEY = os.getenv('SECRET_KEY', 'tu_clave_secreta')  # Usa una variable de entorno para mayor seguridad
RESET_SECRET_KEY = os.getenv('RESET_SECRET_KEY', 'tu_clave_secreta_reset')
MAIL_SENDER = os.getenv('MAIL_SENDER', 'your-email@example.com')

mail = Mail()
serializer = URLSafeTimedSerializer(RESET_SECRET_KEY)

# Endpoint para decir hola

@api.route('/api/hello', methods=['GET', 'POST'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend."
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
        print(data)
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
        return jsonify({"error": str(e)}), 500

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
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

# Obtener datos del usuario autenticado (con JWT)
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
      
# Define el blueprint para las direcciones
direcciones_bp = Blueprint('direcciones', __name__)

#OBTENER TODAS LAS DIRECCIONES DEL USUARIO
@direcciones_bp.route('/api/direcciones', methods=['GET'])
def get_direcciones():
    try:
        # Obtener el user_id de los parámetros de la consulta (query string)
        user_id = request.args.get('user_id')

        if not user_id:
            return jsonify({"error": "Falta el parámetro 'user_id'"}), 400

        # Filtrar las direcciones por el user_id
        direcciones = Direccion.query.filter_by(user_id=user_id).all()

        # Serializar las direcciones
        return jsonify([direccion.serialize() for direccion in direcciones]), 200

    except Exception as e:
        print(f"Error en /api/direcciones: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500
    
#AÑADIR NUEVA DIRECCION
@direcciones_bp.route('/api/direcciones', methods=['POST'])
def add_direccion():
    try:
        data = request.get_json()
        print(f"Datos recibidos: {data}")  # Verifica qué datos estás recibiendo

        # Obtener los campos del cuerpo de la solicitud
        nombre = data.get('nombre')
        direccion = data.get('direccion')
        categoria = data.get('categoria')
        contacto = data.get('contacto', '')
        comentarios = data.get('comentarios', '')

        # Obtener el user_id del cuerpo de la solicitud
        user_id = data.get('user_id')

        # Verificar que los campos obligatorios están presentes
        if not nombre or not direccion or not categoria or not user_id:
            return jsonify({"error": "Nombre, dirección, categoría y user_id son requeridos"}), 400

        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Crear nueva instancia de Direccion asociada al usuario
        nueva_direccion = Direccion(
            nombre=nombre,
            direccion=direccion,
            categoria=categoria,
            contacto=contacto,
            comentarios=comentarios,
            user_id=user_id  # Asociar con el usuario
        )

        # Añadir y confirmar la transacción en la base de datos
        db.session.add(nueva_direccion)
        db.session.commit()

        # Retornar la nueva dirección con el método serialize()
        return jsonify(nueva_direccion.serialize()), 201

    except Exception as e:
        print(f"Error en /api/direcciones: {e}")  # Esto imprimirá el error en la consola
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500

# EDITAR DIRECCION
@direcciones_bp.route('/api/direcciones/<int:id>', methods=['PUT'])
def update_direccion(id):
    try:
        data = request.get_json()
        print(f"Datos recibidos para actualizar: {data}")

        # Obtener el user_id del cuerpo de la solicitud (esto debería venir de la autenticación o de los datos enviados)
        user_id = data.get('user_id')

        if not user_id:
            return jsonify({"error": "El user_id es requerido para esta operación"}), 400

        # Buscar la dirección existente
        direccion = Direccion.query.get(id)
        if not direccion:
            return jsonify({"error": "Dirección no encontrada"}), 404

        # Verificar que el user_id coincida con el de la dirección
        if direccion.user_id != user_id:
            return jsonify({"error": "No tienes permiso para editar esta dirección"}), 403

        # Actualizar los campos
        direccion.nombre = data.get('nombre', direccion.nombre)
        direccion.direccion = data.get('direccion', direccion.direccion)
        direccion.categoria = data.get('categoria', direccion.categoria)
        direccion.contacto = data.get('contacto', direccion.contacto)
        direccion.comentarios = data.get('comentarios', direccion.comentarios)

        # Confirmar la transacción en la base de datos
        db.session.commit()

        # Retornar la dirección actualizada
        return jsonify(direccion.serialize()), 200

    except Exception as e:
        print(f"Error en /api/direcciones/{id}: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500
    
#ELIMINAR DIRECCION
@direcciones_bp.route('/api/direcciones/<int:id>', methods=['DELETE'])
def delete_direccion(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')

        if not user_id:
            return jsonify({"error": "El user_id es requerido para esta operación"}), 400

        # Buscar la dirección existente
        direccion = Direccion.query.get(id)
        if not direccion:
            return jsonify({"error": "Dirección no encontrada"}), 404

        # Verificar que el user_id coincida con el de la dirección
        if direccion.user_id != user_id:
            return jsonify({"error": "No tienes permiso para eliminar esta dirección"}), 403

        # Eliminar la dirección de la base de datos
        db.session.delete(direccion)
        db.session.commit()

        # Retornar un mensaje de éxito
        return jsonify({"message": "Dirección eliminada con éxito"}), 200

    except Exception as e:
        print(f"Error en /api/direcciones/{id}: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500

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
        print(f"Error en /api/contact: {e}")  # Imprime el error completo
        return jsonify({"error": "Error interno del servidor"}), 500
    
# Ruta GET para obtener la lista de todos los clientes
@api.route('/api/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    return jsonify([client.to_dict() for client in clients])
# Ruta POST para agregar un nuevo cliente
@api.route('/api/clients', methods=['POST'])
def add_client():
    data = request.get_json()
# Verificación básica de datos
    if not all(key in data for key in ('first_name', 'last_name', 'phone', 'email')):
        abort(400, 'Missing required data')
# Crear el nuevo cliente
    new_client = Client(
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone=data['phone'],
        email=data['email']
    )
    
    db.session.add(new_client)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(400, 'Email already exists')
    
    return jsonify(new_client.to_dict()), 201
# Ruta PUT para actualizar un cliente existente
@api.route('/api/clients/<int:id>', methods=['PUT'])
def update_client(id):
    client = Client.query.get_or_404(id)
    data = request.get_json()

    client.first_name = data.get('first_name', client.first_name)
    client.last_name = data.get('last_name', client.last_name)
    client.phone = data.get('phone', client.phone)
    client.email = data.get('email', client.email)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(400, 'Email already exists')

    return jsonify(client.to_dict())
# Ruta DELETE para eliminar un cliente por ID
@api.route('/api/clients/<int:id>', methods=['DELETE'])
def delete_client(id):
    client = Client.query.get_or_404(id)
    db.session.delete(client)
    db.session.commit()
    
    return '', 204

# Parte "VEHICULOS"
# Metodo "GET"
@api.route('/api/vehiculos', methods=['GET'])
def obtener_vehiculos():
    try:
        vehiculos = Vehiculo.query.all()  # Obtiene todos los vehículos de la base de datos
        return jsonify([{
            'id': vehiculo.id,
            'nombre': vehiculo.nombre,
            'placa': vehiculo.placa,
            'remolque': vehiculo.remolque,
            'costo_km': vehiculo.costo_km,
            'costo_hora': vehiculo.costo_hora,
            'ejes': vehiculo.ejes,
            'peso': vehiculo.peso,
            'combustible': vehiculo.combustible,
            'emision': vehiculo.emision,
            'created_at': vehiculo.created_at.isoformat()  # Formatea la fecha
        } for vehiculo in vehiculos]), 200
    except Exception as e:
        return {"error": str(e)}, 500  # Devuelve un error si ocurre un problema

# Metodo "POST"
@api.route('/api/vehiculos', methods=['POST'])
def crear_vehiculo():
    data = request.json

    # Validación básica de datos
    if not all(key in data for key in ['nombre', 'placa', 'remolque', 'costo_km', 'costo_hora', 'ejes', 'peso', 'combustible', 'emision']):
        return {"error": "Faltan campos requeridos"}, 400  # Bad Request

    # Validación de campos numéricos
    try:
        costo_km = float(data['costo_km']) if data['costo_km'] else None
        costo_hora = float(data['costo_hora']) if data['costo_hora'] else None
        ejes = int(data['ejes']) if data['ejes'] else None
        peso = float(data['peso']) if data['peso'] else None
    except ValueError:
        return {"error": "Los valores de costo_km, costo_hora, ejes y peso deben ser numéricos."}, 400

    nuevo_vehiculo = Vehiculo(
        nombre=data['nombre'],
        placa=data['placa'],
        remolque=data['remolque'],
        costo_km=costo_km,
        costo_hora=costo_hora,
        ejes=ejes,
        peso=peso,
        combustible=data['combustible'],
        emision=data['emision'],
        user_id=data['user_id']
    )
    
    try:
        db.session.add(nuevo_vehiculo)
        db.session.commit()
        return {"message": "Vehículo creado exitosamente"}, 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

#METODO PUT
@api.route('/api/vehiculos/<int:id>', methods=['PUT'])
def editar_vehiculo(id):
    vehiculo = Vehiculo.query.get(id)
    
    if not vehiculo:
        return jsonify({"message": "Vehículo no encontrado"}), 404

    data = request.get_json()

    vehiculo.nombre = data.get('nombre', vehiculo.nombre)
    vehiculo.placa = data.get('placa', vehiculo.placa)
    vehiculo.remolque = data.get('remolque', vehiculo.remolque)
    vehiculo.costo_km = data.get('costo_km', vehiculo.costo_km)
    vehiculo.costo_hora = data.get('costo_hora', vehiculo.costo_hora)
    vehiculo.ejes = data.get('ejes', vehiculo.ejes)
    vehiculo.peso = data.get('peso', vehiculo.peso)
    vehiculo.combustible = data.get('combustible', vehiculo.combustible)
    vehiculo.emision = data.get('emision', vehiculo.emision)

    db.session.commit()
    
    return jsonify({"message": "Vehículo actualizado exitosamente"}), 200

#METODO DELETE
@api.route('/api/vehiculos/<int:id>', methods=['DELETE'])
def delete_vehiculo(id):
    vehiculo = Vehiculo.query.get(id)
    if vehiculo:
        db.session.delete(vehiculo)
        db.session.commit()
        return jsonify({'message': 'Vehículo eliminado exitosamente.'}), 200
    else:
        return jsonify({'error': 'Vehículo no encontrado.'}), 404


#EDITAR LOS DATOS DEL USUARIO DESDE "MI PERFIL"
@api.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Actualiza los campos permitidos
    user.name = data.get('name', user.name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.company = data.get('company', user.company)
    user.location = data.get('location', user.location)

    db.session.commit()

    return jsonify(user.serialize()), 200


# Define el blueprint para los socios
socios_bp = Blueprint('socios', __name__)

# Obtener todos los socios de un usuario
@socios_bp.route('/api/socios', methods=['GET'])    
def obtener_socios():
    try:
        # Obtener el user_id de los parámetros de la consulta (query string)
        user_id = request.args.get('user_id')

        if not user_id:
            return jsonify({"error": "Falta el parámetro 'user_id'"}), 400

        # Filtrar los socios por el user_id
        socios = Socio.query.filter_by(user_id=user_id).all()

        # Serializar los socios
        return jsonify([socio.serialize() for socio in socios]), 200

    except Exception as e:
        print(f"Error en /api/socios: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500

# Crear un nuevo socio
@socios_bp.route('/api/socios', methods=['POST'])
def agregar_socio():
    try:
        # Obtener datos del cuerpo de la petición (request body)
        data = request.get_json()

        # Validar si se enviaron todos los campos necesarios
        nombre = data.get('nombre')
        email = data.get('email')
        tipo_precio = data.get('tipo_precio')
        precio = data.get('precio')
        periodos_espera = data.get('periodos_espera')
        incluir_peajes = data.get('incluir_peajes')
        user_id = data.get('user_id')

        if not user_id or not nombre or not email or not tipo_precio:
            return jsonify({'error': 'Faltan datos'}), 400

        # Crear un nuevo socio
        nuevo_socio = Socio(
            nombre=nombre,
            email=email,
            tipo_precio=tipo_precio,
            precio=precio,
            periodos_espera=periodos_espera,
            incluir_peajes=incluir_peajes,
            user_id=user_id,
        )

        # Agregar el socio a la base de datos
        db.session.add(nuevo_socio)
        db.session.commit()

        # Devolver respuesta
        return jsonify({'mensaje': 'Socio agregado exitosamente', 'socio': nuevo_socio.serialize()}), 201

    except Exception as e:
        print(f"Error en /api/socios: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500

# Editar un socio
@socios_bp.route('/api/socios/<email>', methods=['PUT'])
def editar_socio(email):
    try:
        # Buscar el socio por su email
        socio = Socio.query.filter_by(email=email).first()

        if not socio:
            return jsonify({'error': 'Socio no encontrado'}), 404

        # Obtener datos del cuerpo de la petición
        data = request.get_json()

        # Actualizar los datos del socio
        socio.nombre = data.get('nombre', socio.nombre)
        socio.tipo_precio = data.get('tipo_precio', socio.tipo_precio)
        socio.precio = data.get('precio', socio.precio)
        socio.periodos_espera = data.get('periodos_espera', socio.periodos_espera)
        socio.incluir_peajes = data.get('incluir_peajes', socio.incluir_peajes)
        socio.user_id = data.get('user_id', socio.user_id)
        

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({'mensaje': 'Socio actualizado exitosamente', 'socio': socio.serialize()}), 200

    except Exception as e:
        print(f"Error en /api/socios/<email>: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500

# Eliminar un socio
@socios_bp.route('/api/socios/<email>', methods=['DELETE'])
def eliminar_socio(email):
    try:
        # Buscar el socio por su email
        socio = Socio.query.filter_by(email=email).first()

        if not socio:
            return jsonify({'error': 'Socio no encontrado'}), 404

        # Eliminar el socio de la base de datos
        db.session.delete(socio)
        db.session.commit()

        return jsonify({'mensaje': 'Socio eliminado exitosamente'}), 200

    except Exception as e:
        print(f"Error en /api/socios/<email>: {e}")
        return jsonify({"error": f"Ocurrió un error en el servidor: {str(e)}"}), 500

