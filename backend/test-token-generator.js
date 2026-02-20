/**
 * Test Token Generator
 * Use this to generate JWT tokens for testing your Stock Module
 * Run: node test-token-generator.js
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Generate tokens for different roles
const generateToken = (userId, username, role) => {
  const payload = {
    id: userId,
    username: username,
    role: role
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  return token;
};

console.log('\n=== TEST TOKENS FOR STOCK MODULE ===\n');

// Admin token (can create, update, delete)
const adminToken = generateToken(1, 'test_admin', 'admin');
console.log('ADMIN TOKEN (for POST, PUT, DELETE):');
console.log(adminToken);
console.log('\n');

// Regular user token (can only read)
const userToken = generateToken(2, 'test_user', 'user');
console.log('USER TOKEN (for GET only):');
console.log(userToken);
console.log('\n');

console.log('Copy the ADMIN TOKEN and use it in Postman:');
console.log('Authorization: Bearer ' + adminToken);
console.log('\n');
