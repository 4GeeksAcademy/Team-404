from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=True)
    company = db.Column(db.String(150), nullable=True)
    location = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relación uno a muchos con Direccion
    direcciones = db.relationship('Direccion', backref='user', lazy=True)

    def __init__(self, email, password_hash, name=None, last_name=None, company=None, location=None):
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.last_name = last_name
        self.company = company
        self.location = location

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'last_name': self.last_name,
            'company': self.company,
            'location': self.location,
            'created_at': self.created_at,
            'direcciones': [direccion.serialize() for direccion in self.direcciones],
            'vehiculos': [vehiculo.serialize() for vehiculo in self.vehiculos],
            'conductores': [conductor.to_dict() for conductor in self.conductores]
        }

class Direccion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    contacto = db.Column(db.String(100), nullable=True)
    comentarios = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Clave foránea

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'direccion': self.direccion,
            'categoria': self.categoria,
            'contacto': self.contacto,
            'comentarios': self.comentarios,
            'user_id': self.user_id
        }
class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefono = db.Column(db.String(20))
    mensaje = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, nombre, email, mensaje, telefono=None):
        self.nombre = nombre
        self.email = email
        self.telefono = telefono
        self.mensaje = mensaje

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "telefono": self.telefono,
            "mensaje": self.mensaje,
            "created_at": self.created_at
        }

class Vehiculo(db.Model):
    __tablename__ = 'vehiculos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    placa = db.Column(db.String(50), unique=True, nullable=False)
    remolque = db.Column(db.String(100), nullable=True)
    costo_km = db.Column(db.Float, nullable=True)
    costo_hora = db.Column(db.Float, nullable=True)
    ejes = db.Column(db.Integer, nullable=True)
    peso = db.Column(db.Float, nullable=True)
    combustible = db.Column(db.String(50), nullable=True)
    emision = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con el modelo User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    usuario = db.relationship('User', backref='vehiculos')

    def __repr__(self):
        return f'<Vehiculo {self.nombre} - {self.placa}>'

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'placa': self.placa,
            'remolque': self.remolque,
            'costo_km': self.costo_km,
            'costo_hora': self.costo_hora,
            'ejes': self.ejes,
            'peso': self.peso,
            'combustible': self.combustible,
            'emision': self.emision,
            'created_at': self.created_at.isoformat(),  # Formato ISO
            'user_id': self.user_id
        }


class Conductor(db.Model):
    __tablename__ = 'conductores'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    poblacion = db.Column(db.String(100), nullable=True)
    ciudad = db.Column(db.String(100), nullable=True)
    sueldo = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Clave foránea que establece la relación con User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Opcionalmente puedes hacer que no sea nulo si cada conductor debe tener un usuario
    user = db.relationship('User', backref='conductores')  # Relación inversa para acceder a los conductores desde el usuario

    def __repr__(self):
        return f'<Conductor {self.nombre} {self.apellidos}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellidos': self.apellidos,
            'fecha_nacimiento': self.fecha_nacimiento.strftime('%Y-%m-%d'),
            'poblacion': self.poblacion,
            'ciudad': self.ciudad,
            'sueldo': self.sueldo,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'user_id': self.user_id,  # Incluir user_id en la representación del dict
        }