import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element }) => {
    const { isLogged } = useContext(AuthContext);

    if (!isLogged) {
        // Redirige a la página de inicio si el usuario no está autenticado
        return <Navigate to="/" />;
    }

    return element; // Si está autenticado, renderiza la ruta protegida
};

export default PrivateRoute;
