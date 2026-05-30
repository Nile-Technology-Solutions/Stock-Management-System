const stockService = require('../services/stockService');

const createStock = async (req, res, next) => {
  try {
    const stock = await stockService.createStock(req.body);
    return res.status(201).json({ data: stock, message: 'Stock item created successfully' });
  } catch (error) {
    next(error);
  }
};


const updateStock = async (req, res, next) => {
  try {
    const id = req.params.id; // normalized by id validator middleware
    const updateData = { ...req.body };
    const stock = await stockService.updateStock(id, updateData);
    return res.status(200).json({ data: stock, message: 'Stock item updated successfully' });
  } catch (error) {
    next(error);
  }
};


const deleteStock = async (req, res, next) => {
  try {
    const id = req.params.id; // normalized by id validator middleware
    await stockService.deleteStock(id);
    return res.status(200).json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    next(error);
  }
};


const getAllStock = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.origin) where.origin = req.query.origin;
    if (req.query.laminated !== undefined) where.laminated = req.query.laminated === 'true';

    const items = await stockService.getAllStock(where);
    return res.status(200).json(items);
    
  } catch (error) {
    next(error);
  }
};


const getStockById = async (req, res, next) => {
  try {
    const id = req.params.id; // normalized by id validator middleware
    const stock = await stockService.getStockById(id);
    return res.status(200).json(stock);
    
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllStock,
  getStockById,
  createStock,
  updateStock,
  deleteStock
};
