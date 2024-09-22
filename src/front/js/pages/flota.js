import React from 'react';
import "../../styles/flota.css";

export const Flota = () => {
    return (
        <div >
            <div className="container mt-4">
                <div className="direcciones-header d-flex justify-content-between align-items-center mb-4">
                    <h3>Vehículos y conductores</h3>
                    <button className="btn btn-primary">Añadir</button>
                </div>
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#">Vehículos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#">Vehículos</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};
