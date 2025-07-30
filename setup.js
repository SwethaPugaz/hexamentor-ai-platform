#!/usr/bin/env node
/**
 * Quick Setup Script for HexaMentor - Configures MongoDB Atlas
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 HexaMentor Database Setup\n');
console.log('Choose your database option:');
console.log('1. MongoDB Atlas (Cloud) - Recommended');
console.log('2. Use dummy data (for testing)\n');

rl.question('Enter your choice (1 or 2): ', (choice) => {
  if (choice === '1') {
    console.log('\n📋 MongoDB Atlas Setup:');
    console.log('1. Go to: https://account.mongodb.com/account/register');
    console.log('2. Create a free account');
    console.log('3. Create a new cluster');
    console.log('4. Get your connection string\n');
    
    rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
      updateEnvFile('MONGODB_URI', connectionString);
      console.log('✅ Database configured successfully!');
      setupOpenAI();
    });
  } else if (choice === '2') {
    updateEnvFile('MONGODB_URI', 'dummy://database');
    console.log('✅ Using dummy data for testing');
    setupOpenAI();
  } else {
    console.log('Invalid choice. Exiting...');
    rl.close();
  }
});

function setupOpenAI() {
  console.log('\n🤖 OpenAI Setup (for AI features):');
  console.log('1. Go to: https://platform.openai.com/api-keys');
  console.log('2. Create an API key\n');
  
  rl.question('Enter your OpenAI API key (or press Enter to skip): ', (apiKey) => {
    if (apiKey.trim()) {
      updateEnvFile('OPENAI_API_KEY', apiKey.trim());
      console.log('✅ AI features enabled!');
    } else {
      console.log('⚠️  AI features will use dummy responses');
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('\nTo start the application:');
    console.log('1. Backend: cd backend && npm run dev');
    console.log('2. Frontend: npm run dev');
    console.log('3. Visit: http://localhost:5173\n');
    
    rl.close();
  });
}

function updateEnvFile(key, value) {
  const envPath = path.join(__dirname, 'backend', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }
  
  fs.writeFileSync(envPath, envContent);
}
