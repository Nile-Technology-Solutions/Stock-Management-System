const prisma = require('../config/db');
const { validateStockCreate, validateStockUpdate } = require('../utils/validation');

/**
 * Create a new stock item
 * @route POST /api/stock
 * @access Admin only
 * @param {Object} req.body - Stock item data
 * @returns {Object} Created stock item with 201 status
 */
const createStock = async (req, res, next) => {
  try {
    // Validate request body
    const validationErrors = validateStockCreate(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Extract validated data
    const { name, quantity, color, size, thickness, laminated, origin, typeNote } = req.body;

    // Create stock item in database
    const stock = await prisma.stockMaterial.create({
      data: {
        name,
        quantity,
        color,
        size,
        thickness,
        laminated: laminated !== undefined ? laminated : false,
        origin,
        typeNote: typeNote || null
      }
    });

    // Return created item with 201 status
    return res.status(201).json({
      data: stock,
      message: 'Stock item created successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing stock item
 * @route PUT /api/stock/:id
 * @access Admin only
 * @param {Object} req.params.id - Stock item ID
 * @param {Object} req.body - Partial stock item data to update
 * @returns {Object} Updated stock item
 */
const updateStock = async (req, res, next) => {
  try {
    // Parse and validate ID parameter
    const idParam = req.params.id;
    const id = parseInt(idParam);

    // Check if ID is valid (must be a positive integer)
    if (isNaN(id) || id <= 0 || idParam !== id.toString()) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }

    // Validate request body for partial updates
    const validationErrors = validateStockUpdate(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if stock item exists
    const existingStock = await prisma.stockMaterial.findUnique({
      where: { id }
    });

    if (!existingStock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Build update data object (only include provided fields)
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.quantity !== undefined) updateData.quantity = req.body.quantity;
    if (req.body.color !== undefined) updateData.color = req.body.color;
    if (req.body.size !== undefined) updateData.size = req.body.size;
    if (req.body.thickness !== undefined) updateData.thickness = req.body.thickness;
    if (req.body.laminated !== undefined) updateData.laminated = req.body.laminated;
    if (req.body.origin !== undefined) updateData.origin = req.body.origin;
    if (req.body.typeNote !== undefined) updateData.typeNote = req.body.typeNote;

    // Update stock item in database
    const stock = await prisma.stockMaterial.update({
      where: { id },
      data: updateData
    });

    // Return updated item
    return res.status(200).json({
      data: stock,
      message: 'Stock item updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete a stock item
 * @route DELETE /api/stock/:id
 * @access Admin only
 * @param {Object} req.params.id - Stock item ID
 * @returns {Object} Success message
 */
const deleteStock = async (req, res, next) => {
  try {
    // Parse and validate ID parameter
    const idParam = req.params.id;
    const id = parseInt(idParam);

    // Check if ID is valid (must be a positive integer)
    if (isNaN(id) || id <= 0 || idParam !== id.toString()) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }

    // Check if stock item exists
    const existingStock = await prisma.stockMaterial.findUnique({
      where: { id }
    });

    if (!existingStock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Delete stock item from database
    await prisma.stockMaterial.delete({
      where: { id }
    });

    // Return success message
    return res.status(200).json({
      message: 'Stock item deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all stock items with optional filtering
 * @route GET /api/stock
 * @access Authenticated users
 * @param {Object} req.query.origin - Optional origin filter (Local/Imported)
 * @param {Object} req.query.laminated - Optional laminated filter (true/false)
 * @returns {Object} Array of stock items
 */
const getAllStock = async (req, res, next) => {
  try {
    // Build filter object for optional filtering
    const where = {};
    
    if (req.query.origin) {
      where.origin = req.query.origin;
    }
    
    if (req.query.laminated !== undefined) {
      where.laminated = req.query.laminated === 'true';
    }
    
    // Query database for stock items
    const items = await prisma.stockMaterial.findMany({
      where,
      orderBy: {
        id: 'asc'
      }
    });
    
    // Return stock items
    return res.status(200).json(items);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single stock item by ID
 * @route GET /api/stock/:id
 * @access Authenticated users
 * @param {Object} req.params.id - Stock item ID
 * @returns {Object} Stock item data
 */
const getStockById = async (req, res, next) => {
  try {
    // Parse and validate ID parameter
    const idParam = req.params.id;
    const id = parseInt(idParam);
    
    // Check if ID is valid (must be a positive integer)
    if (isNaN(id) || id <= 0 || idParam !== id.toString()) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }
    
    // Query database for stock item
    const stock = await prisma.stockMaterial.findUnique({
      where: { id }
    });
    
    // Return 404 if not found
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    
    // Return stock item
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
