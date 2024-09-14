import React, { useState, useEffect } from 'react';

const CalculateDistance = ({ map, onRouteCalculated, onRouteInfo, onClearRoute }) => {
  const [stops, setStops] = useState([
    { location: '', key: 0 },
    { location: '', key: 1 }
  ]);
  const [cargoWeight, setCargoWeight] = useState(0);
  const [containerType, setContainerType] = useState('');
  const [costPerKm, setCostPerKm] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    'Nocturnidad',
    'Mercancia peligrosa',
    'Festivo',
    'Reefer',
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

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const calculateRoute = () => {
    if (stops.some(stop => !stop.location) || !costPerKm || !pricePerKm) {
      alert('Por favor, complete todas las ubicaciones y los datos de coste y precio por km.');
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

          // Cost calculations
          const totalCost = (distance * parseFloat(costPerKm)).toFixed(2);
          const toll = (24.40).toFixed(2);
          const price = (distance * parseFloat(pricePerKm)).toFixed(2);
          const profit = (parseFloat(price) - parseFloat(totalCost) - parseFloat(toll)).toFixed(2);

          // Calculate surcharge based on container type and weight
          let surcharge = 0;
          let showSurchargeAlert = false;

          if (containerType === '20gp' && cargoWeight > 26) {
            surcharge = 0.25 * totalCost;
            showSurchargeAlert = true;
          } else if (['40dry', '40hc', '40out'].includes(containerType) && cargoWeight > 24) {
            surcharge = 0.25 * totalCost;
            showSurchargeAlert = true;
          }

          if (showSurchargeAlert) {
            alert("Recibirás un recargo del 25%");
          }

          const finalCost = (parseFloat(totalCost) + surcharge).toFixed(2);

          onRouteInfo({
            distance: distance.toFixed(2) + ' km',
            duration: Math.floor(duration / 60) + 'h ' + (duration % 60).toFixed(0) + 'min',
            costPerKm: parseFloat(costPerKm).toFixed(2) + '€',
            pricePerKm: parseFloat(pricePerKm).toFixed(2) + '€',
            totalCost: finalCost + '€',
            toll: toll + '€',
            profit: profit + '€',
            price: price + '€',
            surcharge: surcharge.toFixed(2) + '€',
            selectedOptions: selectedOptions
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
    setCargoWeight(0);
    setContainerType('');
    setCostPerKm('');
    setPricePerKm('');
    setSelectedOptions([]);
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
          <select
            className="form-control"
            value={containerType}
            onChange={(e) => setContainerType(e.target.value)}
          >
            <option value="">Selecciona un tipo</option>
            <option value="20gp">20GP</option>
            <option value="40dry">40DRY</option>
            <option value="40hc">40HC</option>
            <option value="40out">40OUT</option>
          </select>
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

        <div className="mt-3">
          <h5 className="card-title mb-3">Costes y Precios</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Coste por km (€)</th>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={costPerKm}
                    onChange={(e) => setCostPerKm(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <th>Precio por km (€)</th>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={pricePerKm}
                    onChange={(e) => setPricePerKm(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <h5 className="card-title mb-3">Opciones adicionales</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                {options.map(option => (
                  <td key={option}>
                    <button
                      className={`btn btn-sm ${selectedOptions.includes(option) ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => toggleOption(option)}
                    >
                      {option}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {selectedOptions.length > 0 && (
          <div className="mt-3">
            <h6>Opciones seleccionadas:</h6>
            <ul className="list-group">
              {selectedOptions.map(option => (
                <li key={option} className="list-group-item d-flex justify-content-between align-items-center">
                  {option}
                  <button className="btn btn-sm btn-danger" onClick={() => toggleOption(option)}>×</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3">
          <button onClick={calculateRoute} className="btn btn-primary me-2">Calcular ruta</button>
          <button onClick={resetRoute} className="btn btn-secondary">Resetear</button>
        </div>
      </div>
    </div>
  );
};

export default CalculateDistance;



