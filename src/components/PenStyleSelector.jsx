import React from 'react';
import { 
  PenTool, 
  Feather, 
  Highlighter, 
  Sparkles, 
  Wand2, 
  Sliders, 
  CircleDot, 
  Minus, 
  X,
  Check
} from 'lucide-react';
import { CHALK_COLORS, STROKE_WIDTHS } from './FloatingToolbar';

export const BRUSH_PROFILES = [
  {
    id: 'chalk',
    name: 'Classroom Chalk',
    description: 'High-texture, anti-aliased blackboard chalk stroke',
    icon: PenTool,
    color: 'text-emerald-400'
  },
  {
    id: 'calligraphy',
    name: 'Calligraphy / Stylus Pen',
    description: 'Velocity-sensitive tapered cursive inking track',
    icon: Feather,
    color: 'text-sky-400'
  },
  {
    id: 'highlighter',
    name: 'Translucent Highlighter',
    description: 'Translucent overlay mode for highlighting text',
    icon: Highlighter,
    color: 'text-amber-400'
  },
  {
    id: 'smart-shape',
    name: 'Smart Shape Assistant',
    description: 'Auto-converts rough hand-drawn loops into clean vectors',
    icon: Wand2,
    color: 'text-purple-400'
  },
  {
    id: 'laser',
    name: 'Presenter Laser Pointer',
    description: 'Ephemeral glowing trail with smooth particle fade',
    icon: Sparkles,
    color: 'text-rose-400'
  }
];

export const BRUSH_DASHES = [
  { id: 'solid', name: 'Solid Line', pattern: [] },
  { id: 'dashed', name: 'Dashed', pattern: [12, 8] },
  { id: 'dotted', name: 'Dotted', pattern: [4, 6] }
];

/**
 * Advanced Pen Style & Brush Parameter Selector
 */
export default function PenStyleSelector({
  isOpen,
  onClose,
  activeBrushProfile,
  setActiveBrushProfile,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  strokeOpacity,
  setStrokeOpacity,
  brushDash,
  setBrushDash,
  isShapeRecognitionOn,
  setIsShapeRecognitionOn
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Brush Profiles & Inking Parameters</h2>
              <p className="text-xs text-slate-400">Configure stroke dynamics, texture, opacity, and shape assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Brush Profile Cards */}
          <div>
            <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-3">
              Inking Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BRUSH_PROFILES.map((profile) => {
                const Icon = profile.icon;
                const isSelected = activeBrushProfile === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setActiveBrushProfile(profile.id);
                      if (profile.id === 'smart-shape') {
                        setIsShapeRecognitionOn(true);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/30'
                        : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-slate-800 border border-white/10 shrink-0 ${profile.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{profile.name}</h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{profile.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Swatches */}
          <div>
            <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-3">
              Academic Color Presets
            </label>
            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-white/10">
              {CHALK_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setStrokeColor(c.hex)}
                  title={c.name}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${
                    strokeColor === c.hex ? 'scale-125 border-white shadow-xl' : 'border-transparent hover:scale-110'
                  } ${c.bg}`}
                />
              ))}
              {/* Custom Color Input */}
              <label className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 border-2 border-white/40 cursor-pointer flex items-center justify-center">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

          {/* 3. Parametric Controls: Opacity & Thickness Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Opacity Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Stroke Opacity</span>
                <span className="font-mono text-sky-400">{Math.round(strokeOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={strokeOpacity}
                onChange={(e) => setStrokeOpacity(parseFloat(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Thickness Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Brush Width</span>
                <span className="font-mono text-sky-400">{strokeWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                step="1"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Dash Style Selector */}
          <div>
            <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2.5">
              Line Pattern
            </label>
            <div className="flex items-center gap-2">
              {BRUSH_DASHES.map((dash) => (
                <button
                  key={dash.id}
                  onClick={() => setBrushDash(dash.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    brushDash === dash.id
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{dash.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition-all"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
}
