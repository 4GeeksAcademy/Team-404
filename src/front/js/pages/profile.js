import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCar, faUserTie, faUsers, faRoute } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (err) {
            setError("No se pudieron cargar los datos del usuario.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="profile-container">
            {/* Left side - Control Panel */}
            <div className="control-panel">
                <h2>Panel de Control</h2>
                <ul>
                    <li>
                        <Link to="/planner">
                            <FontAwesomeIcon icon={faRoute} /> Planner
                        </Link>
                    </li>
                    <li>
                        <Link to="/direcciones">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Mis Direcciones
                        </Link>
                    </li>
                    <li>
                        <Link to="/vehiculos">
                            <FontAwesomeIcon icon={faCar} /> Vehículos y Conductores
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
            </div>

            {/* Right side - User Profile */}
            <div className="profile-content">
                <h1 className="profile-title">Perfil del Usuario</h1>
                {loading ? (
                    <div className="profile-loading">
                        <div className="loading-circle"></div>
                    </div>
                ) : error ? (
                    <div className="profile-error">
                        <p>{error}</p>
                    </div>
                ) : user ? (
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <FontAwesomeIcon icon={faUserTie} size="3x" />
                            </div>
                            <h2 className="profile-name">{user.name} {user.last_name}</h2>
                        </div>
                        <div className="profile-body">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Empresa:</strong> {user.company || 'No especificada'}</p>
                            <p><strong>Ubicación:</strong> {user.location || 'No especificada'}</p>
                            <p><strong>Cuenta creada en:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ) : (
                    <div className="profile-no-data">
                        <p>No se encontraron datos del usuario.</p>
                    </div>
                )}
                <Link to="/">
                    <button className="btn btn-primary">Volver a Inicio</button>
                </Link>
            </div>
        </div>
    );
};

export default Profile;
