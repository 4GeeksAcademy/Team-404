// Mapa.js
import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Autocomplete from '../component/AutoComplete';// Importa el componente Autocomplete
import MarkerClusterer from '@google/markerclustererplus';
import custom_pin2 from '../../img/custom_pin2.png';

const Mapa = () => {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    const apiOptions = {
        apiKey: "AIzaSyBWuBaficPm3aUL-DXQUMK8EUZn8Qttdqs", // Reemplaza con tu clave de API real
    };

    useEffect(() => {
        const loadMap = async () => {
            const loader = new Loader(apiOptions);
            await loader.load();

            console.log('Maps JS API loaded');
            const mapInstance = displayMap();
            setMap(mapInstance);
            const markerArray = addMarkers(mapInstance);
            setMarkers(markerArray);
            clusterMarkers(mapInstance, markerArray);
        };

        loadMap();

        function displayMap() {
            const mapOptions = {
                center: { lat: -33.860664, lng: 151.208138 },
                zoom: 12,
            };
            const mapDiv = document.getElementById('map');
            return new google.maps.Map(mapDiv, mapOptions);
        }

        function addMarkers(map) {
            const locations = {
                operaHouse: { lat: -33.8567844, lng: 151.213108 },
                // Agrega más ubicaciones aquí
            };
            const markers = [];
            for (const location in locations) {
                const markerOptions = {
                    map: map,
                    position: locations[location],
                    icon: custom_pin2, // Usar la URL o ruta de la imagen directamente
                };
                const marker = new google.maps.Marker(markerOptions);
                markers.push(marker);
            }
            return markers;
        }

        function clusterMarkers(map, markers) {
            const clustererOptions = { imagePath: '../../img/m' };
            new MarkerClusterer(map, markers, clustererOptions);
        }
    }, []);

    const handlePlaceSelected = (place) => {
        if (place.geometry && map) {
            map.panTo(place.geometry.location);
            map.setZoom(14);
        }
    };

    return (
        <div>
            <h1>MAPA</h1>
            <div className="bg-gray d-flex justify-content-start">
                <Autocomplete onPlaceSelected={handlePlaceSelected} /> {/* Usa el Autocomplete */}
            </div>
            <div id="map" style={{ width: '100%', height: '700px' }}></div>
        </div>
    );
};

export default Mapa;
