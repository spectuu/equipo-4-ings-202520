import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { register } from '../api/auth';
import { setToken } from '../api/token';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const result = await register(email, username, password);
      setToken(result.token);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Crear cuenta</h2>
        
        <div className="form-group">
          <label htmlFor="username">👤 Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Tu usuario"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">📧 Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Tu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">🔒 Contraseña</label>
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

        <div className="form-group">
          <label htmlFor="confirmPassword">🔐 Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        {error && <p className="form-error">{error}</p>}

        <p className="login-link">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>

      </form>
    </div>
  );
};

export default SignupForm;
