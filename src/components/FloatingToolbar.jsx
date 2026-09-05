import React, { useState } from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  Trash2,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  Maximize2,
  Grid,
  Palette,
  Undo2,
  Redo2,
  Box,
  Layers,
  Sparkles,
  Clock,
  StickyNote,
  Sliders,
  Feather,
  Wand2
} from 'lucide-react';

export const CHALK_COLORS = [
  { name: 'Pure White', hex: '#ffffff', bg: 'bg-white' },
  { name: 'Chalk Yellow', hex: '#fef08a', bg: 'bg-yellow-200' },
  { name: 'Sky Blue', hex: '#38bdf8', bg: 'bg-sky-400' },
  { name: 'Neon Green', hex: '#4ade80', bg: 'bg-green-400' },
  { name: 'Coral Red', hex: '#f87171', bg: 'bg-red-400' },
  { name: 'Vivid Violet', hex: '#c084fc', bg: 'bg-purple-400' },
  { name: 'Solar Orange', hex: '#fb923c', bg: 'bg-orange-400' },
  { name: 'Rose Pink', hex: '#f472b6', bg: 'bg-pink-400' },
  { name: 'Cyan Aqua', hex: '#22d3ee', bg: 'bg-cyan-400' },
  { name: 'Warm Gold', hex: '#facc15', bg: 'bg-yellow-400' },
  { name: 'Mint Green', hex: '#6ee7b7', bg: 'bg-emerald-300' },
  { name: 'Lavender', hex: '#a78bfa', bg: 'bg-violet-400' },
  { name: 'Crimson', hex: '#e11d48', bg: 'bg-rose-600' },
  { name: 'Slate Gray', hex: '#94a3b8', bg: 'bg-slate-400' },
];

export const STROKE_WIDTHS = [
  { label: 'Fine', size: 2, ring: 'w-1.5 h-1.5' },
  { label: 'Medium', size: 6, ring: 'w-3 h-3' },
  { label: 'Bold', size: 12, ring: 'w-4.5 h-4.5' },
  { label: 'Ultra', size: 24, ring: 'w-6 h-6' },
];

export const SHAPES_LIST = [
  { id: 'line', name: 'Straight Line', icon: Minus },
  { id: 'arrow', name: 'Arrow Vector', icon: ArrowRight },
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle / Ellipse', icon: Circle },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'cube', name: '3D Cube', icon: Box },
  { id: 'coordinate-axes', name: '2D Graph Axes', icon: Grid },
];

/**
 * Ergonomic Floating Toolbar for Smart Boards & IFPs
 */
export default function FloatingToolbar({
  activeTool,
  setActiveTool,
  brushProfile,
  setBrushProfile,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  strokeOpacity,
  setStrokeOpacity,
  brushDash,
  setBrushDash,
  activeShape,
  setActiveShape,
  onClearCanvas,
  onOpenSubjectModal,
  onToggleTimer,
  onAddStickyNote,
  onOpenPenStyles,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  dockPosition = 'bottom'
}) {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);

  const handleSelectTool = (tool) => {
    setActiveTool(tool);
    if (tool !== 'shape') setShowShapesMenu(false);
    if (tool !== 'pen' && tool !== 'highlighter') setShowColorMenu(false);
  };

  return (
    <div
      className={`fixed z-30 transition-all duration-300 pointer-events-auto select-none ${
        dockPosition === 'bottom'
          ? 'bottom-4 left-1/2 -translate-x-1/2'
          : 'left-4 top-1/2 -translate-y-1/2 flex-col'
      }`}
    >
      {/* ================= EXPANDABLE SHAPES POPUP ================= */}
      {showShapesMenu && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 glass-panel p-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          {SHAPES_LIST.map((shape) => {
            const Icon = shape.icon;
            const isSelected = activeTool === 'shape' && activeShape === shape.id;
            return (
              <button
                key={shape.id}
                onClick={() => {
                  setActiveTool('shape');
                  setActiveShape(shape.id);
                  setShowShapesMenu(false);
                }}
                title={shape.name}
                className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}

      {/* ================= EXPANDABLE COLOR & STROKE POPUP ================= */}
      {showColorMenu && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 glass-panel p-4 rounded-2xl flex flex-col gap-3.5 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 min-w-[340px]">
          {/* Swatches Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Colors</span>
              <button
                onClick={() => {
                  setShowColorMenu(false);
                  onOpenPenStyles();
                }}
                className="text-[11px] text-sky-300 hover:underline flex items-center gap-1 font-semibold"
              >
                <Sliders className="w-3 h-3" /> More Styles
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {CHALK_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setStrokeColor(color.hex)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    strokeColor.toLowerCase() === color.hex.toLowerCase()
                      ? 'scale-125 border-white shadow-lg ring-2 ring-sky-400/50'
                      : 'border-transparent hover:scale-110'
                  } ${color.bg}`}
                />
              ))}
              {/* Custom Color Wheel Picker */}
              <label
                title="Custom Color Wheel Picker"
                className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 border-2 border-white/40 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              >
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-400">Thickness</span>
            <div className="flex items-center gap-2">
              {STROKE_WIDTHS.map((width) => (
                <button
                  key={width.size}
                  onClick={() => setStrokeWidth(width.size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    strokeWidth === width.size
                      ? 'bg-white/20 text-white font-bold border border-white/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`rounded-full bg-white ${width.ring}`} />
                  <span>{width.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN DOCK CONTAINER ================= */}
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-white/15">
        
        {/* Undo / Redo Buttons */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-white/10">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
              canUndo
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
              canRedo
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Inking Pen */}
        <button
          onClick={() => handleSelectTool('pen')}
          title="Chalk / Pen Drawing (P)"
          className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'pen'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <PenTool className="w-5 h-5" />
        </button>

        {/* Pen Style Selector Modal Trigger */}
        <button
          onClick={onOpenPenStyles}
          title="Pen Styles & Inking Profiles (Chalk, Calligraphy, Highlighter, Dashes)"
          className="touch-btn p-3 rounded-xl flex items-center justify-center text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition-all border border-sky-400/20"
        >
          <Sliders className="w-5 h-5" />
        </button>

        {/* Translucent Highlighter */}
        <button
          onClick={() => handleSelectTool('highlighter')}
          title="Lecture Highlighter (H)"
          className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'highlighter'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Highlighter className="w-5 h-5" />
        </button>

        {/* Laser Pointer */}
        <button
          onClick={() => handleSelectTool('laser')}
          title="Presenter Laser Pointer (L)"
          className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'laser'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-300/40'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Color / Stroke Palette Trigger */}
        <button
          onClick={() => {
            setShowColorMenu(!showColorMenu);
            setShowShapesMenu(false);
          }}
          title="Color & Stroke Width"
          className="touch-btn p-3 rounded-xl flex items-center justify-center relative text-slate-300 hover:text-white hover:bg-white/10"
        >
          <div
            style={{ backgroundColor: strokeColor }}
            className="w-5 h-5 rounded-full border-2 border-white/80 shadow-sm"
          />
        </button>

        {/* Geometric Shapes Picker */}
        <button
          onClick={() => {
            setShowShapesMenu(!showShapesMenu);
            setShowColorMenu(false);
          }}
          title="2D & 3D Geometric Shapes"
          className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'shape'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Square className="w-5 h-5" />
        </button>

        {/* Smart Eraser */}
        <button
          onClick={() => handleSelectTool('eraser')}
          title="Smart Stroke & Area Eraser (E)"
          className={`touch-btn p-3 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'eraser'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Eraser className="w-5 h-5" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        {/* Sticky Note Widget Button */}
        <button
          onClick={onAddStickyNote}
          title="Add Sticky Note Card"
          className="touch-btn p-3 rounded-xl flex items-center justify-center text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 transition-all"
        >
          <StickyNote className="w-5 h-5" />
        </button>

        {/* Classroom Timer Launcher */}
        <button
          onClick={onToggleTimer}
          title="Classroom Timer / Stopwatch"
          className="touch-btn p-3 rounded-xl flex items-center justify-center text-sky-300 hover:text-sky-200 hover:bg-sky-500/20 transition-all"
        >
          <Clock className="w-5 h-5" />
        </button>

        {/* Subject Drawer (Math & Science) */}
        <button
          onClick={() => onOpenSubjectModal('math')}
          title="STEM Resource Drawers"
          className="touch-btn px-3.5 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-sky-600/60 to-indigo-600/60 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md border border-white/15 transition-all"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">STEM Drawers</span>
        </button>

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          title="Clear Active Board"
          className="touch-btn p-3 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
