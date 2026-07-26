import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  PixelCalendar,
  PixelUser,
  PixelDoctor,
  PixelUniversity,
  PixelOffice,
} from '../components/PixelIcons';

const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const hoverEffect = {
    scale: 1.03,
    y: -8,
    boxShadow: '0 20px 40px rgba(31, 38, 135, 0.15)',
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.8)), url("/workspace_bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      paddingBottom: '80px',
      paddingTop: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      {/* Header / Navbar */}
      <motion.nav
        className="navbar glass-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PixelCalendar size={32} color="#f97316" />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
            Schedulify
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1c1c1e', fontWeight: 500 }}>
                Log In
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px 20px' }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span
            style={{
              background: 'rgba(255,255,255,0.6)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ea580c',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
            }}
          >
            🚀 Introducing Schedulify 2.0
          </span>
          <h1
            style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              fontFamily: 'Outfit',
              lineHeight: 1.1,
              marginTop: '25px',
              letterSpacing: '-1.5px',
            }}
          >
            The glassmorphic schedule tool <br />
            built for the <span style={{ color: '#ea580c' }}>future</span>.
          </h1>
          <p
            style={{
              fontSize: '1.35rem',
              color: '#636366',
              maxWidth: '700px',
              margin: '25px auto',
              lineHeight: 1.5,
            }}
          >
            A SaaS platform created for universities, hospitals, offices, lawyers, and freelancers. Drag-and-drop slots, timezone support, and pixel-perfect design.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '35px' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 36px', fontSize: '1.1rem' }}>
              Create Free Account
            </Link>
            <a href="#features" className="btn-secondary" style={{ textDecoration: 'none', padding: '16px 36px', fontSize: '1.1rem' }}>
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* Showcase Cards / Grid */}
      <motion.section
        id="features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          padding: '60px 0',
        }}
      >
        <motion.div className="glass-card" variants={itemVariants} whileHover={hoverEffect}>
          <div style={{ background: '#e0f2fe', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <PixelUniversity size={24} color="#0284c7" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Universities & Colleges</h3>
          <p style={{ color: '#636366', lineHeight: 1.5 }}>
            Coordinate hours between students, teachers, and university coordinators easily. Set recurring semester blocks.
          </p>
        </motion.div>

        <motion.div className="glass-card" variants={itemVariants} whileHover={hoverEffect}>
          <div style={{ background: '#fef3c7', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <PixelDoctor size={24} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Hospitals & Healthcare</h3>
          <p style={{ color: '#636366', lineHeight: 1.5 }}>
            Patients book doctor consultation slots online. Real-time notifications keep receptionists and practitioners synced.
          </p>
        </motion.div>

        <motion.div className="glass-card" variants={itemVariants} whileHover={hoverEffect}>
          <div style={{ background: '#ffedd5', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <PixelOffice size={24} color="#ea580c" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Offices & Consultancies</h3>
          <p style={{ color: '#636366', lineHeight: 1.5 }}>
            Arrange manager and employee alignment syncs. Allow clients to reserve lawyer and consultant time blocks.
          </p>
        </motion.div>
      </motion.section>

      {/* Value Proposition Box */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card"
        style={{
          margin: '60px 0',
          padding: '50px',
          background: 'rgba(255, 255, 255, 0.55)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        <div style={{ flex: '1 1 450px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '20px' }}>
            Configurable role access for any hierarchy.
          </h2>
          <p style={{ color: '#636366', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '25px' }}>
            Schedulify provides five pre-configured roles. Receptionists schedule on behalf of providers. University coordinators oversee entire departments. Customers view simple availability panels to reserve dates instantly.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
              Explore Roles
            </Link>
          </div>
        </div>
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {['Admin Approval Controls', 'In-App Alerts & SMTP E-mails', 'Drag & Drop Calendar Slots', 'Analytics & Revenue Tracking'].map((text, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', borderRadius: '15px', background: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></div>
              <span style={{ fontWeight: 600, fontSize: '1rem' }}>{text}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <section style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '15px' }}>Simple Glassmorphic Pricing</h2>
        <p style={{ color: '#636366', fontSize: '1.2rem', marginBottom: '50px' }}>Choose the tier that fits your institutional scheduling demands.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '40px 30px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Free Tier</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>₹0</div>
            <p style={{ color: '#636366', marginBottom: '25px' }}>For single freelancers or self-employed professionals.</p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>✓ 1 Provider Account</li>
              <li>✓ Up to 50 bookings / month</li>
              <li>✓ Core Calendar Integration</li>
            </ul>
            <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none', display: 'block' }}>Get Started</Link>
          </div>

          <div className="glass-card" style={{ padding: '40px 30px', border: '2px solid #ea580c', transform: 'scale(1.03)', background: 'rgba(255,255,255,0.7)' }}>
            <span style={{ background: '#ea580c', color: '#fff', padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '10px' }}>Pro Schedule</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>₹2,499<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</span></div>
            <p style={{ color: '#636366', marginBottom: '25px' }}>Perfect for hospitals, corporate offices, and law groups.</p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>✓ 15 Provider Accounts</li>
              <li>✓ Unlimited Appointments</li>
              <li>✓ Advanced Admin Panel & Analytics</li>
              <li>✓ Role Management & Approvals</li>
            </ul>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', display: 'block' }}>Start 14-day Trial</Link>
          </div>

          <div className="glass-card" style={{ padding: '40px 30px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Enterprise</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>₹7,999<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</span></div>
            <p style={{ color: '#636366', marginBottom: '25px' }}>For large-scale universities and hospitals.</p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>✓ Unlimited Providers & Depts</li>
              <li>✓ Receptionist & Coordinator Roles</li>
              <li>✓ Customized SMTP configurations</li>
              <li>✓ 24/7 Priority Support</li>
            </ul>
            <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none', display: 'block' }}>Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '80px', padding: '40px 0', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <PixelCalendar size={20} color="#ea580c" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Schedulify</span>
          </div>
          <p style={{ color: '#8e8e93', fontSize: '0.85rem' }}>© 2026 Schedulify Inc. Built with macOS Sonoma & visionOS principles.</p>
        </div>
        <div style={{ display: 'flex', gap: '40px', marginLeft: 'auto' }}>
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: '10px' }}>Platform</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <a href="#features" style={{ color: '#636366', textDecoration: 'none' }}>Features</a>
              <a href="#pricing" style={{ color: '#636366', textDecoration: 'none' }}>Pricing</a>
            </div>
          </div>
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: '10px' }}>Support</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <a href="#faq" style={{ color: '#636366', textDecoration: 'none' }}>FAQ</a>
              <a href="#docs" style={{ color: '#636366', textDecoration: 'none' }}>API Reference</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default LandingPage;
