import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLockClosed, HiOutlineMail, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Generate SVG captcha from backend
  const generateCaptcha = useCallback(async () => {
    try {
      const response = await authService.getCaptcha();
      setCaptcha({ image: response.image, answer: response.answer });
      setCaptchaInput('');
    } catch (error) {
      console.error('Error fetching captcha:', error);
      toast.error('Error al generar captcha de seguridad');
    }
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Password strength calculator
  const calcPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 4) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      setPasswordStrength(calcPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate captcha locally before sending
    if (captchaInput.toLowerCase() !== captcha.answer.toLowerCase()) {
      toast.error('Respuesta del captcha incorrecta');
      generateCaptcha();
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login({
        correo: formData.email,
        password: formData.password,
        captcha_answer: captchaInput,
        captcha_expected: captcha.answer,
      });
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/admin/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Credenciales inválidas';
      toast.error(msg);
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#84cc16', '#10b981'];

  // Generate stars for background
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  // Generate meteors
  const meteors = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 3 + Math.random() * 2,
    duration: 1.5 + Math.random(),
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 60 + 20}%`,
  }));

  return (
    <div className="login-page" id="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="login-star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Meteors */}
        {meteors.map((meteor) => (
          <div
            key={meteor.id}
            className="login-meteor"
            style={{
              top: meteor.top,
              left: meteor.left,
              animationDelay: `${meteor.delay}s`,
              animationDuration: `${meteor.duration}s`,
            }}
          />
        ))}

        {/* Moon */}
        <div className="login-moon">
          <div className="login-moon-glow" />
        </div>

        {/* SVG Mountains */}
        <svg className="login-mountains" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d1b69" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1a0533" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2d1b69" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="mountain3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Back mountain */}
          <path d="M0 400 L0 280 Q120 180 240 250 Q360 140 480 200 Q600 100 720 180 Q840 80 960 160 Q1080 60 1200 150 Q1320 200 1440 220 L1440 400 Z" fill="url(#mountain3)" />
          {/* Middle mountain */}
          <path d="M0 400 L0 320 Q180 220 360 280 Q500 200 640 260 Q780 180 920 240 Q1060 200 1200 270 Q1320 230 1440 280 L1440 400 Z" fill="url(#mountain2)" />
          {/* Front mountain */}
          <path d="M0 400 L0 340 Q200 290 400 330 Q550 280 700 320 Q850 270 1000 310 Q1150 280 1300 330 Q1380 310 1440 340 L1440 400 Z" fill="url(#mountain1)" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="login-card-wrapper">
        <form className="login-card" id="login-form" onSubmit={handleSubmit}>
          {/* Lock Icon */}
          <div className="login-icon">
            <HiOutlineLockClosed />
          </div>

          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">Panel de Administración</p>

          {/* Email */}
          <div className="login-field">
            <div className="login-input-wrapper">
              <HiOutlineMail className="login-input-icon" />
              <input
                type="email"
                className="login-input"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <div className="login-input-wrapper">
              <HiOutlineLockClosed className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                id="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="login-password-strength">
                <div className="login-strength-bar">
                  <div
                    className="login-strength-fill"
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      background: strengthColors[passwordStrength],
                    }}
                  />
                </div>
                <span
                  className="login-strength-label"
                  style={{ color: strengthColors[passwordStrength] }}
                >
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
            )}
          </div>

          {/* Math CAPTCHA */}
          <div className="login-field">
              <div className="login-captcha-group">
                <div className="login-captcha-question">
                  <div 
                    className="login-captcha-svg-container"
                    dangerouslySetInnerHTML={{ __html: captcha.image || '<svg></svg>' }} 
                  />
                  <button 
                    type="button" 
                    className="login-captcha-refresh" 
                    onClick={generateCaptcha}
                    title="Generar nuevo captcha"
                  >
                    ⟳
                  </button>
                </div>
                <div className="input-with-icon">
                  <input
                    type="text"
                    id="captcha"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Escribe el texto de arriba"
                    required
                  />
                </div>
              </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-submit"
            id="login-submit"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
