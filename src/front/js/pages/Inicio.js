import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/home.css";
import principal from "../../img/ImgPrincipal.png";
import fotocamion from "../../img/fotocamion.png";
import fotoruta from "../../img/fotoruta.png";

export const Inicio = () => {
	const [signupData, setSignUpData] = useState({
		email: "",
		password: ""
	});
	const [registerData, setRegisterData] = useState({
		name: "",
		lastName: "",
		company: "",
		location: ""
	});
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const navigate = useNavigate(); // hook para la redirección

	const handleChange = (e) => {
		setSignUpData({
			...signupData,
			[e.target.name]: e.target.value
		});
	};

	const handleRegisterChange = (e) => {
		setRegisterData({
			...registerData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				'https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api',
				signupData,
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			console.log("Respuesta del servidor:", response.data);

			// Si la autenticación es exitosa, redirigir a otra página
			if (response.status === 201) {
				navigate('/Mapa'); // Redirige al Mapa
			} else {
				// Manejar caso de error en autenticación
				console.log("Usuario no registrado o credenciales incorrectas");
			}
		} catch (error) {
			console.log("Ha habido un error:", error.response ? error.response.data : error.message);
		}
	};

	const handleRegisterSubmit = async (e) => {
		e.preventDefault();
		// Lógica para registrar al nuevo usuario
		console.log("Datos de registro:", registerData);
		// Cerrar modal después del registro
		setShowRegisterModal(false);
	};

	return (
		<div className="text-center mt-5">
			<div className="divprincipal">
				<div className="cardDescription">
					<div className="card-body">
						<h5 className="card-title">RUTA TRACK</h5>
						<p className="card-text">
							Ruta Track es una innovadora aplicación web y móvil diseñada para gestionar y optimizar rutas de transporte en tiempo real. Los usuarios pueden planificar trayectos, calcular costos y tiempos estimados, y recibir actualizaciones en vivo sobre el progreso del viaje. Con funcionalidades como visualización de rutas, seguimiento en tiempo real, alertas automáticas y reportes detallados, Ruta Track mejora la transparencia, la eficiencia operativa y la toma de decisiones basadas en datos, beneficiando tanto a clientes como a proveedores.
						</p>
					</div>
				</div>
				<div>
					<button type="button" className="btn btn-danger m-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
						Inicia Sesion
					</button>
					<button type="button" className="btn btn-outline-secondary m-3" onClick={() => setShowRegisterModal(true)}>
						Crear cuenta
					</button>
					<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
						<div className="modal-dialog" style={{ maxWidth: '250px' }}>
							<div className="modal-content">
								<div className="card p-4" style={{ maxWidth: '400px', border: '1px solid #ccc' }}>
									<h3 className="text-center mb-4">Iniciar sesión</h3>
									<form onSubmit={handleSubmit}>
										<div className="form-group mb-3">
											<label htmlFor="email" style={{ color: 'red' }}>Email</label>
											<input
												type="text"
												className="form-control"
												id="email"
												name="email"
												placeholder="E-mail"
												value={signupData.email}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="form-group mb-3">
											<label htmlFor="password" style={{ color: 'red' }}>Password</label>
											<input
												type="password"
												className="form-control"
												id="password"
												name="password"
												placeholder="Contraseña"
												value={signupData.password}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="form-group text-right mb-4">
											<a href="#" className="text-decoration-none" style={{ color: '#007bff' }}><u>He olvidado mi contraseña</u></a>
										</div>
										<button type="submit" className="btn btn-danger w-100 mb-4" style={{ backgroundColor: '#ff0055' }}>Iniciar sesión</button>
									</form>
								</div>
							</div>
						</div>
					</div>
					{showRegisterModal && (
						<div className="modal fade show" style={{ display: 'block' }} aria-labelledby="registerModalLabel" aria-hidden="true" onClick={() => setShowRegisterModal(false)}>
							<div className="modal-dialog" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
								<div className="modal-content">
									<div className="card p-4">
										<h3 className="text-center mb-4">Crear cuenta</h3>
										<form onSubmit={handleRegisterSubmit}>
											<div className="form-group mb-3">
												<label htmlFor="name" style={{ color: 'red' }}>Nombre</label>
												<input
													type="text"
													className="form-control"
													id="name"
													name="name"
													placeholder="Nombre"
													value={registerData.name}
													onChange={handleRegisterChange}
													required
												/>
											</div>
											<div className="form-group mb-3">
												<label htmlFor="lastName" style={{ color: 'red' }}>Apellido</label>
												<input
													type="text"
													className="form-control"
													id="lastName"
													name="lastName"
													placeholder="Apellido"
													value={registerData.lastName}
													onChange={handleRegisterChange}
													required
												/>
											</div>
											<div className="form-group mb-3">
												<label htmlFor="company" style={{ color: 'red' }}>Empresa</label>
												<input
													type="text"
													className="form-control"
													id="company"
													name="company"
													placeholder="Empresa"
													value={registerData.company}
													onChange={handleRegisterChange}
													required
												/>
											</div>
											<div className="form-group mb-3">
												<label htmlFor="location" style={{ color: 'red' }}>Población</label>
												<input
													type="text"
													className="form-control"
													id="location"
													name="location"
													placeholder="Población"
													value={registerData.location}
													onChange={handleRegisterChange}
													required
												/>
											</div>
											<button type="submit" className="btn btn-danger w-100 mb-4" style={{ backgroundColor: '#ff0055' }}>Registrar</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<div id="carouselExampleRide" className="carousel slide w-50 mx-auto" data-bs-ride="carousel">
					<div className="carousel-inner">
						<div className="carousel-item active">
							<img src={principal} className="d-block w-100" alt="Imagen principal" />
						</div>
						<div className="carousel-item">
							<img src={fotocamion} className="d-block w-100" alt="Foto camión" />
							</div>
						<div className="carousel-item">
							<img src={fotoruta} className="d-block w-100" alt="Foto ruta" />
						</div>
					</div>
					<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Anterior</span>
					</button>
					<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Siguiente</span>
					</button>
				</div>
			</div>
		</div>
	);
};
