import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PixelCalendar } from '../components/PixelIcons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  
  // Provider specific states
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');

  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await axios.get('/api/departments');
        if (res.data.success) {
          setDepartmentsList(res.data.departments);
          if (res.data.departments.length > 0) {
            setDepartment(res.data.departments[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in name, email, and password');
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'Provider' && {
          title,
          department,
          specialization,
          bio,
        }),
      };

      const res = await register(payload);
      
      if (res.message && res.message.includes('verify')) {
        toast.info(res.message, { autoClose: 8000 });
        navigate('/login');
      } else {
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '40px 20px' }}>
      <motion.div
        className="glass-card"
        style={{ width: '100%', maxWidth: '520px', padding: '40px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <PixelCalendar size={28} color="#ea580c" />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>Schedulify</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Create Account</h2>
          <p style={{ color: '#636366', fontSize: '0.9rem', marginTop: '5px' }}>Join the premium scheduling network</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">User Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ appearance: 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center' }}
            >
              <option value="Customer">Customer / Client / Patient</option>
              <option value="Provider">Provider (Teacher, Doctor, Consultant, Attorney)</option>
              <option value="Receptionist">Receptionist</option>
              <option value="University Coordinator">University Coordinator</option>
            </select>
          </div>

          {/* Provider Specific Fields */}
          {role === 'Provider' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr., Prof., Attorney"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Associated Department</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select a department</option>
                  {departmentsList.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Cardiology, Corporate Law, AI Research"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Biography</label>
                <textarea
                  className="form-control"
                  placeholder="Describe your qualifications and services..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '15px' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#636366', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
