import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import {
  PixelCalendar,
  PixelUser,
  PixelDoctor,
} from '../components/PixelIcons';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Step 1: Choose Account Type ('Normal' vs 'Faculty')
  // Step 2: Form Details
  const [wizardStep, setWizardStep] = useState(1);
  const [accountType, setAccountType] = useState(''); // 'Normal' or 'Faculty'

  // Common Credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Faculty specific fields
  const [title, setTitle] = useState('Dr.');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  
  // Availability setup based on days (0=Sun, 1=Mon, ..., 6=Sat)
  // Default Mon-Fri active (1,2,3,4,5)
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const [loading, setLoading] = useState(false);

  const daysOfWeekList = [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 0 },
  ];

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setWizardStep(2);
  };

  const handleDayToggle = (dayVal) => {
    if (selectedDays.includes(dayVal)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayVal));
    } else {
      setSelectedDays([...selectedDays, dayVal]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Name, email, and password are required');
    }

    if (accountType === 'Faculty' && selectedDays.length === 0) {
      return toast.error('Please select at least one available day for appointments');
    }

    setLoading(true);
    try {
      const isFaculty = accountType === 'Faculty';
      const payload = {
        name,
        email,
        password,
        role: isFaculty ? 'Provider' : 'Customer',
        ...(isFaculty && {
          title,
          specialization,
          bio,
          selectedDays,
          startTime,
          endTime,
        }),
      };

      const res = await register(payload);
      
      if (res.message && res.message.includes('verify')) {
        toast.info(res.message, { autoClose: 8000 });
        navigate('/login');
      } else {
        toast.success('Registration successful! Redirecting...');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4 },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '40px 20px' }}>
      
      {/* Background blurs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <motion.div
        className="glass-card"
        style={{ width: '100%', maxWidth: '640px', padding: '40px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <PixelCalendar size={28} color="#ea580c" />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>Schedulify</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: '#636366', fontSize: '0.9rem', marginTop: '5px' }}>Choose your account type to get started</p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CHOOSE ACCOUNT TYPE */}
          {wizardStep === 1 && (
            <motion.div key="step1" {...pageTransition}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '25px', textAlign: 'center' }}>
                How will you be using Schedulify?
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Option 1: Normal User */}
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect('Normal')}
                  className="glass-card"
                  style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid var(--glass-border)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div style={{ background: '#e0f2fe', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                    <PixelUser size={30} color="#0284c7" />
                  </div>
                  <strong style={{ display: 'block', fontSize: '1.15rem' }}>Normal User</strong>
                  <span style={{ fontSize: '0.8rem', color: '#636366', display: 'block', marginTop: '8px' }}>
                    Book appointments with doctors, teachers, counselors, or specialists
                  </span>
                </button>

                {/* Option 2: Faculty / Provider */}
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect('Faculty')}
                  className="glass-card"
                  style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid var(--glass-border)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div style={{ background: '#ffedd5', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                    <PixelDoctor size={30} color="#ea580c" />
                  </div>
                  <strong style={{ display: 'block', fontSize: '1.15rem' }}>Faculty / Provider</strong>
                  <span style={{ fontSize: '0.8rem', color: '#636366', display: 'block', marginTop: '8px' }}>
                    Doctor, Teacher, Counselor or Specialist offering appointment slots
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: REGISTRATION FORM */}
          {wizardStep === 2 && (
            <motion.div key="step2" {...pageTransition}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {accountType === 'Faculty' ? 'Faculty / Provider Registration' : 'Normal User Registration'}
                </h3>
                <button type="button" onClick={() => setWizardStep(1)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Change Type
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={accountType === 'Faculty' ? 'e.g. Dr. Jane Smith' : 'e.g. John Doe'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" placeholder="user@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                </div>

                {/* Additional inputs for Faculty / Provider */}
                {accountType === 'Faculty' && (
                  <div style={{ background: 'rgba(255,255,255,0.4)', padding: '20px', borderRadius: '18px', marginTop: '15px', marginBottom: '20px', border: '1px solid var(--glass-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '15px', color: '#ea580c' }}>
                      Profession & Availability Setup
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <select className="form-control" value={title} onChange={(e) => setTitle(e.target.value)}>
                          <option value="Dr.">Dr.</option>
                          <option value="Prof.">Prof.</option>
                          <option value="Counselor">Counselor</option>
                          <option value="Attorney">Attorney</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Profession / Specialization</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Cardiology, Computer Science, Mathematics..."
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short Bio / Expertise</label>
                      <textarea
                        className="form-control"
                        placeholder="Brief summary of your field, advising topics, or consultation background..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={2}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    {/* Available Days Checkboxes */}
                    <div className="form-group" style={{ marginTop: '15px' }}>
                      <label className="form-label">Available Days for Appointments</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {daysOfWeekList.map((day) => {
                          const isSelected = selectedDays.includes(day.value);
                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => handleDayToggle(day.value)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '10px',
                                border: isSelected ? '2px solid #ea580c' : '1px solid var(--glass-border)',
                                background: isSelected ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255,255,255,0.7)',
                                color: isSelected ? '#ea580c' : '#2c2c2e',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s',
                              }}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Working Hours Start</label>
                        <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Working Hours End</label>
                        <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '15px' }} disabled={loading}>
                  {loading ? 'Creating account...' : `Create ${accountType === 'Faculty' ? 'Faculty' : 'Normal User'} Account`}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signin Redirect */}
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
