/**
 * Shape Drawer & Geometric Vector Engine
 * Handles rendering of 2D and 3D shapes on the Smart Board canvas.
 */

export function drawShape(ctx, shape) {
  const { type, start, end, color, width, fill, isDotted } = shape;
  if (!start || !end) return;

  ctx.save();
  ctx.strokeStyle = color || '#ffffff';
  ctx.lineWidth = width || 3;
  ctx.fillStyle = fill || 'transparent';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (isDotted) {
    ctx.setLineDash([8, 6]);
  } else {
    ctx.setLineDash([]);
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const w = Math.abs(dx);
  const h = Math.abs(dy);

  switch (type) {
    case 'line': {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      break;
    }

    case 'arrow': {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(dy, dx);
      const headLen = Math.max(14, width * 3);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLen * Math.cos(angle - Math.PI / 6),
        end.y - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        end.x - headLen * Math.cos(angle + Math.PI / 6),
        end.y - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = color || '#ffffff';
      ctx.fill();
      break;
    }

    case 'double-arrow': {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      const angle = Math.atan2(dy, dx);
      const headLen = Math.max(14, width * 3);

      // End arrow head
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLen * Math.cos(angle - Math.PI / 6),
        end.y - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        end.x - headLen * Math.cos(angle + Math.PI / 6),
        end.y - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = color || '#ffffff';
      ctx.fill();

      // Start arrow head
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(
        start.x + headLen * Math.cos(angle - Math.PI / 6),
        start.y + headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        start.x + headLen * Math.cos(angle + Math.PI6 || angle + Math.PI / 6),
        start.y + headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'rectangle': {
      ctx.beginPath();
      ctx.rect(minX, minY, w, h);
      if (fill && fill !== 'transparent') ctx.fill();
      ctx.stroke();
      break;
    }

    case 'rounded-rect': {
      const radius = Math.min(16, w / 4, h / 4);
      ctx.beginPath();
      ctx.roundRect(minX, minY, w, h, radius);
      if (fill && fill !== 'transparent') ctx.fill();
      ctx.stroke();
      break;
    }

    case 'circle':
    case 'ellipse': {
      ctx.beginPath();
      const radiusX = w / 2;
      const radiusY = h / 2;
      const centerX = minX + radiusX;
      const centerY = minY + radiusY;
      ctx.ellipse(centerX, centerY, Math.max(1, radiusX), Math.max(1, radiusY), 0, 0, Math.PI * 2);
      if (fill && fill !== 'transparent') ctx.fill();
      ctx.stroke();
      break;
    }

    case 'triangle': {
      ctx.beginPath();
      ctx.moveTo(minX + w / 2, minY);
      ctx.lineTo(minX + w, minY + h);
      ctx.lineTo(minX, minY + h);
      ctx.closePath();
      if (fill && fill !== 'transparent') ctx.fill();
      ctx.stroke();
      break;
    }

    case 'right-triangle': {
      ctx.beginPath();
      ctx.moveTo(minX, minY);
      ctx.lineTo(minX, minY + h);
      ctx.lineTo(minX + w, minY + h);
      ctx.closePath();
      if (fill && fill !== 'transparent') ctx.fill();
      ctx.stroke();

      // Right angle indicator
      const sq = Math.min(14, w / 4, h / 4);
      if (sq > 4) {
        ctx.beginPath();
        ctx.moveTo(minX, minY + h - sq);
        ctx.lineTo(minX + sq, minY + h - sq);
        ctx.lineTo(minX + sq, minY + h);
        ctx.stroke();
      }
      break;
    }

    case 'coordinate-axes': {
      const midX = minX + w / 2;
      const midY = minY + h / 2;

      // X Axis
      ctx.beginPath();
      ctx.moveTo(minX, midY);
      ctx.lineTo(minX + w, midY);
      ctx.stroke();

      // X Axis Arrow
      ctx.beginPath();
      ctx.moveTo(minX + w, midY);
      ctx.lineTo(minX + w - 10, midY - 6);
      ctx.lineTo(minX + w - 10, midY + 6);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Y Axis
      ctx.beginPath();
      ctx.moveTo(midX, minY + h);
      ctx.lineTo(midX, minY);
      ctx.stroke();

      // Y Axis Arrow
      ctx.beginPath();
      ctx.moveTo(midX, minY);
      ctx.lineTo(midX - 6, minY + 10);
      ctx.lineTo(midX + 6, minY + 10);
      ctx.closePath();
      ctx.fill();

      // Axis Labels & Grid Ticks
      ctx.font = '12px Outfit, sans-serif';
      ctx.fillText('X', minX + w - 4, midY - 8);
      ctx.fillText('Y', midX + 8, minY + 12);
      ctx.fillText('O', midX - 12, midY + 14);

      // Ticks
      const step = 25;
      for (let x = midX + step; x < minX + w - 15; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, midY - 3);
        ctx.lineTo(x, midY + 3);
        ctx.stroke();
      }
      for (let x = midX - step; x > minX + 15; x -= step) {
        ctx.beginPath();
        ctx.moveTo(x, midY - 3);
        ctx.lineTo(x, midY + 3);
        ctx.stroke();
      }
      for (let y = midY - step; y > minY + 15; y -= step) {
        ctx.beginPath();
        ctx.moveTo(midX - 3, y);
        ctx.lineTo(midX + 3, y);
        ctx.stroke();
      }
      for (let y = midY + step; y < minY + h - 15; y += step) {
        ctx.beginPath();
        ctx.moveTo(midX - 3, y);
        ctx.lineTo(midX + 3, y);
        ctx.stroke();
      }
      break;
    }

    case 'cube': {
      const offset = Math.min(w * 0.35, h * 0.35, 45);
      // Front rectangle
      ctx.beginPath();
      ctx.rect(minX, minY + offset, w - offset, h - offset);
      ctx.stroke();

      // Back rectangle
      ctx.beginPath();
      ctx.rect(minX + offset, minY, w - offset, h - offset);
      ctx.stroke();

      // Connecting edges
      ctx.beginPath();
      ctx.moveTo(minX, minY + offset);
      ctx.lineTo(minX + offset, minY);

      ctx.moveTo(minX + (w - offset), minY + offset);
      ctx.lineTo(minX + w, minY);

      ctx.moveTo(minX, minY + h);
      ctx.lineTo(minX + offset, minY + (h - offset) + offset);

      ctx.moveTo(minX + (w - offset), minY + h);
      ctx.lineTo(minX + w, minY + (h - offset) + offset);
      ctx.stroke();
      break;
    }

    case 'cylinder': {
      const capH = Math.min(24, h * 0.2);
      const rx = w / 2;
      const ry = capH / 2;
      const cx = minX + rx;

      // Top ellipse
      ctx.beginPath();
      ctx.ellipse(cx, minY + ry, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom half-ellipse
      ctx.beginPath();
      ctx.ellipse(cx, minY + h - ry, rx, ry, 0, 0, Math.PI);
      ctx.stroke();

      // Bottom back dashed curve
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.ellipse(cx, minY + h - ry, rx, ry, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Side lines
      ctx.beginPath();
      ctx.moveTo(minX, minY + ry);
      ctx.lineTo(minX, minY + h - ry);
      ctx.moveTo(minX + w, minY + ry);
      ctx.lineTo(minX + w, minY + h - ry);
      ctx.stroke();
      break;
    }

    default:
      break;
  }

  ctx.restore();
}
