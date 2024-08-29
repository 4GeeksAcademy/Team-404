import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import principal from "../../img/ImgPrincipal.png"
import fotocamion from "../../img/fotocamion.png"
import fotoruta from "../../img/fotoruta.png"



export const Inicio = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<div className="divprincipal">
				<div class="cardDescription" >
					<div class="card-body">
						<h5 class="card-title">RUTA TRACK</h5>
						<p class="card-text">Ruta Track es una innovadora aplicación web y móvil diseñada para gestionar y optimizar rutas de transporte en tiempo real. Los usuarios pueden planificar trayectos, calcular costos y tiempos estimados, y recibir actualizaciones en vivo sobre el progreso del viaje. Con funcionalidades como visualización de rutas, seguimiento en tiempo real, alertas automáticas y reportes detallados, Ruta Track mejora la transparencia, la eficiencia operativa y la toma de decisiones basadas en datos, beneficiando tanto a clientes como a proveedores.</p>
						<a href="#" class="card-link">Inicia Sesion</a>
						<a href="#" class="card-link">Crear cuenta</a>
					</div>
				</div>
				<div id="carouselExampleRide" class="carousel slide w-50 mx-auto" data-bs-ride="carousel">
					<div class="carousel-inner">
						<div class="carousel-item active">
							<img src={principal} class="d-block w-100" alt="Imagen principal" />
						</div>
						<div class="carousel-item">
							<img src={fotocamion} class="d-block w-100" alt="Foto camión" />
						</div>
						<div class="carousel-item">
							<img src={fotoruta} class="d-block w-100" alt="Foto ruta" />
						</div>
					</div>
					<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
						<span class="carousel-control-prev-icon" aria-hidden="true"></span>
						<span class="visually-hidden">Anterior</span>
					</button>
					<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
						<span class="carousel-control-next-icon" aria-hidden="true"></span>
						<span class="visually-hidden">Siguiente</span>
					</button>
				</div>

			</div>
		</div>
	);
};
