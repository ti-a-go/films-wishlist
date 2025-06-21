#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');
const saltRounds = 10; // Recommended cost factor

async function generateSalt() {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('Generated Salt:', salt);
    return salt;
  } catch (err) {
    console.error('Error generating salt:', err);
    throw err;
  }
}

// Example usage
generateSalt();
