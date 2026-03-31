// Test login credentials
const crypto = require('crypto');

const password = 'Sherlymodiyil@007';
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Password:', password);
console.log('Hash:', hash);

// Test the stored hash
const storedHash = crypto.createHash('sha256').update('Sherlymodiyil@007').digest('hex');
console.log('Stored hash:', storedHash);
console.log('Hashes match:', hash === storedHash);