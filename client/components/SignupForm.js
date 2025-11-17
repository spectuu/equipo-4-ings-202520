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
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Validación en tiempo real de contraseñas
      if (name === 'password' || name === 'confirmPassword') {
        const password = name === 'password' ? value : prev.password;
        const confirmPassword = name === 'confirmPassword' ? value : prev.confirmPassword;
        
        if (confirmPassword && password !== confirmPassword) {
          setPasswordError('Las contraseñas no coinciden');
        } else {
          setPasswordError('');
        }
      }
      
      return newData;
    });
  };

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError('');

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
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

        {error && <p className="error-message">{error}</p>}

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
            className={passwordError ? 'input-error' : ''}
          />
          {passwordError && (
            <span className="field-error-message">{passwordError}</span>
          )}
        </div>

        <button type="submit" className="register-button" disabled={loading || passwordError}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;