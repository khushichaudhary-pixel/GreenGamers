import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      toastSuccess('Welcome back! 🌱', res.message || 'Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
      toastError('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        backgroundColor: '#f8faf9',
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 32px',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#ecfdf5',
              border: '2px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              margin: '0 auto 14px auto',
            }}
          >
            <Sprout size={28} />
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0e382c', letterSpacing: '-0.02em' }}>
            Welcome to Green Gamers
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Sign in to track your plants, complete daily care & earn Eco XP
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} color="#dc2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <Mail
                size={18}
                color="#9ca3af"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <Lock
                size={18}
                color="#9ca3af"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              fontSize: '0.8125rem',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#4b5563' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#059669', width: '16px', height: '16px' }}
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('For demo accounts, use user123 or admin123');
              }}
              style={{ color: '#059669', fontWeight: 600 }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In To Account'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f8faf9',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
          }}
        >
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0e382c', marginBottom: '8px', textTransform: 'uppercase' }}>
            ⚡ 1-Click Demo Evaluation Logins
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickFill('user@greengamers.org', 'user123')}
              style={{ fontSize: '0.75rem', padding: '6px 8px' }}
            >
              <UserCheck size={13} color="#059669" /> Demo Planter
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickFill('admin@greengamers.org', 'admin123')}
              style={{ fontSize: '0.75rem', padding: '6px 8px' }}
            >
              <ShieldCheck size={13} color="#0e382c" /> Green Admin
            </button>
          </div>
        </div>

        {/* Register CTA */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#059669', fontWeight: 700 }}>
            Register & Earn +50 XP
          </Link>
        </p>
      </div>
    </div>
  );
};
