import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const NuevoTramitePage = () => {
  const [formData, setFormData] = useState({
    // Basado en la documentación de tu API (Scalar.js), el endpoint POST /licencias espera estos campos.
    // Ajustaremos esto si el endpoint espera otros datos.
    tipo_licencia: '',
    descripcion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tipo_licencia) {
      setError('El tipo de trámite es obligatorio.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Usamos el endpoint POST /licencias definido en tu backend.
      // El backend lo asociará al usuario logueado.
      await apiClient.post('/licencias', formData);
      alert('Trámite creado exitosamente');
      navigate('/tramites');
    } catch (err) {
      setError('Error al crear el trámite. Por favor, intente de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Registrar Nuevo Trámite</h1>
        <Link to="/tramites" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la lista
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="tipo_licencia" className="form-label">Tipo de Trámite/Licencia</label>
              <input
                type="text"
                className="form-control"
                id="tipo_licencia"
                name="tipo_licencia"
                value={formData.tipo_licencia}
                onChange={handleChange}
                placeholder="Ej: Licencia de Funcionamiento, Permiso de Construcción"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción (Opcional)</label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Añada una breve descripción de la solicitud"
              ></textarea>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Trámite'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoTramitePage;
