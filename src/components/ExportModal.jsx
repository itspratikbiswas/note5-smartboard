import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, Download, FolderOpen, Check, Sparkles } from 'lucide-react';
import { exportMultiPagePdf, exportCurrentPageImage, exportSessionJson } from '../utils/exportEngine';

/**
 * Export & Lecture Sharing Dialog
 */
export default function ExportModal({
  isOpen,
  onClose,
  pages,
  activePageIndex,
  currentBackground,
  sessionTitle,
  onLoadSession
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(null);

  if (!isOpen) return null;

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportMultiPagePdf(pages, sessionTitle);
      setExportSuccess('PDF Document Generated Successfully!');
      setTimeout(() => {
        setExportSuccess(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = (format) => {
    try {
      const activePage = pages[activePageIndex];
      exportCurrentPageImage(activePage, currentBackground, format, sessionTitle);
      setExportSuccess(`Page Image (${format.toUpperCase()}) Exported!`);
      setTimeout(() => {
        setExportSuccess(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Failed to export image');
    }
  };

  const handleSaveSession = () => {
    exportSessionJson(pages, activePageIndex, sessionTitle);
    setExportSuccess('Whiteboard Session File Saved!');
    setTimeout(() => {
      setExportSuccess(null);
      onClose();
    }, 1200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.pages && Array.isArray(data.pages)) {
          onLoadSession(data);
          onClose();
        } else {
          alert('Invalid session file structure.');
        }
      } catch (err) {
        alert('Could not parse session JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Student Materials</h2>
              <p className="text-xs text-slate-400">Download lecture notes or archive presentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {exportSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="p-6 space-y-4">
          
          {/* Option 1: Multi-Page PDF */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-emerald-400/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Complete PDF Document</h4>
                <p className="text-xs text-slate-400">All {pages.length} lecture pages stitched in landscape 1080p</p>
              </div>
            </div>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Building...' : 'Export PDF'}</span>
            </button>
          </div>

          {/* Option 2: Current Page High-Res Image */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-sky-400/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Current Slide Snapshot</h4>
                <p className="text-xs text-slate-400">Page #{activePageIndex + 1} High-Definition Image</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportImage('png')}
                className="px-3 py-2 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-white text-xs font-semibold transition-all"
              >
                PNG
              </button>
              <button
                onClick={() => handleExportImage('jpeg')}
                className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all"
              >
                JPEG
              </button>
            </div>
          </div>

          {/* Option 3: Save / Open Note5 Session */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-indigo-400/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Archive / Reopen Session</h4>
                <p className="text-xs text-slate-400">Save vector drawing data or restore past lesson</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveSession}
                className="px-3 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                Save
              </button>
              <label className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all cursor-pointer">
                <span>Load</span>
                <input
                  type="file"
                  accept=".note5,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
