/**
 * Adds a visible text watermark to a PDF download link.
 * Since we can't modify the original PDF in the browser without a full PDF library,
 * we use an overlay approach: open the PDF in an iframe with a watermark CSS overlay.
 *
 * For production, watermarking should happen server-side using a library like
 * pdf-lib or HummusJS to embed the watermark directly into the PDF bytes.
 */

/**
 * Generate a watermarked download URL by creating a blob with watermark metadata.
 * This is a client-side approximation. For actual PDF watermarking, use the
 * server-side endpoint.
 */
export function getWatermarkText(userName: string): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return `Confidential — Prepared for ${userName} — ${date}`;
}

/**
 * Open a PDF in a new window with a watermark overlay.
 * The overlay is CSS-based and appears when viewing/printing.
 */
export function openWatermarkedPdf(fileUrl: string, userName: string): void {
  const watermark = getWatermarkText(userName);
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Kingdom Investors — Watermarked Document</title>
  <style>
    * { margin: 0; padding: 0; }
    body { width: 100vw; height: 100vh; overflow: hidden; position: relative; }
    iframe { width: 100%; height: 100%; border: none; }
    .watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .watermark span {
      font-family: 'DM Sans', Arial, sans-serif;
      font-size: 18px;
      color: rgba(201, 168, 76, 0.12);
      transform: rotate(-35deg);
      white-space: nowrap;
      user-select: none;
    }
    @media print {
      .watermark span {
        color: rgba(201, 168, 76, 0.25) !important;
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body>
  <iframe src="${fileUrl}"></iframe>
  <div class="watermark">
    <span>${watermark}</span>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
