import React, { useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from '../store/appContext';

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        actions.fetchUserData();
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
        window.location.reload();
    };

    const isHomePage = location.pathname === "/";

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
                    {isHomePage ? (
                        <span 
                            className="navbar-brand d-flex align-items-center" 
                            style={{ 
                                color: '#000', 
                                fontSize: '1.2rem', 
                                backgroundColor: '#ffc107', 
                                padding: '0.5rem 1rem', 
                                borderRadius: '5px', 
                                fontWeight: 'bold', 
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', 
                                transition: 'all 0.3s', 
                            }}
                        >
                            RutaTrack
                            <span className="ms-2">🚚</span>
                        </span>
                    ) : (
                        <Link 
                            className="navbar-brand d-flex align-items-center" 
                            to="#" 
                            style={{ 
                                color: '#000', 
                                fontSize: '1.2rem', 
                                backgroundColor: '#ffc107', 
                                padding: '0.5rem 1rem', 
                                borderRadius: '5px', 
                                fontWeight: 'bold', 
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', 
                                transition: 'all 0.3s', 
                            }}
                            onClick={handleProfileClick}
                        >
                            RutaTrack
                            <span className="ms-2">🚚</span>
                        </Link>
                    )}
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
                                        color: '#000',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#ffc107',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '5px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', 
                                        transition: 'all 0.3s', 
                                    }}
                                >
                                    {isHomePage ? "¡Bienvenido!" : `Hola ${store.userData && store.userData.name ? store.userData.name : 'Invitado'}!`}
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
