import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PixelCalendar } from '../components/PixelIcons';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Booking Flow Steps: 1 = Dept, 2 = Provider, 3 = Date & Slot, 4 = Details & Confirm
  const [step, setStep] = useState(1);

  // Lists
  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Selections
  const [selectedDept, setSelectedDept] = useState(null);
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
    // Fetch departments
    const fetchDepts = async () => {
      try {
        const res = await axios.get('/api/departments');
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepts();
  }, [user]);

  // Handle department selection
  const handleSelectDept = async (dept) => {
    setSelectedDept(dept);
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/providers?department=${dept._id}`);
      if (res.data.success) {
        setProviders(res.data.providers);
        setStep(2);
      }
    } catch (err) {
      toast.error('Error fetching providers for this department');
    } finally {
      setLoading(false);
    }
  };

  // Handle provider selection
  const handleSelectProvider = (prov) => {
    setSelectedProvider(prov);
    setStep(3);
  };

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
          toast.warning('Provider is out of office / blocked on this date.');
          return;
        }

        // Find matching weekly hours configuration
        const weeklyConfig = availability.weeklyHours.find((wh) => wh.dayOfWeek === dayOfWeek && wh.isActive);
        if (!weeklyConfig) {
          toast.warning('Provider has no slots configured for this day of the week.');
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
        departmentId: selectedDept._id,
        date: selectedDate,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        reason,
      });

      if (res.data.success) {
        toast.success('Appointment booking submitted successfully! Confirmation email sent.');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit appointment booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Dynamic Background Blurs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Top Breadcrumb Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PixelCalendar size={28} color="#ea580c" />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>Book appointment</span>
        </div>
        <Link to="/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Back to Dashboard
        </Link>
      </header>

      {/* Progress indicators */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: s <= step ? 'linear-gradient(135deg, var(--saffron) 0%, #ea580c 100%)' : 'rgba(255,255,255,0.4)',
            }}
          ></div>
        ))}
      </div>

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Select Department / Category</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  onClick={() => handleSelectDept(dept)}
                  className="glass-card"
                  style={{ cursor: 'pointer', padding: '25px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--glass-border)', textAlign: 'center' }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {dept.category}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{dept.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: '10px' }}>{dept.description || 'Access scheduler'}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Choose Professional</h2>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Back</button>
            </div>
            
            {providers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#8e8e93', padding: '30px' }}>No active providers in this department.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {providers.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleSelectProvider(p)}
                    className="glass-card"
                    style={{ cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.6)' }}
                  >
                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {p.avatar ? <img src={`${axios.defaults.baseURL}${p.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{p.title || ''} {p.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600, marginTop: '3px' }}>{p.specialization}</p>
                      <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: '6px' }}>{p.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Select Date & Time</h2>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Back</button>
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label className="form-label">Appointment Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>

            {selectedDate && (
              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '15px' }}>Vacant Slots</label>
                {loading ? (
                  <p>Calculating slots...</p>
                ) : availableSlots.length === 0 ? (
                  <p style={{ color: '#8e8e93', fontSize: '0.9rem' }}>No open vacancies on this day.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: selectedSlot === slot ? '2px solid #ea580c' : '1px solid var(--glass-border)',
                          background: selectedSlot === slot ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255,255,255,0.7)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        {slot.start}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedSlot && (
              <button onClick={() => setStep(4)} className="btn-primary" style={{ width: '100%', marginTop: '30px' }}>
                Proceed to Details
              </button>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Submit Appointment Details</h2>
              <button onClick={() => setStep(3)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Back</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '20px', borderRadius: '15px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Department:</strong> {selectedDept?.name}</div>
              <div><strong>Provider:</strong> {selectedProvider?.title || ''} {selectedProvider?.name} ({selectedProvider?.specialization})</div>
              <div><strong>Scheduled Slot:</strong> {selectedDate} at {selectedSlot?.start} - {selectedSlot?.end}</div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label className="form-label">Brief Reason for Booking</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Explain consultation context, department queries, syllabus checkups, or legal cases..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                {loading ? 'Submitting request...' : 'Confirm and Book Session'}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default BookAppointment;
