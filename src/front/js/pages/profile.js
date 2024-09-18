import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faHome, faTruck, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '@googlemaps/js-api-loader';
import '../../styles/Profile.css'; // Archivo CSS actualizado

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);

    // Función para obtener los datos del usuario autenticado
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api/user", {
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

    // Función para inicializar el mapa
    const initializeMap = () => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Usa la clave API desde el archivo .env
            version: 'weekly',
        });
        loader.load().then(() => {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
            setMap(newMap);
        }).catch(e => {
            console.error("Error al cargar la API de Google Maps: ", e);
        });
    };

    // Función para buscar la ubicación en el mapa
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
        fetchUserData();
    }, []);

    useEffect(() => {
        initializeMap();
    }, []);

    useEffect(() => {
        if (user && user.location) {
            searchLocation(user.location);
        }
    }, [user, map]);

    return (
        <div className="profile-page-container">
            {/* Panel de control */}
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
                            <FontAwesomeIcon icon={faTruck} /> Vehículos y Conductores
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

            {/* Perfil de usuario */}
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

            {/* Sección del mapa */}
            <div className="profile-map-section">
                <div
                    ref={mapRef}
                    className="map-container"
                ></div>
            </div>
        </div>
    );
};

export default Profile;
