#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TalentPool Mobile Development Helper\n');

const commands = {
  build: () => {
    console.log('📦 Building web assets...');
    execSync('npm run build', { stdio: 'inherit' });
  },
  
  sync: () => {
    console.log('🔄 Syncing with Capacitor...');
    execSync('npx cap sync', { stdio: 'inherit' });
  },
  
  android: () => {
    console.log('🤖 Opening Android Studio...');
    execSync('npx cap open android', { stdio: 'inherit' });
  },
  
  ios: () => {
    console.log('🍎 Opening Xcode...');
    execSync('npx cap open ios', { stdio: 'inherit' });
  },
  
  run: () => {
    console.log('🏃 Building and syncing...');
    execSync('npm run build && npx cap sync', { stdio: 'inherit' });
  },
  
  help: () => {
    console.log(`
Available commands:
  build    - Build web assets
  sync     - Sync with Capacitor
  android  - Open Android Studio
  ios      - Open Xcode (macOS only)
  run      - Build and sync
  help     - Show this help

Usage: node scripts/mobile-dev.js <command>
    `);
  }
};

const command = process.argv[2] || 'help';

if (commands[command]) {
  commands[command]();
} else {
  console.log(`❌ Unknown command: ${command}`);
  commands.help();
}
