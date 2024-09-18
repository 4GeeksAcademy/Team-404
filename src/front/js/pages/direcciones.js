import React from "react";
import "../../styles/direccion.css";  // Asegúrate de que la ruta al archivo CSS sea correcta

export const Direcciones = () => {
    // Simula un array vacío de direcciones
    const direcciones = []; 

    return (
        <div>
            {/* Contenedor del título y el botón */}
            <div className="direcciones-header">
                <h3>Mis Direcciones</h3>
                <button className="direccion-btn"> Nueva dirección </button>
            </div>

            {/* Si no hay direcciones, muestra el mensaje y el botón */}
            {direcciones.length === 0 ? (
                <div className="no-direcciones">
                    <p>¡Aún no tienes direcciones guardadas!</p>
                    <button className="direccion-btn"> + Nueva dirección </button>
                </div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};
