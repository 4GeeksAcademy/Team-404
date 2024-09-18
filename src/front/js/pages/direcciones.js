import React, { useState, useEffect, useRef } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import "../../styles/direccion.css"; // Asegúrate de que la ruta al archivo CSS sea correcta

export const Direcciones = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    const direcciones = []; // Simula un array vacío de direcciones

    // Funciones para abrir y cerrar el modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Función para inicializar el mapa
    const initializeMap = () => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });

        loader.load().then(() => {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: -34.397, lng: 150.644 }, // Coordenadas iniciales
                zoom: 8,
            });
            setMap(newMap);
        }).catch(e => {
            console.error("Error al cargar la API de Google Maps: ", e);
        });
    };

    useEffect(() => {
        if (isModalOpen && !map) {
            initializeMap();
        }
    }, [isModalOpen]);

    return (
        <div>
            {/* Contenedor del título y el botón */}
            <div className="direcciones-header">
                <h3>Mis Direcciones</h3>
                <button className="direccion-btn" onClick={openModal}>Nueva dirección</button>
            </div>

            {/* Si no hay direcciones, muestra el mensaje y el botón */}
            {direcciones.length === 0 ? (
                <div className="no-direcciones">
                    <p>¡Aún no tienes direcciones guardadas!</p>
                    <button className="direccion-btn" onClick={openModal}>+ Nueva dirección</button>
                </div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {/* Modal para crear una nueva dirección */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeModal}>✖️</button>
                        <h2>Crear Nueva Dirección</h2>
                        <div className="modal-body">
                            {/* Parte 1: Formulario y Detalle */}
                            <div className="form-detail-section">
                                <div className="form-section">
                                    <h3>Dirección</h3>
                                    <form>
                                        <label>
                                            País <span className="required">*</span>
                                            <input type="text" name="pais" required />
                                        </label>
                                        <label>
                                            Código Postal <span className="required">*</span>
                                            <input type="text" name="codigoPostal" required />
                                        </label>
                                        <label>
                                            Ciudad <span className="required">*</span>
                                            <input type="text" name="ciudad" required />
                                        </label>
                                        <label>
                                            Calle <span className="required">*</span>
                                            <input type="text" name="calle" required />
                                        </label>
                                    </form>
                                </div>
                                <div className="detail-section">
                                    <h3>Detalle</h3>
                                    <form>
                                        <label>
                                            Nombre <span className="required">*</span>
                                            <input type="text" name="nombre" required />
                                        </label>
                                        <label>
                                            Categoría <span className="required">*</span>
                                            <select name="categoria" required>
                                                <option value="ubicacion-propia">
                                                🏚️ ​Ubicación propia
                                                </option>
                                                <option value="recogida-entrega">
                                                🔄​ Recogida/Entrega
                                                </option>
                                                <option value="cliente">
                                                🤵​ Cliente
                                                </option>
                                            </select>
                                        </label>
                                        <label>
                                            Email (opcional)
                                            <input type="email" name="email" />
                                        </label>
                                        <label>
                                            Persona de Contacto (opcional)
                                            <input type="text" name="personaContacto" />
                                        </label>
                                        <label>
                                            Número de Teléfono (opcional)
                                            <input type="text" name="telefono" />
                                        </label>
                                        <label>
                                            Comentarios (opcional)
                                            <textarea name="comentarios"></textarea>
                                        </label>
                                    </form>
                                </div>
                            </div>
                            {/* Parte 2: Mapa */}
                            <div className="map-section" ref={mapRef}></div> {/* Aquí se renderiza el mapa */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
