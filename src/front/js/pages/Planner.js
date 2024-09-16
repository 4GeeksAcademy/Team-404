import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import CalculateDistance from '../component/calculateDistance';
import { FaTruck } from "react-icons/fa";

const Mapa = () => {
    const apiOptions = {
        apiKey: "AIzaSyBWuBaficPm3aUL-DXQUMK8EUZn8Qttdqs"
    };

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar

    useEffect(() => {
        const loader = new Loader({
            apiKey: apiOptions.apiKey,
            version: "weekly",
            libraries: ["places"]
        });

        loader.load().then(() => {
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: { lat: 40.416775, lng: -3.703790 },
                zoom: 6,
            });

            const directionsRendererInstance = new window.google.maps.DirectionsRenderer();
            directionsRendererInstance.setMap(mapInstance);

            setMap(mapInstance);
            setDirectionsRenderer(directionsRendererInstance);
        });
    }, []);

    const handleRouteCalculated = (result) => {
        if (directionsRenderer) {
            directionsRenderer.setDirections(result);
        }
    };

    const handleRouteInfo = (info) => {
        setRouteInfo(info);
    };

    const clearRoute = () => {
        if (directionsRenderer) {
            directionsRenderer.setDirections({ routes: [] });
        }
        setRouteInfo(null);
    };

    return (
        <div className="container-fluid mt-4">
            {/* Sidebar as a navbar on the left */}
            <div
                className="sidebar"
                style={{
                    width: sidebarOpen ? "300px" : "60px", // Aumentado el ancho para que todo el contenido sea visible
                    position: "fixed",
                    top: "60px", // Evitamos superponer la barra superior
                    left: 0,
                    height: "calc(100vh - 60px)", // Ajustado para respetar la altura total menos la barra superior
                    backgroundColor: "#343a40",
                    transition: "width 0.3s ease-in-out",
                    zIndex: 1000, // Nos aseguramos que esté sobre los demás elementos
                    overflowY: "auto" // Permitimos scroll dentro de la barra lateral
                }}
            >
                <button
                    className="btn btn-primary"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#fff",
                        padding: "15px",
                        fontSize: "1.5rem",
                    }}
                >
                    <FaTruck />
                </button>
                {sidebarOpen && (
                    <div style={{ padding: "20px", color: "#fff" }}>
                        <h1 className="mb-4" style={{ fontSize: "1.2rem" }}>Planner</h1>
                        <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                            {/* Área desplazable para el contenido */}
                            <CalculateDistance
                                map={map}
                                onRouteCalculated={handleRouteCalculated}
                                onRouteInfo={handleRouteInfo}
                                onClearRoute={clearRoute}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Ajustamos el mapa para que se mueva con la barra lateral */}
            <div
                style={{
                    marginLeft: sidebarOpen ? "300px" : "60px", // Ajustamos según el tamaño de la barra
                    transition: "margin-left 0.3s ease-in-out",
                    width: sidebarOpen ? "calc(100% - 300px)" : "calc(100% - 60px)"
                }}
            >
                <div
                    ref={mapRef}
                    style={{
                        height: "80vh", // Aumentamos la altura para llenar más el espacio
                        borderRadius: "10px",
                        border: "2px solid #007BFF",
                        width: "100%",
                        transition: "width 0.3s ease-in-out"
                    }}
                    className="border mb-4"
                ></div>

                {routeInfo && (
                    <div className="mt-4 border rounded p-3">
                        <h3>Información de la ruta</h3>
                        <div className="row">
                            <div className="col">
                                <table className="table table-striped table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Distancia</th>
                                            <td>{routeInfo.distance}</td>
                                        </tr>
                                        <tr>
                                            <th>Duración</th>
                                            <td>{routeInfo.duration}</td>
                                        </tr>
                                        <tr>
                                            <th>Costes totales</th>
                                            <td>{routeInfo.totalCost}</td>
                                        </tr>
                                        <tr>
                                            <th>Peaje</th>
                                            <td>{routeInfo.toll}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col">
                                <table className="table table-striped table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Beneficio</th>
                                            <td>{routeInfo.profit}</td>
                                        </tr>
                                        <tr>
                                            <th>Precio</th>
                                            <td>{routeInfo.price}</td>
                                        </tr>
                                        {routeInfo.surcharge && parseFloat(routeInfo.surcharge) > 0 && (
                                            <tr>
                                                <th>Recargo</th>
                                                <td>{routeInfo.surcharge}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mapa;
