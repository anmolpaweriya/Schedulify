import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  PixelCalendar,
  PixelUser,
  PixelOffice,
} from '../components/PixelIcons';

// Lucide & FontAwesome Icons
import {
  LuScissors,
  LuDumbbell,
  LuUsers,
  LuBriefcase,
  LuGraduationCap,
  LuCamera,
  LuMessagesSquare,
  LuTarget,
  LuGlobe,
  LuHeartPulse,
  LuHouse,
  LuCar,
  LuStar,
  LuMusic,
  LuMapPin,
  LuClock,
  LuPlus,
  LuX,
  LuArrowRight,
  LuSearch,
  LuMaximize2,
  LuCheck,
  LuCircle,
} from 'react-icons/lu';
import { FaPaw } from 'react-icons/fa6';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();

  const primaryColor = theme.primaryColor || '#ea580c';
  const secondaryColor = theme.secondaryColor || '#ffedd5';
  const siteName = theme.siteName || 'Schedulify';

  // Step 0: Choose Account Type: 'Administrator' vs 'Normal User'
  const [accountType, setAccountType] = useState(''); // '' | 'Administrator' | 'Normal User'
  const [step, setStep] = useState(1); // Wizard step number

  // Common User Credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------
  // ADMINISTRATOR (THE ONE WHO WILL TAKE THE BOOKING) STATE
  // -------------------------------------------------------------
  // Step 1: Business Scale
  const [businessType, setBusinessType] = useState('An Individual');

  // Step 2: Service Category
  const [businessCategory, setBusinessCategory] = useState('Beauty & Wellness');
  const [categorySearch, setCategorySearch] = useState('');

  // Step 3: Service Menu
  const [services, setServices] = useState([
    { title: 'General Appointment', duration: 30, price: 500 },
  ]);

  // Step 4: Business Hours (Mon-Fri active by default)
  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', dayOfWeek: 1, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', dayOfWeek: 2, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', dayOfWeek: 3, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', dayOfWeek: 4, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', dayOfWeek: 5, isOpen: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', dayOfWeek: 6, isOpen: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Sunday', dayOfWeek: 0, isOpen: false, startTime: '09:00', endTime: '17:00' },
  ]);

  // Step 5: Business Location & Details
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('India');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [timezone, setTimezone] = useState('Asia/Calcutta (+05:30)');

  // -------------------------------------------------------------
  // NORMAL USER (THE ONE WHO WILL BOOK) STATE
  // -------------------------------------------------------------
  const [bookingInterests, setBookingInterests] = useState([]);
  const [preferredDays, setPreferredDays] = useState('Weekdays (Mon-Fri)');
  const [preferredTiming, setPreferredTiming] = useState('Morning (9:00 AM - 12:00 PM)');
  const [userCity, setUserCity] = useState('');

  // 15 Service Categories for Step 2 (Reference Image 2)
  const categoryList = [
    { name: 'Beauty & Wellness', desc: 'Salons, Spas, Life Coaches', icon: <LuScissors size={20} /> },
    { name: 'Health & Fitness', desc: 'Yoga, Sports, Therapists', icon: <LuDumbbell size={20} /> },
    { name: 'Classes & Events', desc: 'Coaches, Weddings, Event Organisers', icon: <LuUsers size={20} /> },
    { name: 'Professional Services', desc: 'Accountants, Attorneys, Consultants', icon: <LuBriefcase size={20} /> },
    { name: 'Education & Tutoring', desc: 'Schools, Colleges, Tutors', icon: <LuGraduationCap size={20} /> },
    { name: 'Photography', desc: 'Photographers, Videographers, Studios', icon: <LuCamera size={20} /> },
    { name: 'Pet Services', desc: 'Pet Sitters, Groomers, Trainers', icon: <FaPaw size={18} /> },
    { name: 'Meetings & Counselling', desc: 'Interviews, Support Services', icon: <LuMessagesSquare size={20} /> },
    { name: 'Activities', desc: 'Hot Air Balloons, Scuba, Art Activities', icon: <LuTarget size={20} /> },
    { name: 'Administrative Services', desc: 'Consulates, Government Institutions', icon: <LuGlobe size={20} /> },
    { name: 'Doctors & Clinics', desc: 'Dentists, Chiropractors, Physicians', icon: <LuHeartPulse size={20} /> },
    { name: 'Home Services', desc: 'Maid Services, Carpet Cleaning, Plumbers', icon: <LuHouse size={20} /> },
    { name: 'Automobile', desc: 'Car Detailing, Driving Schools, Transportation', icon: <LuCar size={20} /> },
    { name: 'Spiritual Services', desc: 'Readings, Psychics, Astrologers', icon: <LuStar size={20} /> },
    { name: 'Music & Dance', desc: 'Studios, Schools, Dance', icon: <LuMusic size={20} /> },
  ];

  // Filtered categories based on search input
  const filteredCategories = categoryList.filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Dynamic formatted date in top right ("OCT 31, 2026 / TODAY")
  const currentDateStr = new Date()
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();

  // Handle adding service row in Step 3
  const handleAddService = () => {
    setServices([...services, { title: '', duration: 30, price: 0 }]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleRemoveService = (index) => {
    if (services.length === 1) {
      return toast.warning('At least one service is required');
    }
    setServices(services.filter((_, i) => i !== index));
  };

  // Handle business hours toggle & change
  const handleHourToggle = (dayName) => {
    setBusinessHours(
      businessHours.map((bh) => (bh.day === dayName ? { ...bh, isOpen: !bh.isOpen } : bh))
    );
  };

  const handleHourTimeChange = (dayName, field, val) => {
    setBusinessHours(
      businessHours.map((bh) => (bh.day === dayName ? { ...bh, [field]: val } : bh))
    );
  };

  // Normal User interest toggle
  const handleInterestToggle = (catName) => {
    if (bookingInterests.includes(catName)) {
      setBookingInterests(bookingInterests.filter((c) => c !== catName));
    } else {
      setBookingInterests([...bookingInterests, catName]);
    }
  };

  // Submit Registration
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error('Name, email, and password are required');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);

    try {
      const isAdministrator = accountType === 'Administrator';

      let payload = {};

      if (isAdministrator) {
        // Prepare Administrator / Provider payload
        payload = {
          name,
          email,
          password,
          role: 'Provider',
          title: businessType === 'An Individual' ? 'Solo' : 'Admin',
          specialization: businessCategory,
          bio: businessName || `${businessType} in ${businessCategory}`,
          businessType,
          businessCategory,
          businessName: businessName || name,
          businessLocation: {
            address,
            country,
            region,
            city,
            zip,
          },
          timezone,
          services: services.filter((s) => s.title.trim() !== ''),
          businessHours,
          phone,
        };
      } else {
        // Prepare Normal User payload
        payload = {
          name,
          email,
          password,
          role: 'Customer',
          phone,
          bookingInterests,
          preferredTiming: `${preferredDays} • ${preferredTiming}`,
          timezone,
          businessLocation: {
            city: userCity,
          },
        };
      }

      const res = await register(payload);

      if (res.message && res.message.includes('verify')) {
        toast.info(res.message, { autoClose: 8000 });
        navigate('/login');
      } else {
        toast.success(
          isAdministrator
            ? 'Administrator setup complete! Welcome to Schedulify.'
            : 'Account created! Welcome to Schedulify.'
        );
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.35 },
  };

  // Total steps based on role
  const totalAdminSteps = 6;
  const totalUserSteps = 4;
  const currentTotalSteps = accountType === 'Administrator' ? totalAdminSteps : totalUserSteps;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '30px 16px',
        position: 'relative',
      }}
    >
      {/* Background Animated Gradient Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="onboarding-card">
        {/* =========================================================================
            HEADER & PROGRESS BAR (Matching Reference Screenshots)
        ========================================================================== */}
        {accountType !== '' && (
          <div className="onboarding-top-bar">
            {/* Step Dots with Connecting Line */}
            <div className="step-dots-container">
              {Array.from({ length: currentTotalSteps }).map((_, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < step;
                const isActive = stepNum === step;

                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`step-dot-circle ${isCompleted ? 'completed' : ''} ${
                        isActive ? 'active' : ''
                      }`}
                      style={{
                        borderColor: isActive ? primaryColor : undefined,
                        background: isCompleted ? primaryColor : undefined,
                      }}
                    />
                    {idx < currentTotalSteps - 1 && (
                      <div
                        className={`step-dot-line ${stepNum < step ? 'filled' : ''}`}
                        style={{
                          backgroundColor: stepNum < step ? primaryColor : undefined,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Current Date Badge (Image top right) */}
            <div className="onboarding-date-badge">
              <div>{currentDateStr}</div>
              <span>TODAY</span>
            </div>
          </div>
        )}

        {/* Brand Bar for Step 0 */}
        {accountType === '' && (
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              {theme.siteLogo ? (
                <img
                  src={theme.siteLogo}
                  alt="Logo"
                  style={{ height: '32px', borderRadius: '6px' }}
                />
              ) : (
                <PixelCalendar size={26} color={primaryColor} />
              )}
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  fontFamily: 'Outfit',
                  color: 'var(--text-primary)',
                }}
              >
                {siteName}
              </span>
            </div>
            <h2
              style={{
                fontSize: '1.9rem',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.5px',
              }}
            >
              Who is this account for?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Choose whose account is being created to customize your setup experience
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* =========================================================================
              STEP 0: CHOOSE WHOSE ACCOUNT IS BEING CREATED
          ========================================================================== */}
          {accountType === '' && (
            <motion.div key="step0" {...pageTransition}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                  marginTop: '15px',
                  marginBottom: '20px',
                }}
              >
                {/* Option 1: Administrator (The one who will take the booking) */}
                <div
                  onClick={() => {
                    setAccountType('Administrator');
                    setStep(1);
                  }}
                  className="glass-card"
                  style={{
                    padding: '36px 28px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.75)',
                    border: '1.5px solid rgba(226, 232, 240, 0.9)',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = primaryColor;
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 35px rgba(234, 88, 12, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                  }}
                >
                  <span
                    style={{
                      background: secondaryColor,
                      color: primaryColor,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      marginBottom: '16px',
                      letterSpacing: '0.3px',
                    }}
                  >
                    THE ONE WHO WILL TAKE THE BOOKING
                  </span>

                  <div
                    style={{
                      background: secondaryColor,
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px',
                    }}
                  >
                    <PixelOffice size={28} color={primaryColor} />
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>
                    Administrator / Provider
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      marginBottom: '20px',
                    }}
                  >
                    Set up your business, configure your service menu, define working hours, and
                    accept client bookings 24x7.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: primaryColor,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    Get Started as Administrator <LuArrowRight size={18} />
                  </div>
                </div>

                {/* Option 2: Normal User (The one who will book) */}
                <div
                  onClick={() => {
                    setAccountType('Normal User');
                    setStep(1);
                  }}
                  className="glass-card"
                  style={{
                    padding: '36px 28px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.75)',
                    border: '1.5px solid rgba(226, 232, 240, 0.9)',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = primaryColor;
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 35px rgba(234, 88, 12, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                  }}
                >
                  <span
                    style={{
                      background: '#e0f2fe',
                      color: '#0284c7',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      marginBottom: '16px',
                      letterSpacing: '0.3px',
                    }}
                  >
                    THE ONE WHO WILL BOOK
                  </span>

                  <div
                    style={{
                      background: '#e0f2fe',
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px',
                    }}
                  >
                    <PixelUser size={28} color="#0284c7" />
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>
                    Normal User / Client
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      marginBottom: '20px',
                    }}
                  >
                    Discover registered doctors, consultants, salons and tutors. Book appointment
                    slots effortlessly and track your bookings.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0284c7',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    Get Started as Normal User <LuArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* Login link */}
              <p
                style={{
                  textAlign: 'center',
                  marginTop: '25px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                }}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{ color: primaryColor, textDecoration: 'none', fontWeight: 700 }}
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          )}

          {/* =========================================================================
              ADMINISTRATOR ONBOARDING FLOW (SCREENSHOTS 1 TO 5 + FINAL CREDENTIALS)
          ========================================================================== */}

          {/* ADMIN STEP 1: What best describes your business? (Screenshot 1) */}
          {accountType === 'Administrator' && step === 1 && (
            <motion.div key="admin-step1" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '28px',
                  color: 'var(--text-primary)',
                }}
              >
                What best describes your business?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  {
                    title: 'An Individual',
                    desc: 'Your scheduling requirements are for a single user',
                  },
                  {
                    title: 'Multi Staff Business',
                    desc: 'You are a part of a business with multiple staff that requires scheduling',
                  },
                  {
                    title: 'Multi Location Business',
                    desc: 'You are a part of an organisation with multiple locations and a large team that requires scheduling',
                  },
                ].map((item, idx) => {
                  const isSelected = businessType === item.title;
                  return (
                    <div
                      key={idx}
                      onClick={() => setBusinessType(item.title)}
                      style={{
                        padding: '18px 22px',
                        borderRadius: '16px',
                        border: isSelected
                          ? `2px solid ${primaryColor}`
                          : '1.5px solid rgba(226, 232, 240, 0.9)',
                        background: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        boxShadow: isSelected
                          ? `0 6px 20px rgba(234, 88, 12, 0.12)`
                          : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Radio dot */}
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? primaryColor : '#94a3b8'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '3px',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: primaryColor,
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <strong
                          style={{
                            fontSize: '1.1rem',
                            display: 'block',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {item.title}
                        </strong>
                        <span
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-secondary)',
                            marginTop: '4px',
                            display: 'block',
                          }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setAccountType('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ADMIN STEP 2: What type of services do you provide? (Screenshot 2) */}
          {accountType === 'Administrator' && step === 2 && (
            <motion.div key="admin-step2" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: 'var(--text-primary)',
                }}
              >
                What type of services do you provide?
              </h2>

              {/* 15 Categories Grid */}
              <div className="category-grid-15">
                {filteredCategories.map((cat, idx) => {
                  const isSelected = businessCategory === cat.name;
                  return (
                    <div
                      key={idx}
                      className={`category-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setBusinessCategory(cat.name)}
                      style={{
                        borderColor: isSelected ? primaryColor : undefined,
                      }}
                    >
                      <div className="category-icon-box">{cat.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong
                          style={{
                            fontSize: '0.94rem',
                            display: 'block',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {cat.name}
                        </strong>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {cat.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Search bar below */}
              <div style={{ marginTop: '22px' }}>
                <label
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Can't find what you are looking for?
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search category or type your custom profession..."
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      if (e.target.value.trim() !== '') {
                        setBusinessCategory(e.target.value);
                      }
                    }}
                    style={{ paddingLeft: '40px' }}
                  />
                  <LuSearch
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(3)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ADMIN STEP 3: Create your own service menu (Screenshot 3) */}
          {accountType === 'Administrator' && step === 3 && (
            <motion.div key="admin-step3" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '24px',
                  color: 'var(--text-primary)',
                }}
              >
                Create your own service menu
              </h2>

              {/* Service Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1.2fr 1.2fr 40px',
                    gap: '14px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    padding: '0 6px',
                  }}
                >
                  <span>Service Title</span>
                  <span>Duration (min)</span>
                  <span>Price (INR)</span>
                  <span></span>
                </div>

                {services.map((svc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1.2fr 1.2fr 40px',
                      gap: '14px',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Consultation Session"
                      value={svc.title}
                      onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="30"
                      value={svc.duration}
                      onChange={(e) => handleServiceChange(idx, 'duration', e.target.value)}
                      min="5"
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="500"
                      value={svc.price}
                      onChange={(e) => handleServiceChange(idx, 'price', e.target.value)}
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Remove service"
                    >
                      <LuX size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* + Add Service Button */}
              <button
                type="button"
                onClick={handleAddService}
                style={{
                  background: 'none',
                  border: 'none',
                  color: primaryColor,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '20px',
                  padding: '6px 0',
                }}
              >
                <LuPlus size={18} /> Add Service
              </button>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const hasValidTitle = services.some((s) => s.title.trim() !== '');
                    if (!hasValidTitle) {
                      return toast.error('Please enter at least one service title');
                    }
                    setStep(4);
                  }}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ADMIN STEP 4: Add business hours to let customers know when you are open (Screenshot 4) */}
          {accountType === 'Administrator' && step === 4 && (
            <motion.div key="admin-step4" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: 'var(--text-primary)',
                }}
              >
                Add business hours to let customers know when you are open
              </h2>

              <div className="business-hours-list">
                {businessHours.map((bh) => (
                  <div
                    key={bh.day}
                    className={`business-hour-item ${!bh.isOpen ? 'disabled' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      background: bh.isOpen ? 'rgba(255, 255, 255, 0.75)' : 'rgba(248, 250, 252, 0.5)',
                      border: bh.isOpen ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(241, 245, 249, 0.8)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      onClick={() => handleHourToggle(bh.day)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '140px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: 600,
                        color: bh.isOpen ? 'var(--text-primary)' : '#94a3b8',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: bh.isOpen ? (theme.primaryColor || '#0284c7') : '#cbd5e1',
                        }}
                      >
                        {bh.isOpen ? (
                          <LuCheck size={20} strokeWidth={2.8} />
                        ) : (
                          <LuCircle size={19} strokeWidth={2} />
                        )}
                      </span>
                      <span style={{ fontSize: '0.96rem' }}>{bh.day}</span>
                    </div>

                    {bh.isOpen ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="time"
                          className="form-control"
                          style={{
                            width: '135px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#fff',
                            border: '1px solid #cbd5e1',
                            fontWeight: 500,
                          }}
                          value={bh.startTime}
                          onChange={(e) => handleHourTimeChange(bh.day, 'startTime', e.target.value)}
                        />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                          To
                        </span>
                        <input
                          type="time"
                          className="form-control"
                          style={{
                            width: '135px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#fff',
                            border: '1px solid #cbd5e1',
                            fontWeight: 500,
                          }}
                          value={bh.endTime}
                          onChange={(e) => handleHourTimeChange(bh.day, 'endTime', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => handleHourToggle(bh.day)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.45, cursor: 'pointer' }}
                        title="Click to enable business hours for this day"
                      >
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            width: '135px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                          placeholder="Start Time"
                          readOnly
                        />
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                          To
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            width: '135px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                          placeholder="End Time"
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const hasActiveDay = businessHours.some((bh) => bh.isOpen);
                    if (!hasActiveDay) {
                      return toast.error('Please keep at least one day open for appointments');
                    }
                    setStep(5);
                  }}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ADMIN STEP 5: Just one last thing! (Screenshot 5 with map) */}
          {accountType === 'Administrator' && step === 5 && (
            <motion.div key="admin-step5" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '24px',
                  color: 'var(--text-primary)',
                }}
              >
                Just one last thing!
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.15fr 1fr',
                  gap: '28px',
                  alignItems: 'stretch',
                }}
              >
                {/* Left Column: Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Business Name */}
                  <div>
                    <label className="form-label">How do customers recognize your business?</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What is your Business Name?"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Location Address */}
                  <div>
                    <label className="form-label">Where is your business located?</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address line (Street, Suite, Landmark)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ marginBottom: '10px' }}
                    />
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <select
                        className="form-control"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                      </select>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="State / Region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Zip / Postal Code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="form-label">What is your timezone?</label>
                    <select
                      className="form-control"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="Asia/Calcutta (+05:30)">Asia/Calcutta (+05:30)</option>
                      <option value="UTC">UTC (+00:00)</option>
                      <option value="America/New_York (-05:00)">America/New York (-05:00)</option>
                      <option value="America/Los_Angeles (-08:00)">America/Los Angeles (-08:00)</option>
                      <option value="Europe/London (+00:00)">Europe/London (+00:00)</option>
                      <option value="Asia/Dubai (+04:00)">Asia/Dubai (+04:00)</option>
                      <option value="Asia/Singapore (+08:00)">Asia/Singapore (+08:00)</option>
                    </select>
                  </div>
                </div>

                {/* Right Column: Map Preview Frame (Matching Screenshot 5) */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="map-preview-frame">
                    <div className="map-grid-pattern"></div>
                    <div className="map-pin-pulse"></div>
                    <div className="map-pin-marker">
                      <LuMapPin size={38} color="#ef4444" fill="#ef4444" />
                    </div>

                    {/* Fullscreen icon top right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255,255,255,0.85)',
                        padding: '6px',
                        borderRadius: '8px',
                        color: '#64748b',
                        display: 'flex',
                      }}
                    >
                      <LuMaximize2 size={16} />
                    </div>

                    {/* Google watermark bottom left */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      Google
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    if (!businessName.trim()) {
                      return toast.error('Please enter your business name');
                    }
                    setStep(6);
                  }}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ADMIN STEP 6: Finalize Administrator Login Credentials */}
          {accountType === 'Administrator' && step === 6 && (
            <motion.div key="admin-step6" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Create your Administrator Account
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginBottom: '24px',
                }}
              >
                Set up your administrator credentials to manage {businessName || 'your business'}
              </p>

              {/* Quick Summary Pill Banner */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: secondaryColor,
                  border: `1px solid ${primaryColor}40`,
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: '0.88rem',
                }}
              >
                <div>
                  <strong style={{ color: primaryColor }}>Business:</strong>{' '}
                  {businessName || 'Schedulify Business'} • {businessCategory} ({businessType})
                </div>
                <div style={{ color: '#475569' }}>
                  {services.length} Service(s) • Mon-Fri 09:00 - 17:00
                </div>
              </div>

              <form onSubmit={handleFinalSubmit}>
                <div className="form-group">
                  <label className="form-label">Administrator Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Business / Work Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="admin@mybusiness.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number (SMS Notifications)</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Create Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="onboarding-bottom-bar">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                    }}
                  >
                    &lt; Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{
                      padding: '14px 34px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {loading ? 'Setting up business...' : 'Create Administrator Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* =========================================================================
              NORMAL USER ONBOARDING FLOW (THE ONE WHO WILL BOOK)
          ========================================================================== */}

          {/* USER STEP 1: What type of appointments do you plan to book? */}
          {accountType === 'Normal User' && step === 1 && (
            <motion.div key="user-step1" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                What type of appointments do you plan to book?
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginBottom: '24px',
                }}
              >
                Select the service categories you are interested in booking (select one or multiple)
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    title: 'Doctors & Healthcare Clinics',
                    desc: 'Physicians, specialists, dentist consultations',
                    icon: <LuHeartPulse size={22} />,
                  },
                  {
                    title: 'Education & Tutoring',
                    desc: 'Academic coaching, instructors, private tutoring',
                    icon: <LuGraduationCap size={22} />,
                  },
                  {
                    title: 'Salons, Beauty & Spa',
                    desc: 'Hair styling, massages, personal care',
                    icon: <LuScissors size={22} />,
                  },
                  {
                    title: 'Fitness & Sports Coaching',
                    desc: 'Gym trainers, yoga, athletics coaching',
                    icon: <LuDumbbell size={22} />,
                  },
                  {
                    title: 'Professional & Legal Services',
                    desc: 'Consultants, attorneys, financial advisors',
                    icon: <LuBriefcase size={22} />,
                  },
                  {
                    title: 'General Consultations & Others',
                    desc: 'Freelancers, photography, office appointments',
                    icon: <LuClock size={22} />,
                  },
                ].map((item, idx) => {
                  const isSelected = bookingInterests.includes(item.title);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleInterestToggle(item.title)}
                      className={`category-select-card ${isSelected ? 'selected' : ''}`}
                      style={{
                        padding: '18px 20px',
                        borderColor: isSelected ? primaryColor : undefined,
                      }}
                    >
                      <div className="category-icon-box">{item.icon}</div>
                      <div>
                        <strong
                          style={{
                            fontSize: '0.98rem',
                            display: 'block',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {item.title}
                        </strong>
                        <span
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            display: 'block',
                            marginTop: '3px',
                          }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setAccountType('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* USER STEP 2: Preferred Booking Schedule & Availability */}
          {accountType === 'Normal User' && step === 2 && (
            <motion.div key="user-step2" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                When do you usually prefer booking?
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginBottom: '26px',
                }}
              >
                Help us surface matching provider slots that fit your daily schedule
              </p>

              {/* Preferred Days */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label">Preferred Days</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {['Weekdays (Mon-Fri)', 'Weekends (Sat-Sun)', 'Any Day / Flexible'].map(
                    (dOption) => {
                      const isSelected = preferredDays === dOption;
                      return (
                        <button
                          key={dOption}
                          type="button"
                          onClick={() => setPreferredDays(dOption)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '14px',
                            border: isSelected
                              ? `2px solid ${primaryColor}`
                              : '1px solid var(--glass-border)',
                            background: isSelected
                              ? 'rgba(255,255,255,0.95)'
                              : 'rgba(255,255,255,0.6)',
                            fontWeight: 600,
                            color: isSelected ? primaryColor : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {dOption}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Preferred Time Window */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label">Preferred Time Window</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    'Morning (9:00 AM - 12:00 PM)',
                    'Afternoon (12:00 PM - 5:00 PM)',
                    'Evening (5:00 PM - 8:00 PM)',
                  ].map((tOption) => {
                    const isSelected = preferredTiming === tOption;
                    return (
                      <button
                        key={tOption}
                        type="button"
                        onClick={() => setPreferredTiming(tOption)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '14px',
                          border: isSelected
                            ? `2px solid ${primaryColor}`
                            : '1px solid var(--glass-border)',
                          background: isSelected
                            ? 'rgba(255,255,255,0.95)'
                            : 'rgba(255,255,255,0.6)',
                          fontWeight: 600,
                          color: isSelected ? primaryColor : 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {tOption}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* City Location */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Your City / Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Timezone</label>
                  <select
                    className="form-control"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="Asia/Calcutta (+05:30)">Asia/Calcutta (+05:30)</option>
                    <option value="UTC">UTC (+00:00)</option>
                    <option value="America/New_York (-05:00)">America/New York (-05:00)</option>
                    <option value="Europe/London (+00:00)">Europe/London (+00:00)</option>
                  </select>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(3)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* USER STEP 3: Personal & Contact Details */}
          {accountType === 'Normal User' && step === 3 && (
            <motion.div key="user-step3" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                How can providers reach you?
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginBottom: '26px',
                }}
              >
                Your contact details are used to confirm appointments and send reminders
              </p>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginTop: '6px',
                  }}
                >
                  Used for instant booking confirmations and reschedule alerts
                </span>
              </div>

              {/* Bottom Actions */}
              <div className="onboarding-bottom-bar">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  &lt; Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    if (!name.trim()) {
                      return toast.error('Please enter your full name');
                    }
                    setStep(4);
                  }}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  NEXT &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* USER STEP 4: Credentials & Account Finalize */}
          {accountType === 'Normal User' && step === 4 && (
            <motion.div key="user-step4" {...pageTransition}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Set up your Normal User Account
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginBottom: '26px',
                }}
              >
                Almost done, {name}! Create your secure login credentials to start booking
              </p>

              <form onSubmit={handleFinalSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="onboarding-bottom-bar">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                    }}
                  >
                    &lt; Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{
                      padding: '14px 34px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {loading ? 'Creating account...' : 'Create Normal User Account & Start Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;
