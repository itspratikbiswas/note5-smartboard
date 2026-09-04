/**
 * Smooth Stroke & Ink Interpolation Engine
 * Uses Mid-point Quadratic Bezier Curves for low-latency, jitter-free smartboard inking.
 * Supports multiple Pen Styles: Chalk, Calligraphy (velocity/pressure sensitive), Highlighter, Smart-shape, and Laser.
 */

/**
 * Calculates distance from point P to line segment AB
 */
export function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const l2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
  if (l2 === 0) return Math.hypot(px - ax, py - ay);

  let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = ax + t * (bx - ax);
  const projY = ay + t * (by - ay);

  return Math.hypot(px - projX, py - projY);
}

/**
 * Checks if a coordinate (x, y) is within eraser distance of any segment in a stroke
 */
export function isPointNearStroke(x, y, stroke, threshold = 18) {
  if (!stroke.points || stroke.points.length === 0) return false;

  if (stroke.points.length === 1) {
    const p = stroke.points[0];
    return Math.hypot(x - p.x, y - p.y) <= threshold;
  }

  for (let i = 0; i < stroke.points.length - 1; i++) {
    const a = stroke.points[i];
    const b = stroke.points[i + 1];
    if (pointToSegmentDistance(x, y, a.x, a.y, b.x, b.y) <= threshold) {
      return true;
    }
  }
  return false;
}

/**
 * Renders a smooth path of points onto a 2D Canvas context using Mid-point Bezier interpolation
 */
export function renderStroke(ctx, stroke) {
  const { points, color, width, tool, opacity, dash } = stroke;
  if (!points || points.length === 0) return;

  ctx.save();

  // Set line dashes (solid, dashed, dotted)
  if (dash === 'dashed') {
    ctx.setLineDash([12, 8]);
  } else if (dash === 'dotted') {
    ctx.setLineDash([4, 6]);
  } else if (Array.isArray(dash)) {
    ctx.setLineDash(dash);
  } else {
    ctx.setLineDash([]);
  }

  const isHighlighter = tool === 'highlighter';
  const isChalk = tool === 'chalk';
  const isCalligraphy = tool === 'calligraphy';

  if (isHighlighter) {
    ctx.globalAlpha = opacity !== undefined ? opacity : 0.35;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 2.5;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
  } else {
    ctx.globalAlpha = opacity !== undefined ? opacity : 1.0;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, (width / 2) || 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    return;
  }

  if (isCalligraphy) {
    // Variable-width velocity & pressure simulation for stylish calligraphy
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const dt = Math.max(1, (p2.time || 0) - (p1.time || 0));
      const speed = Math.min(dist / dt, 3.0);
      
      // High speed = thinner line, slow deliberate speed = bold inking
      const pressure = p2.pressure || 0.5;
      const dynamicWidth = Math.max(1.5, width * (1.2 - speed * 0.3) * (pressure * 1.2));

      ctx.beginPath();
      ctx.lineWidth = dynamicWidth;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  } else {
    // Mid-point Quadratic Bezier Spline
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
    } else {
      for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    }

    ctx.stroke();

    // Subtle chalk texture effect if chalk tool is active
    if (isChalk) {
      ctx.globalAlpha = (opacity || 1.0) * 0.2;
      ctx.lineWidth = width + 2;
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Laser particle manager for active laser pointer trail
 */
export class LaserTrailManager {
  constructor() {
    this.particles = [];
  }

  addPoint(x, y) {
    this.particles.push({
      x,
      y,
      birth: performance.now(),
      life: 650, // milliseconds
      radius: 6
    });
  }

  render(ctx) {
    const now = performance.now();
    this.particles = this.particles.filter(p => now - p.birth < p.life);

    if (this.particles.length === 0) return false;

    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const age = now - p.birth;
      const progress = 1 - (age / p.life); // 1 -> 0
      const currentRadius = p.radius * progress;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 51, 102, ${progress * 0.9})`;
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12 * progress;
      ctx.fill();
    }
    ctx.restore();
    return true;
  }

  clear() {
    this.particles = [];
  }
}
