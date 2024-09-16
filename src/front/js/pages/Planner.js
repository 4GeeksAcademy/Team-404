import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import CalculateDistance from '../component/calculateDistance';

const Mapa = () => {
    const apiOptions = { apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY };

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);

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
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-4 col-md-12">
                    <h1 className="mb-4">Planner</h1>
                    <CalculateDistance
                        map={map}
                        onRouteCalculated={handleRouteCalculated}
                        onRouteInfo={handleRouteInfo}
                        onClearRoute={clearRoute}
                    />
                </div>
                <div className="col-lg-8 col-md-12">
                    <div
                        ref={mapRef}
                        style={{ height: "60vh", borderRadius: "10px", border: "2px solid #007BFF" }}
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
                                                <th>Peaje</th>
                                                <td>{routeInfo.toll}</td>
                                            </tr>
                                            <tr>
                                                <th>Precio por km</th>
                                                <td>{routeInfo.pricePerKm}</td>
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
                                                <th>Precio a cobrar</th>
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
        </div>
    );
};

export default Mapa;
