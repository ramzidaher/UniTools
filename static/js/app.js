document.getElementById('upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const files = document.getElementById('pdf').files;
    const pdfLib = window['pdf-lib'];
    
    const mergedPdf = await pdfLib.PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
  
    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    
    // trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'merged.pdf';
    link.click();
  });
  