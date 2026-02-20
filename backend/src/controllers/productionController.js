const productionService = require('../services/productionService');

const getAllProduction = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.status) where.status = req.query.status;
        if (req.query.category) where.category = req.query.category;

        const records = await productionService.getAllProduction(where);
        return res.status(200).json(records);
    } catch (error) {
        next(error);
    }
};

const getProductionById = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam
        const record = await productionService.getProductionById(id);
        return res.status(200).json(record);
    } catch (error) {
        next(error);
    }
};

const createProduction = async (req, res, next) => {
    try {
        // Extract photo paths from multer-uploaded files
        const photos = req.files ? req.files.map(f => `/uploads/production/${f.filename}`) : [];
        const data = { ...req.body, photos };

        // Parse progressPercentage from form-data string to integer
        if (data.progressPercentage !== undefined) {
            data.progressPercentage = parseInt(data.progressPercentage, 10);
        }

        const record = await productionService.createProduction(data);
        return res.status(201).json({ data: record, message: 'Production record created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateProduction = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam
        const photos = req.files ? req.files.map(f => `/uploads/production/${f.filename}`) : [];
        const updateData = { ...req.body };

        // Only include photos if new files were uploaded
        if (photos.length > 0) {
            updateData.photos = photos;
        }

        // Parse progressPercentage from form-data string to integer
        if (updateData.progressPercentage !== undefined) {
            updateData.progressPercentage = parseInt(updateData.progressPercentage, 10);
        }

        const record = await productionService.updateProduction(id, updateData);
        return res.status(200).json({ data: record, message: 'Production record updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteProduction = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam
        await productionService.deleteProduction(id);
        return res.status(200).json({ message: 'Production record deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProduction,
    getProductionById,
    createProduction,
    updateProduction,
    deleteProduction,
};
