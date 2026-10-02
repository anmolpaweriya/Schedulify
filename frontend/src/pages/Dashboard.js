import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, updateTheme } = useTheme();
  const navigate = useNavigate();

  const getRoleContext = () => {
    if (user?.role === 'Admin') return { label: 'SaaS Administrator Hub', desc: 'Manage system configurations and user lists.', type: 'admin' };

    // Customer roles
    if (user?.role === 'Customer') {
      if (user.dob || user.age || user.gender) {
        return { label: 'Patient Portal Dashboard', desc: 'Schedule health appointments, view prescriptions, and sync consultation logs.', type: 'patient' };
      }
      if (user.program || user.registrationNo) {
        return { label: 'Student Academic Dashboard', desc: 'Sync advising sessions, consult faculty, and manage syllabus syncs.', type: 'student' };
      }
      return { label: 'Client Consultancy Console', desc: 'Check advisory schedules and coordinate meeting alignments.', type: 'client' };
    }

    // Provider roles
    if (user?.role === 'Provider') {
      return { label: 'Advisory Management Console', desc: 'Schedule bookings, coordinate slots, and review client alignments.', type: 'officer' };
    }

    return { label: 'Dashboard Hub', desc: 'Manage your active schedules.', type: 'default' };
  };

  const contextInfo = getRoleContext();

  // Navigation state
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, calendar, availability, admin-users, settings

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Theme & Branding states
  const [siteLogoInput, setSiteLogoInput] = useState('');
  const [siteNameInput, setSiteNameInput] = useState('Schedulify');
  const [primaryColorInput, setPrimaryColorInput] = useState('#ea580c');
  const [secondaryColorInput, setSecondaryColorInput] = useState('#ffedd5');
  const [themeModeInput, setThemeModeInput] = useState('light');

  // UI state
  const [loading, setLoading] = useState(true);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null); // appointment object
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStart, setRescheduleStart] = useState('');
  const [rescheduleEnd, setRescheduleEnd] = useState('');
  const [meetingNotesTarget, setMeetingNotesTarget] = useState(null);
  const [meetingNotesContent, setMeetingNotesContent] = useState('');
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [acceptMeetLink, setAcceptMeetLink] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState('');



  // Availability state
  const [timezone, setTimezone] = useState('UTC');
  const [slotDuration, setSlotDuration] = useState(30);
  const [weeklyHours, setWeeklyHours] = useState([]);
  const [blockedDatesStr, setBlockedDatesStr] = useState('');

  // Profile Form States
  const [profName, setProfName] = useState('');
  const [profTitle, setProfTitle] = useState('');
  const [profSpec, setProfSpec] = useState('');
  const [profBio, setProfBio] = useState('');
  const [profAddress, setProfAddress] = useState('');
  const [profDob, setProfDob] = useState('');
  const [profAge, setProfAge] = useState('');
  const [profGender, setProfGender] = useState('');
  const [profProgram, setProfProgram] = useState('');
  const [profSection, setProfSection] = useState('');
  const [profRegistrationNo, setProfRegistrationNo] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  // Admin Editing User States
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState('Customer');
  const [editUserStatus, setEditUserStatus] = useState('Approved');
  const [editUserAddress, setEditUserAddress] = useState('');
  const [editUserDob, setEditUserDob] = useState('');
  const [editUserAge, setEditUserAge] = useState('');
  const [editUserGender, setEditUserGender] = useState('');
  const [editUserProgram, setEditUserProgram] = useState('');
  const [editUserSection, setEditUserSection] = useState('');
  const [editUserRegistrationNo, setEditUserRegistrationNo] = useState('');

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
    } catch (err) {
      console.error('Error fetching dashboard resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();

      // Populate profile states
      setProfName(user.name || '');
      setProfTitle(user.title || '');
      setProfSpec(user.specialization || '');
      setProfBio(user.bio || '');
      setProfAddress(user.address || '');
      setProfDob(user.dob || '');
      setProfAge(user.age || '');
      setProfGender(user.gender || '');
      setProfProgram(user.program || '');
      setProfSection(user.section || '');
      setProfRegistrationNo(user.registrationNo || '');
    } else {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    if (theme) {
      setSiteLogoInput(theme.siteLogo || '');
      setSiteNameInput(theme.siteName || 'Schedulify');
      setPrimaryColorInput(theme.primaryColor || '#ea580c');
      setSecondaryColorInput(theme.secondaryColor || '#ffedd5');
      setThemeModeInput(theme.themeMode || 'light');
    }
  }, [theme]);

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
      const fd = new FormData();
      fd.append('name', profName);
      fd.append('title', profTitle);
      fd.append('specialization', profSpec);
      fd.append('bio', profBio);
      fd.append('address', profAddress);
      fd.append('dob', profDob);
      fd.append('age', profAge);
      fd.append('gender', profGender);
      fd.append('program', profProgram);
      fd.append('section', profSection);
      fd.append('registrationNo', profRegistrationNo);
      if (avatarFile) {
        fd.append('avatar', avatarFile);
      }

      await updateProfile(fd);
      toast.success('Profile details updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  // Admin user edit setups
  const handleEditUser = (u) => {
    setEditingUser(u);
    setEditUserName(u.name || '');
    setEditUserRole(u.role || 'Customer');
    setEditUserStatus(u.status || 'Approved');
    setEditUserAddress(u.address || '');
    setEditUserDob(u.dob || '');
    setEditUserAge(u.age || '');
    setEditUserGender(u.gender || '');
    setEditUserProgram(u.program || '');
    setEditUserSection(u.section || '');
    setEditUserRegistrationNo(u.registrationNo || '');
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/admin/users/${editingUser._id}`, {
        name: editUserName,
        role: editUserRole,
        status: editUserStatus,
        address: editUserAddress,
        dob: editUserDob,
        age: editUserAge ? parseInt(editUserAge) : null,
        gender: editUserGender,
        program: editUserProgram,
        section: editUserSection,
        registrationNo: editUserRegistrationNo,
      });
      if (res.data.success) {
        toast.success('User updated successfully');
        setEditingUser(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await axios.delete(`/api/admin/users/${id}`);
      if (res.data.success) {
        toast.success('User deleted successfully');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
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

  // Save Theme & Branding settings (Admin)
  const handleSaveTheme = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/admin/settings', {
        siteLogo: siteLogoInput,
        siteName: siteNameInput,
        primaryColor: primaryColorInput,
        secondaryColor: secondaryColorInput,
        themeMode: themeModeInput,
      });
      if (res.data.success) {
        toast.success('Theme & Logo settings saved successfully!');
        updateTheme({
          siteLogo: siteLogoInput,
          siteName: siteNameInput,
          primaryColor: primaryColorInput,
          secondaryColor: secondaryColorInput,
          themeMode: themeModeInput,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update theme settings');
    }
  };

  // Open Accept Modal (Provider/Staff)
  const openAcceptModal = (appt) => {
    setAcceptTarget(appt);
    const randomCode = Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setAcceptMeetLink(`https://meet.google.com/sch-${randomCode}`);
  };

  // Submit Accept
  const submitAccept = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/appointments/${acceptTarget._id}/accept`, {
        meetingLink: acceptMeetLink,
      });
      if (res.data.success) {
        toast.success('Appointment accepted with Google Meet link!');
        setAcceptTarget(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept appointment');
    }
  };

  // Open Reject Modal (Provider/Staff)
  const openRejectModal = (appt) => {
    setRejectTarget(appt);
    setRejectReasonText('');
  };

  // Submit Reject
  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejectReasonText) return toast.error('Please specify a rejection reason');
    try {
      const res = await axios.put(`/api/appointments/${rejectTarget._id}/reject`, {
        rejectionReason: rejectReasonText,
      });
      if (res.data.success) {
        toast.success('Appointment rejected');
        setRejectTarget(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject appointment');
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

  // Helper to check if appointment time has arrived
  const isMeetingTime = (dateStr, startTimeStr) => {
    if (!dateStr || !startTimeStr) return false;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (dateStr > todayStr) {
      return false; // Future date -> not time yet
    }
    if (dateStr < todayStr) {
      return true; // Past date -> meeting date has arrived/passed
    }

    // Today: check if current time HH:MM is >= start time HH:MM
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    return currentTimeStr >= startTimeStr;
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
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>

      {/* Dynamic Background Blurs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Top Navbar Header */}
      <nav className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 30px',
        margin: '20px',
        borderRadius: '20px',
        position: 'sticky',
        top: '20px',
        zIndex: 100
      }}>
        {/* Left Side: Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {theme.siteLogo ? (
            <img src={theme.siteLogo} alt="Logo" style={{ height: '32px', borderRadius: '6px', objectFit: 'contain' }} />
          ) : (
            <PixelCalendar size={28} color={theme.primaryColor || '#ea580c'} />
          )}
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit' }}>{theme.siteName || 'Schedulify'}</span>
        </div>

        {/* Center: Navigation buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn-secondary ${activeTab === 'overview' ? 'active-tab' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(255,255,255,0.8)' : 'transparent',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <PixelAnalytics size={16} color="#ea580c" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`btn-secondary ${activeTab === 'appointments' ? 'active-tab' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'appointments' ? 'rgba(255,255,255,0.8)' : 'transparent',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <PixelAppointment size={16} color="#ea580c" /> Appointments
          </button>

          {user?.role === 'Customer' && (
            <Link
              to="/book"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                color: '#1c1c1e',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <PixelCalendar size={16} color="#ea580c" /> Book Appointment
            </Link>
          )}

          {user?.role === 'Provider' && (
            <button
              onClick={() => setActiveTab('availability')}
              className={`btn-secondary ${activeTab === 'availability' ? 'active-tab' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'availability' ? 'rgba(255,255,255,0.8)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <PixelCalendar size={16} color="#ea580c" /> Availability
            </button>
          )}

          {['Admin', 'University Coordinator'].includes(user?.role) && (
            <>
              <button
                onClick={() => setActiveTab('admin-users')}
                className={`btn-secondary ${activeTab === 'admin-users' ? 'active-tab' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'admin-users' ? 'rgba(255,255,255,0.8)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <PixelUser size={16} color="#ea580c" /> Users
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`btn-secondary ${activeTab === 'settings' ? 'active-tab' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'settings' ? 'rgba(255,255,255,0.8)' : 'transparent',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <PixelSettings size={16} color="#ea580c" /> Profile
          </button>

          {user?.role === 'Admin' && (
            <button
              onClick={() => setActiveTab('theme')}
              className={`btn-secondary ${activeTab === 'theme' ? 'active-tab' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'theme' ? 'rgba(255,255,255,0.8)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <PixelSettings size={16} color="#ea580c" /> Theme & Logo
            </button>
          )}

          {/* Profile Button */}
        </div>

        {/* Right Side: Profile Info & Log Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {user?.avatar ? (
                <img src={user.avatar.startsWith('/') ? `${axios.defaults.baseURL}${user.avatar}` : user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#636366' }}>{user?.role?.toLowerCase() =="customer"?"User":"Faculty"}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem' }}>
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
              {contextInfo.label}
            </h1>
            <p style={{ color: '#636366' }}>
              Welcome back, {user?.name}. {contextInfo.desc}
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
                    <span style={{ color: '#0369a1', fontWeight: 600 }}>
                      {contextInfo.type === 'patient' && 'Total Consultations'}
                      {contextInfo.type === 'doctor' && 'Total Patients Seen'}
                      {contextInfo.type === 'student' && 'Total Advising Syncs'}
                      {contextInfo.type === 'faculty' && 'Active Mapped Students'}
                      {contextInfo.type === 'client' && 'Consultations Booked'}
                      {contextInfo.type === 'officer' && 'Managed Alignments'}
                      {contextInfo.type === 'admin' && 'System-wide Bookings'}
                      {contextInfo.type === 'default' && 'Total Bookings'}
                    </span>
                    <PixelAppointment size={20} color="#0369a1" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.total || 0}</h2>
                </div>

                <div className="glass-card" style={{ background: '#fef9c3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#a16207', fontWeight: 600 }}>
                      {contextInfo.type === 'patient' && 'Awaiting Doctor Approval'}
                      {contextInfo.type === 'doctor' && 'Pending Clinic Appointments'}
                      {contextInfo.type === 'student' && 'Awaiting Coordinator Sync'}
                      {contextInfo.type === 'faculty' && 'Pending Advising Slots'}
                      {contextInfo.type === 'client' && 'Pending Alignments'}
                      {contextInfo.type === 'officer' && 'Pending Registrations'}
                      {contextInfo.type === 'admin' && 'Pending Provider Actions'}
                      {contextInfo.type === 'default' && 'Pending Actions'}
                    </span>
                    <PixelBell size={20} color="#a16207" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.pending || 0}</h2>
                </div>

                <div className="glass-card" style={{ background: '#dcfce7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>
                      {contextInfo.type === 'patient' && 'Confirmed Bookings'}
                      {contextInfo.type === 'doctor' && 'Approved Appointments'}
                      {contextInfo.type === 'student' && 'Confirmed Syncs'}
                      {contextInfo.type === 'faculty' && 'Faculty Consultations'}
                      {contextInfo.type === 'client' && 'Approved Sessions'}
                      {contextInfo.type === 'officer' && 'Confirmed Sessions'}
                      {contextInfo.type === 'admin' && 'Approved System-wide'}
                      {contextInfo.type === 'default' && 'Approved Sessions'}
                    </span>
                    <PixelCalendar size={20} color="#15803d" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.approved || 0}</h2>
                </div>

                <div className="glass-card" style={{ background: '#f3e8ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b21a8', fontWeight: 600 }}>
                      {contextInfo.type === 'patient' && 'Prescriptions Issued'}
                      {contextInfo.type === 'doctor' && 'Completed Visits'}
                      {contextInfo.type === 'student' && 'Meetings Attended'}
                      {contextInfo.type === 'faculty' && 'Cohorts Completed'}
                      {contextInfo.type === 'client' && 'Completed Advisory'}
                      {contextInfo.type === 'officer' && 'Completed Alignments'}
                      {contextInfo.type === 'admin' && 'Completed Bookings'}
                      {contextInfo.type === 'default' && 'Completed'}
                    </span>
                    <PixelUser size={20} color="#6b21a8" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '15px' }}>{analytics?.summary?.completed || 0}</h2>
                </div>
              </div>

              {/* Chart Graphics */}
              <div style={{ marginBottom: '40px' }}>
                <div className="glass-card" style={{ minHeight: '350px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Appointment Booking Velocity</h3>
                  <div style={{ height: '260px' }}>
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
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
                          <div style={{ fontSize: '0.8rem', color: '#636366' }}>{p.specialization}</div>
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
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '8px' }}>
                            {['Admin', 'University Coordinator', 'Receptionist'].includes(user?.role) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div><strong style={{ color: '#636366' }}>Booked By:</strong> {appt.customer?.name || 'Customer'} ({appt.customer?.email || 'N/A'})</div>
                                <div><strong style={{ color: '#ea580c' }}>Faculty:</strong> {appt.provider ? `${appt.provider.title || ''} ${appt.provider.name} (${appt.provider.specialization || 'Specialist'})` : 'N/A'}</div>
                              </div>
                            ) : user?.role === 'Customer' ? (
                              <div><strong style={{ color: '#ea580c' }}>Faculty:</strong> {appt.provider ? `${appt.provider.title || ''} ${appt.provider.name} (${appt.provider.specialization || 'Specialist'})` : 'N/A'}</div>
                            ) : (
                              <div><strong style={{ color: '#636366' }}>Customer:</strong> {appt.customer?.name || 'Customer'} ({appt.customer?.email || 'N/A'})</div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#636366', marginTop: '4px' }}>Reason: {appt.reason}</div>

                          {/* Google Meet Link Banner (If Approved - Shown only when appointment time has come) */}
                          {appt.status === 'Approved' && appt.meetingLink && (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              {isMeetingTime(appt.date, appt.timeSlot?.start) ? (
                                <>
                                  <a
                                    href={appt.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                      padding: '8px 16px',
                                      fontSize: '0.85rem',
                                      textDecoration: 'none',
                                      color: '#fff',
                                      borderRadius: '12px',
                                      fontWeight: 700,
                                    }}
                                  >
                                    Join Google Meet
                                  </a>
                                  <span style={{ fontSize: '0.75rem', color: '#636366' }}>{appt.meetingLink}</span>
                                </>
                              ) : (
                                <div style={{ fontSize: '0.8rem', color: '#0284c7', background: 'rgba(2, 132, 199, 0.1)', padding: '6px 14px', borderRadius: '10px', fontWeight: 600 }}>
                                  Meeting link will activate when appointment time arrives ({appt.date} at {appt.timeSlot?.start})
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rejection Reason Badge (If Rejected) */}
                          {appt.status === 'Rejected' && (
                            <div style={{ fontSize: '0.82rem', background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', borderRadius: '8px', marginTop: '8px', fontWeight: 600 }}>
                              Rejection Reason: {appt.rejectionReason || 'Provider unavailable for this time slot'}
                            </div>
                          )}

                          {appt.meetingNotes && (
                            <div style={{ fontSize: '0.8rem', background: 'rgba(56,189,248,0.1)', padding: '6px 12px', borderRadius: '8px', marginTop: '10px', fontStyle: 'italic' }}>
                              Notes: {appt.meetingNotes}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {/* Provider/Staff Accept or Reject */}
                          {appt.status === 'Pending' && ['Provider', 'Admin', 'University Coordinator', 'Receptionist'].includes(user?.role) && (
                            <>
                              <button onClick={() => openAcceptModal(appt)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#34d399' }}>Accept</button>
                              <button onClick={() => openRejectModal(appt)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#fca5a5', color: '#7f1d1d', border: 'none' }}>Reject</button>
                            </>
                          )}

                          {/* Complete Action (Provider/Staff on Approved) */}
                          {appt.status === 'Approved' && ['Provider', 'Admin', 'University Coordinator', 'Receptionist'].includes(user?.role) && (
                            <button onClick={() => handleAppointmentAction(appt._id, 'complete')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#a78bfa' }}>Mark Completed</button>
                          )}

                          {/* Notes Action */}
                          {['Provider', 'Admin'].includes(user?.role) && (
                            <button onClick={() => openMeetingNotes(appt)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Notes</button>
                          )}

                          {/* Reschedule Action: ONLY FOR NORMAL USER (CUSTOMER) ON REJECTED OR PENDING APPOINTMENTS */}
                          {user?.role === 'Customer' && ['Rejected', 'Pending'].includes(appt.status) && (
                            <button onClick={() => openReschedule(appt)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#ea580c' }}>Reschedule Slot</button>
                          )}

                          {/* Cancel Action */}
                          {['Pending', 'Approved'].includes(appt.status) && (
                            <button onClick={() => handleAppointmentAction(appt._id, 'cancel')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none' }}>Cancel</button>
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

          {activeTab === 'admin-users' && ['Admin', 'University Coordinator'].includes(user?.role) && (
            <motion.div key="admin-users" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Manage Users</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {systemUsers.map((u) => (
                    <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '15px 25px', borderRadius: '15px' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#636366' }}>
                          {u.email} • Role: <strong>{u.role}</strong> {u.role === 'Provider' && `• Status: ${u.status}`}
                        </div>
                        {u.address && <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '3px' }}>Address: {u.address}</div>}
                        {(u.dob || u.registrationNo) && (
                          <div style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '3px' }}>
                            {u.dob && `DOB: ${u.dob} • `}
                            {u.registrationNo && `Reg No: ${u.registrationNo}`}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEditUser(u)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Edit</button>
                        <button onClick={() => handleDeleteUser(u._id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Update Profile Details</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={profName} onChange={(e) => setProfName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Profile Image (Avatar)</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input type="text" className="form-control" placeholder="e.g. 123 Metro Lane, New Delhi" value={profAddress} onChange={(e) => setProfAddress(e.target.value)} />
                  </div>

                  {/* Context-based hospital fields (Healthcare department or Patient/Doctor role) */}
                  <h4 style={{ margin: '25px 0 15px 0', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', fontSize: '1.1rem', fontWeight: 700 }}>
                    Demographics (Healthcare / General)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" value={profDob} onChange={(e) => setProfDob(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input type="number" className="form-control" placeholder="Years" value={profAge} onChange={(e) => setProfAge(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-control" value={profGender} onChange={(e) => setProfGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Context-based University fields */}
                  <h4 style={{ margin: '25px 0 15px 0', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', fontSize: '1.1rem', fontWeight: 700 }}>
                    University / College Specifications
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Academic Program</label>
                      <input type="text" className="form-control" placeholder="e.g. B.Tech Computer Science" value={profProgram} onChange={(e) => setProfProgram(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Section / Batch</label>
                      <input type="text" className="form-control" placeholder="e.g. Section A" value={profSection} onChange={(e) => setProfSection(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Registration / Roll No</label>
                      <input type="text" className="form-control" placeholder="e.g. 2026-REG-0982" value={profRegistrationNo} onChange={(e) => setProfRegistrationNo(e.target.value)} />
                    </div>
                  </div>

                  {user?.role === 'Provider' && (
                    <>
                      <h4 style={{ margin: '25px 0 15px 0', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', fontSize: '1.1rem', fontWeight: 700 }}>
                        Provider Profile Details
                      </h4>
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
                    </>
                  )}

                  <button type="submit" className="btn-primary" style={{ marginTop: '20px', width: '100%', padding: '14px' }}>
                    Save Profile Details
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'theme' && user?.role === 'Admin' && (
            <motion.div key="theme" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
              <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: '35px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '25px' }}>Site Logo & Color Palette Theme</h3>

                <form onSubmit={handleSaveTheme}>
                  {/* Site Title */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Platform / Site Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Schedulify"
                      value={siteNameInput}
                      onChange={(e) => setSiteNameInput(e.target.value)}
                      required
                    />
                  </div>

                  {/* Site Logo */}
                  <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label className="form-label">Site Logo Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://example.com/my-custom-logo.png"
                      value={siteLogoInput}
                      onChange={(e) => setSiteLogoInput(e.target.value)}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#636366', marginTop: '4px', display: 'block' }}>
                      Enter a direct image URL for your brand logo. Leave empty to use default icon logo.
                    </span>
                  </div>

                  {/* Preset Color Swatches */}
                  <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label className="form-label">Primary Color Theme</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {[
                        { name: 'Saffron Orange', primary: '#ea580c', secondary: '#ffedd5' },
                        { name: 'Ocean Blue', primary: '#0284c7', secondary: '#e0f2fe' },
                        { name: 'Emerald Green', primary: '#059669', secondary: '#d1fae5' },
                        { name: 'Royal Violet', primary: '#7c3aed', secondary: '#f3e8ff' },
                        { name: 'Crimson Rose', primary: '#e11d48', secondary: '#ffe4e6' },
                      ].map((preset) => {
                        const isSelected = primaryColorInput === preset.primary;
                        return (
                          <button
                            key={preset.primary}
                            type="button"
                            onClick={() => {
                              setPrimaryColorInput(preset.primary);
                              setSecondaryColorInput(preset.secondary);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 16px',
                              borderRadius: '12px',
                              border: isSelected ? `2px solid ${preset.primary}` : '1px solid var(--glass-border)',
                              background: isSelected ? preset.secondary : 'rgba(255,255,255,0.7)',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s',
                            }}
                          >
                            <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: preset.primary, display: 'inline-block' }}></span>
                            {preset.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                    <div className="form-group">
                      <label className="form-label">Custom Primary Color Code (Hex)</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={primaryColorInput}
                          onChange={(e) => setPrimaryColorInput(e.target.value)}
                          style={{ width: '45px', height: '42px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={primaryColorInput}
                          onChange={(e) => setPrimaryColorInput(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Background Theme Format</label>
                      <select
                        className="form-control"
                        value={themeModeInput}
                        onChange={(e) => setThemeModeInput(e.target.value)}
                      >
                        <option value="light">Glassmorphism Light (Default)</option>
                        <option value="dark">Dark Theme</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                    Save Theme & Branding
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Accept Appointment (Google Meet Link) */}
        {acceptTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <motion.div className="glass-card" style={{ width: '450px', background: '#fff' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px' }}>Accept Appointment</h3>
              <p style={{ fontSize: '0.85rem', color: '#636366', marginBottom: '15px' }}>
                Provide or confirm the Google Meeting link for {acceptTarget.customer?.name}
              </p>
              <form onSubmit={submitAccept}>
                <div className="form-group">
                  <label className="form-label">Google Meet Link</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={acceptMeetLink}
                    onChange={(e) => setAcceptMeetLink(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, background: '#34d399' }}>Confirm & Accept</button>
                  <button type="button" onClick={() => setAcceptTarget(null)} className="btn-secondary" style={{ flex: 1, border: 'none', background: 'rgba(0,0,0,0.05)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal: Reject Appointment (With Reason) */}
        {rejectTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <motion.div className="glass-card" style={{ width: '450px', background: '#fff' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px' }}>Reject Appointment</h3>
              <p style={{ fontSize: '0.85rem', color: '#636366', marginBottom: '15px' }}>
                State reason for declining session request with {rejectTarget.customer?.name}
              </p>
              <form onSubmit={submitReject}>
                <div className="form-group">
                  <label className="form-label">Rejection Reason</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="e.g. Schedule conflict, out of office, please pick another available slot..."
                    value={rejectReasonText}
                    onChange={(e) => setRejectReasonText(e.target.value)}
                    required
                    style={{ resize: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, background: '#ef4444' }}>Confirm & Reject</button>
                  <button type="button" onClick={() => setRejectTarget(null)} className="btn-secondary" style={{ flex: 1, border: 'none', background: 'rgba(0,0,0,0.05)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

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

        {/* Modal: Edit User Details */}
        {editingUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <motion.div className="glass-card" style={{ width: '500px', background: '#fff', maxHeight: '90vh', overflowY: 'auto' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Edit User Details</h3>
              <form onSubmit={handleEditUserSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={editUserName} onChange={(e) => setEditUserName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-control" value={editUserRole} onChange={(e) => setEditUserRole(e.target.value)}>
                    <option value="Customer">Customer</option>
                    <option value="Provider">Provider</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="University Coordinator">University Coordinator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={editUserStatus} onChange={(e) => setEditUserStatus(e.target.value)}>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px', fontSize: '1rem', fontWeight: 700 }}>Demographics & Address</h4>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={editUserAddress} onChange={(e) => setEditUserAddress(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" value={editUserDob} onChange={(e) => setEditUserDob(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-control" value={editUserAge} onChange={(e) => setEditUserAge(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-control" value={editUserGender} onChange={(e) => setEditUserGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px', fontSize: '1rem', fontWeight: 700 }}>University Info</h4>
                <div className="form-group">
                  <label className="form-label">Program</label>
                  <input type="text" className="form-control" value={editUserProgram} onChange={(e) => setEditUserProgram(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <input type="text" className="form-control" value={editUserSection} onChange={(e) => setEditUserSection(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration No</label>
                    <input type="text" className="form-control" value={editUserRegistrationNo} onChange={(e) => setEditUserRegistrationNo(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                  <button type="button" onClick={() => setEditingUser(null)} className="btn-secondary" style={{ flex: 1, border: 'none', background: 'rgba(0,0,0,0.05)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
