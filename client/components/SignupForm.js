import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const setCustomValidity = () => {
      const inputs = document.querySelectorAll('input[required]');
      inputs.forEach(input => {
        input.addEventListener('invalid', () => {
          if (input.validity.valueMissing) {
            input.setCustomValidity('Por favor, completa este campo');
          } else if (input.validity.typeMismatch) {
            input.setCustomValidity('Por favor, ingresa un valor válido');
          }
        });
        input.addEventListener('input', () => {
          input.setCustomValidity('');
        });
      });
    };

    setCustomValidity();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'password') {
        validatePasswordStrength(value);
        if (prev.confirmPassword && value !== prev.confirmPassword) {
          setPasswordError('Las contraseñas no coinciden');
        } else {
          setPasswordError('');
        }
      }
      
      if (name === 'confirmPassword') {
        if (value && prev.password !== value) {
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
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const validatePasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const isPasswordValid = (password) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError('');

    const { username, email, password, confirmPassword } = formData;

    if (!isPasswordValid(password)) {
      setError('La contraseña no cumple con todos los requisitos');
      return;
    }

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
          {formData.password && (
            <div className="password-requirements">
              <div className={passwordStrength.hasMinLength ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasMinLength ? '✓' : '○'} Mínimo 8 caracteres
              </div>
              <div className={passwordStrength.hasUpperCase ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasUpperCase ? '✓' : '○'} Al menos una mayúscula (A-Z)
              </div>
              <div className={passwordStrength.hasLowerCase ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasLowerCase ? '✓' : '○'} Al menos una minúscula (a-z)
              </div>
              <div className={passwordStrength.hasNumber ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasNumber ? '✓' : '○'} Al menos un número (0-9)
              </div>
              <div className={passwordStrength.hasSpecialChar ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasSpecialChar ? '✓' : '○'} Al menos un carácter especial (!@#$%^&*)
              </div>
            </div>
          )}
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

        <button type="submit" className="register-button" disabled={loading || passwordError || (formData.password && !isPasswordValid(formData.password))}>
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