import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PixelCalendar, PixelUser } from '../components/PixelIcons';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Booking Flow Steps: 1 = Choose Faculty, 2 = Date & Slot, 3 = Details & Confirm
  const [step, setStep] = useState(1);

  // Lists & Search
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  // Selections
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null); // { start, end }
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Fetch all active providers/faculties
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/users/providers');
        if (res.data.success) {
          setProviders(res.data.providers);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching available faculties');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [user, navigate]);

  // Handle provider selection
  const handleSelectProvider = (prov) => {
    setSelectedProvider(prov);
    setStep(2);
  };

  // Filtered provider list based on search term
  const filteredProviders = providers.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const titleMatch = (p.title || '').toLowerCase().includes(term);
    const specMatch = (p.specialization || '').toLowerCase().includes(term);
    const bioMatch = (p.bio || '').toLowerCase().includes(term);
    return nameMatch || titleMatch || specMatch || bioMatch;
  });

  // Handle date select and compute slot availability rules
  const handleDateChange = async (dateVal) => {
    setSelectedDate(dateVal);
    setSelectedSlot(null);
    setAvailableSlots([]);

    if (!dateVal || !selectedProvider) return;

    try {
      setLoading(true);
      
      // Fetch provider availability profile
      const availRes = await axios.get(`/api/users/providers/${selectedProvider._id}/availability`);
      // Fetch provider booked appointments on that date to block them
      const apptRes = await axios.get(`/api/appointments?providerId=${selectedProvider._id}&date=${dateVal}`);

      if (availRes.data.success && apptRes.data.success) {
        const availability = availRes.data.availability;
        const bookedAppointments = apptRes.data.appointments;

        const dayOfWeek = new Date(dateVal).getDay(); // 0 = Sun, 1 = Mon...
        
        // Check if date is in blocked dates
        if (availability.blockedDates.includes(dateVal)) {
          toast.warning('Faculty is out of office / unavailable on this date.');
          return;
        }

        // Find matching weekly hours configuration
        const weeklyConfig = availability.weeklyHours.find((wh) => wh.dayOfWeek === dayOfWeek && wh.isActive);
        if (!weeklyConfig) {
          toast.warning('Faculty has no available slots configured for this day of the week.');
          return;
        }

        // Generate availability slots (intervals of e.g. 30 minutes)
        const slotsGenerated = [];
        const slotMinutes = availability.slotDuration || 30;

        weeklyConfig.slots.forEach((range) => {
          let current = timeToMinutes(range.start);
          const end = timeToMinutes(range.end);

          while (current + slotMinutes <= end) {
            const startStr = minutesToTime(current);
            const endStr = minutesToTime(current + slotMinutes);

            // Verify if slot is already occupied
            const isBooked = bookedAppointments.some(
              (appt) =>
                appt.timeSlot.start === startStr &&
                ['Pending', 'Approved', 'Rescheduled'].includes(appt.status)
            );

            if (!isBooked) {
              slotsGenerated.push({ start: startStr, end: endStr });
            }

            current += slotMinutes;
          }
        });

        setAvailableSlots(slotsGenerated);
        if (slotsGenerated.length === 0) {
          toast.info('No vacant time slots left for this date.');
        }
      }
    } catch (err) {
      toast.error('Could not fetch schedule availability');
    } finally {
      setLoading(false);
    }
  };

  // Convert "09:30" to 570 minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert 570 minutes to "09:30"
  const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Confirm booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!reason) {
      return toast.error('Please specify a brief reason for booking');
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/appointments', {
        providerId: selectedProvider._id,
        date: selectedDate,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        reason,
      });

      if (res.data.success) {
        toast.success('Appointment booking submitted successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit appointment booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Background Blurs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PixelCalendar size={28} color="#ea580c" />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>Book Appointment</span>
        </div>
        <Link to="/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Back to Dashboard
        </Link>
      </header>

      {/* Progress Indicators */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '35px' }}>
        {[
          { stepNum: 1, label: '1. Choose Faculty' },
          { stepNum: 2, label: '2. Date & Time Slots' },
          { stepNum: 3, label: '3. Confirm Session' },
        ].map((s) => (
          <div
            key={s.stepNum}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: s.stepNum <= step ? 'linear-gradient(135deg, var(--saffron) 0%, #ea580c 100%)' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s',
            }}
          ></div>
        ))}
      </div>

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        
        {/* STEP 1: CHOOSE FACULTY / PROVIDER */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card" style={{ padding: '30px' }}>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Available Faculties & Specialists</h2>
              <p style={{ color: '#636366', fontSize: '0.9rem', marginTop: '5px' }}>Select any doctor, teacher, or specialist to book a slot</p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '25px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, title, or profession (e.g. Doctor, Teacher, Cardiology, AI)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '14px 20px', borderRadius: '15px', fontSize: '0.95rem' }}
              />
            </div>
            
            {loading ? (
              <p style={{ textAlign: 'center', color: '#8e8e93', padding: '40px' }}>Loading faculties...</p>
            ) : filteredProviders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '20px' }}>
                <PixelUser size={36} color="#8e8e93" style={{ marginBottom: '10px' }} />
                <p style={{ color: '#8e8e93', fontWeight: 600 }}>No faculties found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredProviders.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleSelectProvider(p)}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      padding: '20px',
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      gap: '15px',
                      alignItems: 'flex-start',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.3rem', flexShrink: 0 }}>
                      {p.avatar ? <img src={`${axios.defaults.baseURL}${p.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : p.name.charAt(0)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        {p.title || ''} {p.name}
                      </h3>
                      <span style={{ display: 'inline-block', background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, marginTop: '4px' }}>
                        {p.specialization || 'Specialist'}
                      </span>
                      {p.bio && (
                        <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: SELECT DATE & AVAILABLE SLOTS */}
        {step === 2 && selectedProvider && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Select Date & Available Slots</h2>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Change Faculty
              </button>
            </div>

            {/* Faculty Info Header Card */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '20px', borderRadius: '18px', marginBottom: '30px', border: '1px solid var(--glass-border)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem' }}>
                {selectedProvider.avatar ? <img src={`${axios.defaults.baseURL}${selectedProvider.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : selectedProvider.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedProvider.title || ''} {selectedProvider.name}</h3>
                <span style={{ display: 'inline-block', background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, marginTop: '2px' }}>
                  {selectedProvider.specialization}
                </span>
                {selectedProvider.bio && <p style={{ fontSize: '0.82rem', color: '#636366', marginTop: '6px' }}>{selectedProvider.bio}</p>}
              </div>
            </div>

            {/* Date Picker */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label className="form-label">Select Date for Appointment</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                style={{ padding: '14px 20px', fontSize: '1rem' }}
              />
            </div>

            {/* Available Time Slots Grid */}
            {selectedDate && (
              <div>
                <label className="form-label" style={{ fontWeight: 800, marginBottom: '15px', display: 'block' }}>
                  Available Vacant Slots on {selectedDate}
                </label>
                {loading ? (
                  <p style={{ color: '#8e8e93', fontSize: '0.9rem' }}>Calculating available slots...</p>
                ) : availableSlots.length === 0 ? (
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                    <p style={{ color: '#8e8e93', fontSize: '0.9rem' }}>No open time slots available for this date. Please try another day.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {availableSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.start === slot.start;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '14px',
                            border: isSelected ? '2px solid #ea580c' : '1px solid var(--glass-border)',
                            background: isSelected ? 'rgba(234, 88, 12, 0.18)' : 'rgba(255,255,255,0.7)',
                            color: isSelected ? '#ea580c' : '#2c2c2e',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          {slot.start}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {selectedSlot && (
              <button onClick={() => setStep(3)} className="btn-primary" style={{ width: '100%', marginTop: '30px', padding: '14px' }}>
                Proceed to Details ({selectedSlot.start} - {selectedSlot.end})
              </button>
            )}
          </motion.div>
        )}

        {/* STEP 3: CONFIRMATION DETAILS */}
        {step === 3 && selectedProvider && selectedSlot && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Confirm Appointment Request</h2>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Back</button>
            </div>

            {/* Summary Box */}
            <div style={{ background: 'rgba(255,255,255,0.7)', padding: '20px', borderRadius: '18px', marginBottom: '25px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Faculty:</strong> {selectedProvider.title || ''} {selectedProvider.name} ({selectedProvider.specialization})</div>
              <div><strong>Scheduled Date:</strong> {selectedDate}</div>
              <div><strong>Scheduled Time Slot:</strong> {selectedSlot.start} - {selectedSlot.end}</div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label className="form-label">Brief Reason for Appointment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Explain consultation topic, academic advising, clinical checkup, or session requirements..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  style={{ resize: 'none', padding: '15px' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '15px', padding: '14px' }} disabled={loading}>
                {loading ? 'Submitting request...' : 'Confirm & Book Appointment'}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default BookAppointment;
