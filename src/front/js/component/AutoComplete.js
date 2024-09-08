import React, { useEffect, useState } from 'react';

const GoogleMapAutocomplete = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      // Cargar las bibliotecas necesarias de Google Maps
      const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
      ]);

      // Inicializar el mapa
      const mapInstance = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapId: '4504f8b37365c3d0',
        mapTypeControl: false,
      });

      // Crear el elemento de autocompletado
      const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();

      // Agregar el autocompletado al DOM
      const card = document.getElementById('place-autocomplete-card');
      card.appendChild(placeAutocomplete);
      mapInstance.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

      // Crear el marcador y la ventana de información
      const markerInstance = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
      });

      const infoWindowInstance = new google.maps.InfoWindow({});

      // Listener para el evento "gmp-placeselect"
      placeAutocomplete.addEventListener('gmp-placeselect', async ({ place }) => {
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location'],
        });

        // Si el lugar tiene geometría, centrar el mapa en el lugar
        if (place.viewport) {
          mapInstance.fitBounds(place.viewport);
        } else {
          mapInstance.setCenter(place.location);
          mapInstance.setZoom(17);
        }

        // Crear el contenido de la ventana de información
        const content = `
          <div id="infowindow-content">
            <span id="place-displayname" class="title">${place.displayName}</span><br />
            <span id="place-address">${place.formattedAddress}</span>
          </div>
        `;

        // Actualizar la ventana de información
        updateInfoWindow(content, place.location);
        markerInstance.position = place.location;
      });

      // Establecer el mapa, marcador y ventana de información en el estado
      setMap(mapInstance);
      setMarker(markerInstance);
      setInfoWindow(infoWindowInstance);
    };

    // Inicializar el mapa
    initMap();

    // Función auxiliar para actualizar la ventana de información
    const updateInfoWindow = (content, center) => {
      infoWindow.setContent(content);
      infoWindow.setPosition(center);
      infoWindow.open({
        map,
        anchor: marker,
        shouldFocus: false,
      });
    };
  }, [map, marker, infoWindow]);

  return (
    <div>
      <div id="place-autocomplete-card" style={{ padding: '10px' }}>
        {/* Aquí se agregará el campo de autocompletado */}
      </div>
      <div id="map" style={{ width: '100%', height: '700px' }}></div>
    </div>
  );
};

export default GoogleMapAutocomplete;
