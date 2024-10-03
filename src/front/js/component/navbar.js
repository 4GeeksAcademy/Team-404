import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from '../store/appContext';
import { AuthContext } from "./AuthContext";
import '../../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faHome, faTruck, faUserTie, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [editableUserData, setEditableUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        actions.fetchUserData(); // Cargar datos del usuario al montar el componente
    }, []);

    useEffect(() => {
        if (store.userData) {
            setEditableUserData(store.userData);
        }
    }, [store.userData]);

    const handleProfileClick = () => {
        setShowModal(true);
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSuccessMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "fullName") {
            const [firstName, lastName] = value.split(" ");
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

            setSuccessMessage("Datos de usuario guardados correctamente.");

            setTimeout(() => {
                navigate("/profile");
            }, 2000);

            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    const handleLogout = async (event) => {
        event.preventDefault();
        await logout();
        navigate("/");
    };

    const isHomePage = location.pathname === "/";

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark"
                style={{
                    padding: '0.5rem 1.5rem',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    height: '56px'
                }}>
                <div className="container-fluid">
                    {isHomePage ? (
                        <span className="navbar-brand d-flex align-items-center"
                            style={{
                                color: '#000',
                                fontSize: '1.2rem',
                                backgroundColor: '#ffc107',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.3s',
                            }}>
                            RutaTrack
                            <span className="ms-2">🚚</span>
                        </span>
                    ) : (
                        <Link className="navbar-brand d-flex align-items-center"
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
                            onClick={handleProfile}>
                            RutaTrack
                            <span className="ms-2">🚚</span>
                        </Link>
                    )}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{
                                        marginRight: '10px',
                                        fontWeight: 'bold',
                                    }}>
                                    Panel de Control
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <Link className="dropdown-item" to="/Mapa" onClick={() => { window.location.href = "/Mapa"; }}>
                                            <FontAwesomeIcon icon={faMapMarkedAlt} /> Planner (Ruta)
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/direcciones">
                                            <FontAwesomeIcon icon={faHome} /> Mis Direcciones
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/flota">
                                            <FontAwesomeIcon icon={faTruck} /> Vehículos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/autonomos">
                                            <FontAwesomeIcon icon={faUserTie} /> Autónomos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/clientes">
                                            <FontAwesomeIcon icon={faUsers} /> Clientes
                                        </Link>
                                    </li>
                                </ul>
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
                                    aria-expanded="false">
                                    {isHomePage ? "¡Bienvenido!" : `Hola ${store.userData && store.userData.name ? store.userData.name : 'Invitado'}!`}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><button className="dropdown-item" onClick={handleProfileClick}>Mi Perfil</button></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="/logout"
                                            onClick={handleLogout}>
                                            Cerrar Sesión
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Modal del perfil */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }} aria-hidden="false">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Perfil</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label">Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fullName"
                                            name="fullName"
                                            value={`${editableUserData.name || ''} ${editableUserData.last_name || ''}`}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={editableUserData.email || ''}
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
