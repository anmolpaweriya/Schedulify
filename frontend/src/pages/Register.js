import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  PixelCalendar,
  PixelUniversity,
  PixelDoctor,
  PixelOffice,
  PixelUser,
} from '../components/PixelIcons';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Step 1: Category (University, Hospital, Office)
  // Step 2: Sub-role (Student vs Faculty, Patient vs Doctor, Client vs Officer)
  // Step 3: Registration Forms
  const [wizardStep, setWizardStep] = useState(1);

  // Form inputs
  const [category, setCategory] = useState(''); // University, Hospital, Office
  const [userRoleContext, setUserRoleContext] = useState(''); // Student, Faculty, Patient, Doctor, Client, Officer
  
  // Basic Credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Contextual inputs
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [program, setProgram] = useState('');
  const [section, setSection] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');

  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments list
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

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setWizardStep(2);
  };

  const handleSubRoleSelect = (subRole) => {
    setUserRoleContext(subRole);
    setWizardStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Name, email, and password are required');
    }

    setLoading(true);
    try {
      // Map context to standard roles
      // Student/Patient/Client -> Customer
      // Faculty/Doctor/Officer -> Provider
      const actualRole = ['Faculty', 'Doctor', 'Officer'].includes(userRoleContext) ? 'Provider' : 'Customer';

      const payload = {
        name,
        email,
        password,
        role: actualRole,
        address,
        dob,
        age: age ? parseInt(age) : null,
        gender,
        program,
        section,
        registrationNo,
        professionalId,
        // Provider specific additions
        ...(actualRole === 'Provider' && {
          title: title || (userRoleContext === 'Doctor' ? 'Dr.' : userRoleContext === 'Faculty' ? 'Prof.' : ''),
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
      
      {/* Background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <motion.div
        className="glass-card"
        style={{ width: '100%', maxWidth: '600px', padding: '40px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <PixelCalendar size={28} color="#ea580c" />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>Schedulify</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: '#636366', fontSize: '0.9rem', marginTop: '5px' }}>Set up Schedulify for your institution type</p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CATEGORY SELECTION */}
          {wizardStep === 1 && (
            <motion.div key="step1" {...pageTransition}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
                What are you going to use Schedulify for?
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('University')}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 25px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                  <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '10px' }}>
                    <PixelUniversity size={24} color="#0284c7" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>University & School</strong>
                    <span style={{ fontSize: '0.8rem', color: '#636366' }}>Academic advising, faculty sync, student consulting</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategorySelect('Hospital')}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 25px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                  <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '10px' }}>
                    <PixelDoctor size={24} color="#ef4444" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>Hospital & Clinic</strong>
                    <span style={{ fontSize: '0.8rem', color: '#636366' }}>Patient consultation booking, clinical scheduling</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategorySelect('Office')}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 25px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                  <div style={{ background: '#ffedd5', padding: '8px', borderRadius: '10px' }}>
                    <PixelOffice size={24} color="#ea580c" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>Office, Bank & Corporate</strong>
                    <span style={{ fontSize: '0.8rem', color: '#636366' }}>Client consultations, manager alignments, advisor slots</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CONTEXT ROLE SELECTION */}
          {wizardStep === 2 && (
            <motion.div key="step2" {...pageTransition}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Choose your role</h3>
                <button type="button" onClick={() => setWizardStep(1)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Back</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {category === 'University' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubRoleSelect('Student')}
                      className="glass-card"
                      style={{ padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.7)' }}
                    >
                      <PixelUser size={36} color="#ea580c" style={{ marginBottom: '15px' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Student</strong>
                      <span style={{ fontSize: '0.75rem', color: '#636366', display: 'block', marginTop: '5px' }}>Book faculty hours and check classes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSubRoleSelect('Faculty')}
                      className="glass-card"
                      style={{ padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.7)' }}
                    >
                      <PixelUniversity size={36} color="#ea580c" style={{ marginBottom: '15px' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Faculty / Teacher</strong>
                      <span style={{ fontSize: '0.75rem', color: '#636366', display: 'block', marginTop: '5px' }}>Manage academic slots & consult student queries</span>
                    </button>
                  </>
                )}

                {category === 'Hospital' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubRoleSelect('Patient')}
                      className="glass-card"
                      style={{ padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.7)' }}
                    >
                      <PixelUser size={36} color="#ea580c" style={{ marginBottom: '15px' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Patient</strong>
                      <span style={{ fontSize: '0.75rem', color: '#636366', display: 'block', marginTop: '5px' }}>Book clinic sessions and check summaries</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSubRoleSelect('Doctor')}
                      className="glass-card"
                      style={{ padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.7)' }}
                    >
                      <PixelDoctor size={36} color="#ea580c" style={{ marginBottom: '15px' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Doctor / Specialist</strong>
                      <span style={{ fontSize: '0.75rem', color: '#636366', display: 'block', marginTop: '5px' }}>Configure hours & review diagnostics</span>
                    </button>
                  </>
                )}

                {category === 'Office' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubRoleSelect('Client')}
                      className="glass-card"
                      style={{ padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.7)' }}
                    >
                      <PixelUser size={36} color="#ea580c" style={{ marginBottom: '15px' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Client</strong>
                      <span style={{ fontSize: '0.75rem', color: '#636366', display: 'block', marginTop: '5px' }}>Arrange advisory alignment meetups</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSubRoleSelect('Officer')}
                      className="glass-card"
                      style={{ padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.7)' }}
                    >
                      <PixelOffice size={36} color="#ea580c" style={{ marginBottom: '15px' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Officer / Staff</strong>
                      <span style={{ fontSize: '0.75rem', color: '#636366', display: 'block', marginTop: '5px' }}>Coordinate alignment hours and queries</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: ACCOUNT FORM DETAILS */}
          {wizardStep === 3 && (
            <motion.div key="step3" {...pageTransition}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Register as {userRoleContext}
                </h3>
                <button type="button" onClick={() => setWizardStep(2)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Back</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (@gmail.com)</label>
                    <input type="email" className="form-control" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>

                {/* 1. Context: STUDENT */}
                {userRoleContext === 'Student' && (
                  <div style={{ background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Academic Particulars</h4>
                    <div className="form-group">
                      <label className="form-label">Academic Program</label>
                      <input type="text" className="form-control" placeholder="e.g. Computer Science Engineering" value={program} onChange={(e) => setProgram(e.target.value)} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Section / Batch</label>
                        <input type="text" className="form-control" placeholder="e.g. Batch A" value={section} onChange={(e) => setSection(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Roll / Registration No</label>
                        <input type="text" className="form-control" placeholder="e.g. CS-2026-09" value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Context: PATIENT */}
                {userRoleContext === 'Patient' && (
                  <div style={{ background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Patient Details & Demographics</h4>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input type="text" className="form-control" placeholder="e.g. 12 Park Lane, Delhi" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Age</label>
                        <input type="number" className="form-control" placeholder="Years" value={age} onChange={(e) => setAge(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Context: DOCTOR / FACULTY / OFFICER (Providers) */}
                {['Doctor', 'Faculty', 'Officer'].includes(userRoleContext) && (
                  <div style={{ background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Professional Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Professional ID / Code</label>
                        <input type="text" className="form-control" placeholder={userRoleContext === 'Doctor' ? 'e.g. DOC-928' : 'e.g. FAC-098'} value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Associated Department</label>
                        <select className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                          <option value="">Choose Department</option>
                          {departmentsList.map((d) => (
                            <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" placeholder={userRoleContext === 'Doctor' ? 'Dr.' : 'Prof.'} value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Specialization</label>
                        <input type="text" className="form-control" placeholder={userRoleContext === 'Doctor' ? 'e.g. Cardiology' : 'e.g. AI systems'} value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short Biography</label>
                      <textarea className="form-control" placeholder="Syllabus specialties, consultancy background..." value={bio} onChange={(e) => setBio(e.target.value)} rows={2} style={{ resize: 'none' }} />
                    </div>
                  </div>
                )}

                {/* 4. Context: CLIENT */}
                {userRoleContext === 'Client' && (
                  <div style={{ background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Client Info & Address</h4>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input type="text" className="form-control" placeholder="e.g. Corporate lane, Mumbai" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }} disabled={loading}>
                  {loading ? 'Creating account...' : `Create Account as ${userRoleContext}`}
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
