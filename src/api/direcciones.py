from flask import Blueprint, jsonify, request
from api.models import db, Direccion

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
        print(f"Error en /api/direcciones: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500
