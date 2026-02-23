const newsService = require('../services/newsService');

// ── Public endpoints (no auth) ──

const getPublishedNews = async (req, res, next) => {
    try {
        const posts = await newsService.getPublishedNews();
        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

const getPublicNewsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await newsService.getNewsById(id, { publicAccess: true });
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

// ── Admin endpoints (auth required) ──

const getAllNews = async (req, res, next) => {
    try {
        const posts = await newsService.getAllNews(req.query, req.user);
        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

const getNewsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await newsService.getNewsById(id, { user: req.user });
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

const createNews = async (req, res, next) => {
    try {
        const photos = req.files ? req.files.map(f => `/uploads/news/${f.filename}`) : [];
        const data = { ...req.body, photos };
        const post = await newsService.createNews(data, req.user);
        return res.status(201).json({ data: post, message: 'News post created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateNews = async (req, res, next) => {
    try {
        const id = req.params.id;
        const photos = req.files ? req.files.map(f => `/uploads/news/${f.filename}`) : [];
        const updateData = { ...req.body };
        if (photos.length > 0) {
            updateData.photos = photos;
        }
        const post = await newsService.updateNews(id, updateData, req.user);
        return res.status(200).json({ data: post, message: 'News post updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteNews = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await newsService.deleteNews(id, req.user);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPublishedNews,
    getPublicNewsById,
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
};
