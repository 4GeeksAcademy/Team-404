import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect.
import axios from 'axios'; // Importa axios para hacer peticiones HTTP.
import { FaTrash } from "react-icons/fa"; // Importa el icono de un bote de basura (para eliminar clientes).
import { LuPenSquare } from "react-icons/lu"; // Importa el icono de un lápiz para editar clientes.
import { MdGroups } from "react-icons/md"; // Importa el icono de un grupo para la cabecera del modal.
import '../../styles/Clientes.css'; // Importa los estilos CSS específicos para esta componente.


const ClientListTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto o cerrado.
    const [editingClientIndex, setEditingClientIndex] = useState(null); // Guarda el índice del cliente que está siendo editado.
    const [newClient, setNewClient] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
    }); // Estado para manejar la información del cliente que se está creando o editando.
    const [clients, setClients] = useState([]); // Almacena la lista de clientes que se obtienen del backend.


    useEffect(() => {
        axios.get('https://curly-umbrella-pj7vjjxqwxqr2v74-3001.app.github.dev/api/clients') // Hace una petición GET para obtener la lista de clientes.
            .then(response => {
                setClients(response.data); // Almacena la lista de clientes en el estado 'clients'.
            })
            .catch(error => {
                console.error('Error fetching clients:', error); // Maneja errores en la petición.
            });
    }, []); // Este `useEffect` se ejecuta una sola vez cuando el componente se monta.

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value })); // Actualiza el estado de 'newClient' a medida que el usuario cambia los valores en los inputs.
    };


    // Add or update client (POST/PUT)
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página.
        const clientData = {
            first_name: newClient.firstName,
            last_name: newClient.lastName,
            email: newClient.email,
            phone: newClient.phone
        }; // Crea un objeto con los datos del cliente a partir del estado 'newClient'.

        if (editingClientIndex !== null) { // Si se está editando un cliente (es decir, 'editingClientIndex' no es null):
            const clientId = clients[editingClientIndex].id; // Obtiene el ID del cliente que se está editando.
            axios.put(`https://curly-umbrella-pj7vjjxqwxqr2v74-3001.app.github.dev/api/clients/${clientId}`, clientData) // Hace una petición PUT para actualizar al cliente.
                .then(response => {
                    const updatedClients = [...clients];
                    updatedClients[editingClientIndex] = response.data; // Actualiza la lista de clientes en el estado.
                    setClients(updatedClients); // Guarda los clientes actualizados en el estado.
                })
                .catch(error => {
                    console.error('Error updating client:', error); // Maneja errores en la actualización.
                });
        } else { // Si se está creando un nuevo cliente:
            axios.post('https://curly-umbrella-pj7vjjxqwxqr2v74-3001.app.github.dev/api/clients', clientData, {
                timeout: 5000 // por ejemplo, 5 segundos
            }) // Hace una petición POST para agregar un nuevo cliente.
                .then(response => {
                    setClients(prevClients => [...prevClients, response.data]); // Añade el nuevo cliente a la lista de clientes.
                })
                .catch(error => {
                    console.error('Error adding client:', error); // Maneja errores en la creación.
                });
        }

        setIsModalOpen(false); // Cierra el modal después de enviar el formulario.
        setEditingClientIndex(null); // Resetea el índice de edición a null.
        setNewClient({ firstName: '', lastName: '', phone: '', email: '' }); // Limpia los valores de 'newClient'.
    };

    // Delete client (DELETE request)
    const handleDeleteClient = (indexToDelete) => {
        const clientId = clients[indexToDelete].id; // Obtiene el ID del cliente a eliminar.
        axios.delete(`https://curly-umbrella-pj7vjjxqwxqr2v74-3001.app.github.dev/api/clients/${clientId}`) // Hace una petición DELETE para eliminar el cliente.
            .then(() => {
                setClients(prevClients => prevClients.filter((_, index) => index !== indexToDelete)); // Elimina el cliente de la lista local.
            })
            .catch(error => {
                console.error('Error deleting client:', error); // Maneja errores en la eliminación.
            });
    };

    const handleEditClient = (indexToEdit) => {
        const client = clients[indexToEdit]; // Obtiene el cliente que se va a editar.
        setNewClient({
            firstName: client.first_name,
            lastName: client.last_name,
            phone: client.phone,
            email: client.email,
        }); // Llena el formulario con los datos del cliente seleccionado.
        setEditingClientIndex(indexToEdit); // Guarda el índice del cliente que se está editando.
        setIsModalOpen(true); // Abre el modal para editar al cliente.
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
                        <th>Correo electrónico</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr key={index}>
                            <td>{client.first_name} {client.last_name}</td>
                            <td>
                                {client.email}
                            </td>
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
