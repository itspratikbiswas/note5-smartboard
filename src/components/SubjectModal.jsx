import React, { useState } from 'react';
import { 
  X, 
  Beaker, 
  Compass, 
  Ruler, 
  Atom, 
  Flame, 
  Zap, 
  Eye, 
  Layers, 
  Plus, 
  Grid,
  Check
} from 'lucide-react';
import { STEM_ITEMS, STEM_CATEGORIES } from '../utils/stemAssets';

/**
 * Subject Resource Drawer (Math & Science Drawer)
 * Features interactive tool launchers and scalable STEM apparatus library.
 */
export default function SubjectModal({
  isOpen,
  onClose,
  initialTab = 'math',
  onAddStemObject,
  onToggleTool,
  activeTools,
  onSetBackgroundGrid
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customLiquidColor, setCustomLiquidColor] = useState('#06b6d4');
  const [customLiquidLevel, setCustomLiquidLevel] = useState(60);

  if (!isOpen) return null;

  const chemistryItems = STEM_ITEMS.filter(item => item.category === STEM_CATEGORIES.CHEMISTRY);
  const physicsItems = STEM_ITEMS.filter(item => item.category === STEM_CATEGORIES.PHYSICS);

  const handleInsertItem = (item) => {
    // Generate an image element or SVG data URI for insertion into canvas
    const svgString = item.renderSvg(customLiquidColor, customLiquidLevel);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      onAddStemObject({
        id: `stem-${Date.now()}`,
        stemId: item.id,
        name: item.name,
        width: item.width,
        height: item.height,
        x: window.innerWidth / 2 - item.width / 2,
        y: window.innerHeight / 2 - item.height / 2,
        svgString,
        imgElement: img
      });
      onClose();
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col overflow-hidden border border-white/15 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Academic STEM Resource Drawer</h2>
              <p className="text-xs text-slate-400">Interactive Math Instruments & Science Laboratory Apparatus</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/5 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'math'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Mathematics & Geometry</span>
          </button>

          <button
            onClick={() => setActiveTab('chemistry')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'chemistry'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Beaker className="w-4 h-4" />
            <span>Chemistry Apparatus</span>
          </button>

          <button
            onClick={() => setActiveTab('physics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'physics'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Physics & Optics</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ================= MATH TAB ================= */}
          {activeTab === 'math' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3">
                  On-Screen Interactive Drafting Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ruler Card */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-sky-500/20 hover:border-sky-500/50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-sky-500/20 text-sky-400">
                        <Ruler className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">30cm / 12" Virtual Ruler</h4>
                        <p className="text-xs text-slate-400">Movable, rotatable measurement scale</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onToggleTool('ruler');
                        onClose();
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeTools?.ruler
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-sky-600 hover:bg-sky-500 text-white'
                      }`}
                    >
                      {activeTools?.ruler ? 'Active on Board' : 'Launch Ruler'}
                    </button>
                  </div>

                  {/* Protractor Card */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">360° Angle Protractor</h4>
                        <p className="text-xs text-slate-400">Interactive degree finder & rotation dial</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onToggleTool('protractor');
                        onClose();
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeTools?.protractor
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {activeTools?.protractor ? 'Active on Board' : 'Launch Protractor'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Math Grids */}
              <div>
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3">
                  Academic Canvas Grids
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'chalkboard', name: 'Plain Chalkboard', icon: '⬛' },
                    { id: 'chalkboard-grid', name: 'Coordinate 40px Grid', icon: '📐' },
                    { id: 'chalkboard-isometric', name: 'Isometric 3D Dots', icon: '⚄' },
                    { id: 'chalkboard-lined', name: 'Ruled Notebook Lines', icon: '📝' }
                  ].map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => {
                        onSetBackgroundGrid(bg.id);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/10 hover:border-sky-400 text-left transition-all group"
                    >
                      <span className="text-xl mb-1 block">{bg.icon}</span>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= CHEMISTRY TAB ================= */}
          {activeTab === 'chemistry' && (
            <div className="space-y-6">
              {/* Customizer Panel */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-300">Solution Liquid Color:</span>
                  <div className="flex items-center gap-2">
                    {['#06b6d4', '#10b981', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6'].map(col => (
                      <button
                        key={col}
                        onClick={() => setCustomLiquidColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          customLiquidColor === col ? 'scale-125 border-white shadow-lg' : 'border-transparent hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">Liquid Level:</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={customLiquidLevel}
                    onChange={(e) => setCustomLiquidLevel(Number(e.target.value))}
                    className="w-28 accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-emerald-300">{customLiquidLevel}%</span>
                </div>
              </div>

              {/* Apparatus Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {chemistryItems.map(item => (
                  <div
                    key={item.id}
                    className="group relative p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-400/50 flex flex-col items-center justify-between transition-all"
                  >
                    <div
                      className="w-24 h-28 flex items-center justify-center p-2 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: item.renderSvg(customLiquidColor, customLiquidLevel)
                      }}
                    />
                    <span className="text-xs font-medium text-slate-300 text-center line-clamp-1 mb-2">
                      {item.name}
                    </span>
                    <button
                      onClick={() => handleInsertItem(item)}
                      className="w-full py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Place</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PHYSICS TAB ================= */}
          {activeTab === 'physics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {physicsItems.map(item => (
                  <div
                    key={item.id}
                    className="group relative p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 hover:border-purple-400/50 flex flex-col items-center justify-between transition-all"
                  >
                    <div
                      className="w-28 h-24 flex items-center justify-center p-2 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: item.renderSvg()
                      }}
                    />
                    <span className="text-xs font-medium text-slate-300 text-center line-clamp-1 mb-2">
                      {item.name}
                    </span>
                    <button
                      onClick={() => handleInsertItem(item)}
                      className="w-full py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Place</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Placed apparatus can be freely dragged, repositioned, and annotated on the canvas.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
