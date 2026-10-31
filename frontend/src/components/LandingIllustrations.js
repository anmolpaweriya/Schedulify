import React from 'react';

/**
 * Illustrations matching the reference design style
 * Uses theme color props to blend seamlessly into the user's theme
 */

// 1. Hero Illustration: Desk calendar on stand with spiral rings, date grid, cute blob character pointing at a slot, and a potted plant
export const HeroIllustration = ({ primaryColor = '#ea580c', secondaryColor = '#ffedd5' }) => {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '520px', height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        {/* Soft shadow for the calendar */}
        <filter id="softCalShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.06" />
        </filter>
        {/* Soft gradient for character */}
        <linearGradient id="heroCharGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={secondaryColor || '#ffedd5'} />
        </linearGradient>
      </defs>

      {/* Desk surface line */}
      <line x1="20" y1="330" x2="520" y2="330" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />

      {/* Background Soft Plants / Foliage behind calendar */}
      <g opacity="0.6">
        <path d="M42 270 C30 220 50 170 58 140 C65 170 80 220 70 270 Z" fill="#e2e8f0" />
        <path d="M56 260 C65 210 90 175 105 155 C102 185 92 230 75 265 Z" fill="#cbd5e1" />
        <path d="M35 280 C20 250 15 220 22 195 C35 220 45 250 48 280 Z" fill="#f1f5f9" />
        <line x1="58" y1="140" x2="55" y2="280" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Desk Calendar Body */}
      <g filter="url(#softCalShadow)">
        {/* Back stand leg */}
        <path d="M410 130 L450 330" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Main calendar sheet frame */}
        <rect
          x="120"
          y="70"
          width="320"
          height="240"
          rx="18"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Calendar top spiral binding rings */}
        {[148, 184, 220, 256, 292, 328, 364, 400].map((rx, idx) => (
          <g key={idx}>
            <ellipse cx={rx} cy="70" rx="4.5" ry="11" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <line x1={rx} y1="62" x2={rx} y2="78" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}

        {/* Header month placeholder bar */}
        <rect x="150" y="98" width="90" height="8" rx="4" fill="#f1f5f9" />

        {/* Calendar Dates Grid (5 cols x 4 rows) */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4, 5, 6].map((col) => {
            const cx = 152 + col * 40;
            const cy = 126 + row * 40;
            const isHighlighted = row === 2 && col === 4; // Target date pointed by character

            return (
              <g key={`${row}-${col}`}>
                {isHighlighted ? (
                  <rect
                    x={cx - 3}
                    y={cy - 3}
                    width="18"
                    height="18"
                    rx="5"
                    fill={primaryColor}
                  />
                ) : (
                  <rect
                    x={cx}
                    y={cy}
                    width="12"
                    height="12"
                    rx="3"
                    fill="#f1f5f9"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })
        )}
      </g>

      {/* Potted Plant on the right */}
      <g transform="translate(425, 240)">
        {/* Pot */}
        <path d="M12 90 L8 50 L44 50 L40 90 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="5" y="44" width="42" height="7" rx="3.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
        {/* Plant Leaves */}
        <path d="M26 44 C26 20 10 10 0 5 C5 22 14 36 24 44 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <path d="M26 44 C30 18 48 8 60 5 C54 22 42 36 28 44 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
        <path d="M26 44 C26 15 28 0 26 -8 C22 5 22 25 26 44 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <path d="M26 44 C15 32 8 26 2 24 C8 34 16 40 26 44 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M26 44 C37 32 44 26 50 24 C44 34 36 40 26 44 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      </g>

      {/* Cute Blob Character pointing at calendar slot */}
      <g>
        {/* Main Body */}
        <path
          d="M60 330 C45 330 40 280 40 230 C40 180 80 160 120 165 C150 170 170 205 170 250 C170 300 160 330 125 330 Z"
          fill="url(#heroCharGrad)"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Cheerful Eye */}
        <circle cx="132" cy="205" r="5" fill={primaryColor} />

        {/* Cute Smiling mouth / cheek */}
        <path
          d="M120 220 Q128 226 136 220"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Extending Arm pointing gracefully at the highlighted date slot (x=312, y=206) */}
        <path
          d="M124 235 C160 235 220 235 304 212"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Finger dot pointer touching the slot */}
        <circle cx="305" cy="212" r="3.5" fill={primaryColor} />
      </g>
    </svg>
  );
};

// 2. Step 1 Illustration: Calendar with marked availability and character
export const StepOneIllustration = ({ primaryColor = '#ea580c', secondaryColor = '#ffedd5' }) => {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block' }}
    >
      {/* Calendar card */}
      <rect x="25" y="30" width="160" height="135" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Spiral binding */}
      {[45, 65, 85, 105, 125, 145, 165].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="30" rx="3" ry="7" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={x} y1="25" x2={x} y2="35" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}

      {/* Header bar */}
      <rect x="40" y="48" width="50" height="5" rx="2.5" fill="#f1f5f9" />

      {/* Grid of days */}
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const cx = 42 + c * 26;
          const cy = 66 + r * 22;
          const isSlot = r === 2 && c === 2;

          return isSlot ? (
            <rect key={`${r}-${c}`} x={cx - 1} y={cy - 1} width="12" height="12" rx="3" fill={primaryColor} />
          ) : (
            <rect key={`${r}-${c}`} x={cx} y={cy} width="8" height="8" rx="2" fill="#f1f5f9" />
          );
        })
      )}

      {/* Friendly character beside calendar */}
      <path
        d="M175 165 C160 165 155 125 175 105 C195 85 220 95 220 130 C220 155 210 165 190 165 Z"
        fill={secondaryColor}
        stroke="#94a3b8"
        strokeWidth="1.8"
      />
      {/* Eye and smile */}
      <circle cx="188" cy="118" r="2.5" fill="#64748b" />
      <path d="M182 128 Q187 133 192 128" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Hand pointing to slot */}
      <path d="M172 132 C150 132 125 126 102 115" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="100" cy="114" r="2" fill={primaryColor} />
    </svg>
  );
};

// 3. Step 2 Illustration: Share node bubble, phone, and customers
export const StepTwoIllustration = ({ primaryColor = '#ea580c', secondaryColor = '#ffedd5' }) => {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '260px', height: 'auto', display: 'block' }}
    >
      {/* Phone device mockup */}
      <rect x="90" y="55" width="60" height="105" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="98" y="70" width="44" height="68" rx="4" fill="#f8fafc" />

      {/* Floating Share bubble badge */}
      <g transform="translate(100, 20)">
        <circle cx="20" cy="20" r="18" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
        {/* Share icon nodes */}
        <circle cx="25" cy="14" r="2.5" fill={primaryColor} />
        <circle cx="14" cy="20" r="2.5" fill={primaryColor} />
        <circle cx="25" cy="26" r="2.5" fill={primaryColor} />
        <line x1="16" y1="19" x2="23" y2="15" stroke={primaryColor} strokeWidth="1.5" />
        <line x1="16" y1="21" x2="23" y2="25" stroke={primaryColor} strokeWidth="1.5" />
        {/* Speech tail */}
        <path d="M16 38 L16 46 L22 39 Z" fill="#ffffff" stroke={primaryColor} strokeWidth="1.5" strokeLinejoin="round" />
      </g>

      {/* Customer 1 (left) */}
      <path
        d="M40 160 C30 160 25 125 45 105 C65 85 85 105 85 135 C85 155 70 160 55 160 Z"
        fill={secondaryColor}
        stroke="#94a3b8"
        strokeWidth="1.8"
      />
      <circle cx="58" cy="116" r="2.5" fill="#64748b" />
      <path d="M52 126 Q58 132 64 126" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Customer 2 (right front) */}
      <path
        d="M175 165 C160 165 155 130 175 110 C195 90 220 105 220 140 C220 160 205 165 190 165 Z"
        fill="#ffffff"
        stroke="#94a3b8"
        strokeWidth="1.8"
      />
      <circle cx="190" cy="120" r="2.5" fill="#64748b" />
      <path d="M184 130 Q190 136 196 130" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Customer 3 (right back) */}
      <path
        d="M215 155 C205 155 200 125 218 108 C235 92 255 102 255 132 C255 150 240 155 228 155 Z"
        fill={secondaryColor}
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <circle cx="230" cy="116" r="2" fill="#94a3b8" />
    </svg>
  );
};

// 4. Step 3 Illustration: Mobile confirmation with CANCEL and RESCHEDULE buttons
export const StepThreeIllustration = ({ primaryColor = '#ea580c', secondaryColor = '#ffedd5' }) => {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block' }}
    >
      {/* Smartphone mockup */}
      <rect x="50" y="20" width="110" height="165" rx="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
      {/* Speaker notch */}
      <line x1="90" y1="28" x2="120" y2="28" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

      {/* Screen area */}
      <rect x="58" y="38" width="94" height="135" rx="8" fill="#f8fafc" />

      {/* Booking Card inside screen */}
      <rect x="64" y="46" width="82" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="70" y="52" width="40" height="4" rx="2" fill="#94a3b8" />
      <rect x="70" y="60" width="55" height="4" rx="2" fill="#cbd5e1" />
      <rect x="70" y="68" width="25" height="4" rx="2" fill={primaryColor} />

      {/* Cancel button mockup */}
      <rect x="68" y="94" width="74" height="20" rx="5" fill="#fff1f2" stroke="#f43f5e" strokeWidth="1.2" />
      <text x="105" y="108" fill="#f43f5e" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        CANCEL
      </text>

      {/* Reschedule button mockup */}
      <rect x="68" y="122" width="74" height="20" rx="5" fill="#f0fdf4" stroke={primaryColor} strokeWidth="1.2" />
      <text x="105" y="136" fill={primaryColor} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        RESCHEDULE
      </text>

      {/* Peeking cute character at the bottom left */}
      <g transform="translate(10, 100)">
        <path
          d="M10 85 C5 85 2 65 14 52 C26 40 46 45 48 68 C48 80 40 85 28 85 Z"
          fill={secondaryColor}
          stroke="#94a3b8"
          strokeWidth="1.8"
        />
        <circle cx="25" cy="58" r="2.5" fill="#64748b" />
        <path d="M20 66 Q26 71 32 66" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
};

