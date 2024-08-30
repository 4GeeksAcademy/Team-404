import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">RutaTrack</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
					<ul className="navbar-nav mb-2 mb-lg-0">
						<li className="nav-item">
							<Link className="nav-link active" to="/" aria-current="page" href="#" >Inicio</Link>
						</li>
						<li className="nav-item">
							<link className="nav-link active" to="./Logistica"aria-current="page" href="#">Logística</link>
						</li>
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle" href="#" id="navbarDropdownSobreNosotros" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								Sobre nosotros
							</a>
							<ul className="dropdown-menu" aria-labelledby="navbarDropdownSobreNosotros">
								<li><a className="dropdown-item" href="#">Nuestra historia</a></li>
								<li><a className="dropdown-item" href="#">Nuestro equipo</a></li>							
							</ul>
						</li>
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle" href="#" id="navbarDropdownContactos" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								Contactos
							</a>
							<ul className="dropdown-menu" aria-labelledby="navbarDropdownContactos">
								<li><a className="dropdown-item" href="#">Soporte</a></li>
								<li><a className="dropdown-item" href="#">Servicio al Cliente</a></li>
							</ul>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/login">Acceso</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
