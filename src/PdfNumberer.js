import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import './PdfNumberer.css'; // Импортируем файл стилей

const PdfNumberer = () => {
    const [file, setFile] = useState(null);
    const [processedPdf, setProcessedPdf] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const addPageNumbers = async () => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const pdfBytes = new Uint8Array(e.target.result);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            pages.forEach((page, index) => {
                const { width, height } = page.getSize();
                page.drawText(`${index + 1}`, {
                    x: 7, // Отступ слева
                    y: 7, // Отступ снизу
                    size: 12,
                    color: rgb(0, 0, 0),
                });
            });

            const modifiedPdfBytes = await pdfDoc.save();
            setProcessedPdf(modifiedPdfBytes);
        };

        reader.readAsArrayBuffer(file);
    };

    const downloadPdf = () => {
        if (!processedPdf) return;

        const blob = new Blob([processedPdf], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'numbered-pdf.pdf';
        link.click();
    };

    return (
        <div className="container">
            <h1>Нумерация страниц PDF</h1>
            <div className="upload-section">
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
                <button onClick={addPageNumbers} disabled={!file} className="action-button">
                    Пронумеровать страницы
                </button>
            </div>
            {processedPdf && (
                <button onClick={downloadPdf} className="action-button download-button">
                    Скачать пронумерованный PDF
                </button>
            )}
        </div>
    );
};

export default PdfNumberer;