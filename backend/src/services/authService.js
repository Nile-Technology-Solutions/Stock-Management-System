const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

/**
 * @param {{ fullName: string, email: string, phone: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function register(data) {
  const { fullName, email, phone, password, role: requestedRole } = data;
  // Allow role to be passed (e.g. for admin-created users), default to Customer
  const role = requestedRole || 'Customer';

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  // Check if phone already exists
  const existingPhone = await prisma.user.findUnique({ where: { phone } });
  if (existingPhone) {
    const err = new Error('Phone number already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user, token };
}

/**
 * Login with email or phone and password.
 * @param {{ identifier: string, password: string }}
 * @returns {{ user: object, token: string }}
 */
async function login(data) {
  const { identifier, password } = data;

  if (!identifier || !password) {
    const err = new Error('Email/phone and password are required');
    err.statusCode = 400;
    throw err;
  }

  // Check if identifier is email or phone
  const isEmail = identifier.includes('@');

  let user;
  if (isEmail) {
    user = await prisma.user.findUnique({ where: { email: identifier } });
  } else {
    user = await prisma.user.findUnique({ where: { phone: identifier } });
  }

  if (!user) {
    const err = new Error('Invalid email/phone or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error('Invalid email/phone or password');
    err.statusCode = 401;
    throw err;
  }

  const { password: _, ...safeUser } = user;
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user: safeUser, token };
}

/**
 * Request password reset - generates a reset token
 * @param {{ identifier: string }} data
 */
async function forgotPassword(data) {
  const { identifier } = data;

  // Check if identifier is email or phone
  const isEmail = identifier.includes('@');

  let user;
  if (isEmail) {
    user = await prisma.user.findUnique({ where: { email: identifier } });
  } else {
    user = await prisma.user.findUnique({ where: { phone: identifier } });
  }

  if (!user) {
    // Don't reveal if user exists or not for security
    return { message: 'If the account exists, a reset link will be sent' };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // TODO: Send email or SMS with reset token
  // For now, return the token (in production, this should be sent via email/SMS)
  return {
    message: 'Password reset token generated',
    resetToken, // Remove this in production
    identifier: isEmail ? user.email : user.phone
  };
}

/**
 * Reset password using token
 * @param {{ token: string, newPassword: string }} data
 */
async function resetPassword(data) {
  const { token, newPassword } = data;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token must not be expired
      },
    },
  });

  if (!user) {
    const err = new Error('Invalid or expired reset token');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Password reset successful' };
}

/**
 * Change password for a user after verifying the old password.
 * @param {{ userId: number, oldPassword: string, newPassword: string }} data
 */
async function changePassword(data) {
  const { userId, oldPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const valid = await comparePassword(oldPassword, user.password);
  if (!valid) {
    const err = new Error('Old password is incorrect');
    err.statusCode = 401;
    throw err;
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return true;
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true
    },
  });
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserById,
};
