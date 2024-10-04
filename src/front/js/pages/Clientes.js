import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from "react-icons/fa";
import { LuPenSquare } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import '../../styles/Clientes.css';
import ControlPanel from '../component/panelControl';


const ClientListTable = () => {
    // Estados para manejar la interfaz de usuario y los datos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClientIndex, setEditingClientIndex] = useState(null);
    const [newClient, setNewClient] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
    });
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null); // Nuevo estado para manejar errores

    // Efecto para cargar los clientes al montar el componente 
    useEffect(() => {
        axios.get(`${process.env.BACKEND_URL}/api/clients`)
            .then(response => {
                setClients(response.data);
            })
            .catch(error => {
                console.error('Error fetching clients:', error);
                setError('Hubo un error al cargar los clientes. Por favor, recargue la página.');
            });
    }, []);

    // Manejador para cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));
    };

    // Función para cerrar el modal y limpiar los campos
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClientIndex(null);
        setNewClient({ firstName: '', lastName: '', phone: '', email: '' });
        setError(null); // Limpiar cualquier error al cerrar el modal
    };

    // Manejador para enviar el formulario (crear o actualizar cliente)
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        // Verificar si el email ya existe (para nuevos clientes)
        if (editingClientIndex === null && clients.some(client => client.email === newClient.email)) {
            setError('Este correo electrónico ya está en uso. Por favor, use uno diferente.');
            return;
        }

        const clientData = {
            first_name: newClient.firstName,
            last_name: newClient.lastName,
            email: newClient.email,
            phone: newClient.phone
        };

        const url = editingClientIndex !== null
            ? `${process.env.BACKEND_URL}/api/clients/${clients[editingClientIndex].id}`
            : `${process.env.BACKEND_URL}/api/clients`;

        const method = editingClientIndex !== null ? 'put' : 'post';

        axios[method](url, clientData, { timeout: 5000 })
            .then(response => {
                if (editingClientIndex !== null) {
                    const updatedClients = [...clients];
                    updatedClients[editingClientIndex] = response.data;
                    setClients(updatedClients);
                } else {
                    setClients(prevClients => [...prevClients, response.data]);
                }
                closeModal(); // Usar la nueva función closeModal
            })
            .catch(error => {
                if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
                    setError('El correo electrónico ya existe. Por favor, use uno diferente.');
                } else {
                    setError('Hubo un error al procesar su solicitud. Por favor, inténtelo de nuevo.');
                }
                console.error('Error processing client:', error);
            });
    };

    // Manejador para eliminar un cliente
    const handleDeleteClient = (indexToDelete) => {
        const clientId = clients[indexToDelete].id;
        axios.delete(`${process.env.BACKEND_URL}/api/clients/${clientId}`)
            .then(() => {
                setClients(prevClients => prevClients.filter((_, index) => index !== indexToDelete));
            })
            .catch(error => {
                console.error('Error deleting client:', error);
                setError('Hubo un error al eliminar el cliente. Por favor, inténtelo de nuevo.');
            });
    };

    // Manejador para editar un cliente
    const handleEditClient = (indexToEdit) => {
        const client = clients[indexToEdit];
        setNewClient({
            firstName: client.first_name,
            lastName: client.last_name,
            phone: client.phone,
            email: client.email,
        });
        setEditingClientIndex(indexToEdit);
        setIsModalOpen(true);
    };

    return (
        <div className="min-vh-100 d-flex">
            <ControlPanel />
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-semibold">Clientes</h2>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-warning text-black"><strong>+ Agregar cliente</strong></button>
                </div>

                {/* Mostrar errores generales */}
                {error && !isModalOpen && (
                    <div className="alert alert-danger mt-3">{error}</div>
                )}

                {/* Tabla de clientes */}
                <table className="table table-bordered w-100">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre</th>
                            <th>Correo electrónico</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <tr key={index}>
                                <td>{client.first_name} {client.last_name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <button
                                            className="btn btn-light btn-sm"
                                            onClick={() => handleEditClient(index)}
                                        >
                                            <LuPenSquare />
                                        </button>
                                        <button
                                            className="btn btn-light btn-sm text-danger"
                                            onClick={() => handleDeleteClient(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal para agregar o editar clientes */}
                {isModalOpen && (
                    <>
                        <div className="modal-backdrop-custom"></div>
                        <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                        <h5 className="modal-title">{editingClientIndex !== null ? 'Editar cliente' : 'Agregar cliente'}</h5>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <MdGroups className="fs-1" />
                                        </div>
                                        <button type="button" className="btn-close" onClick={closeModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            {/* Mostrar errores específicos del formulario */}
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <div className="mb-3">
                                                <label className="form-label">Nombre</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={newClient.firstName}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Apellido</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={newClient.lastName}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label">Teléfono</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={newClient.phone}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Correo electrónico</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={newClient.email}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="modal-footer mt-3">
                                                <button type="button" className="btn btn-danger" onClick={closeModal}>Cancelar</button>
                                                <button type="submit" className="btn btn-warning">{editingClientIndex !== null ? 'Actualizar' : 'Crear'}</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientListTable;