const userService = require('../services/userService');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam middleware
        const user = await userService.getUserById(id);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json({ data: user, message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam middleware
        const user = await userService.updateUser(id, req.body);
        return res.status(200).json({ data: user, message: 'User updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id; // normalized by validateIdParam middleware
        await userService.deleteUser(id, req.user.id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
