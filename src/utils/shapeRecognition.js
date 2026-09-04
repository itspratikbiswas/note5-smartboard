/**
 * Smart Geometric Shape Recognition Engine
 * Analyzes raw hand-drawn stylus/mouse stroke paths and automatically classifies
 * them into geometric primitives (Lines, Circles, Rectangles, Triangles).
 */

import { pointToSegmentDistance } from './smoothStroke';

/**
 * Douglas-Peucker line simplification algorithm
 */
export function simplifyPoints(points, tolerance = 6) {
  if (!points || points.length <= 2) return points;

  let maxDistance = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = pointToSegmentDistance(points[i].x, points[i].y, start.x, start.y, end.x, end.y);
    if (d > maxDistance) {
      maxDistance = d;
      index = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = simplifyPoints(points.slice(0, index + 1), tolerance);
    const right = simplifyPoints(points.slice(index), tolerance);
    return [...left.slice(0, -1), ...right];
  } else {
    return [start, end];
  }
}

/**
 * Recognizes if a stroke represents a geometric shape
 */
export function recognizeShape(stroke) {
  const { points, color, width } = stroke;
  if (!points || points.length < 8) return null;

  const start = points[0];
  const end = points[points.length - 1];
  const totalPoints = points.length;

  // Bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let totalLength = 0;

  for (let i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    maxX = Math.max(maxX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
    if (i > 0) {
      totalLength += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
  }

  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;
  const diagonal = Math.hypot(boxWidth, boxHeight);
  if (diagonal < 30) return null; // Too tiny to reliably recognize

  const endDistance = Math.hypot(end.x - start.x, end.y - start.y);
  const isClosed = endDistance < Math.max(35, diagonal * 0.22);

  // 1. Check for Straight Line
  if (!isClosed && endDistance > diagonal * 0.8) {
    const simplified = simplifyPoints(points, 8);
    if (simplified.length <= 3) {
      return {
        type: 'line',
        start: { x: start.x, y: start.y },
        end: { x: end.x, y: end.y },
        color,
        width
      };
    }
  }

  // 2. Check for Circle / Ellipse
  if (isClosed) {
    const centerX = minX + boxWidth / 2;
    const centerY = minY + boxHeight / 2;
    const avgRadius = (boxWidth + boxHeight) / 4;
    let radiusVariance = 0;

    for (let i = 0; i < points.length; i++) {
      const r = Math.hypot(points[i].x - centerX, points[i].y - centerY);
      radiusVariance += Math.abs(r - avgRadius);
    }
    radiusVariance /= points.length;

    const circularity = radiusVariance / avgRadius;
    if (circularity < 0.28) {
      return {
        type: 'circle',
        start: { x: minX, y: minY },
        end: { x: maxX, y: maxY },
        color,
        width
      };
    }
  }

  // 3. Check for Polygon (Rectangle or Triangle) using simplified vertices
  if (isClosed) {
    const simplified = simplifyPoints(points, Math.max(10, diagonal * 0.08));
    const vertices = simplified.slice(0, -1);

    if (vertices.length === 3) {
      return {
        type: 'triangle',
        start: { x: minX, y: minY },
        end: { x: maxX, y: maxY },
        color,
        width
      };
    } else if (vertices.length === 4 || vertices.length === 5) {
      return {
        type: 'rectangle',
        start: { x: minX, y: minY },
        end: { x: maxX, y: maxY },
        color,
        width
      };
    }
  }

  return null;
}
