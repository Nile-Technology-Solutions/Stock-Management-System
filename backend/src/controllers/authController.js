const authService = require('../services/authService');
const { logAction } = require('../middleware/auditLogger');

async function register(req, res, next) {
  try {
    const { fullName, email, phone, password } = req.body;

    const result = await authService.register({ fullName, email, phone, password });

    // Log user registration
    await logAction(
      { user: result.user, ip: req.ip, connection: req.connection, get: req.get.bind(req) },
      'USER_CREATED',
      'User',
      result.user.id,
      `New user registered: ${email}`,
      { fullName, email, phone }
    );

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
    const { identifier, password } = req.body;

    const result = await authService.login({ identifier, password });

    // Log successful login
    await logAction(
      { user: result.user, ip: req.ip, connection: req.connection, get: req.get.bind(req) },
      'LOGIN',
      'User',
      result.user.id,
      `User logged in: ${result.user.email}`,
      { identifier }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (err) {
    // Log failed login attempt
    await logAction(
      { ip: req.ip, connection: req.connection, get: req.get.bind(req) },
      'LOGIN_FAILED',
      'User',
      null,
      `Failed login attempt for: ${identifier}`,
      { identifier, error: err.message }
    ).catch(console.error);
    
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { identifier } = req.body;

    const result = await authService.forgotPassword({ identifier });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.resetToken ? { resetToken: result.resetToken, identifier: result.identifier } : null,
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword({ token, newPassword });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    // authMiddleware attaches `user` to req
    return res.status(200).json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    await authService.changePassword({ userId, oldPassword, newPassword });

    // Log password change
    await logAction(
      req,
      'PASSWORD_CHANGE',
      'User',
      userId,
      `User changed password: ${req.user.email}`
    );

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  changePassword,
};
