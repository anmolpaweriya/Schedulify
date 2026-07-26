import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { PixelCalendar } from '../components/PixelIcons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <motion.div
        className="glass-card"
        style={{ width: '100%', maxWidth: '420px', padding: '40px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <PixelCalendar size={28} color="#ea580c" />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>Schedulify</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: '#636366', fontSize: '0.9rem', marginTop: '5px' }}>Log in to manage your appointments</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#ea580c', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#636366', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
