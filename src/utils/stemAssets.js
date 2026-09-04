/**
 * STEM Assets Library: Math, Chemistry, and Physics apparatus definitions & Lecture Templates
 */

export const STEM_CATEGORIES = {
  CHEMISTRY: 'chemistry',
  PHYSICS: 'physics',
  MATH: 'math',
  TEMPLATES: 'templates'
};

export const STEM_ITEMS = [
  // ================= CHEMISTRY APPARATUS & STRUCTURES =================
  {
    id: 'chem-beaker',
    category: STEM_CATEGORIES.CHEMISTRY,
    name: 'Graduated Beaker (250ml)',
    width: 140,
    height: 180,
    liquidColor: '#06b6d4',
    liquidLevel: 65,
    renderSvg: (color = '#06b6d4', level = 65) => `
      <svg viewBox="0 0 140 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="liqGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.8" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.95" />
          </linearGradient>
          <clipPath id="bClip">
            <path d="M 20 20 L 20 160 Q 20 170 30 170 L 110 170 Q 120 170 120 160 L 120 20 Z" />
          </clipPath>
        </defs>
        <g clip-path="url(#bClip)">
          <rect x="0" y="${170 - (150 * (level / 100))}" width="140" height="180" fill="url(#liqGrad1)" />
          <ellipse cx="70" cy="${170 - (150 * (level / 100))}" rx="50" ry="6" fill="${color}" opacity="0.6" />
        </g>
        <path d="M 12 20 L 20 20 L 20 160 Q 20 172 32 172 L 108 172 Q 120 172 120 160 L 120 20 L 128 20" 
              fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="30" y1="50" x2="55" y2="50" stroke="#cbd5e1" stroke-width="2.5" />
        <text x="60" y="54" fill="#94a3b8" font-size="10" font-family="sans-serif">200ml</text>
        <line x1="30" y1="80" x2="50" y2="80" stroke="#cbd5e1" stroke-width="2" />
        <line x1="30" y1="110" x2="55" y2="110" stroke="#cbd5e1" stroke-width="2.5" />
        <text x="60" y="114" fill="#94a3b8" font-size="10" font-family="sans-serif">100ml</text>
        <line x1="30" y1="140" x2="50" y2="140" stroke="#cbd5e1" stroke-width="2" />
      </svg>
    `
  },
  {
    id: 'chem-erlenmeyer',
    category: STEM_CATEGORIES.CHEMISTRY,
    name: 'Erlenmeyer Flask',
    width: 150,
    height: 190,
    liquidColor: '#a855f7',
    liquidLevel: 50,
    renderSvg: (color = '#a855f7', level = 50) => `
      <svg viewBox="0 0 150 190" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="erlClip">
            <path d="M 62 30 L 62 70 L 22 165 Q 18 175 30 175 L 120 175 Q 132 175 128 165 L 88 70 L 88 30 Z" />
          </clipPath>
        </defs>
        <g clip-path="url(#erlClip)">
          <rect x="0" y="${175 - (115 * (level / 100))}" width="150" height="190" fill="${color}" opacity="0.85" />
        </g>
        <path d="M 58 30 L 92 30 M 62 30 L 62 70 L 22 165 Q 18 175 30 175 L 120 175 Q 132 175 128 165 L 88 70 L 88 30" 
              fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <ellipse cx="75" cy="30" rx="17" ry="4" fill="none" stroke="#e2e8f0" stroke-width="3" />
        <line x1="45" y1="140" x2="65" y2="140" stroke="#cbd5e1" stroke-width="2" />
        <line x1="55" y1="110" x2="75" y2="110" stroke="#cbd5e1" stroke-width="2" />
      </svg>
    `
  },
  {
    id: 'chem-florence',
    category: STEM_CATEGORIES.CHEMISTRY,
    name: 'Florence Boiling Flask',
    width: 140,
    height: 190,
    liquidColor: '#10b981',
    liquidLevel: 45,
    renderSvg: (color = '#10b981', level = 45) => `
      <svg viewBox="0 0 140 190" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="floClip">
            <circle cx="70" cy="125" r="50" />
          </clipPath>
        </defs>
        <g clip-path="url(#floClip)">
          <rect x="10" y="${175 - (100 * (level / 100))}" width="120" height="100" fill="${color}" opacity="0.85" />
        </g>
        <path d="M 60 20 L 60 78 M 80 20 L 80 78" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
        <path d="M 60 78 A 50 50 0 1 0 80 78" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
        <ellipse cx="70" cy="20" rx="12" ry="3" fill="none" stroke="#e2e8f0" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'chem-benzene',
    category: STEM_CATEGORIES.CHEMISTRY,
    name: 'Benzene Ring Structure (C₆H₆)',
    width: 130,
    height: 140,
    renderSvg: () => `
      <svg viewBox="0 0 130 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Hexagon -->
        <polygon points="65,15 110,40 110,95 65,120 20,95 20,40" 
                 fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round" />
        <!-- Inner Aromatic Delocalized Circle -->
        <circle cx="65" cy="67.5" r="28" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,4" />
      </svg>
    `
  },
  {
    id: 'chem-burner',
    category: STEM_CATEGORIES.CHEMISTRY,
    name: 'Bunsen Burner',
    width: 130,
    height: 180,
    renderSvg: () => `
      <svg viewBox="0 0 130 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M 65 15 Q 50 45 65 65 Q 80 45 65 15 Z" fill="#38bdf8" opacity="0.95" />
        <path d="M 65 30 Q 58 48 65 65 Q 72 48 65 30 Z" fill="#fbbf24" opacity="0.9" />
        <rect x="57" y="65" width="16" height="70" fill="#64748b" stroke="#94a3b8" stroke-width="2" rx="2" />
        <rect x="54" y="110" width="22" height="14" fill="#475569" stroke="#94a3b8" stroke-width="1.5" rx="2" />
        <circle cx="65" cy="117" r="3" fill="#0f172a" />
        <path d="M 57 125 L 25 135" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
        <polygon points="30,165 100,165 108,172 22,172" fill="#334155" stroke="#64748b" stroke-width="2" />
      </svg>
    `
  },
  {
    id: 'chem-test-tubes',
    category: STEM_CATEGORIES.CHEMISTRY,
    name: 'Test Tube Rack',
    width: 170,
    height: 150,
    renderSvg: () => `
      <svg viewBox="0 0 170 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="55" width="18" height="55" rx="9" fill="#ef4444" opacity="0.8" />
        <rect x="35" y="25" width="18" height="85" rx="9" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
        <ellipse cx="44" cy="25" rx="9" ry="2.5" stroke="#e2e8f0" stroke-width="2" fill="none"/>
        <rect x="75" y="65" width="18" height="45" rx="9" fill="#3b82f6" opacity="0.8" />
        <rect x="75" y="25" width="18" height="85" rx="9" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
        <ellipse cx="84" cy="25" rx="9" ry="2.5" stroke="#e2e8f0" stroke-width="2" fill="none"/>
        <rect x="115" y="45" width="18" height="65" rx="9" fill="#10b981" opacity="0.8" />
        <rect x="115" y="25" width="18" height="85" rx="9" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
        <ellipse cx="124" cy="25" rx="9" ry="2.5" stroke="#e2e8f0" stroke-width="2" fill="none"/>
        <line x1="15" y1="48" x2="155" y2="48" stroke="#d97706" stroke-width="6" stroke-linecap="round" />
        <line x1="15" y1="110" x2="155" y2="110" stroke="#b45309" stroke-width="6" stroke-linecap="round" />
        <line x1="20" y1="48" x2="20" y2="125" stroke="#b45309" stroke-width="6" stroke-linecap="round" />
        <line x1="150" y1="48" x2="150" y2="125" stroke="#b45309" stroke-width="6" stroke-linecap="round" />
        <line x1="10" y1="125" x2="160" y2="125" stroke="#92400e" stroke-width="8" stroke-linecap="round" />
      </svg>
    `
  },

  // ================= PHYSICS APPARATUS & CIRCUITS =================
  {
    id: 'phys-battery',
    category: STEM_CATEGORIES.PHYSICS,
    name: 'DC Battery Source',
    width: 140,
    height: 70,
    renderSvg: () => `
      <svg viewBox="0 0 140 70" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="35" x2="55" y2="35" stroke="#38bdf8" stroke-width="3" />
        <line x1="55" y1="15" x2="55" y2="55" stroke="#f8fafc" stroke-width="4" stroke-linecap="round" />
        <line x1="68" y1="24" x2="68" y2="46" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
        <line x1="80" y1="15" x2="80" y2="55" stroke="#f8fafc" stroke-width="4" stroke-linecap="round" />
        <line x1="93" y1="24" x2="93" y2="46" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
        <line x1="93" y1="35" x2="130" y2="35" stroke="#38bdf8" stroke-width="3" />
        <text x="45" y="14" fill="#38bdf8" font-size="14" font-weight="bold">+</text>
        <text x="96" y="14" fill="#94a3b8" font-size="16" font-weight="bold">-</text>
      </svg>
    `
  },
  {
    id: 'phys-bulb',
    category: STEM_CATEGORIES.PHYSICS,
    name: 'Incandescent Lamp (Glowing)',
    width: 120,
    height: 90,
    renderSvg: () => `
      <svg viewBox="0 0 120 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="45" r="26" fill="rgba(251, 191, 36, 0.3)" stroke="#fbbf24" stroke-width="3" />
        <line x1="42" y1="27" x2="78" y2="63" stroke="#f59e0b" stroke-width="2.5" />
        <line x1="42" y1="63" x2="78" y2="27" stroke="#f59e0b" stroke-width="2.5" />
        <line x1="10" y1="45" x2="34" y2="45" stroke="#38bdf8" stroke-width="3" />
        <line x1="86" y1="45" x2="110" y2="45" stroke="#38bdf8" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'phys-resistor',
    category: STEM_CATEGORIES.PHYSICS,
    name: 'Standard Resistor (R)',
    width: 150,
    height: 60,
    renderSvg: () => `
      <svg viewBox="0 0 150 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 30 L 40 30 L 47 15 L 61 45 L 75 15 L 89 45 L 103 15 L 110 30 L 140 30" 
              fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="70" y="58" fill="#e2e8f0" font-size="12" font-family="sans-serif" text-anchor="middle">R (Ω)</text>
      </svg>
    `
  },
  {
    id: 'phys-convex-lens',
    category: STEM_CATEGORIES.PHYSICS,
    name: 'Biconvex Optical Lens with Ray Axis',
    width: 160,
    height: 180,
    renderSvg: () => `
      <svg viewBox="0 0 160 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="90" x2="155" y2="90" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
        <path d="M 80 15 Q 110 90 80 165 Q 50 90 80 15 Z" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="3" />
        <circle cx="80" cy="90" r="3" fill="#ffffff" />
        <text x="83" y="105" fill="#94a3b8" font-size="11">O</text>
        <text x="40" y="105" fill="#94a3b8" font-size="11">F₁</text>
        <text x="120" y="105" fill="#94a3b8" font-size="11">F₂</text>
      </svg>
    `
  },
  {
    id: 'phys-prism',
    category: STEM_CATEGORIES.PHYSICS,
    name: 'Optical Dispersion Prism Spectrum',
    width: 160,
    height: 140,
    renderSvg: () => `
      <svg viewBox="0 0 160 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <polygon points="80,18 20,122 140,122" fill="rgba(168, 85, 247, 0.2)" stroke="#c084fc" stroke-width="3" stroke-linejoin="round" />
        <line x1="10" y1="85" x2="48" y2="72" stroke="#ffffff" stroke-width="3" />
        <line x1="48" y1="72" x2="98" y2="78" stroke="#fcd34d" stroke-width="2" />
        <line x1="98" y1="78" x2="150" y2="60" stroke="#ef4444" stroke-width="2.5" />
        <line x1="98" y1="78" x2="152" y2="75" stroke="#10b981" stroke-width="2.5" />
        <line x1="98" y1="78" x2="150" y2="90" stroke="#3b82f6" stroke-width="2.5" />
      </svg>
    `
  },

  // ================= MATHEMATICAL TEMPLATES =================
  {
    id: 'math-polar-plane',
    category: STEM_CATEGORIES.MATH,
    name: 'Polar Coordinate Grid Matrix',
    width: 200,
    height: 200,
    renderSvg: () => `
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="30" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="#38bdf8" stroke-width="2" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="#38bdf8" stroke-width="2" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="#38bdf8" stroke-width="2" />
        <line x1="36" y1="36" x2="164" y2="164" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2" />
        <line x1="36" y1="164" x2="164" y2="36" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2" />
      </svg>
    `
  },
  {
    id: 'math-setsquare-45',
    category: STEM_CATEGORIES.MATH,
    name: '45°-45°-90° Set Square',
    width: 160,
    height: 160,
    renderSvg: () => `
      <svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,140 140,140 20,20" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round" />
        <polygon points="40,125 110,125 40,55" fill="none" stroke="#38bdf8" stroke-width="2" />
        <text x="28" y="132" fill="#38bdf8" font-size="10" font-weight="bold">90°</text>
        <text x="115" y="135" fill="#38bdf8" font-size="9">45°</text>
        <text x="24" y="40" fill="#38bdf8" font-size="9">45°</text>
      </svg>
    `
  }
];
