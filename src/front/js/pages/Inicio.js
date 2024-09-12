import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/home.css";

export const Inicio = () => {
    const [signupData, setSignUpData] = useState({
        email: "",
        password: ""
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        lastName: "",
        company: "",
        location: "",
        email: "",
        password: ""
    });
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate(); // Hook para la redirección

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
                'https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api/login', // Endpoint para inicio de sesión
                signupData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("Respuesta del servidor:", response.data);

            // Si la autenticación es exitosa, redirigir a otra página
            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token); // Guardar el token en el almacenamiento local
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

        try {
            const response = await axios.post(
                'https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api/register', // Endpoint para registro de usuarios
                registerData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("Usuario registrado exitosamente:", response.data);

            // Cerrar modal después del registro
            setShowRegisterModal(false);

            // Mostrar el modal de inicio de sesión si lo deseas
            setShowLoginModal(true);
        } catch (error) {
            console.log("Error al registrar el usuario:", error.response ? error.response.data : error.message);
        }
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setShowRegisterModal(false);
            setShowLoginModal(false);
        }
    };

    return (
        <div className="text-center mt-5">
            <div className="divprincipal">
                <div className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Ruta Track</h1>
                        <p className="hero-slogan">Optimiza tus rutas con inteligencia</p>
                        <p className="hero-text">
                            Ruta Track es una innovadora aplicación web y móvil diseñada para gestionar y optimizar rutas de transporte en tiempo real. Los usuarios pueden planificar trayectos, calcular costos y tiempos estimados, y recibir actualizaciones en vivo sobre el progreso del viaje.
                        </p>
                        <p className="hero-phrase">
                            "Transparencia y eficiencia en cada kilómetro"
                        </p>
                        <div className="button-container">
                            <button type="button" className="btn-custom-primary" onClick={() => setShowLoginModal(true)}>
                                Inicia Sesión
                            </button>
                            <button type="button" className="btn-custom-secondary" onClick={() => setShowRegisterModal(true)}>
                                Crear cuenta
                            </button>
                        </div>
                    </div>
                </div>
                {showLoginModal && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="loginModalLabel" aria-hidden="true" onClick={handleCloseModal}>
                        <div className="modal-dialog" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="card p-4">
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
                                        <button type="submit" className="btn-custom-primary w-100 mb-4">Iniciar sesión</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showRegisterModal && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="registerModalLabel" aria-hidden="true" onClick={handleCloseModal}>
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
                                        <div className="form-group mb-3">
                                            <label htmlFor="registerEmail" style={{ color: 'red' }}>Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="registerEmail"
                                                name="email"
                                                placeholder="E-mail"
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="registerPassword" style={{ color: 'red' }}>Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="registerPassword"
                                                name="password"
                                                placeholder="Contraseña"
                                                value={registerData.password}
                                                onChange={handleRegisterChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-custom-secondary w-100 mb-4">Registrar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
