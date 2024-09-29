import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Cambia useHistory por useNavigate
import { Context } from '../store/appContext';

export const Navbar = () => {
    const { store, actions } = useContext(Context); // Accediendo al contexto
    const navigate = useNavigate(); // Usando useNavigate para manejar la navegación

    useEffect(() => {
        actions.fetchUserData(); // Cargar datos del usuario al montar el componente
    }, []);

    const handleProfileClick = () => {
        navigate('/profile'); // Navegar a la ruta de perfil
        window.location.reload(); // Recargar la página
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark"
                style={{
                    padding: '0.5rem 1.5rem',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    height: '56px'
                }}>
                <div className="container-fluid">
                    <Link 
                        className="navbar-brand d-flex align-items-center" 
                        to="#" // Cambia el 'to' a '#'
                        style={{ 
                            color: '#000', // Cambiar el color del texto a negro
                            fontSize: '1.2rem', // Aumentar el tamaño de la fuente
                            backgroundColor: '#ffc107', // Fondo amarillo
                            padding: '0.5rem 1rem', // Espaciado interno
                            borderRadius: '5px', // Bordes redondeados
                            fontWeight: 'bold', // Negrita
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', // Sombra
                            transition: 'all 0.3s', // Transición suave
                        }}
                        onClick={handleProfileClick} // Llamar a la función al hacer clic
                    >
                        RutaTrack
                        <span className="ms-2">🚚</span>
                    </Link>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/" aria-current="page" style={{ color: '#ffc107', fontSize: '0.9rem' }}>Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sobreNosotros" style={{ color: '#ffc107', fontSize: '0.9rem' }}>Nosotros</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Contacto" style={{ color: '#ffc107', fontSize: '0.9rem' }}>Contacto</Link>
                            </li>
                            <li className="nav-item">
                                <span 
                                    className="nav-link" 
                                    style={{ 
                                        color: '#000', // Cambiar el color del texto a negro
                                        fontSize: '0.9rem',
                                        backgroundColor: '#ffc107', // Fondo amarillo
                                        padding: '0.5rem 1rem', // Espaciado interno
                                        borderRadius: '5px', // Bordes redondeados
                                        fontWeight: 'bold', // Negrita
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', // Sombra
                                        transition: 'all 0.3s', // Transición suave
                                    }}
                                >
                                    ¡BIENVENIDO {store.userData && store.userData.name ? store.userData.name : 'Invitado'}!
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{ height: '56px' }}></div>
        </>
    );
};
