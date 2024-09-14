import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Función para obtener los datos del usuario autenticado
	const fetchUserData = async () => {
		try {
			const token = localStorage.getItem("token");  // Asumiendo que el token JWT esté en localStorage
			const response = await axios.get("/api/user", {
				headers: {
					Authorization: `Bearer ${token}`  // Incluyendo el token JWT en las cabeceras
				}
			});
			setUser(response.data);  // Guardar los datos del usuario en el estado
		} catch (err) {
			setError("No se pudieron cargar los datos del usuario.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();  // Llama a la función para obtener los datos al montar el componente
	}, []);

	return (
		<div className="container">
			<h1>Perfil del Usuario</h1>
			{loading ? (
				<p>Cargando datos del usuario...</p>
			) : error ? (
				<p>{error}</p>
			) : user ? (
				<div>
					<p><strong>Nombre:</strong> {user.name}</p>
					<p><strong>Apellido:</strong> {user.last_name}</p>
					<p><strong>Email:</strong> {user.email}</p>
					<p><strong>Empresa:</strong> {user.company || 'No especificada'}</p>
					<p><strong>Ubicación:</strong> {user.location || 'No especificada'}</p>
					<p><strong>Cuenta creada en:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
				</div>
			) : (
				<p>No se encontraron datos del usuario.</p>
			)}
			<Link to="/">
				<button className="btn btn-primary">Volver a Inicio</button>
			</Link>
		</div>
	);
};

export default Profile;
