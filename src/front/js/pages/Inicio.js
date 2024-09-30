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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [loginWarningMessage, setLoginWarningMessage] = useState('');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const navigate = useNavigate();

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

    const handleForgotPasswordChange = (e) => {
        setForgotPasswordEmail(e.target.value);
    };

    // Actualizamos la función handleSubmit para guardar el usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginWarningMessage('');

        try {
            const response = await axios.post(
                'https://effective-space-couscous-v66946px9jwjhxw65-3001.app.github.dev/api/login',
                signupData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                const { token, user } = response.data;  // Suponiendo que el backend devuelva los datos del usuario
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));  // Guardar los datos del usuario

                navigate('/profile');  // Redirigir a la página de perfil
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoginWarningMessage('Usuario no registrado o credenciales incorrectas');
            } else {
                setLoginWarningMessage(error.response ? error.response.data.error : 'Error en el inicio de sesión');
            }
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://effective-space-couscous-v66946px9jwjhxw65-3001.app.github.dev/api/register',
                registerData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 201) {
                setShowRegisterModal(false);
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    setShowLoginModal(true);
                }, 3000);
            }
        } catch (error) {
            setWarningMessage(error.response ? error.response.data.error : 'Error en el registro');
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                'https://effective-space-couscous-v66946px9jwjhxw65-3001.app.github.dev/api/forgot-password',
                { email: forgotPasswordEmail },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            alert('Si el correo electrónico está registrado, recibirás instrucciones para restablecer tu contraseña.');
            setShowForgotPasswordModal(false);
        } catch (error) {
            alert('Error al enviar el correo de recuperación.');
        }
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setShowRegisterModal(false);
            setShowLoginModal(false);
            setShowSuccessModal(false);
            setShowForgotPasswordModal(false); // Cerrar modal de recuperación de contraseña
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setShowLoginModal(true);
    };

    return (
        <div className="text-center">
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
                                            <a href="#" className="text-decoration-none" style={{ color: '#007bff' }} onClick={() => setShowForgotPasswordModal(true)}><u>He olvidado mi contraseña</u></a>
                                        </div>
                                        <button type="submit" className="btn-custom-primary w-100 mb-4">Iniciar sesión</button>
                                        {loginWarningMessage && <p className="warning-message">{loginWarningMessage}</p>}
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
                                        <div className="form-group mb-4">
                                            <label htmlFor="password" style={{ color: 'red' }}>Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                placeholder="Contraseña"
                                                value={registerData.password}
                                                onChange={handleRegisterChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-custom-primary w-100 mb-4">Registrar</button>
                                        {warningMessage && <p className="warning-message">{warningMessage}</p>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showForgotPasswordModal && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="forgotPasswordModalLabel" aria-hidden="true" onClick={handleCloseModal}>
                        <div className="modal-dialog" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="card p-4">
                                    <h3 className="text-center mb-4">Recuperar Contraseña</h3>
                                    <form onSubmit={handleForgotPasswordSubmit}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="forgotPasswordEmail" style={{ color: 'red' }}>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="forgotPasswordEmail"
                                                name="forgotPasswordEmail"
                                                placeholder="E-mail"
                                                value={forgotPasswordEmail}
                                                onChange={handleForgotPasswordChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-custom-primary w-100 mb-4">Enviar instrucciones</button>
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
                                    <h3 className="text-success">¡Registro exitoso!</h3>
                                    <p>Ahora puedes iniciar sesión.</p>
                                    <button type="button" className="btn-custom-primary" onClick={handleSuccessModalClose}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
