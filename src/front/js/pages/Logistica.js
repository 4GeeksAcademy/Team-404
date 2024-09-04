import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';
import custom_pin2 from '../../img/custom_pin2.png';

const Mapa = () => {
    const apiOptions = {
        apiKey: "AIzaSyBWuBaficPm3aUL-DXQUMK8EUZn8Qttdqs", // Reemplaza con tu clave de API real
    };

    useEffect(() => {
        const loadMap = async () => {
            const loader = new Loader(apiOptions);
            await loader.load();

            console.log('Maps JS API loaded');
            
            // Import the places library after loading the API
            const { Place } = await google.maps.importLibrary("places");

            const map = displayMap();
            const markers = addMarkers(map);
            clusterMarkers(map, markers);
            addPanToMarker(map, markers);
        };

        loadMap();  // Call the async function

        function displayMap() {
            const mapOptions = {
                center: { lat: -33.860664, lng: 151.208138 },
                zoom: 12
            };
            const mapDiv = document.getElementById('map');
            return new google.maps.Map(mapDiv, mapOptions);
        }

        function addMarkers(map) {
            const locations = {
                operaHouse: { lat: -33.8567844, lng: 151.213108 },
                tarongaZoo: { lat: -33.8472767, lng: 151.2188164 },
                manlyBeach: { lat: -33.8209738, lng: 151.2563253 },
                hyderPark: { lat: -33.8690081, lng: 151.2052393 },
                theRocks: { lat: -33.8587568, lng: 151.2058246 },
                circularQuay: { lat: -33.858761, lng: 151.2055688 },
                harbourBridge: { lat: -33.852228, lng: 151.2038374 },
                kingsCross: { lat: -33.8737375, lng: 151.222569 },
                botanicGardens: { lat: -33.864167, lng: 151.216387 },
                museumOfSydney: { lat: -33.8636005, lng: 151.2092542 },
                maritimeMuseum: { lat: -33.869395, lng: 151.198648 },
                kingStreetWharf: { lat: -33.8665445, lng: 151.1989808 },
                aquarium: { lat: -33.869627, lng: 151.202146 },
                darlingHarbour: { lat: -33.87488, lng: 151.1987113 },
                barangaroo: { lat: -33.8605523, lng: 151.1972205 },
                bilbao: { lat: 43.26271, lng: -2.92528 }
            };
            const markers = [];
            for (const location in locations) {
                const markerOptions = {
                    map: map,
                    position: locations[location],
                    icon: custom_pin2  // Usar la URL o ruta de la imagen directamente
                };
                const marker = new google.maps.Marker(markerOptions);
                markers.push(marker);
            }
            return markers;
        }

        function clusterMarkers(map, markers) {
            const clustererOptions = { imagePath: '../../img/m' }; // Asegúrate de que esta ruta es correcta
            new MarkerClusterer(map, markers, clustererOptions);
        }

        function drawCircle(map, location) {
            const circleOptions = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                map: map,
                center: location,
                radius: 800
            };
            const circle = new google.maps.Circle(circleOptions);
            return circle;
        }

        function addPanToMarker(map, markers) {
            let circle;
            markers.forEach(marker => {
                marker.addListener('click', event => {
                    const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                    map.panTo(location);
                    if (circle) {
                        circle.setMap(null);
                    }
                    circle = drawCircle(map, location);
                });
            });
        }

    }, []);  // Empty array ensures the effect runs only once

    return (
        <div>
            <h1>MAPA</h1>
            <div className="bg-gray d-flex justify-content-start">
                <input type="text" id="place-input" className="input" />
            </div>
            <div id="map" style={{ width: '100%', height: '700px' }}></div>
        </div>
    );
};

export default Mapa;
