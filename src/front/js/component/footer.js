import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="footer bg-dark text-white py-4 text-center">
		<div className="container g-3">
			<div className="row justify-content-between flex-wrap gx-5">
				{/* Columna 1: Información de la Empresa */}
				<div className="col-md-3 mb-3">
					<p><strong>Team 404 S.L.</strong></p>
					<p>
						Calle Ruta 404, Ciudad del Transporte, España<br />
						Tel: +123 456 789 | contacto@.com
					</p>
				</div>

				{/* Columna 2: Enlaces de Aviso Legal */}
				<div className="col-md-6 mb-2 d-flex align-items-center justify-content-center">
					<div className="row h-100">
						<div className="col-4 d-flex align-items-center justify-content-center h-50">
							<Link className="foot-link text-white text-decoration-none text-center" to="/condicionesUso">Condiciones de Uso</Link>
						</div>
						<div className="col-4 d-flex align-items-center justify-content-center h-50">
							<Link className="foot-link text-white text-decoration-none text-center" to="/propiedadintelectual">Propiedad Intelectual</Link>
						</div>
						<div className="col-4 d-flex align-items-center justify-content-center h-50">
							<Link className="foot-link text-white text-decoration-none text-center" to="/proteccionDeDatos">Protección de Datos</Link>
						</div>
						<div className="col-4 d-flex align-items-center justify-content-center h-50">
							<Link className="foot-link text-white text-decoration-none text-center" to="/politicaCookies">Política de Cookies</Link>
						</div>
						<div className="col-4 d-flex align-items-center justify-content-center h-50">
							<Link className="foot-link text-white text-decoration-none text-center" to="/limitacionResponsabilidad">Limitación de Responsabilidad</Link>
						</div>
						<div className="col-4 d-flex align-items-center justify-content-center h-50">
							<Link className="foot-link text-white text-decoration-none text-center" to="/jurisdiccion">Jurisdicción y Ley Aplicable</Link>
						</div>
					</div>
				</div>

				{/* Columna 3: Redes Sociales */}
				<div className="col-md-3 mb-3">
					<p><strong>Síguenos:</strong></p>
					<a href="#" className="text-white mx-3">
						<i className="bi bi-facebook">
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
								<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
							</svg>
						</i>
					</a>
					<a href="#" className="text-white mx-3">
						<i className="bi bi-twitter-x">
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
								<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
							</svg>
						</i>
					</a>
					<a href="#" className="text-white mx-3">
						<i className="bi bi-linkedin">
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
								<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
							</svg>
						</i>
					</a>
				</div>
			</div>
			<p className="mt-3">© 2024 Team 404 S.L. Todos los derechos reservados.</p>
		</div>
	</footer>
);
