const todoService = require('../services/todoService');

const getAllTodos = async (req, res, next) => {
    try {
        const todos = await todoService.getAllTodos(req.query);
        return res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
};

const getTodoById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoService.getTodoById(id);
        return res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
};

const createTodo = async (req, res, next) => {
    try {
        const todo = await todoService.createTodo(req.body);
        return res.status(201).json({ data: todo, message: 'Todo item created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoService.updateTodo(id, req.body);
        return res.status(200).json({ data: todo, message: 'Todo item updated successfully' });
    } catch (error) {
        next(error);
    }
};

const toggleComplete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoService.toggleComplete(id, req.user);
        return res.status(200).json({ data: todo, message: `Todo item marked as ${todo.isCompleted ? 'completed' : 'incomplete'}` });
    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await todoService.deleteTodo(id);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
};
