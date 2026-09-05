import React, { useState } from 'react';
import { 
  Palette, 
  Grid, 
  FileUp, 
  X, 
  Check, 
  Music, 
  FileText, 
  BookOpen, 
  Layers, 
  Sliders,
  Sparkles,
  Pipette
} from 'lucide-react';
import { parsePdfDocument } from '../utils/pdfIngestionWorker';

export const CANVAS_PATTERNS = [
  { id: '', name: 'Clean Solid', icon: '⬛', description: 'No grid lines or overlays' },
  { id: 'chalkboard-grid', name: '40px Coordinate Grid', icon: '📐', description: 'Standard math & geometry grid' },
  { id: 'chalkboard-isometric', name: 'Isometric 3D Dot Grid', icon: '⚄', description: '3D drafting and vector projection' },
  { id: 'chalkboard-lined', name: 'Ruled Notebook Lines', icon: '📝', description: 'Handwriting and linear lecture notes' },
  { id: 'chalkboard-cornell', name: 'Cornell Note-Taking', icon: '📑', description: 'Cue column, main body, and summary footer' },
  { id: 'chalkboard-music', name: 'Musical Staves', icon: '🎵', description: '5-line musical notation staves' }
];

export const BOARD_COLORS = [
  { id: 'chalkboard-bg', name: 'Chalkboard Green', hex: '#1e3f20', bgClass: 'chalkboard-bg' },
  { id: 'chalkboard-black', name: 'Obsidian Black', hex: '#121316', bgClass: 'chalkboard-black' },
  { id: 'chalkboard-navy', name: 'Oxford Navy', hex: '#0f172a', bgClass: 'bg-[#0f172a]' },
  { id: 'chalkboard-slate', name: 'Charcoal Slate', hex: '#1e293b', bgClass: 'bg-[#1e293b]' },
  { id: 'chalkboard-white', name: 'Clean Whiteboard', hex: '#f8fafc', bgClass: 'chalkboard-white' },
  { id: 'chalkboard-parchment', name: 'Warm Parchment', hex: '#fef3c7', bgClass: 'bg-[#fef3c7]' },
  { id: 'chalkboard-crimson', name: 'Crimson Slate', hex: '#450a0a', bgClass: 'bg-[#450a0a]' },
  { id: 'chalkboard-royal', name: 'Royal Blue', hex: '#172554', bgClass: 'bg-[#172554]' }
];

/**
 * Advanced Template & PDF Ingestion Manager
 */
export default function TemplateManager({
  isOpen,
  onClose,
  currentTheme,
  setCurrentTheme,
  customBgColor,
  setCustomBgColor,
  onImportPdfPages
}) {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'colors' | 'pdf'
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(null);

  if (!isOpen) return null;

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsParsingPdf(true);
      const result = await parsePdfDocument(file, (current, total) => {
        setPdfProgress(`Rendering PDF Page ${current} of ${total}...`);
      });
      onImportPdfPages(result.pages);
      setIsParsingPdf(false);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error parsing PDF file. Please ensure it is a valid document.');
      setIsParsingPdf(false);
    }
  };

  const handleSelectColor = (colorHex, bgClass) => {
    setCustomBgColor(colorHex);
    // Keep pattern if exists
    const currentPattern = CANVAS_PATTERNS.find(p => p.id && currentTheme.includes(p.id))?.id || '';
    setCurrentTheme(currentPattern ? `${bgClass} ${currentPattern}` : bgClass);
  };

  const handleSelectPattern = (patternId) => {
    // Find current base class
    const baseColor = BOARD_COLORS.find(c => currentTheme.includes(c.bgClass))?.bgClass || 'chalkboard-bg';
    const newTheme = patternId ? `${baseColor} ${patternId}` : baseColor;
    setCurrentTheme(newTheme);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Board Themes, Colors & PDF Slides</h2>
              <p className="text-xs text-slate-400">Customize canvas background tones, grid overlays, or import lesson slides</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/5 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Canvas Colors & Grids</span>
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pdf'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>PDF Slide Ingestion</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* ================= TEMPLATES & COLORS TAB ================= */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              
              {/* 1. Background Solid Colors */}
              <div>
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3">
                  1. Board Background Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BOARD_COLORS.map((bColor) => {
                    const isSelected = customBgColor ? customBgColor.toLowerCase() === bColor.hex.toLowerCase() : currentTheme.includes(bColor.bgClass);
                    return (
                      <button
                        key={bColor.id}
                        onClick={() => handleSelectColor(bColor.hex, bColor.bgClass)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/30'
                            : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
                        }`}
                      >
                        <div
                          style={{ backgroundColor: bColor.hex }}
                          className="w-7 h-7 rounded-xl border border-white/30 shadow-md shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{bColor.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{bColor.hex}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Wheel Picker */}
                <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/10">
                  <label className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 border-2 border-white/40 cursor-pointer flex items-center justify-center shrink-0 shadow-lg">
                    <input
                      type="color"
                      value={customBgColor || '#1e3f20'}
                      onChange={(e) => {
                        setCustomBgColor(e.target.value);
                      }}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                    <Pipette className="w-4 h-4 text-white" />
                  </label>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-white">Custom Color Wheel</h5>
                    <p className="text-[11px] text-slate-400">Click to pick any custom hexadecimal hue for your board</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300 px-2.5 py-1 bg-slate-800 rounded-lg border border-white/10">
                    {customBgColor || 'Default'}
                  </span>
                </div>
              </div>

              {/* 2. Grid & Pattern Overlays */}
              <div>
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3">
                  2. Academic Pattern & Grid Overlay
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CANVAS_PATTERNS.map((pat) => {
                    const isSelected = pat.id ? currentTheme.includes(pat.id) : !CANVAS_PATTERNS.some(p => p.id && currentTheme.includes(p.id));
                    return (
                      <button
                        key={pat.name}
                        onClick={() => handleSelectPattern(pat.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/30'
                            : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
                        }`}
                      >
                        <span className="text-2xl mt-0.5">{pat.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white">{pat.name}</h4>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{pat.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= PDF INGESTION TAB ================= */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl border-2 border-dashed border-sky-400/40 bg-slate-900/50 hover:bg-sky-500/5 hover:border-sky-400 transition-all flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 mb-3 shadow-lg">
                  <FileUp className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-white">Import PDF Lecture Slides</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">
                  Upload syllabus worksheets, question banks, or presentation decks. Each page will be bound as an interactive whiteboard background.
                </p>

                {isParsingPdf ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono text-sky-300">{pdfProgress || 'Parsing document...'}</span>
                  </div>
                ) : (
                  <label className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 cursor-pointer transition-all flex items-center gap-2">
                    <FileUp className="w-4 h-4" />
                    <span>Choose PDF File</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
}
