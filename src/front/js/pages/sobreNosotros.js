import React from "react";
import '../../styles/SobreNosotros.css';

const SobreNosotros = () => {
    return (
        <div>
            <div className="image-container mb-5">
                <img
                    src="https://images.stockcake.com/public/c/4/e/c4ef4a2f-7ef1-4f11-9e94-74f7f2386025_large/trucks-at-twilight-stockcake.jpg"
                    className="img-fluid"
                    alt="Camiones"
                />
                <div>
                    <h1 className="h1-text">Digitalización y automatización de la<br />logística del transporte para transportistas</h1>
                    <p className="image-text">

                        RutaTrack, una pequeña empresa con sede en Valencia, está a la vanguardia de la automatización de la logística<br />
                        de transporte para empresas industriales y de transporte. Nuestra misión es ofrecer herramientas
                        innovadoras que impulsen la digitalización y automatización de la disposición de camiones dentro de la
                        industria del transporte por carretera. A través de nuestra tecnología de vanguardia, nuestro objetivo es
                        agilizar el papeleo del despachador, mejorando la eficiencia y la facilidad en sus operaciones diarias.

                    </p>
                </div>
            </div>

            <div className="container text-center mb-5"> {/* Añadir margen inferior */}
                <h1>Acerca de RutaTrack</h1>
                <p>Nuestra plataforma de gestión logística, RutaTrack, facilita la planificación de rutas, el cálculo de peajes y costos vehiculares, y la gestión integral del transporte. Diseñada para ser fácil de usar y flexible, RutaTrack es una solución ideal para empresas de transporte medianas, ayudándoles a optimizar sus operaciones y mejorar la eficiencia.</p>
                <img
                    src="https://img.freepik.com/foto-gratis/hombre-tiro-completo-caminando-flota-camiones_23-2149426496.jpg?t=st=1726687813~exp=1726691413~hmac=13574290c3c9d803cfc37e8100dde6c95021b99f7ab0a1ee8cac7ae26ac7d52c&w=996"
                    className="img-fluid rounded"
                    alt="Logistica"
                />

            </div>

            <div className="container-fluid text-center bg-light py-5 mb-5"> {/* Padding y margen */}
                <h1>Hacer que el sofware de transporte sea accesible y asequible</h1>
                <p>En RutaTrack, creemos que el software de transporte debe ser accesible para todos. Nuestra solución está diseñada para transformar la planificación de rutas de camiones, resolviendo los desafíos del transporte por carretera, como las restricciones de peso, regulaciones viales y plazos de entrega. Nuestra herramienta web optimiza la eficiencia, confiabilidad y rentabilidad para los conductores de camiones.</p>
            </div>

            <div className="container text-center mb-5"> {/* Este margen empuja el contenido lejos del footer */}
                <h1>Nuestra visión</h1>
                <p>En RutaTrack digitalizamos la logística del transporte con el objetivo de convertirnos en el sistema de gestión más grande y fácil de usar de España para el transporte de mercancías por carretera.</p>
            </div>

        </div>

    );
};

export default SobreNosotros;
