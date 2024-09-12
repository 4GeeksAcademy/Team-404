from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Asegúrate de que este campo exista
    name = db.Column(db.String(50), nullable=True)  # Ejemplo de campo adicional
    last_name = db.Column(db.String(50), nullable=True)  # Ejemplo de campo adicional
    company = db.Column(db.String(100), nullable=True)  # Ejemplo de campo adicional
    location = db.Column(db.String(100), nullable=True)  # Ejemplo de campo adicional
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())  # Ejemplo de campo adicional

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
            'created_at': self.created_at
        }
