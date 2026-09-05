import { jsPDF } from 'jspdf';
import { renderStroke } from './smoothStroke';
import { drawShape } from './shapeDrawer';

/**
 * Renders a single page state onto a temporary offscreen canvas for crisp export
 */
export function renderPageStateToCanvas(page, width, height, bgType = 'chalkboard') {
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d');

  // Background color mapping
  if (bgType === 'chalkboard' || bgType === 'green') {
    ctx.fillStyle = '#1e3f20';
  } else if (bgType === 'black') {
    ctx.fillStyle = '#121316';
  } else if (bgType === 'navy') {
    ctx.fillStyle = '#0f172a';
  } else {
    ctx.fillStyle = '#ffffff';
  }
  ctx.fillRect(0, 0, width, height);

  // Optional background grid rendering for clean PDF view
  if (bgType.includes('grid')) {
    ctx.strokeStyle = (bgType === 'white' || bgType === 'white-grid') ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Draw committed strokes
  if (page.strokes && page.strokes.length > 0) {
    page.strokes.forEach(stroke => {
      renderStroke(ctx, stroke);
    });
  }

  // Draw committed shapes
  if (page.shapes && page.shapes.length > 0) {
    page.shapes.forEach(shape => {
      drawShape(ctx, shape);
    });
  }

  // Draw STEM apparatus objects
  if (page.stemObjects && page.stemObjects.length > 0) {
    page.stemObjects.forEach(obj => {
      if (obj.imgElement) {
        ctx.drawImage(obj.imgElement, obj.x, obj.y, obj.width, obj.height);
      }
    });
  }

  return offscreen;
}

/**
 * Exports all whiteboard pages to a multi-page PDF
 */
export async function exportMultiPagePdf(pages, sessionTitle = 'Note5-Classroom-Notes') {
  if (!pages || pages.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1920, 1080],
    hotfixes: ['px_scaling']
  });

  const width = 1920;
  const height = 1080;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (i > 0) {
      pdf.addPage([width, height], 'landscape');
    }

    const canvas = renderPageStateToCanvas(page, width, height, page.bgType || 'chalkboard');
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

    // Footer page number stamp
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(16);
    pdf.text(`${sessionTitle}  •  Page ${i + 1} of ${pages.length}`, 40, height - 30);
  }

  const filename = `${sessionTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
  pdf.save(filename);
}

/**
 * Exports the active page as a high-resolution PNG or JPEG
 */
export function exportCurrentPageImage(page, bgType = 'chalkboard', format = 'png', title = 'Note5-Board') {
  const width = window.innerWidth * window.devicePixelRatio || 1920;
  const height = window.innerHeight * window.devicePixelRatio || 1080;

  const canvas = renderPageStateToCanvas(page, width, height, bgType);
  const mimeType = format === 'jpeg' || format === 'jpg' ? 'image/jpeg' : 'image/png';
  const imgData = canvas.toDataURL(mimeType, 0.95);

  const link = document.createElement('a');
  link.download = `${title}_Page_${Date.now()}.${format}`;
  link.href = imgData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports the entire whiteboard session state to a JSON file for later reopening
 */
export function exportSessionJson(pages, activePageIndex = 0, title = 'Note5-Session') {
  const cleanPages = pages.map(p => ({
    id: p.id,
    bgType: p.bgType,
    strokes: p.strokes || [],
    shapes: p.shapes || [],
    stemObjects: (p.stemObjects || []).map(o => ({
      id: o.id,
      stemId: o.stemId,
      x: o.x,
      y: o.y,
      width: o.width,
      height: o.height,
      name: o.name
    }))
  }));

  const sessionData = {
    version: '1.0.0',
    app: 'Note5 Smart Board',
    createdAt: new Date().toISOString(),
    title,
    activePageIndex,
    pages: cleanPages
  };

  const jsonStr = JSON.stringify(sessionData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${title}_${Date.now()}.note5`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
