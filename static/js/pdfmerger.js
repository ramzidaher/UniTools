document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#browse-button').addEventListener('click', function() {
      document.querySelector('#pdfs-to-merge').click();
    });
  
    document.querySelector('#pdfs-to-merge').addEventListener('change', function() {
      const uploadedFiles = document.querySelector('.uploaded-pdfs-display');
      uploadedFiles.innerHTML = '';
      for (let i = 0; i < this.files.length; i++) {
        uploadedFiles.innerHTML += `<p>${this.files[i].name}</p>`;
      }
    });
  
    document.querySelector('#merge-pdfs-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const files = document.querySelector('#pdfs-to-merge').files;
      if (files.length < 2) {
        alert('Please select at least 2 PDFs to merge.');
        return;
      }
  
      const { PDFDocument } = PDFLib;
  
      const mergedPdf = await PDFDocument.create();
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileBuffer = await file.arrayBuffer();
        const pdfToMerge = await PDFDocument.load(fileBuffer);
  
        const pageCount = pdfToMerge.getPageCount();
        for (let j = 0; j < pageCount; j++) {
          const [page] = await mergedPdf.copyPages(pdfToMerge, [j]);
          mergedPdf.addPage(page);
        }
      }
  
      const mergedPdfFile = await mergedPdf.save();
  
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
  
      const link = document.createElement('a');
  
      link.href = URL.createObjectURL(blob);
      link.download = 'merged.pdf';
  
      document.body.appendChild(link);
  
      link.click();
  
      document.body.removeChild(link);
    });
  });
  