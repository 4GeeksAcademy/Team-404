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

  // Nuevo: Función para calcular el consumo de combustible basado en el tipo de contenedor y peso
  const calculateFuelConsumption = (distanceKm) => {
    let baseFuelConsumption;
    switch (containerType) {
      case '20':
      case '20reefer':
        baseFuelConsumption = 28; // 28 litros por 100 km para contenedores de 20'
        break;
      case '40':
      case '40reefer':
        baseFuelConsumption = 32; // 32 litros por 100 km para contenedores de 40'
        break;
      default:
        baseFuelConsumption = 30; // Valor por defecto
    }

    // Ajuste por peso: aumenta el consumo un 2% por cada tonelada sobre las 20
    const weightAdjustment = Math.max(0, cargoWeight - 20) * 0.02;
    const adjustedConsumption = baseFuelConsumption * (1 + weightAdjustment);

    return (adjustedConsumption / 100) * distanceKm;
  };

  // Nuevo: Función para calcular el BAF más detallado
  const calculateBAF = (baseFuelPrice, currentFuelPrice, totalFuelConsumption) => {
    const fuelPriceDifference = currentFuelPrice - baseFuelPrice;
    return fuelPriceDifference * totalFuelConsumption;
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

        const distanceKm = totalDistance / 1000; // Convertir a km
        const durationHours = totalDuration / 3600; // Convertir a horas

        // Cálculo del cambio porcentual en el precio del combustible
        const baseFuelPrice = 1.10; // Precio base del ejemplo
        const currentFuelPrice = 1.50; // Precio actual del ejemplo

        // Nuevo: Cálculo del consumo de combustible utilizando la nueva función
        const totalFuelConsumption = calculateFuelConsumption(distanceKm);

        // Nuevo: Cálculo del BAF utilizando la nueva función
        const bafCost = calculateBAF(baseFuelPrice, currentFuelPrice, totalFuelConsumption);

        // Cálculo del costo del conductor fijo a 0.80 €/km
        const driverCostPerKm = 0.80;
        const driverCost = distanceKm * driverCostPerKm;

        // Costo operacional total
        const totalOperationalCost = bafCost + driverCost;

        // Cálculo del precio base
        const basePrice = distanceKm * parseFloat(tarifa);

        // Cálculo de recargos
        let weightSurcharge = 0;
        if (showWeightAlert) {
          weightSurcharge = basePrice * 0.25; // 25% de recargo por peso
        }

        // Recargo por opciones adicionales
        const optionsSurchargePercentage = selectedOptions.length * 0.05;
        const optionsSurcharge = basePrice * optionsSurchargePercentage;

        // Precio final a cobrar
        const finalPrice = basePrice + weightSurcharge + optionsSurcharge;

        // Cálculo del beneficio
        const profit = finalPrice - totalOperationalCost;

        const routeInfo = {
          distance: `${distanceKm.toFixed(2)} km`,
          duration: `${durationHours.toFixed(2)} horas`,
          pricePerKm: `€${parseFloat(tarifa).toFixed(2)}`,
          operationalCost: `€${totalOperationalCost.toFixed(2)}`,
          basePrice: `€${basePrice.toFixed(2)}`,
          weightSurcharge: `€${weightSurcharge.toFixed(2)}`,
          optionsSurcharge: `€${optionsSurcharge.toFixed(2)}`,
          finalPrice: `€${finalPrice.toFixed(2)}`,
          profit: `€${profit.toFixed(2)}`,
          fuelConsumption: `${totalFuelConsumption.toFixed(2)} litros`,
          bafCost: `€${bafCost.toFixed(2)}`,
          toll: 'N/A' // Mantener esto si no se calcula el peaje
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
            Se aplicará un recargo del 25% debido al exceso de peso.
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
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-warning mt-3" onClick={calculateRoute}>
          Calcular Ruta
        </button>
        <button className="btn btn-secondary mt-3 ms-2" onClick={resetRoute}>
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default CalculateDistance;