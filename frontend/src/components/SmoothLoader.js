import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCalendar, LuClock, LuUserCheck, LuVideo } from 'react-icons/lu';

/**
 * Fullscreen smooth glassmorphic loading screen for Booking Appointments
 */
export const BookingLoadingScreen = ({
  isOpen = false,
  title = 'Confirming Your Appointment...',
  subtitle = 'Locking in your requested time slot & dispatching email notifications...',
  providerName = '',
  date = '',
  timeSlot = '',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="smooth-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="smooth-loader-card"
            initial={{ scale: 0.92, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Glowing Pulsing Spinner Ring */}
            <div className="pulsing-spinner-ring" />

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {subtitle}
            </p>

            {/* Indeterminate Progress Bar */}
            <div className="indeterminate-progress-track">
              <div className="indeterminate-progress-bar" />
            </div>

            {/* Skeleton / Details Preview */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: '16px',
                padding: '16px 18px',
                marginTop: '10px',
                textAlign: 'left',
              }}
            >
              {providerName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <LuUserCheck size={18} color="var(--theme-primary, #ea580c)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {providerName}
                  </span>
                </div>
              ) : (
                <div className="skeleton-shimmer-box" style={{ width: '70%', height: '18px', marginBottom: '10px' }} />
              )}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {date ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <LuCalendar size={14} />
                    <span>{date}</span>
                  </div>
                ) : (
                  <div className="skeleton-shimmer-box" style={{ width: '90px', height: '14px' }} />
                )}

                {timeSlot ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <LuClock size={14} />
                    <span>{timeSlot}</span>
                  </div>
                ) : (
                  <div className="skeleton-shimmer-box" style={{ width: '90px', height: '14px' }} />
                )}
              </div>

              {/* Shimmer Placeholder Lines */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="skeleton-shimmer-box" style={{ width: '100%', height: '10px' }} />
                <div className="skeleton-shimmer-box" style={{ width: '80%', height: '10px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Please keep this window open while we finalize your reservation</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Loading screen for Confirming / Accepting an appointment (Google Meet Link generation & email dispatch)
 */
export const ConfirmAppointmentLoadingScreen = ({
  isOpen = false,
  title = 'Accepting Appointment...',
  subtitle = 'Activating Google Meet session & dispatching confirmation emails...',
  customerName = '',
  date = '',
  timeSlot = '',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="smooth-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="smooth-loader-card"
            initial={{ scale: 0.92, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Emerald Glowing Spinner Ring */}
            <div
              className="pulsing-spinner-ring"
              style={{
                borderTopColor: '#10b981',
                borderRightColor: '#06b6d4',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
              }}
            />

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {subtitle}
            </p>

            {/* Indeterminate Progress Bar in emerald/cyan */}
            <div className="indeterminate-progress-track">
              <div
                className="indeterminate-progress-bar"
                style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
              />
            </div>

            {/* Skeleton Card Preview */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: '16px',
                padding: '16px 18px',
                marginTop: '10px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <LuVideo size={18} color="#059669" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Client: {customerName || 'Appointment Guest'}
                </span>
              </div>

              {(date || timeSlot) && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {date} {timeSlot && `• ${timeSlot}`}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                <div className="skeleton-shimmer-box" style={{ width: '100%', height: '12px' }} />
                <div className="skeleton-shimmer-box" style={{ width: '75%', height: '12px' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Connecting to calendar servers & preparing invitation details
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Skeleton Loader Grid for Time Slots
 */
export const SlotSkeletonGrid = ({ count = 8 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '12px', marginTop: '15px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer-box"
          style={{
            height: '46px',
            borderRadius: '12px',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton Loader for Appointment Cards
 */
export const AppointmentListSkeleton = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card"
          style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton-shimmer-box" style={{ width: '100px', height: '24px', borderRadius: '12px' }} />
            <div className="skeleton-shimmer-box" style={{ width: '160px', height: '16px' }} />
          </div>
          <div className="skeleton-shimmer-box" style={{ width: '220px', height: '20px' }} />
          <div className="skeleton-shimmer-box" style={{ width: '60%', height: '14px' }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <div className="skeleton-shimmer-box" style={{ width: '90px', height: '32px', borderRadius: '10px' }} />
            <div className="skeleton-shimmer-box" style={{ width: '90px', height: '32px', borderRadius: '10px' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

