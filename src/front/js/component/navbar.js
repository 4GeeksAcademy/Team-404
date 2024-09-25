import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data); // Verifica la estructura de la respuesta
                setUsuarios(Array.isArray(response.data) ? response.data : []); // Asegúrate de que sea un arreglo
            })
            .catch(error => {
                console.error("Error al cargar usuarios:", error);
            });
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="https://refactored-space-couscous-69wrxv6769929wr-3000.app.github.dev/profile">🚚 RutaTrack</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/" aria-current="page">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/sobreNosotros">Nosotros</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link active" to="/Contacto">Contacto</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Usuarios
                            </a>
                            <ul className="dropdown-menu">
                                {usuarios.map((usuario) => (
                                    <li key={usuario.id}>
                                        <a className="dropdown-item" href="#">
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
    );
};
