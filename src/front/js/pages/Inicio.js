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
        name: '',
        lastName: '',
        company: '',
        location: '',
        email: '',
        password: ''
    });
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal de éxito
    const [error, setError] = useState(''); // Estado para manejar errores
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

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token); // Guardar el token en el almacenamiento local
                navigate('/Mapa'); // Redirige al Mapa
            } else {
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
                'https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api/register',
                registerData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
    
            console.log("Usuario registrado exitosamente:", response.data);
            setError(''); // Limpiar el mensaje de error si el registro es exitoso
            setShowSuccessModal(true); // Mostrar el modal de éxito

            // Ocultar el modal de éxito después de 3 segundos y mostrar el modal de inicio de sesión
            setTimeout(() => {
                setShowSuccessModal(false); // Ocultar el modal de éxito
                setShowRegisterModal(false); // Cerrar el modal de registro
                setShowLoginModal(true); // Mostrar el modal de inicio de sesión
            }, 3000); // 3 segundos
        } catch (error) {
            console.log("Error al registrar el usuario:", error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.error : 'Error interno del servidor'); // Mostrar el mensaje de error
        }
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setShowRegisterModal(false);
            setShowLoginModal(false);
            setShowSuccessModal(false); // Cerrar el modal de éxito
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setShowLoginModal(true); // Mostrar el modal de inicio de sesión
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
                                                type="email"
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
                                                type="email"
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
                                        {error && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                {error}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showSuccessModal && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="successModalLabel" aria-hidden="true" onClick={handleCloseModal}>
                        <div className="modal-dialog" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="card p-4 text-center">
                                    <h3>¡Registro Exitoso!</h3>
                                    <p>Tu cuenta ha sido registrada exitosamente. Ahora puedes iniciar sesión.</p>
                                    <button type="button" className="btn-custom-primary mt-3" onClick={handleSuccessModalClose}>Ir a Iniciar Sesión</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
