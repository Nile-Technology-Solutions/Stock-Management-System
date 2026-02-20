const productService = require('../services/productService');

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts(req.query);
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam
        const product = await productService.getProductById(id);
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        return res.status(201).json({ data: product, message: 'Product created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam
        const product = await productService.updateProduct(id, req.body);
        return res.status(200).json({ data: product, message: 'Product updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam
        await productService.deleteProduct(id);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
