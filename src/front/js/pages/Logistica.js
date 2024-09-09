import React, { useEffect, useRef, useState } from 'react';

const Mapa = () => {
    const apiOptions = {
        apiKey: "AIzaSyBWuBaficPm3aUL-DXQUMK8EUZn8Qttdqs"
        // apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    };

    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);

    useEffect(() => {
        const loadMap = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const myLatLng = { lat: latitude, lng: longitude };

                        const mapInstance = new window.google.maps.Map(mapRef.current, {
                            center: myLatLng,
                            zoom: 12,
                        });

                        const markerInstance = new window.google.maps.Marker({
                            position: myLatLng,
                            map: mapInstance,
                        });

                        const infoWindowInstance = new window.google.maps.InfoWindow();

                        setMap(mapInstance);
                        setMarker(markerInstance);
                        setInfoWindow(infoWindowInstance);

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

                            markerInstance.setPosition(place.geometry.location);
                            markerInstance.setVisible(true);

                            let content = `<h2>${place.name}</h2>`;
                            if (place.formatted_address) {
                                content += `<p>${place.formatted_address}</p>`;
                            }
                            if (place.website) {
                                content += `<a href="${place.website}" target="_blank">Sitio web</a>`;
                            }

                            infoWindowInstance.setContent(content);
                            infoWindowInstance.open(mapInstance, markerInstance);
                        });
                    },
                    () => {
                        handleLocationError(true, mapRef.current.getCenter());
                    }
                );
            } else {
                handleLocationError(false, mapRef.current.getCenter());
            }
        };

        const handleLocationError = (browserHasGeolocation, pos) => {
            const content = browserHasGeolocation ?
                'Error: El servicio de geolocalización falló.' :
                'Error: Tu navegador no soporta geolocalización.';
            alert(content);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiOptions.apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMap = loadMap;

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100">
                <div className="col-lg-10 col-md-12 mx-auto">
                    <h1 className="text-center mb-4">MAPA</h1>
                    <input
                        ref={autocompleteRef}
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar lugares"
                    />
                    <div
                        ref={mapRef}
                        style={{ width: "100%", height: "80vh" }}
                        className="border"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Mapa;