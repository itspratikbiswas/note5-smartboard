import React, { useState } from 'react';
import {
  Download,
  Share2,
  Maximize,
  Minimize,
  Palette,
  ChevronLeft,
  ChevronRight,
  Plus,
  Copy,
  Trash,
  LayoutGrid,
  FileText,
  Sliders,
  Sparkles,
  FileUp,
  Grid
} from 'lucide-react';

export const BACKGROUND_THEMES = [
  { id: 'chalkboard-bg', name: 'Dark Green Chalkboard', class: 'chalkboard-bg', color: '#1e3f20' },
  { id: 'chalkboard-bg chalkboard-grid', name: 'Chalkboard 40px Grid', class: 'chalkboard-bg chalkboard-grid', color: '#1a371c' },
  { id: 'chalkboard-bg chalkboard-isometric', name: 'Isometric 3D Dots', class: 'chalkboard-bg chalkboard-isometric', color: '#1a371c' },
  { id: 'chalkboard-bg chalkboard-lined', name: 'Ruled Notebook Lines', class: 'chalkboard-bg chalkboard-lined', color: '#1e3f20' },
  { id: 'chalkboard-black', name: 'Matte Obsidian Black', class: 'chalkboard-black', color: '#121316' },
  { id: 'chalkboard-white', name: 'Clean Whiteboard', class: 'chalkboard-white', color: '#f8fafc' },
  { id: 'chalkboard-white chalkboard-white-grid', name: 'Whiteboard Graph Grid', class: 'chalkboard-white chalkboard-white-grid', color: '#f1f5f9' },
];

/**
 * Smart Board Top Navigation Bar (Phase 2)
 */
export default function TopHeader({
  sessionTitle,
  setSessionTitle,
  currentBackground,
  setCurrentBackground,
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onOpenExportModal,
  onOpenTemplateManager,
  onOpenAiFormulas,
  onOpenPenStyles,
  isFullscreen,
  onToggleFullscreen,
  showFilmstrip,
  setShowFilmstrip
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="fixed top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none select-none">
      
      {/* Left: Brand, Templates & PDF Ingestion */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-3 shadow-lg border border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center font-black text-white text-sm shadow-md">
            N5
          </div>
          {isEditingTitle ? (
            <input
              type="text"
              value={sessionTitle}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="bg-slate-800 text-white font-bold text-sm px-2 py-0.5 rounded outline-none border border-sky-400 max-w-[200px]"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename session"
              className="text-sm font-bold text-slate-200 hover:text-white cursor-pointer transition-colors max-w-[200px] truncate"
            >
              {sessionTitle}
            </span>
          )}
        </div>

        {/* Templates & PDF Ingestion Button */}
        <button
          onClick={onOpenTemplateManager}
          title="Board Templates & PDF Slide Ingestion"
          className="glass-panel px-3 py-2.5 rounded-2xl flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold shadow-lg border border-white/10 transition-all"
        >
          <Grid className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Templates & PDF</span>
        </button>

        {/* AI Math & Formula Button */}
        <button
          onClick={onOpenAiFormulas}
          title="AI Math & LaTeX Typesetting"
          className="glass-panel px-3 py-2.5 rounded-2xl flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold shadow-lg border border-white/10 transition-all"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="hidden lg:inline">AI Formulas</span>
        </button>
      </div>

      {/* Center: Multi-Page Navigation Pill */}
      <div className="pointer-events-auto">
        <div className="glass-panel px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border border-white/10">
          <button
            onClick={() => onSelectPage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            title="Previous Page"
            className={`p-2 rounded-xl transition-all ${
              activePageIndex === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowFilmstrip(!showFilmstrip)}
            title="Toggle Slide Filmstrip"
            className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-sky-300 tracking-wide flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Page {activePageIndex + 1} / {pages.length}</span>
          </button>

          <button
            onClick={() => onSelectPage(Math.min(pages.length - 1, activePageIndex + 1))}
            disabled={activePageIndex === pages.length - 1}
            title="Next Page"
            className={`p-2 rounded-xl transition-all ${
              activePageIndex === pages.length - 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

          {/* Add Page */}
          <button
            onClick={onAddPage}
            title="Add New Board Page"
            className="p-2 rounded-xl bg-sky-600/60 hover:bg-sky-500 text-white transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Export, Fullscreen, Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          title="Export Multi-page PDF or Image"
          className="glass-panel px-3.5 py-2.5 rounded-2xl flex items-center gap-2 bg-gradient-to-r from-emerald-600/70 to-teal-600/70 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg border border-white/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Smartboard Fullscreen'}
          className="glass-panel p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 shadow-lg border border-white/10 transition-all"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

    </header>
  );
}
