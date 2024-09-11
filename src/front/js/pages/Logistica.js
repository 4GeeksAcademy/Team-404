import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import CalculateDistance from '../component/calculateDistance';

const Mapa = () => {
    const apiOptions = {
        apiKey: "AIzaSyBWuBaficPm3aUL-DXQUMK8EUZn8Qttdqs"
    };

    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);
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
                center: { lat: 40.416775, lng: -3.703790 }, // Centro en Madrid por defecto
                zoom: 6,
            });

            const directionsRendererInstance = new window.google.maps.DirectionsRenderer();
            directionsRendererInstance.setMap(mapInstance);

            setMap(mapInstance);
            setDirectionsRenderer(directionsRendererInstance);

            const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current);
            autocomplete.bindTo("bounds", mapInstance);

            autocomplete.addListener('place_changed', function () {
                const place = autocomplete.getPlace();

                if (!place.geometry || !place.geometry.location) {
                    window.alert("No se encontraron detalles para: '" + place.name + "'");
                    return;
                }

                if (place.geometry.viewport) {
                    mapInstance.fitBounds(place.geometry.viewport);
                } else {
                    mapInstance.setCenter(place.geometry.location);
                    mapInstance.setZoom(17);
                }
            });
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
        <div className="container-fluid d-flex flex-column" style={{ height: "100vh" }}>
            <div className="row flex-grow-1">
                <div className="col-lg-4 col-md-12 d-flex flex-column">
                    <h1 className="mb-4">Planner</h1>
                    <input
                        ref={autocompleteRef}
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar lugares"
                    />
                    <CalculateDistance
                        map={map}
                        onRouteCalculated={handleRouteCalculated}
                        onRouteInfo={handleRouteInfo}
                        onInputChange={clearRoute}
                    />
                </div>
                <div className="col-lg-8 d-flex flex-column">
                    <div
                        ref={mapRef}
                        style={{ flexGrow: 1 }}
                        className="border"
                    ></div>
                </div>
            </div>
            {routeInfo && (
                <div className="row bg-light py-2">
                    <div className="col">
                        <strong>Distancia:</strong> {routeInfo.distance}
                    </div>
                    <div className="col">
                        <strong>Hora:</strong> {routeInfo.duration}
                    </div>
                    <div className="col">
                        <strong>Coste por km:</strong> {routeInfo.costPerKm}€/km
                    </div>
                    <div className="col">
                        <strong>Costes totales:</strong> {routeInfo.totalCost}€
                    </div>
                    <div className="col">
                        <strong>Peaje:</strong> {routeInfo.toll}€
                    </div>
                    <div className="col">
                        <strong>Precio por km:</strong> {routeInfo.pricePerKm}€/km
                    </div>
                    <div className="col">
                        <strong>Beneficio:</strong> {routeInfo.profit}€
                    </div>
                    <div className="col">
                        <strong>Precio:</strong> {routeInfo.price}€
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mapa;