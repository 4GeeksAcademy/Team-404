import React, { useContext } from 'react'; // Asegúrate de importar useContext
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faHome, faTruck, faUserTie, faUsers, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../styles/panelcontrol.css'; // Archivo CSS actualizado
import { AuthContext } from "./AuthContext";

const ControlPanel = () => {
    const { logout } = useContext(AuthContext); // Asegúrate de usar useContext correctamente
    const navigate = useNavigate(); // Crea una instancia de useNavigate

    const handleLogout = async (event) => {
        event.preventDefault();
        await logout();
        navigate("/");
    };

    const isHomePage = location.pathname === "/";

    return (
        <div className="profile-control-panel">
            <h1>Panel de Control</h1>
            <ul>
                <li>
                    <Link
                        to="/Mapa">
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
            <Link to="/profile">
                <button id="mi-perfil-button">
                    <FontAwesomeIcon icon={faUser} /> Mi Perfil
                </button>
            </Link>
            <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
        </div>
    );
};

export default ControlPanel;

