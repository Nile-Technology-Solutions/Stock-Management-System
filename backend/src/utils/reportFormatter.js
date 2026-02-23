const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

/**
 * Converts JSON data to CSV string
 * @param {Array<Object>} data - The data array to convert
 * @returns {String} The CSV string
 */
const toCSV = (data) => {
    if (!data || data.length === 0) {
        return '';
    }
    const parser = new Parser();
    return parser.parse(data);
};

/**
 * Generates a PDF document as a stream of buffers
 * @param {Object|Array} data - The report data
 * @param {String} title - The title of the report
 * @param {Function} callback - Callback function that receives the final buffer
 */
const toPDF = (data, title, callback) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        callback(pdfData);
    });

    // Header
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown(2);

    // Content
    doc.fontSize(12);

    // Format data based on its type
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            doc.text(`--- Item ${index + 1} ---`);
            Object.entries(item).forEach(([key, value]) => {
                // Stringify complex objects or dates
                let displayValue = value;
                if (value instanceof Date) {
                    displayValue = value.toLocaleString();
                } else if (typeof value === 'object' && value !== null) {
                    displayValue = JSON.stringify(value);
                }

                doc.text(`${key}: ${displayValue}`);
            });
            doc.moveDown();
        });
    } else if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
            // Handle nested arrays (like records in a report)
            if (Array.isArray(value)) {
                doc.moveDown();
                doc.font('Helvetica-Bold').text(`${key.toUpperCase()}:`);
                doc.font('Helvetica').moveDown(0.5);
                value.forEach((item, index) => {
                    doc.text(`[${index + 1}] `);
                    Object.entries(item).forEach(([subKey, subValue]) => {
                        let displayValue = subValue;
                        if (subValue instanceof Date) {
                            displayValue = subValue.toLocaleString();
                        } else if (typeof subValue === 'object' && subValue !== null) {
                            displayValue = JSON.stringify(subValue);
                        }
                        doc.text(`   ${subKey}: ${displayValue}`);
                    });
                    doc.moveDown(0.5);
                });
            } else {
                let displayValue = value;
                if (value instanceof Date) {
                    displayValue = value.toLocaleString();
                } else if (typeof value === 'object' && value !== null) {
                    displayValue = JSON.stringify(value);
                }
                doc.font('Helvetica-Bold').text(`${key}: `, { continued: true }).font('Helvetica').text(displayValue);
            }
        });
    } else {
        doc.text(String(data));
    }

    // Finalize PDF file
    doc.end();
};

module.exports = {
    toCSV,
    toPDF
};
