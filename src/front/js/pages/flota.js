import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/flota.css";
import { Modal, Button, Tab, Nav, Table } from 'react-bootstrap';
import axios from 'axios';

export const Flota = () => {
    const { actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState('vehiculos');
    const [showModal, setShowModal] = useState(false);
    const [vehiculoData, setVehiculoData] = useState({
        id: null,
        nombre: '',
        placa: '',
        remolque: '',
        costo_km: '',
        costo_hora: '',
        ejes: '',
        peso: '',
        combustible: '',
        emision: ''
    });

    const [conductorData, setConductorData] = useState({
        nombre: '',
        apellidos: '',
        fechaNacimiento: new Date(), // Asegúrate de que esto sea un objeto Date
        poblacion: '',
        ciudad: '',
        sueldo: ''
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]); // Estado para conductores

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        if (activeTab === 'vehiculos') {
            setVehiculoData({
                id: null,
                nombre: '',
                placa: '',
                remolque: '',
                costo_km: '',
                costo_hora: '',
                ejes: '',
                peso: '',
                combustible: '',
                emision: ''
            });
        } else {
            setConductorData({
                id: null,
                nombre: '',
                apellidos: '',
                fechaNacimiento: new Date(),
                poblacion: '',
                ciudad: '',
                sueldo: ''
            });
        }
    };

    const handleVehiculoChange = (e) => {
        setVehiculoData({
            ...vehiculoData,
            [e.target.name]: e.target.value
        });
    };

    const handleConductorChange = (e) => {
        const { name, value } = e.target;
        setConductorData((prevData) => ({
            ...prevData,
            [name]: name === 'fechaNacimiento' ? new Date(value) : value // Convierte a Date si es fecha
        }));
    };

    const handleSave = async () => {
        if (activeTab === 'vehiculos') {
            try {
                const updatedVehiculoData = {
                    ...vehiculoData,
                    user_id: actions.getUserId(),
                    costo_km: vehiculoData.costo_km !== '' ? parseFloat(vehiculoData.costo_km) : null,
                    costo_hora: vehiculoData.costo_hora !== '' ? parseFloat(vehiculoData.costo_hora) : null,
                    ejes: vehiculoData.ejes !== '' ? parseInt(vehiculoData.ejes, 10) : null,
                    peso: vehiculoData.peso !== '' ? parseFloat(vehiculoData.peso) : null,
                };

                if (vehiculoData.id) {
                    // Editar vehículo existente
                    const response = await axios.put(`https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/vehiculos/${vehiculoData.id}`, updatedVehiculoData);
                    console.log('Vehículo editado', response.data);
                } else {
                    // Agregar nuevo vehículo
                    const response = await axios.post('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/vehiculos', updatedVehiculoData);
                    console.log('Vehículo guardado', response.data);
                }
                fetchVehiculos();
            } catch (error) {
                console.error('Error al guardar vehículo:', error);
                if (error.response) {
                    console.log("Detalles del error:", error.response.data);
                }
            }
        } else {
            try {
                const updatedConductorData = {
                    ...conductorData,
                    fechaNacimiento: conductorData.fechaNacimiento.toISOString().split('T')[0] // Formatear fecha
                };
                if (conductorData.id) {
                    // Editar conductor existente
                    const response = await axios.put(`https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/conductores/${conductorData.id}`, updatedConductorData);
                    console.log('Conductor editado', response.data);
                } else {
                    // Agregar nuevo conductor
                    const response = await axios.post('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/conductores', updatedConductorData);
                    console.log('Conductor guardado', response.data);
                }
                fetchConductores();
            } catch (error) {
                console.error('Error al guardar conductor:', error);
            }
        }
        handleClose();
    };

    const fetchVehiculos = async () => {
        try {
            const response = await axios.get('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/vehiculos');
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
        }
    };

    const fetchConductores = async () => {
        try {
            const response = await axios.get('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/conductores');
            console.log("Datos de conductores obtenidos:", response.data); // Agrega esta línea para verificar
            setConductores(Array.isArray(response.data) ? response.data : []); // Asegúrate de que sea un array
        } catch (error) {
            console.error('Error al obtener conductores:', error);
        }
    };

    // En el renderizado de la tabla de conductores, también agrega un console.log:
    console.log("Lista de conductores:", conductores); // Verifica el contenido de conductores

    const handleEditVehiculo = (vehiculo) => {
        setVehiculoData(vehiculo);
        setShowModal(true);
    };

    const handleEditConductor = (conductor) => {
        setConductorData(conductor);
        setShowModal(true);
    };

    const handleDeleteVehiculo = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")) {
            try {
                await axios.delete(`https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/vehiculos/${id}`);
                console.log('Vehículo eliminado');
                fetchVehiculos();
            } catch (error) {
                console.error('Error al eliminar vehículo:', error);
            }
        }
    };

    const handleDeleteConductor = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este conductor?")) {
            try {
                await axios.delete(`https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/conductores/${id}`);
                console.log('Conductor eliminado');
                fetchConductores();
            } catch (error) {
                console.error('Error al eliminar conductor:', error);
            }
        }
    };

    useEffect(() => {
        fetchVehiculos();
        fetchConductores(); // Cargar conductores al inicio
        actions.fetchUserData();
    }, []);

    return (
        <div>
            <div className="container mt-4">
                <div className="direcciones-header d-flex justify-content-between align-items-center mb-4">
                    <h3>Vehículos y conductores</h3>
                    <button className="btn btn-primary" onClick={handleShowModal}>
                        {activeTab === 'vehiculos' ? 'Añadir Vehículos' : 'Añadir Conductores'}
                    </button>
                </div>
                <ul className="nav nav-tabs custom-tabs">
                    <li className="nav-item">
                        <a
                            className={`nav-link custom-tab-link ${activeTab === 'vehiculos' ? 'active' : ''}`}
                            href="#"
                            onClick={() => handleTabClick('vehiculos')}
                        >
                            Vehículos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link custom-tab-link ${activeTab === 'conductores' ? 'active' : ''}`}
                            href="#"
                            onClick={() => handleTabClick('conductores')}
                        >
                            Conductores
                        </a>
                    </li>
                </ul>

                {/* Tabla de Vehículos */}
                {activeTab === 'vehiculos' && (
                    <div className="mb-4">
                        <h5>Lista de Vehículos</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Placa</th>
                                    <th>Remolque</th>
                                    <th>Costo por KM</th>
                                    <th>Costo por Hora</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.id}>
                                        <td>{vehiculo.id}</td>
                                        <td>{vehiculo.nombre}</td>
                                        <td>{vehiculo.placa}</td>
                                        <td>{vehiculo.remolque}</td>
                                        <td>{vehiculo.costo_km}</td>
                                        <td>{vehiculo.costo_hora}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEditVehiculo(vehiculo)}>🔄</Button>
                                            <Button variant="danger" onClick={() => handleDeleteVehiculo(vehiculo.id)}>🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tabla de Conductores */}
                {activeTab === 'conductores' && (
                    <div>
                        <h5>Lista de Conductores</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Población</th>
                                    <th>Ciudad</th>
                                    <th>Sueldo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conductores.map((conductor) => (
                                    <tr key={conductor.id}>
                                        <td>{conductor.id}</td>
                                        <td>{conductor.nombre}</td>
                                        <td>{conductor.apellidos}</td>
                                        <td>{new Date(conductor.fechaNacimiento).toLocaleDateString()}</td> {/* Asegúrate de que esto sea un objeto Date */}
                                        <td>{conductor.poblacion}</td>
                                        <td>{conductor.ciudad}</td>
                                        <td>{conductor.sueldo}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEditConductor(conductor)}>🔄</Button>
                                            <Button variant="danger" onClick={() => handleDeleteConductor(conductor.id)}>🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal para Vehículos y Conductores */}
                <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">
                            {activeTab === 'vehiculos' ? '🚚​ Añadir Vehículos' : '🤵🏻 Añadir Conductores'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {activeTab === 'vehiculos' && (
                            <div>
                                <form>
                                    {/* Aquí van los campos para vehículos, como antes */}
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            value={vehiculoData.nombre}
                                            onChange={handleVehiculoChange}
                                            required
                                        />
                                    </div>
                                    {/* Agrega más campos según tu estructura... */}
                                </form>
                            </div>
                        )}
                        {activeTab === 'conductores' && (
                            <div>
                                <form>
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            value={conductorData.nombre}
                                            onChange={handleConductorChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellidos</label>
                                        <input
                                            type="text"
                                            name="apellidos"
                                            className="form-control"
                                            value={conductorData.apellidos}
                                            onChange={handleConductorChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            name="fechaNacimiento"
                                            className="form-control"
                                            value={conductorData.fechaNacimiento.toISOString().split('T')[0]}
                                            onChange={handleConductorChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Población</label>
                                        <input
                                            type="text"
                                            name="poblacion"
                                            className="form-control"
                                            value={conductorData.poblacion}
                                            onChange={handleConductorChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ciudad</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            className="form-control"
                                            value={conductorData.ciudad}
                                            onChange={handleConductorChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Sueldo</label>
                                        <input
                                            type="number"
                                            name="sueldo"
                                            className="form-control"
                                            value={conductorData.sueldo}
                                            onChange={handleConductorChange}
                                        />
                                    </div>
                                </form>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};
