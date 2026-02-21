const bcrypt = require('bcryptjs');

const passwords = [
  'Admin@123',
  'Owner@123',
  'User@123'
];

async function generateHashes() {
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('---');
  }
}

generateHashes();