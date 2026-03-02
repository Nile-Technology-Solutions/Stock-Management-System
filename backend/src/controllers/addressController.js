const addressService = require('../services/addressService');

const getAllAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addresses = await addressService.getAllAddresses(userId);
        return res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
};

const getAddressById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const address = await addressService.getAddressById(id, userId);
        return res.status(200).json(address);
    } catch (error) {
        next(error);
    }
};

const createAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const address = await addressService.createAddress(req.body, userId);
        return res.status(201).json({ data: address, message: 'Address created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const address = await addressService.updateAddress(id, req.body, userId);
        return res.status(200).json({ data: address, message: 'Address updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const result = await addressService.deleteAddress(id, userId);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};
