import React from 'react';

// Componente para el formulario de colaborador
const ColaboradorForm = ({ formData, handleInputChange, errorMessage }) => (
  <form>
    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    <div className="row m-0 p-4">
      <div className="col-6 mb-3">
        <label htmlFor="inputNombre" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="inputNombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
        />
      </div>
      <div className="col-6 mb-3">
        <label htmlFor="inputEmail" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="inputEmail"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
        />
      </div>
    </div>

    <hr className="m-0" />

    <p className="text-secondary p-4">TARIFAS</p>
    <div className="row m-0 px-4 py-2">
      <div className="col-6">
        <label htmlFor="selectTipo" className="select-label mb-2">Tipo</label>
        <select
          id="selectTipo"
          className="form-select"
          name="tipoPrecio"
          value={formData.tipoPrecio}
          onChange={handleInputChange}
        >
          <option value="">Seleccionar tipo de precios</option>
          <option value="Por kilometraje">Por kilometraje</option>
          <option value="Por peso">Por peso</option>
          <option value="Por contenedores">Por contenedores</option>
          <option value="Por días">Por días</option>
        </select>
      </div>
      <div className="col-6">
        <label htmlFor="inputPrecio" className="form-label">Precio</label>
        <input
          type="text"
          className="form-control"
          id="inputPrecio"
          name="precio"
          value={formData.precio}
          onChange={handleInputChange}
          placeholder="€/km"
        />
      </div>
      <div className="col-6 mt-3">
        <label htmlFor="inputPeriodosEspera" className="form-label">Periodos de espera</label>
        <input
          type="text"
          className="form-control"
          id="inputPeriodosEspera"
          name="periodosEspera"
          value={formData.periodosEspera}
          onChange={handleInputChange}
          placeholder="€/h"
        />
      </div>
      <div className="d-flex align-items-end col-6 mt-3 mb-1">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="inputIncluirPeajes"
            name="incluirPeajes"
            checked={formData.incluirPeajes}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="inputIncluirPeajes">
            Incluir peajes
          </label>
        </div>
      </div>
    </div>
  </form>
);

  export default ColaboradorForm;