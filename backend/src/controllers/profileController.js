const prisma = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get current user profile
 * @route   GET /api/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        addresses: true,
        orders: {
          include: {
            product: true,
            payments: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Calculate stats
    const totalOrders = user.orders.length;
    const activeOrders = user.orders.filter(o => 
      ['OrderSubmitted', 'PaymentConfirmed', 'UnderProcess'].includes(o.status)
    ).length;

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          totalOrders,
          activeOrders
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, username, phone, email } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser && existingUser.id !== req.user.id) {
        return next(new ErrorResponse('Username already taken', 400));
      }
    }

    // Check if phone is already taken by another user
    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { 
          phone,
          NOT: { id: req.user.id }
        }
      });

      if (existingPhone) {
        return next(new ErrorResponse('Phone number already in use', 400));
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(username && { username }),
        ...(phone && { phone }),
        ...(email && { email })
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/profile/picture
 * @access  Private
 */
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image', 400));
    }

    const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePicture: profilePictureUrl }
    });

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { 
        user: userWithoutPassword,
        profilePicture: profilePictureUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user preferences
 * @route   GET /api/profile/preferences
 * @access  Private
 */
exports.getPreferences = async (req, res, next) => {
  try {
    // For now, return default preferences
    // In production, you'd store these in a separate table
    const preferences = {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      promotionalEmails: false,
      newsletter: false,
      language: 'en',
      currency: 'ETB',
      paymentMethod: 'Chapa'
    };

    res.status(200).json({
      success: true,
      data: { preferences }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/profile/preferences
 * @access  Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const preferences = req.body;

    // In production, save to database
    // For now, just return success

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit feedback
 * @route   POST /api/profile/feedback
 * @access  Private
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const { category, rating, subject, message } = req.body;

    if (!subject || !message) {
      return next(new ErrorResponse('Please provide subject and message', 400));
    }

    // In production, save feedback to database
    // For now, just log it
    console.log('Feedback received:', {
      userId: req.user.id,
      category,
      rating,
      subject,
      message,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Contact support
 * @route   POST /api/profile/support
 * @access  Private
 */
exports.contactSupport = async (req, res, next) => {
  try {
    const { priority, category, subject, description, orderId } = req.body;

    if (!subject || !description) {
      return next(new ErrorResponse('Please provide subject and description', 400));
    }

    // In production, create support ticket in database
    // For now, just log it
    console.log('Support request received:', {
      userId: req.user.id,
      priority,
      category,
      subject,
      description,
      orderId,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Support ticket created successfully. We will get back to you within 24 hours.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get notifications
 * @route   GET /api/profile/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res, next) => {
  try {
    // In production, fetch from database
    // For now, return mock notifications
    const notifications = [
      {
        id: 1,
        type: 'order',
        title: 'Order Confirmed',
        message: 'Your order has been confirmed and is being processed.',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        type: 'payment',
        title: 'Payment Successful',
        message: 'Your payment has been processed successfully.',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/profile/notifications/:id/read
 * @access  Private
 */
exports.markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // In production, update in database
    // For now, just return success

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};
