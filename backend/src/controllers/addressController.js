const prisma = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all addresses for current user
 * @route   GET /api/addresses
 * @access  Private
 */
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    next(error);
  }
};

/**
 * @desc    Create a new address
 * @route   POST /api/addresses
 * @access  Private
 */
exports.createAddress = async (req, res, next) => {
  try {
    const { street, city, state, country, zipCode, isDefault } = req.body;

    if (!street || !city) {
      return next(new ErrorResponse('Street and city are required', 400));
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: req.user.id,
          isDefault: true
        },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        street,
        city,
        state: state || null,
        country: country || 'Ethiopia',
        zipCode: zipCode || null,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Create address error:', error);
    next(error);
  }
};

/**
 * @desc    Update an address
 * @route   PUT /api/addresses/:id
 * @access  Private
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { street, city, state, country, zipCode, isDefault } = req.body;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingAddress) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: req.user.id,
          isDefault: true,
          NOT: { id: parseInt(id) }
        },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        ...(street && { street }),
        ...(city && { city }),
        ...(state !== undefined && { state }),
        ...(country && { country }),
        ...(zipCode !== undefined && { zipCode }),
        ...(isDefault !== undefined && { isDefault })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Update address error:', error);
    next(error);
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/addresses/:id
 * @access  Private
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingAddress) {
      return next(new ErrorResponse('Address not found', 404));
    }

    await prisma.address.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    next(error);
  }
};
