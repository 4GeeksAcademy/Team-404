//import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

// Crea un root y renderiza tu aplicación React
const root = ReactDOM.createRoot(document.querySelector("#app")); // Crea el root
root.render(<Layout />); // Renderiza el componente Layout
