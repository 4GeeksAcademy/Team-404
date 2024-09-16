import React, { useState, useEffect } from 'react';

const CalculateDistance = ({ map, onRouteCalculated, onRouteInfo, onClearRoute }) => {
  const [stops, setStops] = useState([
    { location: '', key: 0 },
    { location: '', key: 1 }
  ]);
  const [cargoWeight, setCargoWeight] = useState(0);
  const [containerType, setContainerType] = useState('');
  const [tarifa, setTarifa] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showWeightAlert, setShowWeightAlert] = useState(false);

  const additionalOptions = [
    'Nocturnidad',
    'Mercancía peligrosa',
    'Festivo',
    'Basculante'
  ];

  useEffect(() => {
    if (window.google && map) {
      stops.forEach((stop, index) => {
        const autocomplete = new window.google.maps.places.Autocomplete(
          document.getElementById(`location-${index}`)
        );
        autocomplete.bindTo("bounds", map);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            updateStop(index, 'location', place.formatted_address);
          }
        });
      });
    }
  }, [map, stops]);

  useEffect(() => {
    checkWeightLimit();
  }, [cargoWeight, containerType]);

  const checkWeightLimit = () => {
    // Define the weight limits for each container type
    if ((containerType === '20' || containerType === '20reefer') && cargoWeight > 25) {
      setShowWeightAlert(true);
    } else if ((containerType === '40' || containerType === '40reefer') && cargoWeight > 24) {
      setShowWeightAlert(true);
    } else {
      setShowWeightAlert(false);
    }
  };

  const updateStop = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const addStop = () => {
    setStops([...stops, { location: '', key: stops.length }]);
  };

  const removeStop = (index) => {
    if (stops.length > 2) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const calculateRoute = () => {
    if (!window.google || !map) {
      console.error('Google Maps API not loaded');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = stops.slice(1, -1).map(stop => ({
      location: stop.location,
      stopover: true
    }));

    const request = {
      origin: stops[0].location,
      destination: stops[stops.length - 1].location,
      waypoints: waypoints,
      travelMode: 'DRIVING'
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        onRouteCalculated(result);

        const route = result.routes[0];
        let totalDistance = 0;
        let totalDuration = 0;

        route.legs.forEach(leg => {
          totalDistance += leg.distance.value;
          totalDuration += leg.duration.value;
        });

        const distanceKm = totalDistance / 1000; // Convert to km
        const durationHours = totalDuration / 3600; // Convert to hours

        let price = distanceKm * parseFloat(tarifa); // Base price

        // Apply weight surcharge if necessary
        if (showWeightAlert) {
          price *= 1.25; // 25% surcharge
        }

        const surchargePercentage = selectedOptions.length * 0.05;
        const surcharge = price * surchargePercentage;

        const routeInfo = {
          distance: `${distanceKm.toFixed(2)} km`,
          duration: `${durationHours.toFixed(2)} horas`,
          pricePerKm: `€${parseFloat(tarifa).toFixed(2)}`,
          price: `€${(price + surcharge).toFixed(2)}`, // Final price including surcharges
          surcharge: `€${surcharge.toFixed(2)}`,
          toll: 'N/A',
          profit: `€${price.toFixed(2)}` // Base price
        };

        onRouteInfo(routeInfo);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  };

  const resetRoute = () => {
    setStops([
      { location: '', key: 0 },
      { location: '', key: 1 }
    ]);
    setCargoWeight(0);
    setContainerType('');
    setTarifa('');
    setSelectedOptions([]);
    setShowWeightAlert(false);
    onClearRoute();
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Paradas</h5>
        {stops.map((stop, index) => (
          <div key={stop.key} className="mb-2 d-flex align-items-center">
            <input
              id={`location-${index}`}
              type="text"
              className="form-control me-2"
              placeholder={index === 0 ? "Origen" : index === stops.length - 1 ? "Destino final" : `Parada ${index}`}
              value={stop.location}
              onChange={(e) => updateStop(index, 'location', e.target.value)}
            />
            {index === stops.length - 1 && (
              <button className="btn btn-outline-secondary me-2" onClick={addStop}>+</button>
            )}
            {stops.length > 2 && index !== 0 && index !== stops.length - 1 && (
              <button className="btn btn-outline-danger" onClick={() => removeStop(index)}>×</button>
            )}
          </div>
        ))}

        <div className="mt-3">
          <label>Tipo de contenedor:</label>
          <div className="input-group">
            <select
              className="form-select"
              value={containerType}
              onChange={(e) => setContainerType(e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              <option value="20">20'</option>
              <option value="40">40'</option>
              <option value="20reefer">20' Reefer</option>
              <option value="40reefer">40' Reefer</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label>Peso de la carga (toneladas):</label>
          <input
            type="number"
            className="form-control"
            value={cargoWeight}
            onChange={(e) => setCargoWeight(parseFloat(e.target.value))}
            placeholder="Ingresa el peso de la carga"
          />
        </div>

        {showWeightAlert && (
          <div className="alert alert-warning mt-3">
            Recibirás un recargo del 25% debido al exceso de peso.
          </div>
        )}

        <div className="mt-3">
          <h5 className="card-title mb-3">Introducir Tarifa</h5>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={tarifa}
              onChange={(e) => setTarifa(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
            <span className="input-group-text">€/km</span>
          </div>
        </div>

        <div className="mt-3">
          <h5 className="card-title mb-3">Opciones Adicionales</h5>
          <div className="d-flex flex-wrap">
            {additionalOptions.map((option, index) => (
              <div key={index} className="form-check me-3 mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`option-${index}`}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                <label className="form-check-label" htmlFor={`option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <button onClick={calculateRoute} className="btn btn-primary me-2">Calcular ruta</button>
          <button onClick={resetRoute} className="btn btn-secondary">Resetear</button>
        </div>
      </div>
    </div>
  );
};

export default CalculateDistance;
