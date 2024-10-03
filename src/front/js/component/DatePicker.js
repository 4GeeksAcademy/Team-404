import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa estilos de calendario
import "../../styles/flota.css";


const DatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowCalendar(false); // Cerrar el calendario al seleccionar una fecha
  };

  return (
    <div>
      <input
        type="text"
        value={date.toLocaleDateString()} // Formato de fecha en el input
        readOnly
        onClick={() => setShowCalendar(!showCalendar)} // Alternar el calendario al hacer clic
        placeholder="Seleccione una fecha"
      />
      {showCalendar && (
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;