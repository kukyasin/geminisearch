#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import process from 'process';

function getHomeDir() {
  return process.env.HOME || process.env.USERPROFILE;
}

function getShell() {
  return process.env.SHELL?.split('/')?.pop() || 'bash';
}

function getNpmGlobalBin() {
  try {
    const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
    return path.join(npmPrefix, 'bin');
  } catch (error) {
    console.warn('WARNING: Could not determine npm global bin directory');
    return null;
  }
}

function isPathInProfile(profilePath, targetPath) {
  try {
    if (!fs.existsSync(profilePath)) return false;
    const content = fs.readFileSync(profilePath, 'utf8');
    return content.includes(targetPath);
  } catch (error) {
    return false;
  }
}

function addToProfile(profilePath, binPath) {
  try {
    const exportLine = `\n# GeminiSearch CLI - Added by geminisearch-cli\nexport PATH="$PATH:${binPath}"\n`;

    if (fs.existsSync(profilePath)) {
      fs.appendFileSync(profilePath, exportLine);
    } else {
      fs.writeFileSync(profilePath, `#!/bin/bash\n${exportLine}`);
    }

    console.log(`SUCCESS: Added to ${profilePath}`);
    return true;
  } catch (error) {
    console.warn(`WARNING: Could not write to ${profilePath}: ${error.message}`);
    return false;
  }
}

function setupPath() {
  const binPath = getNpmGlobalBin();
  if (!binPath) {
    console.log('INFO: Skipping PATH setup - could not determine npm global bin directory');
    return;
  }

  const homeDir = getHomeDir();
  const shell = getShell();

  console.log('GeminiSearch CLI - Setting up PATH...');
  console.log(`npm global bin: ${binPath}`);

  let profileFiles = [];

  if (process.platform === 'darwin') {
    // macOS
    profileFiles = [
      path.join(homeDir, '.zshrc'),
      path.join(homeDir, '.bash_profile'),
      path.join(homeDir, '.bashrc'),
      path.join(homeDir, '.profile')
    ];
  } else if (process.platform === 'linux') {
    // Linux
    profileFiles = [
      path.join(homeDir, '.bashrc'),
      path.join(homeDir, '.profile'),
      path.join(homeDir, '.zshrc')
    ];
  } else if (process.platform === 'win32') {
    // Windows - handled differently
    console.log('INFO: Windows detected - Please add to PATH manually:');
    console.log(`   ${binPath}`);
    return;
  }

  // Check if already in PATH
  if (process.env.PATH?.includes(binPath)) {
    console.log('SUCCESS: PATH already configured');
    return;
  }

  // Try to add to profile files
  let success = false;
  for (const profilePath of profileFiles) {
    if (isPathInProfile(profilePath, binPath)) {
      console.log(`SUCCESS: Already in ${profilePath}`);
      success = true;
      break;
    }
  }

  if (!success) {
    for (const profilePath of profileFiles) {
      if (addToProfile(profilePath, binPath)) {
        success = true;
        break;
      }
    }
  }

  if (success) {
    console.log('SUCCESS: PATH setup completed!');
    console.log('Please restart your terminal or run:');

    if (shell === 'zsh') {
      console.log('   source ~/.zshrc');
    } else if (shell === 'bash') {
      console.log('   source ~/.bashrc');
    } else {
      console.log('   source ~/.bashrc');
    }

    console.log('\nAlternative - Use npx (no PATH setup needed):');
    console.log('   npx geminisearch-cli');

  } else {
    console.log('WARNING: Could not automatically set up PATH');
    console.log('You can manually add this line to your shell profile:');
    console.log(`   export PATH="$PATH:${binPath}"`);
    console.log('\nOr use npx instead:');
    console.log('   npx geminisearch-cli');
  }
}

// Check if this is a global installation
const isGlobalInstall = process.env.npm_config_global === 'true' ||
                       process.argv.includes('global');

if (isGlobalInstall) {
  setupPath();
} else {
  console.log('INFO: Local installation - skipping PATH setup');
  console.log('Use npx geminisearch-cli to run the tool');
}