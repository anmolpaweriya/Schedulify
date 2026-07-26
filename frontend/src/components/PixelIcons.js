import React from 'react';

// Minecraft/Pixel-art styled SVG Icons (designed using pixelated grids)
// Uses crisp SVG rendering (shape-rendering="crispEdges")

const svgStyle = {
  shapeRendering: 'crispEdges',
  display: 'inline-block',
  verticalAlign: 'middle',
};

// 1. Pixel Calendar
export const PixelCalendar = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Base outline */}
    <path d="M2 1h12v14H2V1z" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Spiral bounds/rings at the top */}
    <path d="M4 0h1v2H4V0z M7 0h1v2H7V0z M11 0h1v2H11V0z" fill={color} />
    {/* Header banner line */}
    <path d="M2 4h12v1H2V4z" fill={color} />
    {/* Grid points (days) */}
    <path d="M4 6h2v2H4V6z M10 6h2v2H10V6z M4 10h2v2H4V10z M10 10h2v2H10V10z" fill={color} opacity="0.8" />
  </svg>
);

// 2. Pixel User
export const PixelUser = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Head block */}
    <path d="M5 2h6v5H5V2z" fill={color} />
    {/* Neck */}
    <path d="M7 7h2v1H7V7z" fill={color} />
    {/* Shoulders / Body */}
    <path d="M2 9h12v6H2V9z" fill={color} />
    {/* Inner detail (e.g. collar) */}
    <path d="M7 9h2v2H7V9z" fill="#ffffff" opacity="0.5" />
  </svg>
);

// 3. Pixel Doctor (User with red cross badge)
export const PixelDoctor = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Doctor Cap/Hair */}
    <path d="M4 1h8v2H4V1z" fill={color} />
    {/* Face */}
    <path d="M5 3h6v4H5V3z" fill={color} opacity="0.9" />
    {/* Doctor Collar / Body */}
    <path d="M2 8h12v7H2V8z" fill={color} />
    {/* Red Cross badge */}
    <path d="M6 11h4v1H6v-1z M7 10h2v3H7v-3z" fill="#ef4444" />
  </svg>
);

// 4. Pixel University (Building with dome/pillar structure)
export const PixelUniversity = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Roof Triangle/Pediment */}
    <path d="M8 0L3 4h10L8 0z" fill={color} />
    {/* Roof Base */}
    <path d="M2 4h12v1H2V4z" fill={color} />
    {/* Pillars */}
    <path d="M3 5h2v6H3V5z M7 5h2v6H7V5z M11 5h2v6H11V5z" fill={color} opacity="0.8" />
    {/* Base steps */}
    <path d="M1 11h14v2H1v-2z M0 13h16v2H0v-2z" fill={color} />
  </svg>
);

// 5. Pixel Office (Skyscraper / Tall Building)
export const PixelOffice = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Building outer shell */}
    <path d="M3 1h10v14H3V1z" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Window grid */}
    <path d="M5 3h2v2H5V3z M9 3h2v2H9V3z M5 7h2v2H5V7z M9 7h2v2H9V7z M5 11h2v2H5V11z M9 11h2v2H9V11z" fill={color} opacity="0.75" />
  </svg>
);

// 6. Pixel Bell (Alert Notification)
export const PixelBell = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Top handle ring */}
    <path d="M7 1h2v1H7V1z" fill={color} />
    {/* Bell body */}
    <path d="M5 3h6v1H5V3z M4 4h8v5H4V4z M2 9h12v2H2V9z" fill={color} />
    {/* Clapper/Ringer */}
    <path d="M7 11h2v2H7v-2z" fill={color} opacity="0.9" />
  </svg>
);

// 7. Pixel Settings (Cogwheel/Gear)
export const PixelSettings = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Core ring */}
    <path d="M5 5h6v6H5V5z" fill="none" stroke={color} strokeWidth="2" />
    {/* Outer teeth */}
    <path d="M7 1h2v2H7V1z M7 13h2v2H7v-2z M1 7h2v2H1V7z M13 7h2v2H13V7z" fill={color} />
    {/* Diagonal teeth */}
    <path d="M3 3h2v2H3V3z M11 3h2v2H11V3z M3 11h2v2H3v-2z M11 11h2v2H11v-2z" fill={color} />
    {/* Center hole */}
    <path d="M7 7h2v2H7V7z" fill="#ffffff" />
  </svg>
);

// 8. Pixel Appointment (Checked list page)
export const PixelAppointment = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Document page base */}
    <path d="M2 1h10l2 2v12H2V1z" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Top fold indicator */}
    <path d="M11 1v2h2" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Bullet checklist rows */}
    <path d="M4 5h2v2H4V5z M7 6h5v1H7V6z M4 9h2v2H4V9z M7 10h5v1H7V10z" fill={color} opacity="0.8" />
  </svg>
);

// 9. Pixel Chat (Message bubble)
export const PixelChat = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Main bubble */}
    <path d="M1 2h14v10H6v2H5v-2H1V2z" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Chat typing dots */}
    <path d="M4 6h2v2H4V6z M7 6h2v2H7V6z M10 6h2v2H10V6z" fill={color} opacity="0.7" />
  </svg>
);

// 10. Pixel Analytics (Chart bars)
export const PixelAnalytics = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={svgStyle} {...props}>
    {/* Border axis lines */}
    <path d="M1 1v13h14" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Bar 1 */}
    <path d="M3 9h2v4H3V9z" fill={color} opacity="0.5" />
    {/* Bar 2 */}
    <path d="M7 5h2v8H7V5z" fill={color} opacity="0.75" />
    {/* Bar 3 */}
    <path d="M11 2h2v11h-2V2z" fill={color} />
  </svg>
);

// Map object for convenience
export const pixelIconsMap = {
  calendar: PixelCalendar,
  user: PixelUser,
  doctor: PixelDoctor,
  university: PixelUniversity,
  office: PixelOffice,
  bell: PixelBell,
  settings: PixelSettings,
  appointment: PixelAppointment,
  chat: PixelChat,
  analytics: PixelAnalytics,
};
