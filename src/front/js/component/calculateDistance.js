import React, { useState, useEffect } from 'react';

const CalculateDistance = ({ map, onRouteCalculated, onRouteInfo, onClearRoute }) => {
  const [stops, setStops] = useState([
    { location: '', key: 0 },
    { location: '', key: 1 }
  ]);
  const [cargoWeight, setCargoWeight] = useState(0); // New state for cargo weight

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

  const calculateRoute = () => {
    if (stops.some(stop => !stop.location)) {
      alert('Por favor, complete todas las ubicaciones.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const origin = stops[0].location;
    const destination = stops[stops.length - 1].location;
    const waypoints = stops.slice(1, -1).map(stop => ({
      location: stop.location,
      stopover: true
    }));

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          onRouteCalculated(result);
          const distance = result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000;
          const duration = result.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0) / 60;

          // Fuel consumption calculation for heavy trucks
          const fuelConsumptionPerKm = 0.4; // liters per kilometer for heavy-duty trucks
          const totalFuelConsumption = (distance * fuelConsumptionPerKm).toFixed(2); // Total liters consumed
          
          // Cost calculations
          const costPerKm = 1.02;
          const totalCost = (distance * costPerKm).toFixed(2);
          const toll = (24.40).toFixed(2);
          const pricePerKm = 1.12;
          const profit = (76.30).toFixed(2);
          const price = (839.34).toFixed(2);
          
          // Calculate surcharge if cargo exceeds 26 tons
          let surcharge = 0;
          if (cargoWeight > 26) {
            surcharge = 0.25 * totalCost;
            alert(`Esta carga tendrá un recargo del 25% del coste. Surcharge: €${surcharge.toFixed(2)}`);
          }

          const finalCost = (parseFloat(totalCost) + surcharge).toFixed(2);

          onRouteInfo({
            distance: distance.toFixed(2) + ' km',
            duration: Math.floor(duration / 60) + 'h ' + (duration % 60).toFixed(0) + 'min',
            totalFuelConsumption: totalFuelConsumption + ' L', // Display fuel consumption
            costPerKm: costPerKm.toFixed(2),
            totalCost: finalCost + '€',
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

  const resetRoute = () => {
    setStops([
      { location: '', key: 0 },
      { location: '', key: 1 }
    ]);
    setCargoWeight(0); // Reset cargo weight
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

        {/* Input for cargo weight */}
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

        <div className="mt-3">
          <button onClick={calculateRoute} className="btn btn-primary me-2">Calcular ruta</button>
          <button onClick={resetRoute} className="btn btn-secondary">Resetear</button>
        </div>
      </div>
    </div>
  );
};

export default CalculateDistance;
