import React from 'react'


const CondicionesDeUso = () => {
  return (
    <div className="fullContainer mx-5 mb-5 px-5">
      <div className="m-5 p-5">
        <h1 className="text-center mb-4">Condiciones de Uso</h1>
        <p className= "pb-4 my-3">
          El acceso y uso de este sitio web dedicado a la calculadora de rutas de transporte terrestre de mercancías (en adelante, "el sitio web") implica la aceptación de las presentes condiciones de uso. El usuario se compromete a utilizar este sitio web de manera lícita, en conformidad con las buenas prácticas comerciales y legales, y de acuerdo con las siguientes estipulaciones:
        </p>
        <ul className="list-unstyled">
          <li className="mb-3 pb-4 my-3">
            El sitio web está destinado a facilitar el cálculo de rutas, distancias y costos aproximados para el transporte terrestre de mercancías. Los resultados obtenidos son estimaciones y no constituyen un compromiso vinculante ni una oferta formal de servicios de transporte.
          </li>
          <li className="mb-3 my-3">
            El uso del sitio web para cualquier propósito ilícito, fraudulento o que viole la legislación aplicable queda estrictamente prohibido. Asimismo, se prohíbe cualquier actividad que pueda comprometer la seguridad del sitio o sus datos.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CondicionesDeUso;
