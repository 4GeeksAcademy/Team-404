import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faHome, faTruck, faUserTie, faUsers, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../styles/panelcontrol.css'; // Archivo CSS actualizado


const ControlPanel = ({ onLogout }) => {

    const handleLogout = () => {
        // Eliminar el token de autenticación de localStorage
        localStorage.removeItem('authToken');

        // Redirigir a la página de inicio de sesión usando la variable global del .env
        window.location.href = process.env.REACT_APP_BACKEND_URL;
    };

    const handleClick = () => {
        // Cambiar la ubicación y recargar la página
        window.location.href = '/profile';
    };

    return (
        <div className="profile-control-panel">
            <h1>Panel de Control</h1>
            <ul>
                <li>
                    <Link
                        to="/Mapa"
                        onClick={() => {
                            window.location.href = "/Mapa";
                        }}
                    >
                        <FontAwesomeIcon icon={faMapMarkedAlt} /> Planner (Ruta)
                    </Link>
                </li>
                <li>
                    <Link to="/direcciones">
                        <FontAwesomeIcon icon={faHome} /> Mis Direcciones
                    </Link>
                </li>
                <li>
                    <Link to="/flota">
                        <FontAwesomeIcon icon={faTruck} /> Vehículos
                    </Link>
                </li>
                <li>
                    <Link to="/autonomos">
                        <FontAwesomeIcon icon={faUserTie} /> Autónomos
                    </Link>
                </li>
                <li>
                    <Link to="/clientes">
                        <FontAwesomeIcon icon={faUsers} /> Clientes
                    </Link>
                </li>
            </ul>
            <button id="mi-perfil-button" onClick={handleClick}>
                <FontAwesomeIcon icon={faUser} /> Mi Perfil
            </button>
            <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
        </div>
    );
};

export default ControlPanel;
