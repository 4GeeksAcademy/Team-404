import React from 'react'


const ProteccionDeDatos = () => {
    return (
        <div className="fullContainer mx-5 mb-5 px-5">
            <div className="m-5 p-5">
                <h1 className="text-center mb-4">Protección de Datos Personales</h1>
                <p className="pb-4 my-3">
                    De acuerdo con la normativa vigente en materia de protección de datos personales, informamos a los usuarios que, en caso de que faciliten datos personales (por ejemplo, a través de formularios de contacto o consultas de rutas personalizadas), los mismos serán tratados de conformidad con la Ley de Protección de Datos de [País] y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.
                </p>
                <p className="pb-4 my-3">
                    Los datos personales proporcionados serán utilizados únicamente para responder a las solicitudes de información y ofrecer los servicios solicitados. En ningún caso se cederán datos a terceros sin el consentimiento previo del usuario, salvo en los casos previstos por la ley. El usuario podrá ejercer sus derechos de acceso, rectificación, cancelación, oposición y portabilidad enviando una solicitud a: contacto@transporteseguro.com.
                </p>
            </div>
        </div>
    );
};

export default ProteccionDeDatos;