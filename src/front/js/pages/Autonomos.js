import React, { useState } from 'react';

const App = () => {
  // Estado para almacenar los colaboradores
  const [colaboradores, setColaboradores] = useState([]);

  // Estado para los valores del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipoPrecio: '',
    precio: '',
    periodosEspera: '',
    incluirPeajes: false
  });

  // Manejar el cambio en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Función para agregar un nuevo colaborador
  const agregarColaborador = () => {
    // Agregar los datos del nuevo colaborador a la lista
    setColaboradores([...colaboradores, formData]);

    // Limpiar el formulario
    setFormData({
      nombre: '',
      email: '',
      tipoPrecio: '',
      precio: '',
      periodosEspera: '',
      incluirPeajes: false
    });

    // Cerrar el modal manualmente
    const modalElement = document.getElementById('modalAgregarSocio');
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  };

  return (
    <div className="min-vh-100">
      <div>
        <div className="border border-secondary rounded d-flex justify-content-between mw-100 m-3 p-3">
          <h1 className="d-flex align-items-center m-0">Autónomos</h1>

          {/* Botón para abrir el modal */}
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAgregarSocio">
            + Agregar Socio
          </button>

          {/* Modal */}
          <div className="modal fade" id="modalAgregarSocio" tabIndex="-1" aria-labelledby="etiquetaAgregarSocio" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header p-4">
                  <h1 className="modal-title fs-5" id="etiquetaAgregarSocio">Añadir colaborador</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body p-0">
                  <p className="text-secondary p-4">DETALLES</p>
                  <form>
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
                      <div className="d-flex align-items-end col-6 mt-3">
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
                </div>
                <div className="modal-footer p-4">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={agregarColaborador}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* HTML para mostrar los colaboradores */}
        <div className="text-start border border-secondary rounded-3 mw-100 m-3 pb-2">
          <div className="row justify-content-evenly mx-0">
            <div className="col-3 border-bottom border-secondary  bg-secondary-subtle rounded-start p-2"><strong>Nombre</strong></div>
            <div className="col-3 border border-top-0 border-secondary bg-secondary-subtle py-2"><strong>Email</strong></div>
            <div className="col-3 border border-top-0 border-start-0 border-secondary bg-secondary-subtle py-2"><strong>Tipo de precios</strong></div>
            <div className="col-3 border-bottom border-secondary bg-secondary-subtle rounded-end p-2"><strong>Acciones</strong></div>
          </div>

          {/* Renderizar los colaboradores */}
          {colaboradores.map((colaborador, index) => (
            <div className="row text-start pt-2 mx-0" key={index}>
              <div className="col-3">{colaborador.nombre}</div>
              <div className="col-3">{colaborador.email}</div>
              <div className="col-3">{colaborador.tipoPrecio}</div>
              <div className="col-3">
                <button className="btn btn-danger btn-sm">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>;
    </div>
  );
};

export default App;

