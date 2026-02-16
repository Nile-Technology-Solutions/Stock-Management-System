const authService = require('../services/authService');

const MIN_PASSWORD_LENGTH = 6;

async function register(req, res, next) {
  try {
    const { username, password, fullName } = req.body;

    if (!username || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Username, fullName, and password are required',
      });
    }

    if (typeof username !== 'string' || typeof fullName !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const result = await authService.register({ username, password, fullName });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
      });
    }

    const result = await authService.login({ username, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
