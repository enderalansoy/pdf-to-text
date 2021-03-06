const PDFJS = require('pdfjs-dist');

const urlPDF = 'assets/test.pdf';
PDFJS.workerSrc = 'lib/pdf.worker.js';

function getPdf() {
  PDFJS.getDocument(urlPDF).then((pdf) => {
    let pdfDocument = pdf;
    let pagesPromises = [];
    for (let i = 0; i < pdf.pdfInfo.numPages; i++) {
      ((pageNumber) => {
        pagesPromises.push(getPageText(pageNumber, pdfDocument));
      })(i + 1);
    }
    Promise.all(pagesPromises).then((pagesText) => {
      const final = pagesText.join(' ');
      console.log(final);
    });
  }, (reason) => {
    console.error(reason);
  });
}

function getPageText(pageNum, PDFDocumentInstance) {
  return new Promise((resolve, reject) => {
    PDFDocumentInstance.getPage(pageNum).then((pdfPage) => {
      pdfPage.getTextContent().then((textContent) => {
        let textItems = textContent.items;
        let finalString = "";
        for (let i = 0; i < textItems.length; i++) {
          let item = textItems[i];
          finalString += item.str + " ";
        }
        resolve(finalString);
      });
    });
  });
}

getPdf();
