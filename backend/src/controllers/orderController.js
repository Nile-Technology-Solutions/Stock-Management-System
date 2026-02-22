const prisma = require('../config/db');

// Admin/SuperAdmin: get all orders
const getAllOrders = async (req, res, next) => {
  try {
    if (!['Admin','SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: { include: { product: true } },
        payments: true
      }
    });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Customer or Admin: get single order
const getOrderById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ message: 'Invalid order ID' });

    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        items: { include: { product: true } },
         payments: true, 
         user: true }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Customers can only see their own orders
    if (req.user.role === 'Customer' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Customer: create order
const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ productId, quantity }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one product' });
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product or quantity' });
      }

      const product = await prisma.product.findUnique({
         where: { id: item.productId } });
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });

      total += product.price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: 'OrderSubmitted',
        items: { create: orderItemsData }
      },
      include: { items: true }
    });

    return res.status(201).json({ data: order, message: 'Order placed successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin/SuperAdmin: update order status
const updateOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ message: 'Invalid order ID' });

    const { status } = req.body;
    const validStatuses = ['OrderSubmitted','PaymentConfirmed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be: ${validStatuses.join(', ')}` });
    }

    if (!['Admin','SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });

    // Enforce status flow
    if (existingOrder.status === 'PaymentConfirmed' && status === 'OrderSubmitted') {
      return res.status(400).json({ message: 'Cannot revert status back to OrderSubmitted' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true, payments: true }
    });

    return res.status(200).json({ data: order, message: 'Order updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin/SuperAdmin: delete order
const deleteOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ message: 'Invalid order ID' });

    if (!['Admin','SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { orderId: id } }),
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } })
    ]);

    return res.status(200).json({ message: 'Order deleted successfully' });
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