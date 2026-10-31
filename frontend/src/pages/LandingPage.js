import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PixelCalendar } from '../components/PixelIcons';
import {
  HeroIllustration,
  StepOneIllustration,
  StepTwoIllustration,
  StepThreeIllustration,
} from '../components/LandingIllustrations';

// React Icons
import {
  LuSparkles,
  LuScissors,
  LuFlame,
  LuHeartPulse,
  LuDumbbell,
  LuBriefcase,
  LuMonitor,
  LuBookOpen,
  LuLandmark,
  LuShoppingCart,
  LuBuilding2,
  LuUsers,
  LuScale,
  LuStethoscope,
  LuBrush,
  LuNetwork,
  LuCar,
  LuGlobe,
  LuCalendarDays,
  LuBellRing,
  LuStore,
  LuShieldCheck,
  LuUsersRound,
  LuChevronDown,
  LuMenu,
  LuX,
  LuCheck,
  LuArrowRight,
  LuMail,
  LuPhone,
} from 'react-icons/lu';
import { FaPaw } from 'react-icons/fa6';

const LandingPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState({});

  const primaryColor = theme.primaryColor || '#ea580c';
  const secondaryColor = theme.secondaryColor || '#ffedd5';
  const siteName = theme.siteName || 'Schedulify';

  const toggleFaq = (index) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // 18 Industries from reference Image 3
  const industries = [
    { name: 'Salon & Beauty', icon: <LuSparkles size={28} /> },
    { name: 'Barber', icon: <LuScissors size={28} /> },
    { name: 'Spa', icon: <LuFlame size={28} /> },
    { name: 'Health & Wellness', icon: <LuHeartPulse size={28} /> },
    { name: 'Fitness & Sports', icon: <LuDumbbell size={28} /> },
    { name: 'Professional Services', icon: <LuBriefcase size={28} /> },
    { name: 'Tutoring Services', icon: <LuMonitor size={28} /> },
    { name: 'Education & Non-profits', icon: <LuBookOpen size={28} /> },
    { name: 'Banking & Finance', icon: <LuLandmark size={28} /> },
    { name: 'Retail', icon: <LuShoppingCart size={28} /> },
    { name: 'Real Estate', icon: <LuBuilding2 size={28} /> },
    { name: 'Communities & Facilities', icon: <LuUsers size={28} /> },
    { name: 'Government & Public sector', icon: <LuScale size={28} /> },
    { name: 'Medical Office', icon: <LuStethoscope size={28} /> },
    { name: 'Pet Services', icon: <FaPaw size={26} /> },
    { name: 'Home Services & Cleaning', icon: <LuBrush size={28} /> },
    { name: 'Business Operations', icon: <LuNetwork size={28} /> },
    { name: 'Automotive', icon: <LuCar size={28} /> },
  ];

  // 6 Key Features from reference Image 4
  const features = [
    {
      title: 'Online Booking System',
      icon: <LuGlobe size={28} />,
      badge: '24/7',
      desc: `Remove friction from your booking process by minimizing the communication gap with your customers. Your ${siteName}'s online booking page will allow them to view real-time availability for services so that they can pick a time of their own convenience easily.`,
    },
    {
      title: 'Calendar Scheduler',
      icon: <LuCalendarDays size={28} />,
      badge: 'Sync',
      desc: 'View appointments and staff schedules for any day/week/month at a glance. Easily identify gaps in your schedule to fill empty slots by accommodating walk-ins or promoting deals.',
    },
    {
      title: 'Appointment Alerts',
      icon: <LuBellRing size={28} />,
      badge: 'Alerts',
      desc: 'Receive instant notifications via sms, email, or straight in the app when an appointment is booked, rescheduled, or canceled. Your customers also receive automated appointment alerts so that they stay on top of their bookings without having to dial-in.',
    },
    {
      title: 'Multi Channel Bookings',
      icon: <LuStore size={28} />,
      badge: 'Google',
      desc: "Accept online reservations from your business's Google My Business listing using Reserve with Google. Add a 'Book Now' button to your website, Facebook, & Instagram to enable appointment bookings, & prompt visitors to book when they are highly engaged with your brand.",
    },
    {
      title: 'No-show Protection',
      icon: <LuShieldCheck size={28} />,
      badge: 'Security',
      desc: 'Send automated email and text reminders to customers at preset times before each appointment to reduce no shows. With our Square, Stripe and Paypal integrations, you have the option to charge a full, part or a fixed amount as prepayment to avoid any casual bookings.',
    },
    {
      title: 'Staff Scheduling & Management',
      icon: <LuUsersRound size={28} />,
      badge: 'Team',
      desc: 'Assign staff or manager roles to your team members and let them manage their own schedules, leaves, etc. Keep a constant tab on staff productivity, sales, and schedules. Auto-allocate online appointments to staff members based on intelligent algorithms to ensure maximum productivity.',
    },
  ];

  // 10 FAQ items from reference Image 5 (5 Left, 5 Right)
  const faqLeft = [
    {
      q: 'What is an online booking system?',
      a: `${siteName} is a comprehensive online booking system that enables businesses, organizations, and service providers to accept appointments 24/7. It eliminates telephone tag and manual scheduling with automated calendar booking, instant confirmations, and customer self-service.`,
    },
    {
      q: 'How can I manage all the bookings that are made in the booking software?',
      a: `Through your centralized ${siteName} dashboard, you can view appointments in day, week, or month calendar formats, accept or decline incoming requests, reschedule bookings with automatic notifications, and track attendance with real-time analytics.`,
    },
    {
      q: 'Can different staff members have their own login?',
      a: `Yes! ${siteName} features full multi-role permission controls. You can create unique accounts for Administrators, Providers, Receptionists, and Department Coordinators, allowing staff members to manage their individual calendars, shifts, and breaks safely.`,
    },
    {
      q: `Can I add ${siteName} to my website or social media handles?`,
      a: `Yes, you can easily embed your personalized ${siteName} booking widget directly into any website, or add direct booking links and "Book Now" buttons to your Instagram, Facebook page, LinkedIn profile, and Google My Business profile.`,
    },
    {
      q: 'Which data formats are supported during migration from other software systems?',
      a: `We provide automated import wizards supporting standard CSV and Excel (.xlsx) file formats for customer contacts, service menus, appointment histories, and staff directories. Our team is also on standby to assist with enterprise data transfers.`,
    },
  ];

  const faqRight = [
    {
      q: `Does ${siteName} offer client and admin appointment scheduling apps?`,
      a: `Yes, ${siteName} is engineered with a progressive, responsive web architecture that delivers a fluid native-app experience across iOS, Android, macOS, and Windows browsers without requiring cumbersome store downloads.`,
    },
    {
      q: 'Can I set specific availability for certain services, and not a regular one?',
      a: 'Absolutely. You can define granular availability rules per service, assign custom buffers between sessions, configure minimum and maximum advance booking windows, and designate specific staff members to distinct service categories.',
    },
    {
      q: 'Can I sync my personal calendar with an online booking platform?',
      a: `${siteName} supports real-time two-way synchronization with Google Calendar, Apple iCloud Calendar, Microsoft Outlook, and Office 365, guaranteeing you will never be double-booked across your personal and professional schedules.`,
    },
    {
      q: `Does ${siteName} also have a WordPress plugin?`,
      a: `Yes! We provide an official embed script and WordPress plugin that lets you add your live booking page to any WordPress page, post, or sidebar widget with a single click.`,
    },
    {
      q: 'How does the free trial work? What happens after it ends?',
      a: `Our free plan is 100% free forever with no credit card required. If you test our Pro or Enterprise tiers on a 14-day trial and decide not to upgrade, your account simply transitions to the Free plan with all your bookings preserved.`,
    },
  ];

  return (
    <div
      id="home"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.8)), url("/workspace_bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        paddingBottom: '60px',
        paddingTop: '16px',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        {/* Navigation Bar (Reference Image 1) */}
        <motion.nav
          className="navbar glass-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            margin: '0 0 30px 0',
            padding: '14px 28px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {theme.siteLogo ? (
              <img
                src={theme.siteLogo}
                alt="Logo"
                style={{ height: '36px', borderRadius: '8px', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: secondaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PixelCalendar size={24} color={primaryColor} />
              </div>
            )}
            <span
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.5px',
                color: 'var(--text-primary)',
              }}
            >
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
            className="desktop-nav"
          >
            <a href="#home" className="landing-nav-link">
              Home
            </a>
            <a href="#industries" className="landing-nav-link">
              Customers
            </a>
            <a href="#contact" className="landing-nav-link">
              Contact Us
            </a>
            <a href="#pricing" className="landing-nav-link">
              Pricing
            </a>

            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-nav-link" style={{ fontWeight: 600 }}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{
                    textDecoration: 'none',
                    padding: '10px 24px',
                    borderRadius: '20px',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            {mobileMenuOpen ? <LuX size={26} /> : <LuMenu size={26} />}
          </div>
        </motion.nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card"
              style={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '20px',
              }}
            >
              <a
                href="#home"
                className="landing-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#industries"
                className="landing-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customers
              </a>
              <a
                href="#contact"
                className="landing-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </a>
              <a
                href="#enterprise"
                className="landing-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Enterprise
              </a>
              <a
                href="#pricing"
                className="landing-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="btn-primary"
                    style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary"
                      style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            SECTION 1: HERO SECTION (Reference Image 1)
        ========================================================================== */}
        <section className="hero-wrapper">
          {/* Left Column: Heading, Subtitle, CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 800,
                fontFamily: 'Outfit',
                lineHeight: 1.15,
                letterSpacing: '-1.2px',
                color: 'var(--text-primary)',
                marginBottom: '24px',
              }}
            >
              Discover the easiest way to schedule appointments with the{' '}
              <span style={{ color: primaryColor }}>#1 online booking system</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '36px',
              }}
            >
              Save time spent on coordinating appointments over phone and email with an all-in-one
              appointment booking software. Accept online bookings 24x7, automate payments,
              business management, marketing, and more!
            </p>

            <div>
              <Link
                to={user ? '/dashboard' : '/register'}
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  padding: '16px 38px',
                  fontSize: '1.1rem',
                  borderRadius: '30px',
                  fontWeight: 600,
                  boxShadow: `0 8px 24px rgba(234, 88, 12, 0.28)`,
                }}
              >
                {user ? 'Go to Dashboard' : 'Get started now!'}
              </Link>

              <div
                style={{
                  marginTop: '16px',
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}
              >
                No credit card required! Our free plan is free forever.
              </div>
            </div>
          </motion.div>

          {/* Right Column: Desk Calendar & Character Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <HeroIllustration primaryColor={primaryColor} secondaryColor={secondaryColor} />
          </motion.div>
        </section>

        {/* Transition Headline to 3-Step Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            margin: '80px 0 30px 0',
            padding: '0 20px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)',
              fontWeight: 700,
              fontFamily: 'Outfit',
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
              maxWidth: '750px',
              margin: '0 auto',
              lineHeight: 1.3,
            }}
          >
            Online appointment booking made simple with a 3-step setup process
          </h2>
        </motion.div>

        {/* =========================================================================
            SECTION 2: 3-STEP SETUP PROCESS JOURNEY (Reference Image 2)
        ========================================================================== */}
        <section className="step-journey-container" id="how-it-works">
          {/* Subtle connecting curved trail path */}
          <svg className="step-path-svg" viewBox="0 0 900 650" fill="none" preserveAspectRatio="none">
            <path
              d="M 180 80 Q 450 180 480 320 T 220 540"
              stroke="#e2e8f0"
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 180 80 Q 450 180 480 320 T 220 540"
              stroke={secondaryColor}
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </svg>

          {/* STEP 1 */}
          <motion.div
            className="step-card-row"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <StepOneIllustration primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </div>
            <div style={{ flex: '1 1 auto', maxWidth: '580px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="step-number-badge">1</span>
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--text-primary)',
                  }}
                >
                  Set your availability. Booking rules make it simple and flexible
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  paddingLeft: '44px',
                }}
              >
                Simply enter the available services and working hours for you and your staff for
                your booking page to be ready. Add buffers, block-times, or irregular available
                hours to replicate your real-life schedule. No double bookings!
              </p>
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div
            className="step-card-row step-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <StepTwoIllustration primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </div>
            <div style={{ flex: '1 1 auto', maxWidth: '580px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="step-number-badge">2</span>
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--text-primary)',
                  }}
                >
                  Share your booking link with your customers or embed it
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  paddingLeft: '44px',
                }}
              >
                Share your online appointment booking page URL with your customers in emails, texts,
                brochures, etc. Start accepting appointments on your website by integrating{' '}
                {siteName}'s booking widget on it. Add 'Book Now' button on your Facebook, Instagram
                and Google My Business pages.
              </p>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div
            className="step-card-row"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <StepThreeIllustration primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </div>
            <div style={{ flex: '1 1 auto', maxWidth: '580px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="step-number-badge">3</span>
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--text-primary)',
                  }}
                >
                  Accept online bookings hassle-free 24x7 (55% people book outside business hours)!
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  paddingLeft: '44px',
                }}
              >
                Give customers the convenience to self schedule, cancel, reschedule and book
                recurring appointments using {siteName}'s 24x7 online booking software. Send
                automated email and text reminders before appointments and reduce no-shows.
              </p>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 3: INDUSTRY SEGMENTS (Reference Image 3)
        ========================================================================== */}
        <section
          id="industries"
          style={{
            padding: '70px 0 60px 0',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.8px',
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              {siteName} can serve almost any industry segment
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                maxWidth: '720px',
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              Our appointment booking system is fit for all service-based local businesses,
              multi-location enterprises, franchises, and more.
            </p>
          </motion.div>

          {/* 18 Industries Grid */}
          <motion.div
            className="industry-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {industries.map((ind, idx) => (
              <motion.div key={idx} className="industry-item" variants={itemVariants}>
                <div className="industry-circle">{ind.icon}</div>
                <span className="industry-label">{ind.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 4: KEY FEATURES HIGHLIGHTS (Reference Image 4)
        ========================================================================== */}
        <section
          id="features"
          style={{
            padding: '70px 0 60px 0',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '20px' }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.8px',
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              Everything you need to automate your appointment workflow
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              Powerful tools designed to simplify your schedule, protect against missed bookings,
              and delight your clients.
            </p>
          </motion.div>

          {/* 6 Features Grid (2 rows x 3 columns) */}
          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {features.map((feat, idx) => (
              <motion.div key={idx} className="feature-card-item" variants={itemVariants}>
                <div className="feature-icon-wrapper">{feat.icon}</div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.94rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS (Reference Image 5)
        ========================================================================== */}
        <section
          id="faq"
          style={{
            padding: '70px 0 70px 0',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '25px' }}
          >
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.8px',
                color: 'var(--text-primary)',
              }}
            >
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="faq-grid">
            {/* Left Column (5 Questions) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqLeft.map((item, idx) => {
                const key = `left-${idx}`;
                const isOpen = !!openFaq[key];
                return (
                  <motion.div
                    key={key}
                    className={`faq-pill-card ${isOpen ? 'active' : ''}`}
                    onClick={() => toggleFaq(key)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="faq-question-row">
                      <span>{item.q}</span>
                      <LuChevronDown
                        size={20}
                        className={`faq-chevron ${isOpen ? 'expanded' : ''}`}
                      />
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="faq-answer-content"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column (5 Questions) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqRight.map((item, idx) => {
                const key = `right-${idx}`;
                const isOpen = !!openFaq[key];
                return (
                  <motion.div
                    key={key}
                    className={`faq-pill-card ${isOpen ? 'active' : ''}`}
                    onClick={() => toggleFaq(key)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="faq-question-row">
                      <span>{item.q}</span>
                      <LuChevronDown
                        size={20}
                        className={`faq-chevron ${isOpen ? 'expanded' : ''}`}
                      />
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="faq-answer-content"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            PRICING TIERS SECTION (Supporting Navbar "Pricing" link)
        ========================================================================== */}
        <section id="pricing" style={{ padding: '60px 0', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.8px',
                marginBottom: '15px',
                color: 'var(--text-primary)',
              }}
            >
              Simple, transparent pricing
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.15rem',
                marginBottom: '50px',
              }}
            >
              Choose the tier that fits your scheduling requirements. No hidden fees.
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '30px',
              alignItems: 'center',
            }}
          >
            {/* Free Tier */}
            <div className="glass-card" style={{ padding: '40px 30px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Free Tier</h3>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  margin: '18px 0',
                  color: 'var(--text-primary)',
                }}
              >
                ₹0
                <span style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  {' '}
                  / forever
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', minHeight: '44px' }}>
                For individual freelancers or solo professionals starting out.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  '1 Provider Account',
                  'Up to 50 bookings / month',
                  'Standard Calendar Integration',
                  'Email Confirmation Alerts',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.95rem',
                    }}
                  >
                    <LuCheck color={primaryColor} size={18} /> {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Schedule */}
            <div
              className="glass-card"
              style={{
                padding: '44px 32px',
                textAlign: 'left',
                border: `2px solid ${primaryColor}`,
                background: 'rgba(255,255,255,0.85)',
                boxShadow: `0 20px 45px rgba(234, 88, 12, 0.15)`,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: primaryColor,
                  color: '#ffffff',
                  padding: '5px 16px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Most Popular
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Pro Schedule</h3>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  margin: '18px 0',
                  color: 'var(--text-primary)',
                }}
              >
                ₹2,499
                <span style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  {' '}
                  / month
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', minHeight: '44px' }}>
                Ideal for clinics, law practices, salons, and expanding business operations.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  '15 Provider Accounts',
                  'Unlimited Appointments',
                  'Google Calendar & Outlook 2-way sync',
                  'SMS & In-app reminder notifications',
                  'Role Management & Receptionist view',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.95rem',
                    }}
                  >
                    <LuCheck color={primaryColor} size={18} /> {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                Start 14-day Free Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="glass-card" style={{ padding: '40px 30px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Enterprise</h3>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  margin: '18px 0',
                  color: 'var(--text-primary)',
                }}
              >
                ₹7,999
                <span style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  {' '}
                  / month
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', minHeight: '44px' }}>
                Engineered for hospitals, universities, and multi-location franchises.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  'Unlimited Staff & Multi-Department',
                  'Dedicated Receptionist & Dean portals',
                  'Customized SMTP & Domain branding',
                  'Priority 24/7 Phone & Email support',
                  'Custom integrations & SLA guarantee',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.95rem',
                    }}
                  >
                    <LuCheck color={primaryColor} size={18} /> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ENTERPRISE BANNER SECTION (Supporting Navbar "Enterprise" link)
        ========================================================================== */}
        <section id="enterprise" style={{ margin: '50px 0' }}>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              padding: '48px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '30px',
              background: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span
                style={{
                  background: secondaryColor,
                  color: primaryColor,
                  padding: '5px 14px',
                  borderRadius: '16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'inline-block',
                  marginBottom: '14px',
                }}
              >
                ENTERPRISE GRADE INFRASTRUCTURE
              </span>
              <h3
                style={{
                  fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)',
                  fontWeight: 800,
                  fontFamily: 'Outfit',
                  letterSpacing: '-0.6px',
                  marginBottom: '14px',
                  color: 'var(--text-primary)',
                }}
              >
                Built for multi-location universities and healthcare networks
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}
              >
                Manage department rosters, student advising hours, doctor rotations, and receptionist
                booking desks from a singular secure environment. Enterprise SSO, custom role
                hierarchies, and audit logs included.
              </p>
            </div>
            <div>
              <a
                href="#contact"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 30px',
                  fontSize: '1.05rem',
                }}
              >
                Request Enterprise Demo <LuArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            CONTACT US SECTION (Supporting Navbar "Contact Us" link)
        ========================================================================== */}
        <section id="contact" style={{ padding: '60px 0 40px 0' }}>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              padding: '48px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            <h3
              style={{
                fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                fontWeight: 800,
                fontFamily: 'Outfit',
                letterSpacing: '-0.6px',
                marginBottom: '12px',
                color: 'var(--text-primary)',
              }}
            >
              Have questions or need assistance?
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto 30px auto',
              }}
            >
              Our team of scheduling specialists is available 24/7 to assist with onboarding, custom
              configurations, and enterprise deployments.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="mailto:support@schedulify.io"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                }}
              >
                <LuMail size={18} color={primaryColor} /> support@schedulify.io
              </a>
              <a
                href="tel:+18005550199"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                }}
              >
                <LuPhone size={18} color={primaryColor} /> +1 (800) 555-0199
              </a>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            FOOTER
        ========================================================================== */}
        <footer
          style={{
            marginTop: '60px',
            padding: '40px 0 20px 0',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {theme.siteLogo ? (
                <img
                  src={theme.siteLogo}
                  alt="Logo"
                  style={{ height: '24px', borderRadius: '4px' }}
                />
              ) : (
                <PixelCalendar size={20} color={primaryColor} />
              )}
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  fontFamily: 'Outfit',
                  color: 'var(--text-primary)',
                }}
              >
                {siteName}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              © {new Date().getFullYear()} {siteName} Inc. All rights reserved.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <a href="#home" className="landing-nav-link" style={{ padding: 0 }}>
              Home
            </a>
            <a href="#how-it-works" className="landing-nav-link" style={{ padding: 0 }}>
              How it works
            </a>
            <a href="#industries" className="landing-nav-link" style={{ padding: 0 }}>
              Industries
            </a>
            <a href="#features" className="landing-nav-link" style={{ padding: 0 }}>
              Features
            </a>
            <a href="#faq" className="landing-nav-link" style={{ padding: 0 }}>
              FAQ
            </a>
            <a href="#pricing" className="landing-nav-link" style={{ padding: 0 }}>
              Pricing
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
