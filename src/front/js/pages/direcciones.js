import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader } from '@googlemaps/js-api-loader';
import "../../styles/direccion.css"; // Asegúrate de que la ruta al archivo CSS sea correcta

export const Direcciones = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [map, setMap] = useState(null);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [warning, setWarning] = useState("");
    const mapRef = useRef(null);
    const [marker, setMarker] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        window.location.reload(); // Recargar la página al cerrar modal
    };

    const initializeMap = () => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error("Error al obtener la lista de países:", error);
            });
    }, []);

    const handleCountryChange = (event) => {
        const countryCode = event.target.value;
        setSelectedCountry(countryCode);
        const selectedCountryData = countries.find(country => country.cca2 === countryCode);

        if (selectedCountryData && map) {
            const { latlng } = selectedCountryData;
            const latLng = new window.google.maps.LatLng(latlng[0], latlng[1]);
            map.setCenter(latLng);
            if (marker) marker.setMap(null);
            const newMarker = new window.google.maps.Marker({
                position: latLng,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            });
            setMarker(newMarker);
        }
    };

    const searchAddress = () => {
        if (!address && !postalCode && !street) return;

        const geocoder = new window.google.maps.Geocoder();
        const query = `${street}, ${address}, ${postalCode}`;

        geocoder.geocode({ address: query }, (results, status) => {
            if (status === "OK" && results[0] && map) {
                const { location } = results[0].geometry;
                map.setCenter(location);
                if (marker) marker.setMap(null);
                const newMarker = new window.google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                });
                setMarker(newMarker);
            } else {
                console.error("Geocoding error: ", status);
            }
        });
    };

    const handleCreateAddress = () => {
        if (!name || !selectedCountry || !postalCode || !address || !street || !category) {
            setWarning("Por favor, rellena todos los campos obligatorios.");
            return;
        }
    
        const newAddress = {
            nombre: name,
            direccion: `${street}, ${address}, ${postalCode}`,
            categoria: category,
            contacto: "", // Aquí puedes agregar contacto si lo deseas
            comentarios: "", // Aquí puedes agregar comentarios si lo deseas
        };
    
        axios.post('https://super-duper-trout-v66946px9wp5f6p6w-3001.app.github.dev/api/direcciones', newAddress)
            .then(response => {
                console.log("Dirección creada: ", response.data);
                closeModal();
            })
            .catch(error => {
                console.error("Error al crear la dirección: ", error.response ? error.response.data : error.message);
                setWarning("Error al crear la dirección.");
            });
    };

    useEffect(() => {
        if (isModalOpen && !map) {
            initializeMap();
        }
    }, [isModalOpen]);

    return (
        <div>
            <div className="direcciones-header">
                <h3>Mis Direcciones</h3>
                <button className="direccion-btn" onClick={openModal}>Nueva dirección</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeModal}>✖️</button>
                        <h2>Crear Nueva Dirección</h2>
                        <div className="modal-body">
                            <div className="form-detail-section">
                                <div className="form-section">
                                    <h3>Dirección</h3>
                                    <form>
                                        <label>
                                            País <span className="required">*</span>
                                            <select name="pais" required onChange={handleCountryChange}>
                                                <option value="">Seleccionar país</option>
                                                {countries.map(country => (
                                                    <option key={country.cca2} value={country.cca2}>
                                                        {country.name.common}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Código Postal <span className="required">*</span>
                                            <input
                                                type="text"
                                                name="codigoPostal"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Ciudad <span className="required">*</span>
                                            <input
                                                type="text"
                                                name="ciudad"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Calle <span className="required">*</span>
                                            <input
                                                type="text"
                                                name="calle"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                            />
                                        </label>
                                        <button type="button" className="search-btn" onClick={searchAddress}>Buscar</button>
                                    </form>
                                </div>
                                <div className="detail-section">
                                    <h3>Detalle</h3>
                                    <form>
                                        <label>
                                            Nombre <span className="required">*</span>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Categoría <span className="required">*</span>
                                            <select
                                                name="categoria"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                <option value="ubicacion-propia">🏚️​​​  Ubicación propia</option>
                                                <option value="recogida-entrega">🔄  Recogida/Entrega</option>
                                                <option value="cliente">🤵  Cliente</option>
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
                            <div className="map-section" ref={mapRef}></div>
                        </div>
                        <div className="modal-footer">
                            {warning && (
                                <div className="warning-message">
                                    {warning}
                                </div>
                            )}
                            <div className="modal-buttons">
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancelar</button>
                                <button type="button" className="direccion-btn" onClick={handleCreateAddress}>Crear Dirección</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
