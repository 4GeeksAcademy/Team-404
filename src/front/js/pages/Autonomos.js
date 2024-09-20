import React from 'react'

const Autonomos = () => {
  return (
    <div>
      <div className="border border-secondary border-4 rounded d-flex justify-content-between mw-100 m-3 p-3">
        <h4 className="d-flex align-items-center m-0">Autónomos</h4>

        {/* Modal */}
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAgregarSocio">
          + Agregar Socio
        </button>

        <div className="modal fade" id="modalAgregarSocio" tabindex="-1" aria-labelledby="etiquetaAgregarSocio" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header p-4">
                <h1 className="modal-title fs-5" id="etiquetaAgregarSocio">Añadir colaborador</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-0">
                <p className="text-secondary p-4">DETALLES</p>
                <form>
                  <div className="row p-4">
                    <div className="col-6 mb-3">
                      <label for="inputNombre" className="form-label">Nombre</label>
                      <input type="nombre" className="form-control" id="inputNombre"></input>
                    </div>
                    <div className="col-6 mb-3">
                      <label for="inputEmail" className="form-label">Email</label>
                      <input type="email" className="form-control" id="inputEmail" placeholder="example@email.com"></input>
                    </div>
                  </div>

                  <hr className="m-0" />

                  <p className="text-secondary p-4">TARIFAS</p>
                  <div className="row mb-3 p-4">
                    <div className="col-6">
                      <label for="selectTipo" className="select-label">Tipo</label>
                      <select id="selectTipo" className="form-select" aria-label="Tipos de tarifas">
                        <option selected>Por kilometraje</option>
                        <option value="1">Por peso</option>
                        <option value="2">Por contenedores</option>
                        <option value="3">Por días</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label for="selectTipo" className="select-label">Tipo</label>
                      <select id="selectTipo" className="form-select" aria-label="Tipos de tarifas">
                        <option selected>Por kilometraje</option>
                        <option value="1">Por peso</option>
                        <option value="2">Por contenedores</option>
                        <option value="3">Por días</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label for="inputPrecio" className="form-label">Precio</label>
                      <input type="precio" className="form-control" id="inputPrecio" placeholder="€/km"></input>

                    </div>



                  </div>
                </form>
              </div>
              <div className="modal-footer p-4">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" className="btn btn-primary">Guardar</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="text-start border border-secondary border-3 rounded-3 mw-100 m-3 pb-2">
        <div className="row justify-content-evenly mx-0">
          <div className="col-3 border-bottom border-secondary border-3 bg-secondary-subtle rounded-start p-2"><strong>Nombre</strong></div>
          <div className="col-3 border border-top-0 border-secondary border-3 bg-secondary-subtle py-2"><strong>Email</strong></div>
          <div className="col-3 border border-top-0 border-start-0 border-secondary border-3 bg-secondary-subtle py-2"><strong>Tipo de precios</strong></div>
          <div className="col-3 border-bottom border-secondary border-3 bg-secondary-subtle rounded-end p-2"><strong>Acciones</strong></div>
        </div>

        {/* Aquí se deben añadir los elementos conforme se vayan creando perfiles de colaboradores. */}
        <div className="row text-start pt-2 mx-0">
          <div className="col-3">Juan Perez</div>
          <div className="col-3">juanperez@jperez.com</div>
          <div className="col-3">Por peso de la carga</div>
          <div className="col-3">Agregar botones</div>
        </div>

        <div className="row text-start pt-2 mx-0">
          <div className="col-3">Antonio López</div>
          <div className="col-3">alopez@translopez.com</div>
          <div className="col-3">Por Kms.</div>
          <div className="col-3">Agregar botones</div>
        </div>

        <div className="row text-start pt-2 mx-0">
          <div className="col-3">Carmen Mora</div>
          <div className="col-3">cmora@transportesmora.com</div>
          <div className="col-3">Por días</div>
          <div className="col-3">Agregar botones</div>
        </div>

      </div>

    </div>
  );
};

export default Autonomos;
