import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader } from '@googlemaps/js-api-loader';
import "../../styles/direccion.css";

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
    const [direcciones, setDirecciones] = useState([]);
    const [currentAddressId, setCurrentAddressId] = useState(null);
    const mapRef = useRef(null);
    const [marker, setMarker] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const [loading, setLoading] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setAddress("");
        setPostalCode("");
        setStreet("");
        setCategory("");
        setSelectedCountry(null);
        setWarning("");
    };

    const [filter, setFilter] = useState("");
    const categoryColors = {
        "ubicacion-propia": "lightblue",
        "recogida-entrega": "lightgreen",
        "cliente": "lightcoral",
    };

    useEffect(() => {
        axios.get('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/direcciones')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setDirecciones(response.data);
                } else {
                    console.error("La respuesta no es un array:", response.data);
                    setDirecciones([]); // O maneja el error de otra manera
                }
            })
            .catch(error => {
                console.error("Error al obtener las direcciones:", error);
                setWarning("No se pudieron cargar las direcciones.");
            });
    }, []);

    // Filtrar direcciones según el estado 'filter'
    const filteredDirecciones = direcciones.filter(direccion => {
        return !filter || direccion.categoria === filter; // Filtrado por categoría
    });

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
            contacto: "",
            comentarios: "",
        };

        axios.post('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/direcciones', newAddress)
            .then(response => {
                console.log("Dirección creada: ", response.data);
                setDirecciones(prevDirecciones => [...prevDirecciones, response.data]); // Agregar dirección al estado
                closeModal();
            })
            .catch(error => {
                console.error("Error al crear la dirección: ", error.response ? error.response.data : error.message);
                setWarning("Error al crear la dirección.");
            });
    };

    const categoryIcons = {
        "ubicacion-propia": "🏚️",
        "recogida-entrega": "🔄",
        "cliente": "🤵",
    };

    const handleEdit = (direccion) => {
        setCurrentAddressId(direccion.id);
        setName(direccion.nombre);
        setAddress(direccion.direccion);
        setCategory(direccion.categoria);
        setSelectedCountry(""); // Ajusta según tu lógica de países
        setIsModalOpen(true);
    };

    const handleSaveChanges = () => {
        if (!currentAddressId) return;

        const updatedAddress = {
            nombre: name,
            direccion: `${street}, ${address}, ${postalCode}`,
            categoria: category,
            contacto: "",
            comentarios: "",
        };

        axios.put(`https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/direcciones/${currentAddressId}`, updatedAddress)
            .then(response => {
                console.log("Dirección actualizada: ", response.data);
                setDirecciones(prevDirecciones =>
                    prevDirecciones.map(direccion =>
                        direccion.id === currentAddressId ? response.data : direccion
                    )
                );
                closeModal();
            })
            .catch(error => {
                console.error("Error al actualizar la dirección: ", error);
                setWarning("Error al actualizar la dirección.");
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta dirección?");
        if (confirmDelete) {
            axios.delete(`https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/direcciones/${id}`)
                .then(() => {
                    setDirecciones(prevDirecciones => prevDirecciones.filter(direccion => direccion.id !== id));
                    console.log("Dirección eliminada");
                })
                .catch(error => {
                    console.error("Error al eliminar la dirección: ", error);
                    alert("Error al eliminar la dirección. Por favor, intenta de nuevo.");
                });
        }
    };

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener la lista de países:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isModalOpen && !map) {
            initializeMap();
        }
    }, [isModalOpen]);

    return (
        <div>
            <div className="container mt-4">
                <div className="direcciones-header d-flex justify-content-between align-items-center mb-4">
                    <h3>Mis Direcciones</h3>
                    <label>
                        Filtrar por categoría:
                        <select onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="ubicacion-propia">🏚️  Ubicación propia</option>
                            <option value="recogida-entrega">🔄  Recogida/Entrega</option>
                            <option value="cliente">🤵  Cliente</option>
                        </select>
                    </label>
                    <button className="btn btn-primary" onClick={openModal}>Nueva dirección</button>
                </div>

                <table className="table table-striped table-hover text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDirecciones.map(direccion => (
                            <tr key={direccion.id}>
                                <td>{direccion.nombre}</td>
                                <td>{direccion.direccion}</td>
                                <td style={{ backgroundColor: categoryColors[direccion.categoria] || 'white' }}>{direccion.categoria}</td>
                                <td>
                                    <button onClick={() => handleEdit(direccion)} className="btn btn-warning">Editar</button>
                                    <button onClick={() => handleDelete(direccion.id)} className="btn btn-danger">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h4>{currentAddressId ? "Editar Dirección" : "Crear Dirección"}</h4>
                        {warning && <div className="alert alert-warning">{warning}</div>}
                        <div className="form-group">
                            <label>Nombre <span style={{ color: "red" }}>*</span></label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Dirección <span style={{ color: "red" }}>*</span></label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Código Postal <span style={{ color: "red" }}>*</span></label>
                            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Calle <span style={{ color: "red" }}>*</span></label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Categoría <span style={{ color: "red" }}>*</span></label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                                <option value="">Selecciona una categoría</option>
                                <option value="ubicacion-propia">🏚️  Ubicación propia</option>
                                <option value="recogida-entrega">🔄  Recogida/Entrega</option>
                                <option value="cliente">🤵  Cliente</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Selecciona un país</label>
                            <select value={selectedCountry} onChange={handleCountryChange} className="form-control">
                                <option value="">Selecciona un país</option>
                                {countries.map(country => (
                                    <option key={country.cca2} value={country.cca2}>{country.name.common}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <button onClick={searchAddress} className="btn btn-info">Buscar dirección</button>
                        </div>
                        <div ref={mapRef} style={{ width: "100%", height: "300px" }}></div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                            <button className="btn btn-primary" onClick={currentAddressId ? handleSaveChanges : handleCreateAddress}>
                                {currentAddressId ? "Guardar Cambios" : "Crear Dirección"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
