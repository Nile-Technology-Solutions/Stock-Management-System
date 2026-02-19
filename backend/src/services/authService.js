const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

/**
 * @param {{ username: string, password: string, fullName: string }} data
 * @returns {{ user: object, token: string }}
 */
async function register(data) {
  const { username, password, fullName } = data;
  const role = 'Customer';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    const err = new Error('Username already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      fullName,
      role,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user, token };
}

/**
 * Login with username and password.
 * @param {{ username: string, password: string }}
 * @returns {{ user: object, token: string }}
 */
async function login(data) {
  const { username, password } = data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    const err = new Error('Invalid username or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error('Invalid username or password');
    err.statusCode = 401;
    throw err;
  }

  const { password: _, ...safeUser } = user;
  const token = jwt.sign(
    { userId: user.id, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user: safeUser, token };
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
    select: { id: true, username: true, fullName: true, role: true, createdAt: true },
  });
}

module.exports = {
  register,
  login,
  changePassword,
  getUserById,
};
