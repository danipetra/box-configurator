import * as pdfjsLib from 'pdfjs-dist';

// NOTE: in Next (client), bisogna impostare workerSrc
// useremo il worker dal CDN con la versione runtime
export async function pdfFirstPageToDataUrl(file: File, scale = 2): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  // the current pdfjs types require the canvas element itself in the parameters
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;

  return canvas.toDataURL('image/png');
}