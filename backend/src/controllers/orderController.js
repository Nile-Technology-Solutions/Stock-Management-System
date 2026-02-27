const orderService = require('../services/orderService');

const getAllOrders = async (req, res, next) => {
    try {
        const query = { ...req.query }

        // Customers can only see their own orders
        if (req.user.role === 'Customer') {
            query.userId = req.user.id;
        }

        const orders = await orderService.getAllOrders(query);
        return res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await orderService.getOrderById(id);

        // Customers can only view their own orders
        if (req.user.role === 'Customer' && order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        return res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body, req.user.id);
        return res.status(201).json({ data: order, message: 'Order created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id, status);
        return res.status(200).json({ data: order, message: 'Order status updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await orderService.deleteOrder(id);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
};
