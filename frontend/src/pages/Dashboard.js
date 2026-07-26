import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  PixelCalendar,
  PixelUser,
  PixelDoctor,
  PixelUniversity,
  PixelOffice,
  PixelBell,
  PixelSettings,
  PixelAppointment,
  PixelChat,
  PixelAnalytics,
} from '../components/PixelIcons';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Navigation state
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, calendar, availability, departments, admin-users, settings

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null); // appointment object
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStart, setRescheduleStart] = useState('');
  const [rescheduleEnd, setRescheduleEnd] = useState('');
  const [meetingNotesTarget, setMeetingNotesTarget] = useState(null);
  const [meetingNotesContent, setMeetingNotesContent] = useState('');

  // Department creation states
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptCategory, setNewDeptCategory] = useState('Education');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  // Settings states
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [requireApprove, setRequireApprove] = useState(true);
  const [requireVerify, setRequireVerify] = useState(false);

  // Availability state
  const [timezone, setTimezone] = useState('UTC');
  const [slotDuration, setSlotDuration] = useState(30);
  const [weeklyHours, setWeeklyHours] = useState([]);
  const [blockedDatesStr, setBlockedDatesStr] = useState('');

  // Profile Form States
  const [profName, setProfName] = useState(user?.name || '');
  const [profTitle, setProfTitle] = useState(user?.title || '');
  const [profSpec, setProfSpec] = useState(user?.specialization || '');
  const [profBio, setProfBio] = useState(user?.bio || '');
  const [profDept, setProfDept] = useState(user?.department?._id || user?.department || '');

  // Fetch initial analytics, notifications, appointments
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch analytics
      const analyticRes = await axios.get('/api/analytics/dashboard');
      if (analyticRes.data.success) {
        setAnalytics(analyticRes.data);
      }

      // Fetch notifications
      const notifRes = await axios.get('/api/notifications');
      if (notifRes.data.success) {
        setNotifications(notifRes.data.notifications);
      }

      // Fetch appointments
      const apptRes = await axios.get('/api/appointments');
      if (apptRes.data.success) {
        setAppointments(apptRes.data.appointments);
      }

      // Fetch departments
      const deptRes = await axios.get('/api/departments');
      if (deptRes.data.success) {
        setDepartments(deptRes.data.departments);
      }

      // Fetch Providers (for booking lists)
      const provRes = await axios.get('/api/users/providers');
      if (provRes.data.success) {
        setProviders(provRes.data.providers);
      }

      // Fetch Provider Availability if Provider
      if (user?.role === 'Provider') {
        const availRes = await axios.get(`/api/users/providers/${user._id}/availability`);
        if (availRes.data.success) {
          const av = availRes.data.availability;
          setTimezone(av.timezone);
          setSlotDuration(av.slotDuration);
          setWeeklyHours(av.weeklyHours);
          setBlockedDatesStr(av.blockedDates.join(', '));
        }
      }

      // Role specific admin resources
      if (['Admin', 'University Coordinator'].includes(user?.role)) {
        // Fetch users
        const usersRes = await axios.get('/api/users');
        if (usersRes.data.success) {
          setSystemUsers(usersRes.data.users);
        }

        // Fetch pending providers
        const pendingRes = await axios.get('/api/admin/providers/pending');
        if (pendingRes.data.success) {
          setPendingProviders(pendingRes.data.providers);
        }
      }

      // Fetch SMTP/Platform Settings
      if (user?.role === 'Admin') {
        const settingsRes = await axios.get('/api/admin/settings');
        if (settingsRes.data.success) {
          const s = settingsRes.data.settings;
          setSmtpHost(s.smtpHost || '');
          setSmtpPort(s.smtpPort || 587);
          setSmtpUser(s.smtpUser || '');
          setSmtpPass(s.smtpPass || '');
          setSmtpFrom(s.smtpFrom || '');
          setRequireApprove(s.requireProviderApproval);
          setRequireVerify(s.requireEmailVerification);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [user]);

  // Handle Log Out
  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Notification actions
  const handleMarkNotifRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  // Approve Provider Application
  const handleProviderApproval = async (id, status) => {
    try {
      const res = await axios.put(`/api/admin/providers/${id}/approve`, { status });
      if (res.data.success) {
        toast.success(`Provider application has been ${status.toLowerCase()}!`);
        setPendingProviders((prev) => prev.filter((p) => p._id !== id));
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request');
    }
  };

  // Handle update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profName,
        title: profTitle,
        specialization: profSpec,
        bio: profBio,
        department: profDept,
      });
      toast.success('Profile details updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  // Appointment State changes: Accept/Decline/Complete/Cancel
  const handleAppointmentAction = async (id, action) => {
    try {
      const res = await axios.put(`/api/appointments/${id}/${action}`);
      if (res.data.success) {
        toast.success(`Appointment status updated: ${action.toUpperCase()}`);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  // Open Reschedule Modal
  const openReschedule = (appt) => {
    setRescheduleTarget(appt);
    setRescheduleDate(appt.date);
    setRescheduleStart(appt.timeSlot.start);
    setRescheduleEnd(appt.timeSlot.end);
  };

  // Submit Reschedule Request
  const submitReschedule = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/appointments/${rescheduleTarget._id}/reschedule`, {
        newDate: rescheduleDate,
        startTime: rescheduleStart,
        endTime: rescheduleEnd,
        reason: 'Rescheduled from dashboard panel',
      });
      if (res.data.success) {
        toast.success('Appointment rescheduled successfully');
        setRescheduleTarget(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reschedule failed');
    }
  };

  // Open Meeting Notes Modal
  const openMeetingNotes = (appt) => {
    setMeetingNotesTarget(appt);
    setMeetingNotesContent(appt.meetingNotes || '');
  };

  // Save Meeting Notes
  const saveMeetingNotes = async () => {
    try {
      const res = await axios.put(`/api/appointments/${meetingNotesTarget._id}/notes`, {
        notes: meetingNotesContent,
      });
      if (res.data.success) {
        toast.success('Meeting notes updated successfully');
        setMeetingNotesTarget(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update notes');
    }
  };

  // Create Department
  const handleCreateDept = async (e) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) {
      return toast.error('Name and Code are required');
    }
    try {
      const res = await axios.post('/api/departments', {
        name: newDeptName,
        code: newDeptCode,
        category: newDeptCategory,
        description: newDeptDesc,
      });
      if (res.data.success) {
        toast.success('Department created successfully!');
        setNewDeptName('');
        setNewDeptCode('');
        setNewDeptDesc('');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/admin/settings', {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        smtpFrom,
        requireProviderApproval: requireApprove,
        requireEmailVerification: requireVerify,
      });
      if (res.data.success) {
        toast.success('Settings saved successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    }
  };

  // Save Availability slots
  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    try {
      const blockedDates = blockedDatesStr
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d !== '');

      const res = await axios.put('/api/users/availability', {
        timezone,
        slotDuration: parseInt(slotDuration),
        weeklyHours,
        blockedDates,
      });

      if (res.data.success) {
        toast.success('Availability slots saved successfully!');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save availability');
    }
  };

  // Update specific day hours availability state
  const handleToggleDay = (dayIndex) => {
    setWeeklyHours((prev) =>
      prev.map((wh) => (wh.dayOfWeek === dayIndex ? { ...wh, isActive: !wh.isActive } : wh))
    );
  };

  const handleSlotTimeChange = (dayIndex, slotIndex, field, value) => {
    setWeeklyHours((prev) =>
      prev.map((wh) => {
        if (wh.dayOfWeek === dayIndex) {
          const updatedSlots = wh.slots.map((s, idx) =>
            idx === slotIndex ? { ...s, [field]: value } : s
          );
          return { ...wh, slots: updatedSlots };
        }
        return wh;
      })
    );
  };

  // Charts render datasets
  const chartData = {
    labels: analytics?.dailyBookings?.map((b) => b.date) || [],
    datasets: [
      {
        label: 'Daily Scheduled Appointments',
        data: analytics?.dailyBookings?.map((b) => b.count) || [],
        fill: true,
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: '#38bdf8',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#a78bfa',
      },
    ],
  };

  const barChartData = {
    labels: analytics?.deptDistribution?.map((d) => d.code) || [],
    datasets: [
      {
        label: 'Bookings per Department',
        data: analytics?.deptDistribution?.map((d) => d.count) || [],
        backgroundColor: ['#ffedd5', '#e0f2fe', '#fef9c3', '#f3e8ff', '#34d399'],
        borderColor: '#ea580c',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="skeleton skeleton-title"></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '30px' }}>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
        <div className="skeleton skeleton-card" style={{ height: '300px' }}></div>
      </div>
    );
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
      
      {/* Dynamic Background Blurs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Sidebar Panel */}
      <nav className="sidebar glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '10px' }}>
          <PixelCalendar size={28} color="#ea580c" />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit' }}>Schedulify</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn-secondary ${activeTab === 'overview' ? 'active-tab' : ''}`}
            style={{
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '15px',
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(255,255,255,0.8)' : 'transparent',
              fontWeight: 600,
            }}
          >
            <PixelAnalytics size={18} color="#ea580c" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`btn-secondary ${activeTab === 'appointments' ? 'active-tab' : ''}`}
            style={{
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '15px',
              border: 'none',
              background: activeTab === 'appointments' ? 'rgba(255,255,255,0.8)' : 'transparent',
              fontWeight: 600,
            }}
          >
            <PixelAppointment size={18} color="#ea580c" /> Appointments
          </button>

          {user?.role === 'Customer' && (
            <Link
              to="/book"
              style={{
                textDecoration: 'none',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '15px',
                color: '#1c1c1e',
                fontWeight: 600,
              }}
            >
              <PixelCalendar size={18} color="#ea580c" /> Book Appointment
            </Link>
          )}

          {user?.role === 'Provider' && (
            <button
              onClick={() => setActiveTab('availability')}
              className={`btn-secondary ${activeTab === 'availability' ? 'active-tab' : ''}`}
              style={{
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '15px',
                border: 'none',
                background: activeTab === 'availability' ? 'rgba(255,255,255,0.8)' : 'transparent',
                fontWeight: 600,
              }}
            >
              <PixelCalendar size={18} color="#ea580c" /> Availability Slots
            </button>
          )}

          {['Admin', 'University Coordinator'].includes(user?.role) && (
            <>
              <button
                onClick={() => setActiveTab('departments')}
                className={`btn-secondary ${activeTab === 'departments' ? 'active-tab' : ''}`}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  borderRadius: '15px',
                  border: 'none',
                  background: activeTab === 'departments' ? 'rgba(255,255,255,0.8)' : 'transparent',
                  fontWeight: 600,
                }}
              >
                <PixelUniversity size={18} color="#ea580c" /> Departments
              </button>

              <button
                onClick={() => setActiveTab('admin-users')}
                className={`btn-secondary ${activeTab === 'admin-users' ? 'active-tab' : ''}`}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  borderRadius: '15px',
                  border: 'none',
                  background: activeTab === 'admin-users' ? 'rgba(255,255,255,0.8)' : 'transparent',
                  fontWeight: 600,
                }}
              >
                <PixelUser size={18} color="#ea580c" /> Manage Users
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`btn-secondary ${activeTab === 'settings' ? 'active-tab' : ''}`}
            style={{
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '15px',
              border: 'none',
              background: activeTab === 'settings' ? 'rgba(255,255,255,0.8)' : 'transparent',
              fontWeight: 600,
            }}
          >
            <PixelSettings size={18} color="#ea580c" /> My Profile
          </button>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.avatar ? (
                <img src={user.avatar.startsWith('/') ? `${axios.defaults.baseURL}${user.avatar}` : user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#636366' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Panel Content */}
      <main className="main-content">
        
        {/* Top Navbar Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>
              Hello, {user?.name}
            </h1>
            <p style={{ color: '#636366' }}>
              {user?.role === 'Provider' ? `${user.title || ''} Provider Account` : 'Manage your upcoming bookings.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>
            {/* Notification Bell Dropdown */}
            <button
              onClick={() => setNotifDropdown(!notifDropdown)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--glass-shadow)',
                position: 'relative',
              }}
            >
              <PixelBell size={20} color="#ea580c" />
              {unreadNotificationsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifDropdown && (
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '55px',
                    width: '320px',
                    zIndex: 200,
                    padding: '20px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                    <h4 style={{ fontWeight: 700 }}>Notifications</h4>
                    <button onClick={handleMarkAllNotifsRead} style={{ border: 'none', background: 'transparent', color: '#ea580c', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ color: '#8e8e93', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                      No new notifications
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => !n.isRead && handleMarkNotifRead(n._id)}
                          style={{
                            padding: '10px',
                            borderRadius: '12px',
                            background: n.isRead ? 'transparent' : 'rgba(56, 189, 248, 0.1)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                            <span>{n.title}</span>
                            {!n.isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }}></span>}
                          </div>
                          <p style={{ color: '#636366', marginTop: '3px' }}>{n.message}</p>
                          <span style={{ fontSize: '0.7rem', color: '#8e8e93', display: 'block', marginTop: '5px' }}>
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              {/* Analytics Top Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ background: '#e0f2fe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#0369a1', fontWeight: 600 }}>Total Bookings</span>
                    <PixelAppointment size={20} color="#0369a1" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.total || 0}</h2>
                </div>

                <div className="glass-card" style={{ background: '#fef9c3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#a16207', fontWeight: 600 }}>Pending Actions</span>
                    <PixelBell size={20} color="#a16207" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.pending || 0}</h2>
                </div>

                <div className="glass-card" style={{ background: '#dcfce7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>Approved Sessions</span>
                    <PixelCalendar size={20} color="#15803d" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.approved || 0}</h2>
                </div>

                <div className="glass-card" style={{ background: '#f3e8ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b21a8', fontWeight: 600 }}>Completed</span>
                    <PixelUser size={20} color="#6b21a8" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.completed || 0}</h2>
                </div>
              </div>

              {/* Chart & Department Graphics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ minHeight: '350px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Appointment Booking Velocity</h3>
                  <div style={{ height: '260px' }}>
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="glass-card" style={{ minHeight: '350px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Department Distributions</h3>
                  <div style={{ height: '260px' }}>
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              {/* Provider Approvals (Admin/Coordinator only) */}
              {['Admin', 'University Coordinator'].includes(user?.role) && pendingProviders.length > 0 && (
                <div className="glass-card" style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Pending Provider Registrations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {pendingProviders.map((p) => (
                      <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '15px 25px', borderRadius: '15px' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.title || ''} {p.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#636366' }}>{p.specialization} • Department: {p.department?.name || 'None'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleProviderApproval(p._id, 'Approved')} className="btn-primary" style={{ padding: '8px 18px', background: '#34d399', fontSize: '0.85rem' }}>Approve</button>
                          <button onClick={() => handleProviderApproval(p._id, 'Rejected')} className="btn-secondary" style={{ padding: '8px 18px', background: '#ef4444', color: '#fff', fontSize: '0.85rem', border: 'none' }}>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Appointments Schedule</h3>
                {appointments.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px 0', color: '#8e8e93' }}>No appointments booked yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {appointments.map((appt) => (
                      <div
                        key={appt._id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid var(--glass-border)',
                          padding: '20px 25px',
                          borderRadius: '20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '15px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '10px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: appt.status === 'Approved' ? '#dcfce7' : appt.status === 'Pending' ? '#fef9c3' : '#fee2e2',
                              color: appt.status === 'Approved' ? '#15803d' : appt.status === 'Pending' ? '#a16207' : '#b91c1c'
                            }}>
                              {appt.status}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#636366', fontWeight: 600 }}>{appt.date} • {appt.timeSlot.start} - {appt.timeSlot.end}</span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '8px' }}>
                            {user?.role === 'Customer' ? `${appt.provider.title || ''} ${appt.provider.name}` : appt.customer.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#636366', marginTop: '3px' }}>Reason: {appt.reason}</div>
                          {appt.meetingNotes && (
                            <div style={{ fontSize: '0.8rem', background: 'rgba(56,189,248,0.1)', padding: '6px 12px', borderRadius: '8px', marginTop: '10px', fontStyle: 'italic' }}>
                              Notes: {appt.meetingNotes}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {appt.status === 'Pending' && user?.role === 'Provider' && (
                            <>
                              <button onClick={() => handleAppointmentAction(appt._id, 'accept')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#34d399' }}>Accept</button>
                              <button onClick={() => handleAppointmentAction(appt._id, 'reject')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#fca5a5', border: 'none' }}>Reject</button>
                            </>
                          )}

                          {appt.status === 'Approved' && user?.role === 'Provider' && (
                            <button onClick={() => handleAppointmentAction(appt._id, 'complete')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#a78bfa' }}>Complete</button>
                          )}

                          {user?.role === 'Provider' && (
                            <button onClick={() => openMeetingNotes(appt)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Notes</button>
                          )}

                          {['Pending', 'Approved', 'Rescheduled'].includes(appt.status) && (
                            <>
                              <button onClick={() => openReschedule(appt)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Reschedule</button>
                              <button onClick={() => handleAppointmentAction(appt._id, 'cancel')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none' }}>Cancel</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'availability' && user?.role === 'Provider' && (
            <motion.div key="availability" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '25px' }}>Configure Calendar Availability</h3>
                
                <form onSubmit={handleSaveAvailability}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                    <div className="form-group">
                      <label className="form-label">Timezone</label>
                      <input type="text" className="form-control" value={timezone} onChange={(e) => setTimezone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Session Duration (minutes)</label>
                      <select className="form-control" value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)}>
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="45">45 Minutes</option>
                        <option value="60">60 Minutes</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '15px' }}>Weekly Working Days</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {weeklyHours.map((wh) => (
                        <div key={wh.dayOfWeek} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>
                          <input
                            type="checkbox"
                            checked={wh.isActive}
                            onChange={() => handleToggleDay(wh.dayOfWeek)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          <span style={{ width: '90px', fontWeight: 600 }}>
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][wh.dayOfWeek]}
                          </span>
                          
                          {wh.isActive && wh.slots.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input
                                type="time"
                                className="form-control"
                                style={{ padding: '6px 12px', width: '110px' }}
                                value={s.start}
                                onChange={(e) => handleSlotTimeChange(wh.dayOfWeek, idx, 'start', e.target.value)}
                              />
                              <span>to</span>
                              <input
                                type="time"
                                className="form-control"
                                style={{ padding: '6px 12px', width: '110px' }}
                                value={s.end}
                                onChange={(e) => handleSlotTimeChange(wh.dayOfWeek, idx, 'end', e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blocked Out Dates (Comma-separated YYYY-MM-DD)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2026-08-15, 2026-08-25"
                      value={blockedDatesStr}
                      onChange={(e) => setBlockedDatesStr(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                    Save Availability
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'departments' && ['Admin', 'University Coordinator'].includes(user?.role) && (
            <motion.div key="departments" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Existing Departments</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {departments.map((dept) => (
                      <div key={dept._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.7)', borderRadius: '15px' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{dept.name} ({dept.code})</div>
                          <div style={{ fontSize: '0.8rem', color: '#636366' }}>Category: {dept.category} • {dept.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card">
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Add Department</h3>
                  <form onSubmit={handleCreateDept}>
                    <div className="form-group">
                      <label className="form-label">Department Name</label>
                      <input type="text" className="form-control" placeholder="e.g. Computer Science" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Code</label>
                      <input type="text" className="form-control" placeholder="e.g. CS" value={newDeptCode} onChange={(e) => setNewDeptCode(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-control" value={newDeptCategory} onChange={(e) => setNewDeptCategory(e.target.value)}>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Government">Government</option>
                        <option value="Legal">Legal</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" placeholder="Short description..." value={newDeptDesc} onChange={(e) => setNewDeptDesc(e.target.value)} rows={2} style={{ resize: 'none' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                      Add Department
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin-users' && ['Admin', 'University Coordinator'].includes(user?.role) && (
            <motion.div key="admin-users" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Manage Users</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {systemUsers.map((u) => (
                    <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '15px 25px', borderRadius: '15px' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#636366' }}>{u.email} • Role: <strong>{u.role}</strong> {u.role === 'Provider' && `• Status: ${u.status}`}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Custom actions (e.g. Promote, Suspend or Delete) could be here */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                
                {/* Profile update form */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Update Profile Details</h3>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={profName} onChange={(e) => setProfName(e.target.value)} required />
                    </div>

                    {user?.role === 'Provider' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Professional Title</label>
                          <input type="text" className="form-control" value={profTitle} onChange={(e) => setProfTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Specialization</label>
                          <input type="text" className="form-control" value={profSpec} onChange={(e) => setProfSpec(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Biography</label>
                          <textarea className="form-control" value={profBio} onChange={(e) => setProfBio(e.target.value)} rows={3} style={{ resize: 'none' }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Department</label>
                          <select className="form-control" value={profDept} onChange={(e) => setProfDept(e.target.value)}>
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                      Save Profile
                    </button>
                  </form>
                </div>

                {/* SaaS SMTP Server Settings (Admin only) */}
                {user?.role === 'Admin' && (
                  <div className="glass-card">
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>SaaS Admin Configuration</h3>
                    <form onSubmit={handleSaveSettings}>
                      <div className="form-group">
                        <label className="form-label">SMTP Server Host</label>
                        <input type="text" className="form-control" placeholder="e.g. smtp.mailgun.org" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">SMTP Port</label>
                        <input type="number" className="form-control" value={smtpPort} onChange={(e) => setSmtpPort(parseInt(e.target.value))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">SMTP Username</label>
                        <input type="text" className="form-control" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">SMTP Password</label>
                        <input type="password" className="form-control" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Sender Email Address (From)</label>
                        <input type="text" className="form-control" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} />
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                        <input type="checkbox" checked={requireApprove} onChange={(e) => setRequireApprove(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                        <label className="form-label" style={{ marginBottom: 0 }}>Require Admin Provider Approval</label>
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={requireVerify} onChange={(e) => setRequireVerify(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                        <label className="form-label" style={{ marginBottom: 0 }}>Require Customer Email Verification</label>
                      </div>

                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Save Platform Settings
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Reschedule Appointment */}
        {rescheduleTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <motion.div className="glass-card" style={{ width: '400px', background: '#fff' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Reschedule Appointment</h3>
              <form onSubmit={submitReschedule}>
                <div className="form-group">
                  <label className="form-label">New Date</label>
                  <input type="date" className="form-control" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input type="time" className="form-control" value={rescheduleStart} onChange={(e) => setRescheduleStart(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input type="time" className="form-control" value={rescheduleEnd} onChange={(e) => setRescheduleEnd(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm</button>
                  <button type="button" onClick={() => setRescheduleTarget(null)} className="btn-secondary" style={{ flex: 1, border: 'none', background: 'rgba(0,0,0,0.05)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal: Meeting Notes */}
        {meetingNotesTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <motion.div className="glass-card" style={{ width: '450px', background: '#fff' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px' }}>Meeting Notes</h3>
              <p style={{ fontSize: '0.85rem', color: '#636366', marginBottom: '15px' }}>Session with {meetingNotesTarget.customer.name}</p>
              
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Record summary of consulting, diagnosis or meeting syllabus..."
                  value={meetingNotesContent}
                  onChange={(e) => setMeetingNotesContent(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={saveMeetingNotes} className="btn-primary" style={{ flex: 1 }}>Save Notes</button>
                <button onClick={() => setMeetingNotesTarget(null)} className="btn-secondary" style={{ flex: 1, border: 'none', background: 'rgba(0,0,0,0.05)' }}>Close</button>
              </div>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
