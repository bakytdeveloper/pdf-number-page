import React, { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import './PdfNumberer.css';

const PdfNumberer = () => {
    const [file, setFile] = useState(null);
    const [processedPdf, setProcessedPdf] = useState(null);
    const fileInputRef = useRef(null); // Создаю ссылку на инпут

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
        if (!processedPdf || !file) return;

        const blob = new Blob([processedPdf], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Формируем имя файла
        const originalFileName = file.name.replace(/\.pdf$/i, ''); // Убираю расширение .pdf, если есть
        link.download = `${originalFileName}_numbered.pdf`; // Добавляю суффикс

        link.click();

        // Сбрасываю состояние и инпут
        setFile(null);
        setProcessedPdf(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container">
            <h1>Нумерация страниц PDF файлов</h1>
            <div className="upload-section">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input"
                    ref={fileInputRef}
                />
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