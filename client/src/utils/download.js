/**
 * Downloads a PDF of the provided SVG for the user.
 *
 * @see https://jsfiddle.net/klesun/zg4qbwd8/42/ for source
 *
 * @param {string} svg a string holding the standard HTML representation of
 * an SVG to download for the user
 */
const svgToPdfDownload = (svg) => {
  /* Assumes that PDFDocument is available on window by using the following
  script tag:
  <script src="https://cdn.jsdelivr.net/npm/pdfkit@0.10.0/js/pdfkit.standalone.js"></script>
  */
  const doc = new window.PDFDocument();
  const chunks = [];
  doc.pipe({
    // writable stream implementation
    write: (chunk) => chunks.push(chunk),
    end: () => {
      const pdfBlob = new Blob(chunks, {
        type: 'application/pdf',
      });
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl);
    },
    // readable streaaam stub iplementation
    on: () => {},
    once: () => {},
    emit: () => {},
  });

  window.SVGtoPDF(doc, svg, 20, 20);

  doc.end();
};

export default svgToPdfDownload;
