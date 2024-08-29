import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

 const CrearCuenta = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container">
			<h1>PRUEBA</h1>
			<p>Esta pagina sera para la creacion de la cuenta en caso de no tenerlar</p>
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};
export default CrearCuenta
