import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, X, Maximize2, Move, Compass, CornerDownRight } from 'lucide-react';

/**
 * Interactive On-Screen Math Tools (Ruler & Protractor)
 * Allows teachers to position, rotate, and measure directly on the smartboard.
 */
export default function InteractiveToolLayer({ activeTools, onCloseTool }) {
  // Ruler State
  const [rulerPos, setRulerPos] = useState({ x: 250, y: 220, angle: 0, length: 500 });
  const [isDraggingRuler, setIsDraggingRuler] = useState(false);
  const [isRotatingRuler, setIsRotatingRuler] = useState(false);

  // Protractor State
  const [protractorPos, setProtractorPos] = useState({ x: 450, y: 350, angle: 0, radius: 180, needleAngle: 45 });
  const [isDraggingProtractor, setIsDraggingProtractor] = useState(false);
  const [isRotatingProtractor, setIsRotatingProtractor] = useState(false);
  const [isMovingNeedle, setIsMovingNeedle] = useState(false);

  const dragRef = useRef(null);

  // Mouse/Touch drag handler
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDraggingRuler) {
        setRulerPos(prev => ({
          ...prev,
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      } else if (isRotatingRuler && dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const deg = Math.round((rad * 180) / Math.PI);
        setRulerPos(prev => ({ ...prev, angle: deg }));
      } else if (isDraggingProtractor) {
        setProtractorPos(prev => ({
          ...prev,
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      } else if (isRotatingProtractor && dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const deg = Math.round((rad * 180) / Math.PI);
        setProtractorPos(prev => ({ ...prev, angle: deg }));
      } else if (isMovingNeedle && dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let deg = Math.round((Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI) - protractorPos.angle;
        if (deg < 0) deg += 360;
        setProtractorPos(prev => ({ ...prev, needleAngle: deg % 360 }));
      }
    };

    const handlePointerUp = () => {
      setIsDraggingRuler(false);
      setIsRotatingRuler(false);
      setIsDraggingProtractor(false);
      setIsRotatingProtractor(false);
      setIsMovingNeedle(false);
    };

    if (isDraggingRuler || isRotatingRuler || isDraggingProtractor || isRotatingProtractor || isMovingNeedle) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingRuler, isRotatingRuler, isDraggingProtractor, isRotatingProtractor, isMovingNeedle, protractorPos.angle]);

  const showRuler = activeTools && activeTools.ruler;
  const showProtractor = activeTools && activeTools.protractor;

  if (!showRuler && !showProtractor) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* ================= VIRTUAL RULER ================= */}
      {showRuler && (
        <div
          ref={isRotatingRuler ? dragRef : null}
          style={{
            transform: `translate3d(${rulerPos.x}px, ${rulerPos.y}px, 0) rotate(${rulerPos.angle}deg)`,
            width: `${rulerPos.length}px`,
            height: '84px',
            transformOrigin: 'center center',
          }}
          className="absolute pointer-events-auto rounded-lg shadow-2xl border border-sky-400/40 bg-slate-900/80 backdrop-blur-md select-none touch-none flex flex-col justify-between p-1.5 transition-shadow hover:border-sky-400"
        >
          {/* Top Ruler CM Markings */}
          <div className="w-full h-8 relative flex items-start border-b border-sky-500/30">
            {Array.from({ length: 26 }).map((_, i) => (
              <div
                key={`cm-${i}`}
                style={{ left: `${(i / 25) * 100}%` }}
                className="absolute top-0 flex flex-col items-center -translate-x-1/2"
              >
                <div className={`w-[1.5px] ${i % 5 === 0 ? 'h-4 bg-sky-300' : 'h-2 bg-sky-400/50'}`} />
                {i % 5 === 0 && (
                  <span className="text-[10px] font-mono text-sky-200 mt-0.5 leading-none">
                    {i}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Center Handle Bar */}
          <div className="flex items-center justify-between px-3">
            <div
              onPointerDown={() => setIsDraggingRuler(true)}
              className="flex items-center gap-2 cursor-grab active:cursor-grabbing px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 rounded-md border border-sky-400/30 text-sky-200 text-xs font-semibold"
            >
              <Move className="w-3.5 h-3.5" />
              <span>30 cm Scale</span>
              <span className="text-[10px] opacity-75 font-mono">({rulerPos.angle}°)</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Rotation Handle */}
              <button
                ref={isRotatingRuler ? null : dragRef}
                onPointerDown={() => setIsRotatingRuler(true)}
                title="Hold & Drag to Rotate"
                className="p-1.5 bg-sky-500/30 hover:bg-sky-500/50 text-sky-100 rounded-md cursor-ew-resize border border-sky-400/40"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => onCloseTool('ruler')}
                className="p-1.5 bg-red-500/30 hover:bg-red-500/60 text-red-200 rounded-md border border-red-400/40"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Ruler Inch Markings */}
          <div className="w-full h-4 relative flex items-end border-t border-sky-500/30">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`in-${i}`}
                style={{ left: `${(i / 10) * 100}%` }}
                className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
              >
                <div className={`w-[1.5px] ${i % 2 === 0 ? 'h-3.5 bg-amber-300' : 'h-2 bg-amber-400/50'}`} />
                {i % 2 === 0 && (
                  <span className="text-[9px] font-mono text-amber-200 mb-0.5 leading-none">
                    {i}"
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIRTUAL PROTRACTOR ================= */}
      {showProtractor && (
        <div
          ref={isRotatingProtractor ? dragRef : null}
          style={{
            transform: `translate3d(${protractorPos.x - protractorPos.radius}px, ${protractorPos.y - protractorPos.radius}px, 0) rotate(${protractorPos.angle}deg)`,
            width: `${protractorPos.radius * 2}px`,
            height: `${protractorPos.radius * 2}px`,
            transformOrigin: 'center center',
          }}
          className="absolute pointer-events-auto rounded-full shadow-2xl border-2 border-emerald-400/50 bg-slate-900/80 backdrop-blur-md select-none touch-none transition-shadow hover:border-emerald-400"
        >
          {/* Degree Ticks Around Circle */}
          <svg
            className="w-full h-full absolute inset-0"
            viewBox={`0 0 ${protractorPos.radius * 2} ${protractorPos.radius * 2}`}
          >
            {Array.from({ length: 36 }).map((_, i) => {
              const deg = i * 10;
              const rad = (deg * Math.PI) / 180;
              const r = protractorPos.radius;
              const x1 = r + (r - (deg % 30 === 0 ? 16 : 8)) * Math.cos(rad);
              const y1 = r + (r - (deg % 30 === 0 ? 16 : 8)) * Math.sin(rad);
              const x2 = r + (r - 2) * Math.cos(rad);
              const y2 = r + (r - 2) * Math.sin(rad);

              const textR = r - 26;
              const tx = r + textR * Math.cos(rad);
              const ty = r + textR * Math.sin(rad);

              return (
                <g key={`deg-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={deg % 90 === 0 ? '#34d399' : '#10b981'}
                    strokeWidth={deg % 30 === 0 ? 2 : 1}
                  />
                  {deg % 30 === 0 && (
                    <text
                      x={tx}
                      y={ty + 3}
                      fill="#a7f3d0"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      transform={`rotate(${deg + 90}, ${tx}, ${ty})`}
                    >
                      {deg}°
                    </text>
                  )}
                </g>
              );
            })}

            {/* Needle Angle Line */}
            {(() => {
              const rad = (protractorPos.needleAngle * Math.PI) / 180;
              const r = protractorPos.radius;
              const nx = r + (r - 4) * Math.cos(rad);
              const ny = r + (r - 4) * Math.sin(rad);
              return (
                <line
                  x1={r}
                  y1={r}
                  x2={nx}
                  y2={ny}
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="3,3"
                />
              );
            })()}

            {/* Center Origin Dot */}
            <circle cx={protractorPos.radius} cy={protractorPos.radius} r="4" fill="#34d399" />
          </svg>

          {/* Center Info Pill & Drag Handle */}
          <div
            onPointerDown={() => setIsDraggingProtractor(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 border border-emerald-500/40 cursor-grab active:cursor-grabbing text-emerald-200"
          >
            <Move className="w-3.5 h-3.5 mb-1" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {protractorPos.needleAngle}°
            </span>
            <span className="text-[9px] text-emerald-400/80">Protractor</span>
          </div>

          {/* Quick Buttons at Top Right */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              ref={isRotatingProtractor ? null : dragRef}
              onPointerDown={() => setIsRotatingProtractor(true)}
              title="Drag to Rotate Protractor"
              className="p-1 bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-100 rounded-md border border-emerald-400/40"
            >
              <RotateCw className="w-3 h-3" />
            </button>
            <button
              onClick={() => onCloseTool('protractor')}
              className="p-1 bg-red-500/30 hover:bg-red-500/60 text-red-200 rounded-md border border-red-400/40"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
