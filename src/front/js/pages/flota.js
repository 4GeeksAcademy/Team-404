import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../store/appContext';
import "../../styles/flota.css";
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import ControlPanel from '../component/panelControl';
import { FaTrash } from "react-icons/fa";
import { LuPenSquare } from "react-icons/lu";


export const Flota = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        placa: '',
        remolque: '',
        costoKm: '',
        costoHora: '',
        ejes: '',
        peso: '',
        combustible: '',
        emision: ''
    });
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Manejar apertura y cierre del modal
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        // Función para obtener vehículos y el ID del usuario
        const obtenerUserIdYVehiculos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No se pudo identificar al usuario. Por favor, vuelva a iniciar sesión.');
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const user_id = decoded.user_id;
                setCurrentUserId(user_id);

                const response = await axios.get(`${process.env.BACKEND_URL}/api/vehiculos?user_id=${user_id}`);
                setVehiculos(response.data);
            } catch (error) {
                setError('Hubo un error al cargar los vehículos. Consulte con el Administrador.');
            }
        };

        obtenerUserIdYVehiculos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const agregarVehiculo = async () => {
        if (!currentUserId) {
            setError('No se pudo identificar al usuario. Vuelva a iniciar sesión.');
            return;
        }

        // Validación del formulario antes de agregar un vehículo
        if (!formData.nombre || !formData.placa || !formData.costoKm || !formData.costoHora) {
            setWarning('Todos los campos obligatorios deben ser llenados.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.BACKEND_URL}/api/vehiculos`, {
                user_id: currentUserId,
                ...formData
            });

            setVehiculos([...vehiculos, response.data.vehiculo]);
            setFormData({
                nombre: '',
                placa: '',
                remolque: '',
                costoKm: '',
                costoHora: '',
                ejes: '',
                peso: '',
                combustible: '',
                emision: ''
            });
            handleCloseModal();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al procesar la solicitud.');
        }
    };

    return (
        <div className="min-vh-100 d-flex">
            <ControlPanel />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Vehículos</h2>
                    <Button className="btn-warning fw-bold" onClick={handleShowModal}>
                        Añadir Vehículo
                    </Button>
                </div>

                <table className="table table-striped">
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
                                <td>{vehiculo.costoKm}</td>
                                <td>{vehiculo.costoHora}</td>
                                <td>
                                    <button className="btn" onClick={() => console.log('Editando...')}><LuPenSquare /></button>
                                    <button className="btn text-danger" onClick={() => console.log('Eliminando...')}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal para añadir vehículo */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Añadir Vehículo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Placa</label>
                                <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Costo por KM</label>
                                <input type="number" name="costoKm" value={formData.costoKm} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Costo por Hora</label>
                                <input type="number" name="costoHora" value={formData.costoHora} onChange={handleInputChange} className="form-control" />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                        <Button variant="primary" onClick={agregarVehiculo}>Guardar Vehículo</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};