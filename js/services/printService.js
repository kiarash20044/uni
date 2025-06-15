// js/services/printService.js

/**
 * Exports a specific HTML element to a PDF document.
 * @param {string} elementId The ID of the HTML element to capture.
 * @param {string} pageTitle The title to be displayed at the top of the PDF.
 * @param {string} filename The desired filename for the downloaded PDF.
 */
export function exportElementToPdf(elementId, pageTitle, filename) {
    const { jsPDF } = window.jspdf;
    const elementToCapture = document.getElementById(elementId);

    if (!elementToCapture) {
        console.error("Element to capture not found!");
        return;
    }

    const printButton = elementToCapture.querySelector('.export-pdf-btn');
    if(printButton) printButton.style.display = 'none'; // Hide button during capture

    // Use html2canvas to render the element
    html2canvas(elementToCapture, {
        scale: 2, // Improve resolution
        backgroundColor: '#1A1A2E', // Match dark theme background
        useCORS: true // For any external images/fonts
    }).then(canvas => {
        if(printButton) printButton.style.display = 'block'; // Show button again

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p', // portrait
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // with some margin
        const imgHeight = imgWidth / ratio;

        // Header
        pdf.setFontSize(18);
        pdf.setTextColor('#EAEAEA');
        pdf.text(pageTitle, pdfWidth / 2, 15, { align: 'center' });

        // Add the captured image
        pdf.addImage(imgData