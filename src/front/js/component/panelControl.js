import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faHome, faTruck, faUserTie, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const ControlPanel = ({ onLogout }) => {
    return (
        <div className="profile-control-panel">
            <h1>Panel de Control</h1>
            <ul>
                <li>
                    <Link to="/Mapa">
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
            <button onClick={onLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
        </div>
    );
};

export default ControlPanel;