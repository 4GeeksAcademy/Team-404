import React, { useState } from 'react';
import "../../styles/flota.css";
import { Modal, Button, Tab, Nav } from 'react-bootstrap';
import DatePicker from '../component/DatePicker'; // Asegúrate de la ruta correcta

export const Flota = () => {
    const [activeTab, setActiveTab] = useState('vehiculos');
    const [showModal, setShowModal] = useState(false);
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

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
                                                    <input type="text" className="form-control" placeholder="Ingrese el nombre del vehículo" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Placa</label>
                                                    <input type="text" className="form-control" placeholder="Ingrese la placa del vehículo" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Remolque (opcional)</label>
                                                    <input type="text" className="form-control" placeholder="Ingrese el remolque, si aplica" />
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="form-content">
                                            <h5> Detalles del Conductor</h5>
                                            <form>
                                                <div className="mb-3">
                                                    <label className="form-label">Nombre</label>
                                                    <input type="text" className="form-control" placeholder="Ingrese el nombre del conductor" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Apellidos</label>
                                                    <input type="text" className="form-control" placeholder="Ingrese los apellidos" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Fecha de Nacimiento</label>
                                                    <DatePicker
                                                        selectedDate={fechaNacimiento}
                                                        setSelectedDate={setFechaNacimiento}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Población</label>
                                                    <input type="text" className="form-control" placeholder="Ingrese la población" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Ciudad</label>
                                                    <input type="text" className="form-control" placeholder="Ingrese la ciudad" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Sueldo</label>
                                                    <input type="number" className="form-control" placeholder="Ingrese el sueldo €" />
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </Tab.Pane>
                                {activeTab === 'vehiculos' && (
                                    <>
                                        <Tab.Pane eventKey="costo">
                                            <div className="form-content">
                                                <h5>Costo del Vehículo</h5>
                                                <form>
                                                    <div className="mb-3">
                                                        <label className="form-label">Euros por Kilómetro</label>
                                                        <input type="number" className="form-control" placeholder="Ingrese el costo por kilómetro" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Euros por Hora</label>
                                                        <input type="number" className="form-control" placeholder="Ingrese el costo por hora" />
                                                    </div>
                                                </form>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="peajes">
                                            <div className="form-content">
                                                <h5>Peajes del Vehículo</h5>
                                                <form>
                                                    <div className="mb-3">
                                                        <label className="form-label">Recuento de Ejes</label>
                                                        <select className="form-select">
                                                            <option>Seleccionar</option>
                                                            <option>2 ejes</option>
                                                            <option>3 ejes</option>
                                                            <option>4 ejes</option>
                                                            <option>Más de 4 ejes</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Peso Bruto del Vehículo</label>
                                                        <select className="form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Menos de 3,5t</option>
                                                            <option>De 3,5t a 7,5t</option>
                                                            <option>Más de 7,5t</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Tipo de Combustible</label>
                                                        <select className="form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Gasolina</option>
                                                            <option>Diésel</option>
                                                            <option>Eléctrico</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Clase de Emisión</label>
                                                        <select className="form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Euro 1</option>
                                                            <option>Euro 2</option>
                                                            <option>Euro 3</option>
                                                            <option>Euro 4</option>
                                                            <option>Euro 5</option>
                                                            <option>Euro 6</option>
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>
                                        </Tab.Pane>
                                    </>
                                )}
                            </Tab.Content>
                        </Tab.Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};
