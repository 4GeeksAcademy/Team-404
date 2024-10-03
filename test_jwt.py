import jwt

# Define una clave secreta
SECRET_KEY = 'tu_clave_secreta'

# Crear un token
token = jwt.encode({'user_id': 123}, SECRET_KEY, algorithm='HS256')
print("Token generado:", token)

# Decodificar el token
decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
print("Payload decodificado:", decoded_payload)