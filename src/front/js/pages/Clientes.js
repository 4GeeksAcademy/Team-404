import React, { useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { LuPenSquare } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import '../../styles/Clientes.css';

const ClientListTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClientIndex, setEditingClientIndex] = useState(null); // Almacenar el índice del cliente que se está editando

    // Estado para almacenar el nuevo cliente o cliente editado
    const [newClient, setNewClient] = useState({
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
    });

    // Estado para la lista de clientes
    const [clients, setClients] = useState([
        {
            name: 'prueba prueba',
            contact: 'prueba prueba prueba',
            email: 'prueba@gmail.com',
            phone: '56486489489'
        },
        {
            name: 'Por ejemplo, ibarho GmbH',
            contact: 'Max Doe',
            email: 'm.mustermann@email.com',
            phone: '1-541-754-3010'
        }
    ]);

    // Función para manejar los cambios de los inputs del modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));
    };

    // Función para manejar la adición o actualización del cliente
    const handleSubmit = (e) => {
        e.preventDefault();

        const clientToAddOrEdit = {
            name: newClient.firstName + ' ' + newClient.lastName,
            contact: newClient.firstName + ' ' + newClient.lastName,
            email: newClient.email,
            phone: newClient.phone
        };

        if (editingClientIndex !== null) {
            // Actualizar el cliente existente
            const updatedClients = [...clients];
            updatedClients[editingClientIndex] = clientToAddOrEdit;
            setClients(updatedClients);
        } else {
            // Agregar nuevo cliente
            setClients(prevClients => [...prevClients, clientToAddOrEdit]);
        }

        // Cerrar el modal y reiniciar los campos del formulario
        setIsModalOpen(false);
        setEditingClientIndex(null);
        setNewClient({
            name: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
        });
    };

    // Función para eliminar cliente por índice
    const handleDeleteClient = (indexToDelete) => {
        setClients(prevClients => prevClients.filter((_, index) => index !== indexToDelete));
    };

    // Función para abrir el modal en modo de edición con datos precargados
    const handleEditClient = (indexToEdit) => {
        const client = clients[indexToEdit];
        const [firstName, lastName] = client.name.split(' '); // Dividir el nombre completo en primer nombre y apellido
        setNewClient({
            firstName,
            lastName,
            phone: client.phone,
            email: client.email,
        });
        setEditingClientIndex(indexToEdit); // Almacenar el índice del cliente que estamos editando
        setIsModalOpen(true); // Abrir el modal
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-semibold">Clientes</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-warning text-white">+ Agregar cliente</button>
            </div>

            {/* Tabla de clientes */}
            <table className="table table-bordered w-100">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Persona de contacto</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr key={index}>
                            <td>{client.name}</td>
                            <td>
                                {client.contact}<br />
                                <span className="text-secondary">{client.email}</span>
                            </td>
                            <td>{client.phone}</td>
                            <td>
                                <div className="d-flex justify-content-around">
                                    <button
                                        className="btn btn-light btn-sm"
                                        onClick={() => handleEditClient(index)} // Abrir modal en modo edición
                                    >
                                        <LuPenSquare />
                                    </button>
                                    <button
                                        className="btn btn-light btn-sm text-danger"
                                        onClick={() => handleDeleteClient(index)} // Llamada a la función de eliminación
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar o editar cliente */}
            {isModalOpen && (
                <>
                    <div className="modal-backdrop-custom"></div> {/* Fondo gris claro personalizado */}
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                    <h5 className="modal-title">{editingClientIndex !== null ? 'Editar cliente' : 'Agregar cliente'}</h5>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <MdGroups className="fs-1" />
                                    </div>
                                    <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
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
                                            <button type="button" className="btn btn-danger" onClick={() => setIsModalOpen(false)}>Cancelar</button>
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
    );
};

export default ClientListTable;
