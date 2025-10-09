import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { login } from '../api/auth';
import { setToken } from '../api/token';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { username, password } = formData;

    try {
      setLoading(true);
      // Para este demo, usaremos username como email
      const result = await login(username, password);
      setToken(result.token);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Inicia sesión</h2>
        
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="tu_usuario"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        <button 
          type="button" 
          className="register-redirect-button"
          onClick={() => router.push('/signup')}
        >
          Registrarse
        </button>

        {error && <p className="form-error">{error}</p>}

        <p className="forgot-password">¿Olvidaste tu contraseña?</p>
      </form>
    </div>
  );
};

export default LoginForm;