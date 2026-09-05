import React from 'react';
import { Plus, Trash2, Copy, X, FileText } from 'lucide-react';

/**
 * Slide Filmstrip & Multi-Page Management Drawer
 */
export default function PageManager({
  isOpen,
  onClose,
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="glass-panel p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-2 max-w-[90vw] overflow-hidden">
        
        {/* Filmstrip Header */}
        <div className="flex items-center justify-between px-2 pb-1 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Lecture Slide Filmstrip ({pages.length} Pages)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 px-1">
          {pages.map((page, idx) => {
            const isActive = idx === activePageIndex;
            const strokeCount = (page.strokes || []).length + (page.shapes || []).length;

            return (
              <div
                key={page.id || idx}
                onClick={() => onSelectPage(idx)}
                className={`group relative w-36 h-24 rounded-xl flex flex-col justify-between p-2 cursor-pointer transition-all border ${
                  isActive
                    ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-lg scale-105'
                    : 'border-white/15 hover:border-white/40 hover:scale-100 opacity-80 hover:opacity-100'
                } ${
                  page.bgType === 'black'
                    ? 'bg-slate-950'
                    : page.bgType === 'white'
                    ? 'bg-slate-100'
                    : 'bg-[#1e3f20]'
                }`}
              >
                {/* Page Number Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      page.bgType === 'white' ? 'bg-slate-800 text-white' : 'bg-black/50 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  {/* Quick Page Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicatePage(idx);
                      }}
                      title="Duplicate Slide"
                      className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(idx);
                        }}
                        title="Delete Slide"
                        className="p-1 rounded bg-red-600/80 hover:bg-red-500 text-white"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Page Content Summary / Counter */}
                <div className="text-[10px] text-slate-300 font-mono flex items-center justify-between">
                  <span>{strokeCount} objects</span>
                </div>
              </div>
            );
          })}

          {/* Add Slide Button */}
          <button
            onClick={onAddPage}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-sky-400 bg-white/5 hover:bg-sky-500/10 flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-sky-300 transition-all shrink-0"
          >
            <Plus className="w-6 h-6" />
            <span className="text-[10px] font-bold">New Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
