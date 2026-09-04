import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Clock, StickyNote, Plus, Move, Sparkles } from 'lucide-react';

/**
 * Classroom Quiz Timer & Stopwatch Widget
 * Frequently used in coaching institutes and smart classrooms for timed drills.
 */
export function ClassroomTimer({ isOpen, onClose }) {
  const [mode, setMode] = useState('timer'); // 'timer' | 'stopwatch'
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 mins default
  const [initialSeconds, setInitialSeconds] = useState(300);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 80 });
  const [isDragging, setIsDragging] = useState(false);

  // Timer Tick Interval
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'timer') {
          setSecondsLeft(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              // Simple audio beep or visual flash on timeout
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchTime(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  // Window drag handling
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handlePointerMove = (moveEvent) => {
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 280, moveEvent.clientX - startX)),
        y: Math.max(10, Math.min(window.innerHeight - 200, moveEvent.clientY - startY))
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const setTimerPreset = (mins) => {
    setIsRunning(false);
    setInitialSeconds(mins * 60);
    setSecondsLeft(mins * 60);
  };

  const isFinished = mode === 'timer' && secondsLeft === 0;

  return (
    <div
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      className={`fixed top-0 left-0 z-40 pointer-events-auto rounded-2xl shadow-2xl border ${
        isFinished ? 'border-red-500 animate-pulse bg-red-950/90' : 'border-sky-400/40 bg-slate-900/90'
      } backdrop-blur-md p-3.5 w-64 select-none touch-none flex flex-col gap-2.5 transition-shadow`}
    >
      {/* Widget Header */}
      <div
        onPointerDown={handlePointerDown}
        className="flex items-center justify-between cursor-grab active:cursor-grabbing pb-1.5 border-b border-white/10"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
          <Clock className="w-3.5 h-3.5" />
          <span>Classroom Timer</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode(mode === 'timer' ? 'stopwatch' : 'timer')}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200"
          >
            {mode === 'timer' ? 'Timer' : 'Stopwatch'}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Big Digital Display */}
      <div className="flex flex-col items-center justify-center py-2 bg-slate-950/60 rounded-xl border border-white/5">
        <span className={`text-4xl font-mono font-black tracking-wider ${
          isFinished ? 'text-red-400' : 'text-amber-300'
        }`}>
          {formatTime(mode === 'timer' ? secondsLeft : stopwatchTime)}
        </span>
        {isFinished && (
          <span className="text-xs font-bold text-red-400 mt-1 animate-bounce">
            TIME'S UP!
          </span>
        )}
      </div>

      {/* Quick Presets for Timer Mode */}
      {mode === 'timer' && (
        <div className="flex items-center justify-between gap-1">
          {[1, 3, 5, 10].map(mins => (
            <button
              key={mins}
              onClick={() => setTimerPreset(mins)}
              className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
            >
              {mins}m
            </button>
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            if (mode === 'timer') setSecondsLeft(initialSeconds);
            else setStopwatchTime(0);
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Movable & Editable Sticky Note Card on Canvas
 */
export function StickyNoteCard({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text || '');

  const handlePointerDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    const startX = e.clientX - note.x;
    const startY = e.clientY - note.y;

    const handleMove = (m) => {
      onUpdate(note.id, {
        x: m.clientX - startX,
        y: m.clientY - startY
      });
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const bgColors = {
    yellow: 'bg-amber-200 text-slate-900 border-amber-300',
    pink: 'bg-rose-200 text-slate-900 border-rose-300',
    cyan: 'bg-sky-200 text-slate-900 border-sky-300',
    green: 'bg-emerald-200 text-slate-900 border-emerald-300',
  };

  return (
    <div
      style={{ transform: `translate3d(${note.x}px, ${note.y}px, 0)` }}
      onPointerDown={handlePointerDown}
      className={`absolute top-0 left-0 z-20 w-52 min-h-[140px] rounded-2xl shadow-xl p-3 flex flex-col justify-between border-2 ${
        bgColors[note.color || 'yellow']
      } cursor-grab active:cursor-grabbing select-none group`}
    >
      {/* Note Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1 opacity-70">
          <StickyNote className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Note</span>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1 rounded-full hover:bg-black/10 text-slate-700 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Note Content */}
      <div className="flex-1 my-1">
        {isEditing ? (
          <textarea
            autoFocus
            value={text}
            onBlur={() => {
              setIsEditing(false);
              onUpdate(note.id, { text });
            }}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-24 bg-transparent outline-none resize-none font-medium text-xs leading-relaxed"
            placeholder="Type notes or lecture points..."
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full h-full text-xs font-semibold whitespace-pre-wrap leading-relaxed cursor-text min-h-[60px]"
          >
            {text || 'Click to add lecture note or formula...'}
          </div>
        )}
      </div>

      {/* Note Color Dots */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-black/10">
        {['yellow', 'pink', 'cyan', 'green'].map(c => (
          <button
            key={c}
            onClick={() => onUpdate(note.id, { color: c })}
            className={`w-3.5 h-3.5 rounded-full border border-black/20 ${
              c === 'yellow' ? 'bg-amber-300' : c === 'pink' ? 'bg-rose-300' : c === 'cyan' ? 'bg-sky-300' : 'bg-emerald-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
