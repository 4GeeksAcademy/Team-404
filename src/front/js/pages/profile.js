// src/pages/Profile.js
import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faHome, faTruck, faUserTie, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Profile.css'; // Archivo CSS actualizado
import { Context } from '../store/appContext';
import loaderInstance from "../component/Loader"; // Importa el Loader singleton

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Función para obtener los datos del usuario autenticado
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.BACKEND_URL}/api/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (err) {
            setError("No se pudieron cargar los datos del usuario.");
        } finally {
            setLoading(false);
        }
    };

    // Inicializa el mapa usando el loader singleton
    const initializeMap = () => {
        loaderInstance.load().then(() => {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
            setMap(newMap);
        }).catch(e => {
            console.error("Error al cargar la API de Google Maps: ", e);
        });
    };

    const handleLogout = () => {
        // Eliminar el token de autenticación de localStorage
        localStorage.removeItem('authToken');

        // Redirigir a la página de inicio de sesión usando la variable global del .env
        window.location.href = process.env.REACT_APP_BACKEND_URL;
    };

    const searchLocation = async (location) => {
        if (!map || !location) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK') {
                const { lat, lng } = results[0].geometry.location;
                map.setCenter({ lat: lat(), lng: lng() });
                new window.google.maps.Marker({
                    position: { lat: lat(), lng: lng() },
                    map: map,
                });
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Iniciar el estado de carga
                setLoading(true);

                // Llamar a la función de Flux para obtener los datos del usuario
                await actions.fetchUserData();

                // Actualizar el estado 'user' cuando los datos se obtienen
                if (store.userData) {
                    setUser(store.userData);
                    console.log(store.userData);
                }
            } catch (error) {
                // Manejar el error
                console.error("Error al obtener los datos del usuario:", error);
                setError(error);  // Opcionalmente, puedes usar setError para manejar los errores
            } finally {
                // Detener el estado de carga al finalizar
                setLoading(false);
            }
        };

        fetchData();
    }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

    useEffect(() => {
        initializeMap();  // Inicializa el mapa usando el Loader singleton
    }, []);

    useEffect(() => {
        if (user && user.location) {
            searchLocation(user.location);
        }
    }, [user, map]);

    return (
        <div className="profile-page-container">
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
                <Link>
                    <button onClick={handleLogout} className="logout-button">
                        <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                    </button>
                </Link>

            </div>

            <div className="profile-section">
                <h1>Perfil del Usuario</h1>
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
                            <img src="https://i.pravatar.cc/150" alt="Avatar" className="profile-avatar" />
                            <div className="profile-info">
                                <h2>{user.name} {user.last_name}</h2>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Empresa:</strong> {user.company || 'No especificada'}</p>
                                <p><strong>Ubicación:</strong> {user.location || 'No especificada'}</p>
                                <p><strong>Cuenta creada en:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="profile-no-data">
                        <p>No se encontraron datos del usuario.</p>
                    </div>
                )}
            </div>

            <div className="profile-map-section">
                <div ref={mapRef} className="map-container"></div>
            </div>
        </div>
    );
};

export default Profile;
