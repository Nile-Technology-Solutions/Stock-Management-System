const {
    generateStockReport,
    generateProductionReport,
    generateOrdersReport,
    generatePaymentsReport,
    generateSalesReport
} = require('../services/reportService');
const { toCSV, toPDF } = require('../utils/reportFormatter');

/**
 * Helper to handle the response format based on query param
 */
const handleReportResponse = (res, data, format, title) => {
    try {
        if (format === 'csv') {
            const csvData = toCSV(data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_').toLowerCase()}.csv"`);
            return res.status(200).send(csvData);
        } else if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_').toLowerCase()}.pdf"`);
            toPDF(data, title, (pdfBuffer) => {
                return res.status(200).send(pdfBuffer);
            });
        } else {
            // Default to JSON
            return res.status(200).json(data);
        }
    } catch (error) {
        console.error(`Error formatting report [${format}]:`, error);
        return res.status(500).json({ error: 'Failed to format the report' });
    }
};

/**
 * Extracts and parses common query parameters
 */
const extractFilters = (req) => {
    const { from_date, to_date, format } = req.query;
    const filters = {};

    if (from_date) {
        // Parse as start of the day
        filters.fromDate = new Date(from_date);
    }
    if (to_date) {
        // Parse as end of the day to include the whole day
        filters.toDate = new Date(to_date);
        filters.toDate.setHours(23, 59, 59, 999);
    }

    return { filters, format: (format || 'json').toLowerCase() };
};

exports.getStockReport = async (req, res, next) => {
    try {
        const { format } = extractFilters(req);
        const reportData = await generateStockReport();
        handleReportResponse(res, reportData, format, 'Stock Report');
    } catch (error) {
        next(error);
    }
};

exports.getProductionReport = async (req, res, next) => {
    try {
        const { filters, format } = extractFilters(req);
        const reportData = await generateProductionReport(filters);
        handleReportResponse(res, reportData, format, 'Production Report');
    } catch (error) {
        next(error);
    }
};

exports.getOrdersReport = async (req, res, next) => {
    try {
        const { filters, format } = extractFilters(req);
        const reportData = await generateOrdersReport(filters);
        handleReportResponse(res, reportData, format, 'Orders Report');
    } catch (error) {
        next(error);
    }
};

exports.getPaymentsReport = async (req, res, next) => {
    try {
        const { filters, format } = extractFilters(req);
        const reportData = await generatePaymentsReport(filters);
        handleReportResponse(res, reportData, format, 'Payments Report');
    } catch (error) {
        next(error);
    }
};

exports.getSalesReport = async (req, res, next) => {
    try {
        const { filters, format } = extractFilters(req);
        // Sales report might format the entire response differently per swagger spec
        const reportData = await generateSalesReport(filters);
        handleReportResponse(res, reportData, format, 'Sales Report');
    } catch (error) {
        next(error);
    }
};
