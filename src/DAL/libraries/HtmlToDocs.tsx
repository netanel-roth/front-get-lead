// מאחר ש-React הוא סביבת צד לקוח,
//  לא נוכל לייצר ולהוריד קבצי Word ישירות מהדפדפן כמו שנעשה ב-PHP,
//  אבל נשתמש בטכניקות צד לקוח כדי ליצור מסמך HTML ולהוריד אותו כקובץ Word.
import React, { useState } from 'react';

const HTMLToDoc: React.FC = () => {
    const [docFile, setDocFile] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [htmlHead, setHtmlHead] = useState<string>('');
    const [htmlBody, setHtmlBody] = useState<string>('');

    // פונקציה ליצירת שם הקובץ
    const setDocFileName = (fileName: string) => {
        let file = fileName;
        if (!file.match(/\.doc$/i) && !file.match(/\.docx$/i)) {
            file += '.doc';
        }
        setDocFile(file);
    };

    // יצירת ה-Header למסמך ה-Word
    const getHeader = (): string => {
        return `
      <html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
      xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="ProgId" content="Word.Document">
          <meta name="Generator" content="Microsoft Word 9">
          <meta name="Originator" content="Microsoft Word 9">
          <style>
          @page { font-family: Open Sans; margin:14.2mm 17.5mm 14.2mm 16mm; }
          div.Section1 { page:Section1; font-family: 'Open Sans'; }
          </style>
          <title>${title}</title>
          ${htmlHead}
        </head>
        <body>
    `;
    };

    // יצירת ה-Footer למסמך ה-Word
    const getFooter = (): string => {
        return `</body></html>`;
    };

    // המרת HTML למסמך Word והורדה
    const createDoc = (html: string, fileName: string, download: boolean = false) => {
        setDocFileName(fileName);

        const doc = getHeader() + htmlBody + getFooter();

        if (download) {
            const blob = new Blob([doc], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = docFile;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.log('Document generated but not downloaded:', doc);
        }
    };

    // ניתוח HTML כדי להוציא את הכותרות והתוכן
    const parseHtml = (html: string) => {
        const cleanedHtml = html
            .replace(/<!DOCTYPE[^>]*>/ims, "")
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/ims, "");

        const headMatches = cleanedHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/ims);
        const bodyMatches = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/ims);

        const headContent = headMatches ? headMatches[1] : '';
        const bodyContent = bodyMatches ? bodyMatches[1] : cleanedHtml;

        const titleMatches = headContent.match(/<title[^>]*>([\s\S]*?)<\/title>/ims);
        const extractedTitle = titleMatches ? titleMatches[1] : '';

        setTitle(extractedTitle);
        setHtmlHead(headContent.replace(/<title[^>]*>([\s\S]*?)<\/title>/ims, ''));
        setHtmlBody(bodyContent);
    };

    return (
        <div>
            <h1>Convert HTML to DOC</h1>
            <textarea
                placeholder="Enter HTML content"
                rows={10}
                cols={50}
                onChange={(e) => parseHtml(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter file name"
                onChange={(e) => setDocFile(e.target.value)}
            />
            <button onClick={() => createDoc(htmlBody, docFile, true)}>Download DOC</button>
        </div>
    );
};

export default HTMLToDoc;
