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
							<Link className="nav-link active" to="/Mapa" aria-current="page" href="#">Planner</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link active" to="/sobreNosotros">Nosotros</Link>
						</li>
						<li className="nav-item dropdown">
						<Link className="nav-link active" to="/Contacto">Contacto</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
