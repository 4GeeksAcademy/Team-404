import React, { useState, useEffect } from 'react';
import "../../styles/flota.css";
import { Modal, Button, Tab, Nav, Table } from 'react-bootstrap';
import DatePicker from '../component/DatePicker'; // Asegúrate de la ruta correcta
import axios from 'axios';

export const Flota = () => {
    const [activeTab, setActiveTab] = useState('vehiculos');
    const [showModal, setShowModal] = useState(false);
    const [vehiculoData, setVehiculoData] = useState({
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

    const [vehiculos, setVehiculos] = useState([]); // Estado para almacenar vehículos

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        // Reiniciar datos al cerrar el modal
        if (activeTab === 'vehiculos') {
            setVehiculoData({
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
                // Enviar datos del vehículo al backend
                const response = await axios.post('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/vehiculos', vehiculoData);
                console.log('Vehículo guardado', response.data);
                fetchVehiculos(); // Actualiza la lista de vehículos
            } catch (error) {
                console.error('Error al guardar vehículo:', error);
            }
        } else {
            try {
                // Enviar datos del conductor al backend
                const response = await axios.post('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/conductores', conductorData);
                console.log('Conductor guardado', response.data);
            } catch (error) {
                console.error('Error al guardar conductor:', error);
            }
        }
        handleClose(); // Cierra el modal después de guardar
    };

    // Función para obtener la lista de vehículos
    const fetchVehiculos = async () => {
        try {
            const response = await axios.get('https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/vehiculos');
            setVehiculos(response.data); // Almacena los vehículos en el estado
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
        }
    };

    // Llama a fetchVehiculos al montar el componente
    useEffect(() => {
        fetchVehiculos();
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

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

                {/* Modal para Vehículos y Conductores */}
                <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">
                            {activeTab === 'vehiculos' ? '🚚​ Añadir Vehículos' : '🤵🏻 Añadir Conductores'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tab.Container defaultActiveKey="detalles">
                            <Nav variant="tabs" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey="detalles">DETALLES</Nav.Link>
                                </Nav.Item>
                                {activeTab === 'vehiculos' && (
                                    <>
                                        <Nav.Item>
                                            <Nav.Link eventKey="costo">COSTO</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="peajes">PEAJE</Nav.Link>
                                        </Nav.Item>
                                    </>
                                )}
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="detalles">
                                    {activeTab === 'vehiculos' ? (
                                        <div className="form-content">
                                            <h5>Detalles del Vehículo</h5>
                                            <form>
                                                <div className="mb-3">
                                                    <label className="form-label">Nombre</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese el nombre del vehículo"
                                                        name="nombre"
                                                        value={vehiculoData.nombre}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Placa</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese la placa del vehículo"
                                                        name="placa"
                                                        value={vehiculoData.placa}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Remolque (opcional)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese el remolque, si aplica"
                                                        name="remolque"
                                                        value={vehiculoData.remolque}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="form-content">
                                            <h5> Detalles del Conductor</h5>
                                            <form>
                                                <div className="mb-3">
                                                    <label className="form-label">Nombre</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese el nombre del conductor"
                                                        name="nombre"
                                                        value={conductorData.nombre}
                                                        onChange={handleConductorChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Apellidos</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese los apellidos"
                                                        name="apellidos"
                                                        value={conductorData.apellidos}
                                                        onChange={handleConductorChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Fecha de Nacimiento</label>
                                                    <DatePicker
                                                        selectedDate={fechaNacimiento}
                                                        setSelectedDate={setFechaNacimiento}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </Tab.Pane>
                                {activeTab === 'vehiculos' && (
                                    <Tab.Pane eventKey="costo">
                                        <div className="form-content">
                                            <h5>Costo del Vehículo</h5>
                                            <form>
                                                <div className="mb-3">
                                                    <label className="form-label">Costo por KM</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Ingrese el costo por KM"
                                                        name="costoKm"
                                                        value={vehiculoData.costoKm}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Costo por Hora</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Ingrese el costo por hora"
                                                        name="costoHora"
                                                        value={vehiculoData.costoHora}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </Tab.Pane>
                                )}
                                {activeTab === 'vehiculos' && (
                                    <Tab.Pane eventKey="peajes">
                                        <div className="form-content">
                                            <h5>Detalles de Peaje</h5>
                                            <form>
                                                <div className="mb-3">
                                                    <label className="form-label">Ejes</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Ingrese el número de ejes"
                                                        name="ejes"
                                                        value={vehiculoData.ejes}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Peso</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Ingrese el peso"
                                                        name="peso"
                                                        value={vehiculoData.peso}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Combustible</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese tipo de combustible"
                                                        name="combustible"
                                                        value={vehiculoData.combustible}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Emisión</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese tipo de emisión"
                                                        name="emision"
                                                        value={vehiculoData.emision}
                                                        onChange={handleVehiculoChange}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </Tab.Pane>
                                )}
                            </Tab.Content>
                        </Tab.Container>
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
        </div>
    );
};

export default Flota;
