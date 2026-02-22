const prisma = require('../config/db');

/**
 * GET /api/orders
 * Admin & SuperAdmin only
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { Payment: true }
    });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};


/**
 * GET /api/orders/:id
 * Authenticated users
 */
const getOrderById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ message: 'Invalid order ID' });

    const order = await prisma.order.findUnique({
      where: { id },
      include: { Payment: true }
    });

    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    // Customers can only see their own orders
    if (req.user.role === 'Customer' && order.clientName !== req.user.name) {
      return res.status(403).json({ message: 'forbidden' });
    }

    return res.status(200).json(order);

  } catch (error) {
    next(error);
  }
};


/**
 * POST /api/orders
 * Customer places order
 */
const createOrder = async (req, res, next) => {
  try {
    const { productName, quantity, address } = req.body;

    if (!productName || !quantity)
      return res.status(400).json({ message: 'productName and quantity are required' });

    if (quantity <= 0)
      return res.status(400).json({ message: 'Quantity must be greater than 0' });

    // Validate product exists (BE2 link)
    const product = await prisma.product.findFirst({
      where: { name: productName }
    });

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const order = await prisma.order.create({
      data: {
        productName: product.name,
        quantity,
        clientName: req.user.name,
        phone: req.user.phone || '',
        address: address || null,
        status: 'OrderSubmitted'
      }
    });

    return res.status(201).json({
      message: 'Order placed successfully',
      data: order
    });

  } catch (error) {
    next(error);
  }
};


/**
 * PUT /api/orders/:id
 * Admin/SuperAdmin updates status
 */
const updateOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ message: 'Invalid order ID' });

    const { status } = req.body;

   const validStatuses = ['OrderSubmitted', 'PaymentConfirmed'];

    if (!status || !validStatuses.includes(status))
      return res.status(400).json({
        message: `Invalid status. Allowed: ${validStatuses.join(', ')}`
      });

    const existingOrder = await prisma.order.findUnique({ where: { id } });

    if (!existingOrder)
      return res.status(404).json({ message: 'Order not found' });

    // Enforce status flow
    if (
      existingOrder.status === 'PaymentConfirmed' &&
      status === 'OrderSubmitted'
    ) {
      return res.status(400).json({
        message: 'Cannot revert status back to OrderSubmitted'
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { Payment: true }
    });

    return res.status(200).json({
      message: 'Order updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    next(error);
  }
};


/**
 * DELETE /api/orders/:id
 * SuperAdmin only
 */
const deleteOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ message: 'Invalid order ID' });

    const existingOrder = await prisma.order.findUnique({ where: { id } });

    if (!existingOrder)
      return res.status(404).json({ message: 'Order not found' });

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } })
    ]);

    return res.status(200).json({
      message: 'Order deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
// const prisma = require('../config/db');
// const getAllOrders = async (req, res, next) => {
//   try {
//     const orders = await prisma.order.findMany({
//       orderBy: {
//         createdAt: 'desc'
//       },
//       include: {
//         Payment: true // Include payment information
//       }
//     });

//     return res.status(200).json(orders);
//   } catch (error) {
//     next(error);
//   }
// };


// const getOrderById = async (req, res, next) => {
//   try {
//     const idParam = req.params.id;
//     const id = parseInt(idParam);

//     // Validate ID
//     if (isNaN(id) || id <= 0 || idParam !== id.toString()) {
//       return res.status(400).json({ message: 'Invalid order ID' });
//     }

//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         Payment: true
//       }
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // If customer, only allow viewing own orders (check by phone or clientName)
//     if (req.user.role === 'Customer') {
//       // For now, customers can view any order
//       // TODO: Add customer ID to orders in future to restrict access
//     }

//     return res.status(200).json(order);
//   } catch (error) {
//     next(error);
//   }
// };


// const createOrder = async (req, res, next) => {
//   try {
//     const { productName, quantity, clientName, phone, address } = req.body;

//     // Validate required fields
//     if (!productName || !quantity || !clientName || !phone) {
//       return res.status(400).json({
//         message: 'Missing required fields: productName, quantity, clientName, phone'
//       });
//     }

//     // Validate quantity
//     if (typeof quantity !== 'number' || quantity <= 0) {
//       return res.status(400).json({
//         message: 'Quantity must be a positive number'
//       });
//     }
//     if (typeof phone !== 'string' || phone.trim().length < 10) {
//       return res.status(400).json({
//         message: 'Invalid phone number'
//       });
//     }
// // Create order with default status "OrderSubmitted"
//     const order = await prisma.order.create({
//       data: {
//         productName,
//         quantity,
//         clientName,
//         phone,
//         address: address || null,
//         status: 'OrderSubmitted'
//       }
//     });

//     return res.status(201).json({
//       data: order,
//       message: 'Order placed successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// const deleteOrder = async (req, res, next) => {
//   try {
//     const idParam = req.params.id;
//     const id = parseInt(idParam);

//     // Validate ID
//     if (isNaN(id) || id <= 0 || idParam !== id.toString()) {
//       return res.status(400).json({ message: 'Invalid order ID' });
//     }

//     // Check if order exists
//     const existingOrder = await prisma.order.findUnique({
//       where: { id }
//     });

//     if (!existingOrder) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Delete associated payments first (if any)
//     await prisma.payment.deleteMany({
//       where: { orderId: id }
//     });

//     // Delete order
//     await prisma.order.delete({
//       where: { id }
//     });

//     return res.status(200).json({
//       message: 'Order deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   getAllOrders,
//   getOrderById,
//   createOrder,
//   updateOrder,
//   deleteOrder
// };
