import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navbarHeight = '56px'; // Altura estimada del navbar

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setUsuarios(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error al cargar usuarios:", error);
            });
    }, []);

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
                    height: navbarHeight
                }}>
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center" to="/profile" style={{ color: '#ffc107', fontSize: '1.2rem' }}>
                        RutaTrack
                        <span className="ms-2">🚚</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
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
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#ffc107', fontSize: '0.9rem' }}>
                                    Usuarios
                                </a>
                                <ul className="dropdown-menu">
                                    {usuarios.map((usuario) => (
                                        <li key={usuario.id}>
                                            <a className="dropdown-item" href="#" style={{ fontSize: '0.8rem' }}>
                                                {usuario.name} {usuario.last_name} - {usuario.company} ({usuario.location})
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{ height: navbarHeight }}></div>
        </>
    );
};