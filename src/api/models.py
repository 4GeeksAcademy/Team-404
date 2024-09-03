from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Asegúrate de que este campo exista

    def __init__(self, email, password_hash):
        self.email = email
        self.password_hash = password_hash

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email
        }