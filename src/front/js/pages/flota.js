import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/flota.css";
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import ControlPanel from '../component/panelControl';


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
        fechaNacimiento: '',
        poblacion: '',
        ciudad: '',
        sueldo: ''
    });

    const [vehiculos, setVehiculos] = useState([]);

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
                fechaNacimiento: '',
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
                    const response = await axios.put(`${process.env.BACKEND_URL}/api/vehiculos/${vehiculoData.id}`, updatedVehiculoData);
                    console.log('Vehículo editado', response.data);
                } else {
                    // Agregar nuevo vehículo (usar POST)
                    const response = await axios.post(`${process.env.BACKEND_URL}/api/vehiculos`, updatedVehiculoData);
                    console.log('Vehículo guardado', response.data);
                }
                fetchVehiculos();
            } catch (error) {
                console.error('Error al guardar vehículo:', error);
                if (error.response) {
                    console.log("Detalles del error:", error.response.data);
                }
            }
        }
        handleClose();
    };
    

    const fetchVehiculos = async () => {
        try {
            const response = await axios.get(`${process.env.BACKEND_URL}/api/vehiculos`);
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
        }
    };

    const handleEdit = (vehiculo) => {
        setVehiculoData(vehiculo);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")) {
            try {
                await axios.delete(`${process.env.BACKEND_URL}/api/vehiculos/${id}`);
                console.log('Vehículo eliminado');
                fetchVehiculos();
            } catch (error) {
                console.error('Error al eliminar vehículo:', error);
            }
        }
    };

    useEffect(() => {
        fetchVehiculos();
        actions.fetchUserData();
    }, []);

    return (
        <div className="min-vh-100 d-flex">
            <ControlPanel />
                <div className="container mt-4">
                    <div className="direcciones-header d-flex justify-content-between align-items-center mb-4">
                        <h3>Vehículos</h3>
                        <button className="btn btn-primary" onClick={handleShowModal}>
                            {activeTab === 'vehiculos' ? 'Añadir Vehículos' : 'Añadir Conductores'}
                        </button>
                    </div>
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


                    {/* Modal para Vehículos  */}
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
                                        <div className="form-group">
                                            <label>Placa</label>
                                            <input
                                                type="text"
                                                name="placa"
                                                className="form-control"
                                                value={vehiculoData.placa}
                                                onChange={handleVehiculoChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Remolque</label>
                                            <input
                                                type="text"
                                                name="remolque"
                                                className="form-control"
                                                value={vehiculoData.remolque}
                                                onChange={handleVehiculoChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Costo por KM</label>
                                            <input
                                                type="number"
                                                name="costo_km"
                                                className="form-control"
                                                value={vehiculoData.costo_km}
                                                onChange={handleVehiculoChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Costo por Hora</label>
                                            <input
                                                type="number"
                                                name="costo_hora"
                                                className="form-control"
                                                value={vehiculoData.costo_hora}
                                                onChange={handleVehiculoChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ejes</label>
                                            <input
                                                type="number"
                                                name="ejes"
                                                className="form-control"
                                                value={vehiculoData.ejes}
                                                onChange={handleVehiculoChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Peso</label>
                                            <input
                                                type="number"
                                                name="peso"
                                                className="form-control"
                                                value={vehiculoData.peso}
                                                onChange={handleVehiculoChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Combustible</label>
                                            <input
                                                type="text"
                                                name="combustible"
                                                className="form-control"
                                                value={vehiculoData.combustible}
                                                onChange={handleVehiculoChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Emisión</label>
                                            <input
                                                type="text"
                                                name="emision"
                                                className="form-control"
                                                value={vehiculoData.emision}
                                                onChange={handleVehiculoChange}
                                            />
                                        </div>
                                    </form>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                {/* Modal para Vehículos y Conductores */}
                <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">
                            {activeTab === 'vehiculos' ? 'Añadir Vehículos' : '🤵🏻 Añadir Conductores'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {activeTab === 'vehiculos' && (
                            <div>
                                <form>
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
                                    <div className="form-group">
                                        <label>Placa</label>
                                        <input
                                            type="text"
                                            name="placa"
                                            className="form-control"
                                            value={vehiculoData.placa}
                                            onChange={handleVehiculoChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Remolque</label>
                                        <input
                                            type="text"
                                            name="remolque"
                                            className="form-control"
                                            value={vehiculoData.remolque}
                                            onChange={handleVehiculoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Costo por KM</label>
                                        <input
                                            type="number"
                                            name="costo_km"
                                            className="form-control"
                                            value={vehiculoData.costo_km}
                                            onChange={handleVehiculoChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Costo por Hora</label>
                                        <input
                                            type="number"
                                            name="costo_hora"
                                            className="form-control"
                                            value={vehiculoData.costo_hora}
                                            onChange={handleVehiculoChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ejes</label>
                                        <input
                                            type="number"
                                            name="ejes"
                                            className="form-control"
                                            value={vehiculoData.ejes}
                                            onChange={handleVehiculoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Peso</label>
                                        <input
                                            type="number"
                                            name="peso"
                                            className="form-control"
                                            value={vehiculoData.peso}
                                            onChange={handleVehiculoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Combustible</label>
                                        <input
                                            type="text"
                                            name="combustible"
                                            className="form-control"
                                            value={vehiculoData.combustible}
                                            onChange={handleVehiculoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Emisión</label>
                                        <input
                                            type="text"
                                            name="emision"
                                            className="form-control"
                                            value={vehiculoData.emision}
                                            onChange={handleVehiculoChange}
                                        />
                                    </div>
                                </form>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="warning" onClick={handleSave}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
    );
};
