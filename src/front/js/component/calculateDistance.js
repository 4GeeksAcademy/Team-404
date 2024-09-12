import React, { useState, useEffect, useRef } from 'react';

const CalculateDistance = ({ map, onRouteCalculated, onRouteInfo, onInputChange }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    if (window.google && map) {
      const originAutocomplete = new window.google.maps.places.Autocomplete(originRef.current);
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationRef.current);

      originAutocomplete.bindTo("bounds", map);
      destinationAutocomplete.bindTo("bounds", map);

      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.formatted_address) {
          setOrigin(place.formatted_address);
        }
      });

      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.formatted_address) {
          setDestination(place.formatted_address);
        }
      });
    }
  }, [map]);

  const calculateDistance = () => {
    if (!origin || !destination) {
      alert('Por favor, ingrese tanto el origen como el destino.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          onRouteCalculated(result);
          const distance = result.routes[0].legs[0].distance.text;
          const duration = result.routes[0].legs[0].duration.text;

          // Calcular valores ficticios para los demás campos
          const distanceValue = parseFloat(distance.replace(' km', ''));
          const costPerKm = 1.02;
          const totalCost = (distanceValue * costPerKm).toFixed(2);
          const toll = (24.40).toFixed(2);
          const pricePerKm = 1.12;
          const profit = (76.30).toFixed(2);
          const price = (839.34).toFixed(2);

          onRouteInfo({
            distance,
            duration,
            costPerKm: costPerKm.toFixed(2),
            totalCost,
            toll,
            pricePerKm: pricePerKm.toFixed(2),
            profit,
            price
          });
        } else {
          alert('No se pudo calcular la ruta: ' + status);
        }
      }
    );
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    onInputChange();
  };

  const clearInput = (setter) => () => {
    setter('');
    onInputChange();
  };

  return (
    <div>
      <div className="input-group mb-2">
        <input
          ref={originRef}
          type="text"
          placeholder="Origen"
          value={origin}
          onChange={handleInputChange(setOrigin)}
          className="form-control"
        />
        <button className="btn btn-outline-secondary" type="button" onClick={clearInput(setOrigin)}>
          ×
        </button>
      </div>
      <div className="input-group mb-2">
        <input
          ref={destinationRef}
          type="text"
          placeholder="Destino"
          value={destination}
          onChange={handleInputChange(setDestination)}
          className="form-control"
        />
        <button className="btn btn-outline-secondary" type="button" onClick={clearInput(setDestination)}>
          ×
        </button>
      </div>
      <button onClick={calculateDistance} className="btn btn-primary mb-2">Calcular Distancia y Trazar Ruta</button>
    </div>
  );
};


export default CalculateDistance;