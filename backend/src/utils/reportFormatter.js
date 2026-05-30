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
 * Helper to format currency
 */
const formatCurrency = (value) => {
    return `ETB ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Helper to format date
 */
const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

/**
 * Helper to draw a table
 */
const drawTable = (doc, headers, rows, startY) => {
    const tableTop = startY;
    const itemHeight = 25;
    const columnWidth = (doc.page.width - 100) / headers.length;
    
    // Draw header
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((header, i) => {
        doc.rect(50 + i * columnWidth, tableTop, columnWidth, itemHeight)
           .fillAndStroke('#4F46E5', '#4F46E5');
        doc.fillColor('#FFFFFF')
           .text(header, 55 + i * columnWidth, tableTop + 8, {
               width: columnWidth - 10,
               align: 'left'
           });
    });

    // Draw rows
    doc.font('Helvetica').fontSize(9);
    rows.forEach((row, rowIndex) => {
        const y = tableTop + itemHeight + rowIndex * itemHeight;
        
        // Alternate row colors
        const fillColor = rowIndex % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
        doc.rect(50, y, doc.page.width - 100, itemHeight)
           .fillAndStroke(fillColor, '#E5E7EB');
        
        row.forEach((cell, colIndex) => {
            doc.fillColor('#1F2937')
               .text(String(cell), 55 + colIndex * columnWidth, y + 8, {
                   width: columnWidth - 10,
                   align: 'left'
               });
        });
    });

    return tableTop + itemHeight + rows.length * itemHeight + 20;
};

/**
 * Helper to draw summary cards
 */
const drawSummaryCards = (doc, cards, startY) => {
    const cardWidth = (doc.page.width - 100 - 20) / 3;
    const cardHeight = 80;
    
    cards.forEach((card, index) => {
        const x = 50 + index * (cardWidth + 10);
        
        // Card background with gradient effect
        doc.rect(x, startY, cardWidth, cardHeight)
           .fillAndStroke(card.color || '#3B82F6', card.color || '#3B82F6');
        
        // Card content
        doc.fillColor('#FFFFFF')
           .font('Helvetica').fontSize(10)
           .text(card.label, x + 10, startY + 15, { width: cardWidth - 20 });
        
        doc.font('Helvetica-Bold').fontSize(20)
           .text(card.value, x + 10, startY + 35, { width: cardWidth - 20 });
    });
    
    return startY + cardHeight + 30;
};

/**
 * Generate Stock Report PDF
 */
const generateStockReportPDF = (doc, data) => {
    let y = 150;
    
    // Summary cards
    const cards = [
        { label: 'Total Materials', value: data.totalMaterials || 0, color: '#3B82F6' },
        { label: 'Low Stock Items', value: data.lowStockItems || 0, color: '#EF4444' },
        { label: 'Healthy Stock', value: (data.totalMaterials || 0) - (data.lowStockItems || 0), color: '#10B981' }
    ];
    y = drawSummaryCards(doc, cards, y);
    
    // Materials table
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F2937')
       .text('Stock Materials', 50, y);
    y += 30;
    
    const headers = ['Material', 'Quantity', 'Unit', 'Min Stock', 'Status'];
    const rows = (data.materials || []).map(item => [
        item.name || 'Unknown',
        item.quantity || 0,
        item.unit || 'N/A',
        item.minStockLevel || 'N/A',
        (item.quantity || 0) < 10 ? 'Low Stock' : 'Normal'
    ]);
    
    drawTable(doc, headers, rows, y);
};

/**
 * Generate Production Report PDF
 */
const generateProductionReportPDF = (doc, data) => {
    let y = 150;
    
    // Summary cards
    const cards = [
        { label: 'Under Process', value: data.totalUnderProcess || 0, color: '#F59E0B' },
        { label: 'Completed', value: data.totalCompleted || 0, color: '#10B981' },
        { label: 'Rejected', value: data.totalRejected || 0, color: '#EF4444' }
    ];
    y = drawSummaryCards(doc, cards, y);
    
    // Production records table
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F2937')
       .text('Production Records', 50, y);
    y += 30;
    
    const headers = ['Product', 'Quantity', 'Status', 'Date'];
    const rows = (data.records || []).slice(0, 20).map(record => [
        record.productName || 'N/A',
        record.quantity || 0,
        record.status || 'Unknown',
        formatDate(record.createdAt)
    ]);
    
    drawTable(doc, headers, rows, y);
};

/**
 * Generate Orders Report PDF
 */
const generateOrdersReportPDF = (doc, data) => {
    let y = 150;
    
    // Summary cards
    const avgOrderValue = (data.totalOrders || 0) > 0 
        ? formatCurrency((data.totalRevenue || 0) / (data.totalOrders || 0))
        : 'ETB 0.00';
    
    const cards = [
        { label: 'Total Orders', value: data.totalOrders || 0, color: '#3B82F6' },
        { label: 'Total Revenue', value: formatCurrency(data.totalRevenue || 0), color: '#10B981' },
        { label: 'Avg Order Value', value: avgOrderValue, color: '#8B5CF6' }
    ];
    y = drawSummaryCards(doc, cards, y);
    
    // Orders table
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F2937')
       .text('Order Details', 50, y);
    y += 30;
    
    const headers = ['Order ID', 'Customer', 'Product', 'Quantity', 'Amount', 'Status'];
    const rows = (data.orders || []).slice(0, 20).map(order => [
        `#${order.id || 'N/A'}`,
        order.user?.fullName || 'N/A',
        order.product?.name || order.productName || 'N/A',
        order.quantity || 0,
        formatCurrency(order.totalPrice || 0),
        order.status || 'Unknown'
    ]);
    
    drawTable(doc, headers, rows, y);
};

/**
 * Generate Payments Report PDF
 */
const generatePaymentsReportPDF = (doc, data) => {
    let y = 150;
    
    // Summary cards
    const avgPayment = (data.totalPayments || 0) > 0 
        ? formatCurrency((data.totalAmount || 0) / (data.totalPayments || 0))
        : 'ETB 0.00';
    
    const successfulPayments = (data.payments || []).filter(p => 
        p.status === 'Completed' || p.status === 'Success'
    ).length;
    
    const cards = [
        { label: 'Total Amount', value: formatCurrency(data.totalAmount || 0), color: '#10B981' },
        { label: 'Total Payments', value: data.totalPayments || 0, color: '#3B82F6' },
        { label: 'Successful', value: successfulPayments, color: '#8B5CF6' }
    ];
    y = drawSummaryCards(doc, cards, y);
    
    // Payments table
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F2937')
       .text('Payment Details', 50, y);
    y += 30;
    
    const headers = ['Payment ID', 'Order ID', 'Amount', 'Method', 'Status', 'Date'];
    const rows = (data.payments || []).slice(0, 20).map(payment => [
        `#${payment.id || 'N/A'}`,
        `#${payment.orderId || 'N/A'}`,
        formatCurrency(payment.amount || 0),
        payment.paymentMethod || 'N/A',
        payment.status || 'Unknown',
        formatDate(payment.createdAt)
    ]);
    
    drawTable(doc, headers, rows, y);
};

/**
 * Generate Sales Report PDF
 */
const generateSalesReportPDF = (doc, data) => {
    let y = 150;
    
    // Summary cards
    const totalUnits = (data.topProducts || []).reduce((sum, p) => sum + (p.salesCount || 0), 0);
    
    const cards = [
        { label: 'Total Revenue', value: formatCurrency(data.totalSales || 0), color: '#10B981' },
        { label: 'Total Sales', value: data.totalSales || 0, color: '#3B82F6' },
        { label: 'Units Sold', value: totalUnits, color: '#8B5CF6' }
    ];
    y = drawSummaryCards(doc, cards, y);
    
    // Period info
    doc.font('Helvetica').fontSize(11).fillColor('#6B7280')
       .text(`Period: ${data.period || 'All Time'}`, 50, y);
    y += 30;
    
    // Top products table
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F2937')
       .text('Top Selling Products', 50, y);
    y += 30;
    
    const headers = ['Rank', 'Product Name', 'Units Sold', 'Revenue', 'Avg Price'];
    const rows = (data.topProducts || []).map((product, index) => {
        const avgPrice = (product.salesCount || 0) > 0 
            ? formatCurrency((product.revenue || 0) / (product.salesCount || 0))
            : 'ETB 0.00';
        
        return [
            `#${index + 1}`,
            product.productName || 'Unknown',
            product.salesCount || 0,
            formatCurrency(product.revenue || 0),
            avgPrice
        ];
    });
    
    drawTable(doc, headers, rows, y);
};

/**
 * Generates a professional PDF document
 * @param {Object|Array} data - The report data
 * @param {String} title - The title of the report
 * @param {Function} callback - Callback function that receives the final buffer
 */
const toPDF = (data, title, callback) => {
    const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        bufferPages: true
    });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        callback(pdfData);
    });

    // Header with gradient effect (simulated with rectangles)
    doc.rect(0, 0, doc.page.width, 120).fill('#4F46E5');
    
    // Company/Report Title
    doc.fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .fontSize(28)
       .text(title, 50, 40, { align: 'center' });
    
    // Generation date
    doc.fontSize(11)
       .font('Helvetica')
       .text(`Generated on: ${new Date().toLocaleString('en-US', { 
           dateStyle: 'full', 
           timeStyle: 'short' 
       })}`, 50, 85, { align: 'center' });

    // Determine report type and generate appropriate content
    if (title.includes('Stock')) {
        generateStockReportPDF(doc, data);
    } else if (title.includes('Production')) {
        generateProductionReportPDF(doc, data);
    } else if (title.includes('Orders')) {
        generateOrdersReportPDF(doc, data);
    } else if (title.includes('Payments')) {
        generatePaymentsReportPDF(doc, data);
    } else if (title.includes('Sales')) {
        generateSalesReportPDF(doc, data);
    } else {
        // Generic fallback
        let y = 150;
        doc.font('Helvetica').fontSize(12).fillColor('#1F2937');
        doc.text(JSON.stringify(data, null, 2), 50, y);
    }

    // Footer
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        
        // Footer line
        doc.rect(50, doc.page.height - 50, doc.page.width - 100, 1)
           .fill('#E5E7EB');
        
        // Page number
        doc.font('Helvetica').fontSize(9).fillColor('#6B7280')
           .text(
               `Page ${i + 1} of ${pages.count}`,
               50,
               doc.page.height - 35,
               { align: 'center' }
           );
    }

    // Finalize PDF file
    doc.end();
};

module.exports = {
    toCSV,
    toPDF
};
