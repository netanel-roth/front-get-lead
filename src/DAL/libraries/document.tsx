import axios from 'axios';
import React from 'react';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';

interface DocumentLibraryProps {
  apiUrl: string;
  pdfApiKey: string;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ apiUrl, pdfApiKey }) => {
  // פונקציה למיזוג קבצי PDF
  const mergePdf = async (files: File[], outputPdfName: string): Promise<void> => {
    try {
      if (!files.length) {
        console.error('No files to merge');
        return;
      }
      const pdfDocs = [];
      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        pdfDocs.push(pdfDoc);
      }
      const mergedPdf = await PDFDocument.create();
      for (const pdfDoc of pdfDocs) {
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, outputPdfName); // שמירת קובץ ה-PDF הממוזג
    } catch (error) {
      console.error('Error merging PDF:', error);
    }
  };

  // פונקציה להמרת תמונה ל-PDF
  const imageToPdf = async (imageUrl: string, outputPdfName: string): Promise<void> => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const imageBlob = response.data;
      const pdfDoc = await PDFDocument.create();
      const imageBytes = await imageBlob.arrayBuffer();
      const image = await pdfDoc.embedJpg(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, outputPdfName); // שמירת קובץ ה-PDF שנוצר מהתמונה
    } catch (error) {
      console.error('Error converting image to PDF:', error);
    }
  };

  // פונקציה להמרת מסמך ל-PDF באמצעות API
  const docToPdf = async (documentUrl: string, outputPdfName: string): Promise<void> => {
    try {
      const postData = {
        doc_base64: btoa(await (await fetch(documentUrl)).text()), // קידוד המסמך ל-Base64
      };
      const response = await axios.post(apiUrl, postData, {
        headers: {
          'Authorization': `Bearer ${pdfApiKey}`, // שליחת מפתח ה-API לאימות
        },
      });
      if (response.status === 200 && response.data) {
        const pdfBytes = atob(response.data); // פענוח המידע שהתקבל מ-Base64
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, outputPdfName); // שמירת קובץ ה-PDF שנוצר
      } else {
        console.error('Failed to convert document to PDF.');
      }
    } catch (error) {
      console.error('Error converting document to PDF:', error);
    }
  };

  return (
    <div>
      <h2>Document Library</h2>
      {/* הוסיפו כאן רכיבי ממשק משתמש הקשורים למסמכים */}
    </div>
  );
};

export default DocumentLibrary;