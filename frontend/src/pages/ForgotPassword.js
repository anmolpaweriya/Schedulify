import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PixelCalendar } from '../components/PixelIcons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter email');
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgotpassword', { email });
      if (res.data.success) {
        toast.success('Password reset link sent! Check your email or console log.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending link');
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
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Forgot Password</h2>
          <p style={{ color: '#636366', fontSize: '0.9rem', marginTop: '5px' }}>We will send you a password reset link</p>
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

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#636366', fontSize: '0.9rem' }}>
          Back to{' '}
          <Link to="/login" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
