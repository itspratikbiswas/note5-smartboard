/**
 * PDF & Slide Document Ingestion Engine
 * Extracts multi-page PDF documents and binds them as static background canvas layers.
 */

// Dynamically loads PDF.js script if not present
async function ensurePdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;

  return new Promise((resolve, reject) => {
    if (document.getElementById('pdfjs-script')) {
      const check = setInterval(() => {
        if (window.pdfjsLib) {
          clearInterval(check);
          resolve(window.pdfjsLib);
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.id = 'pdfjs-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Ingests a local PDF file and extracts all pages into high-resolution image data URLs
 */
export async function parsePdfDocument(file, onProgress) {
  const pdfjs = await ensurePdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pagesData = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) onProgress(pageNum, numPages);
    const page = await pdf.getPage(pageNum);
    
    // Scale for crisp 1080p / 4K presentation screens
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    pagesData.push({
      pageNum,
      totalPages: numPages,
      width: viewport.width,
      height: viewport.height,
      dataUrl,
      aspectRatio: viewport.width / viewport.height
    });
  }

  return {
    filename: file.name,
    totalPages: numPages,
    pages: pagesData
  };
}
