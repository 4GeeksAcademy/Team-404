import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhoneAlt, FaPaperPlane } from 'react-icons/fa';

const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.BACKEND_URL + "contact", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus('Mensaje enviado correctamente');
                setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
            } else {
                setStatus('Error al enviar el mensaje');

            }
        } catch (error) {
            setStatus('Error de conexión');
        }
    };
    const fetchHello = () => {
        fetch("https://curly-umbrella-pj7vjjxqwxqr2v74-3001.app.github.dev/api/hello")
            .then(response => response.json())
            .then(data => console.log(data))
    };
    useEffect(() => {
        fetchHello()
    }, [])

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Contáctanos</h2>
                            {status && <div className="alert alert-info">{status}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre *</label>
                                    <div className="input-group">
                                        <input type="text" onChange={handleChange} value={formData.nombre} className="form-control" id="nombre" placeholder="Tu nombre completo" required />
                                        <span className="input-group-text bg-transparent border-start-0">
                                            <FaUser />
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico *</label>
                                    <div className="input-group">
                                        <input type="email" onChange={handleChange} value={formData.email} className="form-control" id="email" placeholder="Tu dirección de correo electrónico" required />
                                        <span className="input-group-text bg-transparent border-start-0">
                                            <FaEnvelope />
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                                    <div className="input-group">
                                        <input type="tel" onChange={handleChange} value={formData.telefono} className="form-control" id="telefono" placeholder="Tu número de teléfono" />
                                        <span className="input-group-text bg-transparent border-start-0">
                                            <FaPhoneAlt />
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mensaje" className="form-label">Mensaje</label>
                                    <textarea onChange={handleChange} value={formData.mensaje} className="form-control" id="mensaje" rows="4" placeholder="Escribe tu mensaje aquí"></textarea>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-warning px-4 py-2">
                                        Enviar Mensaje <FaPaperPlane className="ms-2" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacto;