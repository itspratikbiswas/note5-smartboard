import React, { useRef, useEffect, useState, useCallback } from 'react';
import { renderStroke, isPointNearStroke, LaserTrailManager } from '../utils/smoothStroke';
import { drawShape } from '../utils/shapeDrawer';
import { recognizeShape } from '../utils/shapeRecognition';
import { Trash2, Move, Sparkles } from 'lucide-react';

/**
 * Advanced Hardware-Accelerated Smart Board Drawing Canvas (Phase 2)
 */
export default function SmartCanvas({
  strokes,
  setStrokes,
  shapes,
  setShapes,
  stemObjects,
  setStemObjects,
  formulas,
  setFormulas,
  activeTool,
  brushProfile = 'chalk',
  strokeColor,
  strokeWidth,
  strokeOpacity = 1.0,
  brushDash = 'solid',
  activeShape,
  onCommitAction,
  bgClass,
  customBgColor,
  pdfBackground
}) {
  const containerRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const laserCanvasRef = useRef(null);

  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef([]);
  const shapeStartRef = useRef(null);
  const activePointerIdRef = useRef(null);
  const laserManagerRef = useRef(new LaserTrailManager());
  const laserRafIdRef = useRef(null);

  /**
   * Resizes canvases according to container dimensions and high-DPI scaling
   */
  const handleResize = useCallback(() => {
    if (!containerRef.current || !mainCanvasRef.current || !overlayCanvasRef.current || !laserCanvasRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    [mainCanvasRef.current, overlayCanvasRef.current, laserCanvasRef.current].forEach(canvas => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    });

    redrawMainCanvas();
  }, [strokes, shapes, stemObjects, pdfBackground]);

  /**
   * Fully redraws the main committed ink canvas
   */
  const redrawMainCanvas = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw PDF Background Image if bound to this slide
    if (pdfBackground && pdfBackground.dataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        const scale = Math.min(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();

        // Draw vectors over PDF background
        drawCanvasVectors(ctx);
      };
      img.src = pdfBackground.dataUrl;
      return;
    }

    drawCanvasVectors(ctx);
  }, [strokes, shapes, stemObjects, pdfBackground]);

  const drawCanvasVectors = (ctx) => {
    // 2. Draw STEM apparatus objects
    if (stemObjects && stemObjects.length > 0) {
      stemObjects.forEach(obj => {
        if (obj.imgElement) {
          ctx.drawImage(obj.imgElement, obj.x, obj.y, obj.width, obj.height);
        }
      });
    }

    // 3. Draw committed geometric shapes
    if (shapes && shapes.length > 0) {
      shapes.forEach(shape => {
        drawShape(ctx, shape);
      });
    }

    // 4. Draw committed pen/chalk/highlighter strokes
    if (strokes && strokes.length > 0) {
      strokes.forEach(stroke => {
        renderStroke(ctx, stroke);
      });
    }
  };

  useEffect(() => {
    redrawMainCanvas();
  }, [redrawMainCanvas]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Laser pointer animation loop
  useEffect(() => {
    const laserCanvas = laserCanvasRef.current;
    if (!laserCanvas) return;
    const ctx = laserCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const animateLaser = () => {
      const width = laserCanvas.width / dpr;
      const height = laserCanvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      laserManagerRef.current.render(ctx);
      laserRafIdRef.current = requestAnimationFrame(animateLaser);
    };

    laserRafIdRef.current = requestAnimationFrame(animateLaser);
    return () => {
      if (laserRafIdRef.current) cancelAnimationFrame(laserRafIdRef.current);
    };
  }, []);

  const getCoordinates = (e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
      time: performance.now()
    };
  };

  /**
   * POINTER DOWN
   */
  const handlePointerDown = (e) => {
    if (!e.isPrimary) return;

    const coords = getCoordinates(e);
    isDrawingRef.current = true;
    activePointerIdRef.current = e.pointerId;

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (err) {}

    if (activeTool === 'laser' || brushProfile === 'laser') {
      laserManagerRef.current.addPoint(coords.x, coords.y);
      return;
    }

    if (activeTool === 'eraser') {
      eraseAtPoint(coords.x, coords.y);
      return;
    }

    if (activeTool === 'shape') {
      shapeStartRef.current = { x: coords.x, y: coords.y };
      return;
    }

    currentPointsRef.current = [coords];
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d');
      renderStroke(ctx, {
        points: currentPointsRef.current,
        color: strokeColor,
        width: strokeWidth,
        tool: activeTool === 'highlighter' ? 'highlighter' : brushProfile,
        opacity: strokeOpacity,
        dash: brushDash
      });
    }
  };

  /**
   * POINTER MOVE
   */
  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || e.pointerId !== activePointerIdRef.current) return;
    const coords = getCoordinates(e);

    if (activeTool === 'laser' || brushProfile === 'laser') {
      laserManagerRef.current.addPoint(coords.x, coords.y);
      return;
    }

    if (activeTool === 'eraser') {
      eraseAtPoint(coords.x, coords.y);
      return;
    }

    if (activeTool === 'shape' && shapeStartRef.current) {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, overlay.width / dpr, overlay.height / dpr);

      drawShape(ctx, {
        type: activeShape,
        start: shapeStartRef.current,
        end: { x: coords.x, y: coords.y },
        color: strokeColor,
        width: strokeWidth
      });
      return;
    }

    currentPointsRef.current.push(coords);
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, overlay.width / dpr, overlay.height / dpr);

    renderStroke(ctx, {
      points: currentPointsRef.current,
      color: strokeColor,
      width: strokeWidth,
      tool: activeTool === 'highlighter' ? 'highlighter' : brushProfile,
      opacity: strokeOpacity,
      dash: brushDash
    });
  };

  /**
   * POINTER UP
   */
  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    activePointerIdRef.current = null;

    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, overlay.width / dpr, overlay.height / dpr);
    }

    if (activeTool === 'shape' && shapeStartRef.current) {
      const coords = getCoordinates(e);
      const newShape = {
        id: `shape-${Date.now()}`,
        type: activeShape,
        start: shapeStartRef.current,
        end: { x: coords.x, y: coords.y },
        color: strokeColor,
        width: strokeWidth
      };
      setShapes(prev => [...prev, newShape]);
      onCommitAction();
      shapeStartRef.current = null;
      return;
    }

    if (currentPointsRef.current.length > 0) {
      const rawStroke = {
        id: `stroke-${Date.now()}`,
        points: [...currentPointsRef.current],
        color: strokeColor,
        width: strokeWidth,
        tool: activeTool === 'highlighter' ? 'highlighter' : brushProfile,
        opacity: strokeOpacity,
        dash: brushDash
      };

      // Smart Shape Recognition Check
      if (brushProfile === 'smart-shape') {
        const recognized = recognizeShape(rawStroke);
        if (recognized) {
          setShapes(prev => [...prev, { id: `shape-${Date.now()}`, ...recognized }]);
          onCommitAction();
          currentPointsRef.current = [];
          return;
        }
      }

      setStrokes(prev => [...prev, rawStroke]);
      onCommitAction();
      currentPointsRef.current = [];
    }
  };

  const eraseAtPoint = (x, y) => {
    const eraserRadius = Math.max(18, strokeWidth * 2.5);
    const remainingStrokes = strokes.filter(stroke => !isPointNearStroke(x, y, stroke, eraserRadius));
    const remainingShapes = shapes.filter(shape => {
      const minX = Math.min(shape.start.x, shape.end.x) - eraserRadius;
      const maxX = Math.max(shape.start.x, shape.end.x) + eraserRadius;
      const minY = Math.min(shape.start.y, shape.end.y) - eraserRadius;
      const maxY = Math.max(shape.start.y, shape.end.y) + eraserRadius;
      return !(x >= minX && x <= maxX && y >= minY && y <= maxY);
    });

    if (remainingStrokes.length !== strokes.length || remainingShapes.length !== shapes.length) {
      setStrokes(remainingStrokes);
      setShapes(remainingShapes);
      onCommitAction();
    }
  };

  return (
    <div
      ref={containerRef}
      style={customBgColor ? { backgroundColor: customBgColor } : {}}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${bgClass}`}
    >
      <canvas ref={mainCanvasRef} className="absolute inset-0 block pointer-events-none z-0" />
      <canvas ref={overlayCanvasRef} className="absolute inset-0 block pointer-events-none z-10" />
      <canvas ref={laserCanvasRef} className="absolute inset-0 block pointer-events-none z-20" />

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`absolute inset-0 z-10 touch-none ${
          activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
        }`}
      />

      {/* Formula Cards Overlay */}
      {formulas && formulas.map((form) => (
        <div
          key={form.id}
          style={{ transform: `translate3d(${form.x}px, ${form.y}px, 0)` }}
          className="absolute top-0 left-0 z-20 p-3 rounded-2xl bg-slate-900/90 border border-purple-400/50 shadow-2xl backdrop-blur-md cursor-grab active:cursor-grabbing select-none group flex flex-col gap-1"
        >
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-white/10">
            <span className="text-[10px] font-bold text-purple-300">{form.name}</span>
            <button
              onClick={() => setFormulas(prev => prev.filter(f => f.id !== form.id))}
              className="p-0.5 text-slate-400 hover:text-white rounded"
            >
              <Trash2 className="w-3 h-3 text-red-400" />
            </button>
          </div>
          <div className="text-sm font-mono font-bold text-amber-300">
            {form.preview}
          </div>
        </div>
      ))}
    </div>
  );
}
