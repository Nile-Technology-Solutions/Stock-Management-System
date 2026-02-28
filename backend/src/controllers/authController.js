const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { fullName, email, phone, password } = req.body;

    const result = await authService.register({ fullName, email, phone, password });

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
