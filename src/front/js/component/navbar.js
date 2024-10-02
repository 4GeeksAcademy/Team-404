import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from '../store/appContext';
import '../../styles/navbar.css'; // Archivo CSS actualizado

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [editableUserData, setEditableUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito

    useEffect(() => {
        actions.fetchUserData(); // Cargar datos del usuario al montar el componente
    }, []);

    useEffect(() => {
        if (store.userData) {
            setEditableUserData(store.userData); // Actualizar editableUserData al cargar datos
        }
    }, [store.userData]);

    const handleProfileClick = () => {
        setShowModal(true); // Mostrar el modal al hacer clic en "Mi Perfil"
    };

    const handleProfile = () => {
        navigate('/profile'); // Mostrar el modal al hacer clic en "Mi Perfil"
        window.location.reload()
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false); // Reiniciar el estado de edición
        setSuccessMessage(''); // Reiniciar el mensaje de éxito al cerrar el modal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "fullName") {
            const [firstName, lastName] = value.split(" "); // Divide el valor en nombre y apellido
            setEditableUserData({
                ...editableUserData,
                name: firstName || '',
                last_name: lastName || '',
            });
        } else {
            setEditableUserData({ ...editableUserData, [name]: value });
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`https://effective-space-couscous-v66946px9jwjhxw65-3001.app.github.dev/api/users/${store.userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editableUserData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos del usuario');
            }

            const updatedUser = await response.json();
            actions.updateUserData(updatedUser);

            // Mostrar mensaje de éxito
            setSuccessMessage("Datos de usuario guardados correctamente."); // Establecer mensaje de éxito

            // Actualizar la página de perfil
            setTimeout(() => {
                navigate("/profile"); // Redirigir a la página de perfil para actualizarla
            }, 2000); // Tiempo para mostrar el mensaje de éxito antes de redirigir

            handleCloseModal(); // Cerrar el modal
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };


    const isHomePage = location.pathname === "/";

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark"
                style={{
                    padding: '0.5rem 1.5rem',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    height: '56px'
                }}>
                <div className="container-fluid">
                    {isHomePage ? (
                        <span
                            className="navbar-brand d-flex align-items-center"
                            style={{
                                color: '#000',
                                fontSize: '1.2rem',
                                backgroundColor: '#ffc107',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.3s',
                            }}
                        >
                            RutaTrack
                            <span className="ms-2">🚚</span>
                        </span>
                    ) : (
                        <Link
                            className="navbar-brand d-flex align-items-center"
                            to="#"
                            style={{
                                color: '#000',
                                fontSize: '1.2rem',
                                backgroundColor: '#ffc107',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.3s',
                            }}
                            onClick={handleProfile}
                        >
                            RutaTrack
                            <span className="ms-2">🚚</span>
                        </Link>
                    )}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/" aria-current="page" style={{ color: '#ffc107', fontSize: '0.9rem' }}>Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sobreNosotros" style={{ color: '#ffc107', fontSize: '0.9rem' }}>Nosotros</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Contacto" style={{ color: '#ffc107', fontSize: '0.9rem' }}>Contacto</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    style={{
                                        color: '#000',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#ffc107',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '5px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                        transition: 'all 0.3s',
                                    }}
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {isHomePage ? "¡Bienvenido!" : `Hola ${store.userData && store.userData.name ? store.userData.name : 'Invitado'}!`}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><button className="dropdown-item" onClick={handleProfileClick}>Mi Perfil</button></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="/logout">Cerrar Sesión</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{ height: '56px' }}></div>
            {/* Modal del perfil */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog" style={{ maxWidth: '700px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Perfil del Usuario</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {store.loading ? (
                                    <div className="profile-loading">
                                        <div className="loading-circle"></div>
                                    </div>
                                ) : store.error ? (
                                    <div className="profile-error">
                                        <p>{store.error}</p>
                                    </div>
                                ) : store.userData ? (
                                    <div style={{ backgroundColor: '#d09e14', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)' }}>
                                        <div className="profile-header">
                                            <div className="profile-info">
                                                <h2>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            value={`${editableUserData.name || ''} ${editableUserData.last_name || ''}`}
                                                            onChange={handleInputChange}
                                                            className="form-control"
                                                            placeholder="Nombre y Apellido"
                                                            style={{ marginBottom: '10px' }}
                                                        />
                                                    ) : (
                                                        `${editableUserData.name || ''} ${editableUserData.last_name || ''}`
                                                    )}
                                                </h2>
                                                <div>
                                                    <label style={{ color: '#000', fontWeight: 'bold' }}>Email:</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={editableUserData.email}
                                                            onChange={handleInputChange}
                                                            className="form-control"
                                                            style={{ marginBottom: '10px' }}
                                                        />
                                                    ) : (
                                                        <p>{editableUserData.email}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label style={{ color: '#000', fontWeight: 'bold' }}>Empresa:</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            value={editableUserData.company || ''}
                                                            onChange={handleInputChange}
                                                            className="form-control"
                                                            style={{ marginBottom: '10px' }}
                                                        />
                                                    ) : (
                                                        <p>{editableUserData.company || 'No especificada'}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label style={{ color: '#000', fontWeight: 'bold' }}>Ubicación:</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={editableUserData.location || ''}
                                                            onChange={handleInputChange}
                                                            className="form-control"
                                                            style={{ marginBottom: '10px' }}
                                                        />
                                                    ) : (
                                                        <p>{editableUserData.location || 'No especificada'}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label style={{ color: '#000', fontWeight: 'bold' }}>Cuenta creada en:</label>
                                                    <p>{new Date(editableUserData.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="profile-no-data">
                                        <p>No se encontraron datos del usuario.</p>
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="alert alert-success mt-2">
                                        {successMessage}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                {isEditing ? (
                                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Guardar Cambios</button>
                                ) : (
                                    <button type="button" className="btn btn-warning" onClick={() => setIsEditing(true)}>Editar</button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
