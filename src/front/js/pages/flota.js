import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/flota.css";
import { Modal, Button } from 'react-bootstrap';
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
        fechaNacimiento: new Date(),
        poblacion: '',
        ciudad: '',
        sueldo: ''
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);

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
        setConductorData({
            ...conductorData,
            [e.target.name]: e.target.value
        });
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
        } else if (activeTab === 'conductores') {
            try {
                const conductorData = {
                    nombre: /* valor del input de nombre */ '',
                    apellidos: /* valor del input de apellidos */ '',
                    fechaNacimiento: /* valor del input de fecha de nacimiento */ '',
                    poblacion: /* valor del input de población */ '',
                    ciudad: /* valor del input de ciudad */ '',
                    sueldo: conductorData.sueldo !== '' ? parseFloat(conductorData.sueldo) : null, // Convierte a número si no está vacío
                };
    
                // Validar campos requeridos
                if (!conductorData.nombre || !conductorData.apellidos || !conductorData.fechaNacimiento) {
                    console.error('Los campos nombre, apellidos y fecha de nacimiento son obligatorios.');
                    return; // Detener la ejecución si hay campos obligatorios vacíos
                }
    
                const response = await axios.post('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/conductores', conductorData);
                console.log('Conductor guardado', response.data);
                fetchConductores(); // Llama a la función para actualizar la lista de conductores
            } catch (error) {
                console.error('Error al guardar conductor:', error);
                if (error.response) {
                    console.log("Detalles del error:", error.response.data);
                }
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
            setConductores(response.data || []); // Asegurarte de que sea un array
        } catch (error) {
            console.error('Error al obtener conductores:', error);
        }
    };

    const handleEdit = (vehiculo) => {
        setVehiculoData(vehiculo);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
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

    useEffect(() => {
        fetchVehiculos();
        fetchConductores(); // Obtener conductores al cargar el componente
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
                                            <Button variant="warning" onClick={() => handleEdit(vehiculo)}>🔄</Button>
                                            <Button variant="danger" onClick={() => handleDelete(vehiculo.id)}>🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tabla de Conductores */}
                {activeTab === 'conductores' && (
                    <div className="mb-4">
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
                                {Array.isArray(conductores) && conductores.length > 0 ? (
                                    conductores.map((conductor) => (
                                        <tr key={conductor.id}>
                                            <td>{conductor.id}</td>
                                            <td>{conductor.nombre}</td>
                                            <td>{conductor.apellidos}</td>
                                            <td>{new Date(conductor.fechaNacimiento).toLocaleDateString()}</td>
                                            <td>{conductor.poblacion}</td>
                                            <td>{conductor.ciudad}</td>
                                            <td>{conductor.sueldo}</td>
                                            <td>
                                                <Button variant="warning">🔄</Button>
                                                <Button variant="danger">🗑️</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No hay conductores disponibles.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{activeTab === 'vehiculos' ? 'Añadir Vehículo' : 'Añadir Conductor'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {activeTab === 'vehiculos' ? (
                        <div>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" name="nombre" value={vehiculoData.nombre} onChange={handleVehiculoChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="placa" className="form-label">Placa</label>
                                    <input type="text" className="form-control" name="placa" value={vehiculoData.placa} onChange={handleVehiculoChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="remolque" className="form-label">Remolque</label>
                                    <input type="text" className="form-control" name="remolque" value={vehiculoData.remolque} onChange={handleVehiculoChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="costo_km" className="form-label">Costo por KM</label>
                                    <input type="number" className="form-control" name="costo_km" value={vehiculoData.costo_km} onChange={handleVehiculoChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="costo_hora" className="form-label">Costo por Hora</label>
                                    <input type="number" className="form-control" name="costo_hora" value={vehiculoData.costo_hora} onChange={handleVehiculoChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ejes" className="form-label">Ejes</label>
                                    <input type="number" className="form-control" name="ejes" value={vehiculoData.ejes} onChange={handleVehiculoChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="peso" className="form-label">Peso</label>
                                    <input type="number" className="form-control" name="peso" value={vehiculoData.peso} onChange={handleVehiculoChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="combustible" className="form-label">Combustible</label>
                                    <input type="text" className="form-control" name="combustible" value={vehiculoData.combustible} onChange={handleVehiculoChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="emision" className="form-label">Emisión</label>
                                    <input type="text" className="form-control" name="emision" value={vehiculoData.emision} onChange={handleVehiculoChange} />
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" name="nombre" value={conductorData.nombre} onChange={handleConductorChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                                    <input type="text" className="form-control" name="apellidos" value={conductorData.apellidos} onChange={handleConductorChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                                    <input type="date" className="form-control" name="fechaNacimiento" value={conductorData.fechaNacimiento.toISOString().substring(0, 10)} onChange={handleConductorChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="poblacion" className="form-label">Población</label>
                                    <input type="text" className="form-control" name="poblacion" value={conductorData.poblacion} onChange={handleConductorChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                    <input type="text" className="form-control" name="ciudad" value={conductorData.ciudad} onChange={handleConductorChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="sueldo" className="form-label">Sueldo</label>
                                    <input type="number" className="form-control" name="sueldo" value={conductorData.sueldo} onChange={handleConductorChange} />
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
    );
};
