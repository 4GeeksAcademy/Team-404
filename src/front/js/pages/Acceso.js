import React from 'react'
import { Link } from 'react-router-dom';

const LoginForm = () => {
    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card p-4" style={{ maxWidth: '400px', border: '1px solid #ccc' }}>
                <h3 className="text-center mb-4">Iniciar sesión</h3>
                <form>
                    <div className="form-group mb-3">
                        <label htmlFor="username" style={{ color: '#26c6da' }}>Correo</label>
                        <input type="text" className="form-control" id="username" placeholder="E-mail" />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" style={{ color: '#26c6da' }}>Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Contraseña" />
                    </div>
                    <div className="form-group text-right mb-4">
                        <a href="#" className="text-decoration-none" style={{ color: '#007bff' }}><u>He olvidado mi contraseña</u></a>
                    </div>
                    <button type="submit" className="btn btn-danger w-100 mb-4" style={{ backgroundColor: '#ff0055' }}>Iniciar sesión</button>
                </form>
                <hr />
                <div className="text-center mb-3">
                    <span>¿Eres nuevo cliente?</span>
                </div>
                <Link to="/crearCuenta">
                    <button className="btn btn-outline-secondary w-100">Crear cuenta</button>
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
