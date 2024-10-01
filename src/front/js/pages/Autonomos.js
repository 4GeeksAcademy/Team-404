import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ControlPanel from '../component/panelControl';

const Autonomos = () => {
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

  // Obtener la lista de colaboradores desde la API al cargar el componente
  useEffect(() => {
    const obtenerColaboradores = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/socios`);
        setColaboradores(response.data); // Cambia aquí para usar Axios
      } catch (error) {
        console.error('Error:', error);
      }
    };

    obtenerColaboradores();
  }, []);

  // Manejar el cambio en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Función para agregar un nuevo colaborador (y enviar datos a la API)
  const agregarColaborador = async () => {
    try {
      // Enviar datos del nuevo colaborador a la API de Flask usando Axios
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/socios`, {
        user_id: 1, // Aquí deberías pasar el user_id correcto
        nombre: formData.nombre,
        email: formData.email,
        tipo_precio: formData.tipoPrecio,
        precio: formData.precio,
        periodos_espera: formData.periodosEspera,
        incluir_peajes: formData.incluirPeajes
      });

      // Agregar el nuevo socio a la lista de colaboradores
      setColaboradores([...colaboradores, response.data.socio]);

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

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para eliminar un colaborador (y eliminarlo del servidor)
  const eliminarColaborador = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/socios/${id}`); 

      // Actualizar la lista de colaboradores eliminando el colaborador eliminado
      setColaboradores(colaboradores.filter(colaborador => colaborador.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <ControlPanel />
      <div className="flex-grow-1 p-4">
        <div className="border border-secondary rounded d-flex justify-content-between mb-3 p-3">
          <h1 className="d-flex align-items-center m-0">Autónomos</h1>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAgregarSocio">
            + Agregar Socio
          </button>
        </div>

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

        {/* HTML para mostrar los colaboradores */}
        <div className="text-start border border-secondary rounded-3 mw-100 m-3 pb-2">
          <div className="row justify-content-evenly mx-0">
            <div className="col-3 border-bottom border-secondary bg-secondary-subtle rounded-start p-2"><strong>Nombre</strong></div>
            <div className="col-3 border border-top-0 border-secondary bg-secondary-subtle py-2"><strong>Email</strong></div>
            <div className="col-3 border border-top-0 border-start-0 border-secondary bg-secondary-subtle py-2"><strong>Tipo de precios</strong></div>
            <div className="col-3 border-bottom border-secondary bg-secondary-subtle rounded-end p-2"><strong>Acciones</strong></div>
          </div>

          {/* Renderizar los colaboradores */}
          {colaboradores.map((colaborador, index) => (
            <div className="row text-start pt-2 mx-0" key={index}>
              <div className="col-3">{colaborador.nombre}</div>
              <div className="col-3">{colaborador.email}</div>
              <div className="col-3">{colaborador.tipo_precio}</div>
              <div className="col-3">
                <button className="btn btn-danger btn-sm" onClick={() => eliminarColaborador(colaborador.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Autonomos;