/**
 * MOCK Stock Controller - For testing without database
 * Use this while waiting for BE1 (database person) to create the schema
 * Replace with real stockController.js once database is ready
 */

// In-memory mock data (temporary)
let mockStockData = [
  {
    id: 1,
    name: 'Laminated MDF Board',
    quantity: 50,
    color: 'Dark Oak',
    size: '1220mm x 2440mm',
    thickness: '18mm',
    laminated: true,
    origin: 'Imported',
    typeNote: 'High-density water resistant',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Plywood Sheet',
    quantity: 30,
    color: 'Natural',
    size: '1220mm x 2440mm',
    thickness: '12mm',
    laminated: false,
    origin: 'Local',
    typeNote: 'Standard grade',
    lastUpdated: new Date().toISOString()
  }
];

let nextId = 3;

/**
 * Get all stock items with optional filtering
 */
const getAllStock = async (req, res, next) => {
  try {
    let items = [...mockStockData];
    
    // Apply filters
    if (req.query.origin) {
      items = items.filter(item => item.origin === req.query.origin);
    }
    
    if (req.query.laminated !== undefined) {
      const isLaminated = req.query.laminated === 'true';
      items = items.filter(item => item.laminated === isLaminated);
    }
    
    return res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single stock item by ID
 */
const getStockById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }
    
    const stock = mockStockData.find(item => item.id === id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    
    return res.status(200).json(stock);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new stock item
 */
const createStock = async (req, res, next) => {
  try {
    const { name, quantity, color, size, thickness, laminated, origin, typeNote } = req.body;
    
    // Basic validation
    if (!name || !color || !size || !thickness || !origin) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, color, size, thickness, origin' 
      });
    }
    
    if (origin !== 'Local' && origin !== 'Imported') {
      return res.status(400).json({ 
        message: 'Origin must be either "Local" or "Imported"' 
      });
    }
    
    const newStock = {
      id: nextId++,
      name,
      quantity: quantity || 0,
      color,
      size,
      thickness,
      laminated: laminated || false,
      origin,
      typeNote: typeNote || null,
      lastUpdated: new Date().toISOString()
    };
    
    mockStockData.push(newStock);
    
    return res.status(201).json({
      data: newStock,
      message: 'Stock item created successfully (MOCK)'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing stock item
 */
const updateStock = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }
    
    const index = mockStockData.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    
    // Update only provided fields
    const updatedStock = {
      ...mockStockData[index],
      ...req.body,
      id, // Keep original ID
      lastUpdated: new Date().toISOString()
    };
    
    mockStockData[index] = updatedStock;
    
    return res.status(200).json({
      data: updatedStock,
      message: 'Stock item updated successfully (MOCK)'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a stock item
 */
const deleteStock = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }
    
    const index = mockStockData.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    
    mockStockData.splice(index, 1);
    
    return res.status(200).json({
      message: 'Stock item deleted successfully (MOCK)'
    });
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
