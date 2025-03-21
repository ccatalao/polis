#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const buildDir = 'web-build';
const deployBranch = 'gh-pages';
const remote = 'https://github.com/ccatalao/polis.git';
const commitMessage = 'Deploy to GitHub Pages';

console.log('📦 Starting manual GitHub Pages deployment...');

try {
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.error(`❌ Build directory "${buildDir}" does not exist. Run npm run build:web first.`);
    process.exit(1);
  }

  // Create temporary directory for deployment
  const tempDir = path.join(__dirname, 'temp-gh-pages');
  if (fs.existsSync(tempDir)) {
    console.log('🧹 Cleaning up existing temporary directory...');
    execSync(`rm -rf "${tempDir}"`);
  }
  
  // Create temp directory and initialize git
  fs.mkdirSync(tempDir, { recursive: true });
  process.chdir(tempDir);
  console.log('🔧 Initializing Git repository in temporary directory...');
  execSync('git init');
  execSync(`git config --local user.name "GitHub Actions Bot"`);
  execSync(`git config --local user.email "github-actions-bot@users.noreply.github.com"`);
  
  // Set increased timeouts for git commands
  execSync('git config --local http.postBuffer 524288000');  // Increase buffer size
  execSync('git config --local http.lowSpeedLimit 1000');    // Lower threshold for low speed detection
  execSync('git config --local http.lowSpeedTime 60');       // Longer time for low speed tolerance
  
  // Copy build files to temporary directory
  console.log('📋 Copying build files...');
  execSync(`cp -R "${process.cwd()}/../${buildDir}/"* .`);
  execSync('touch .nojekyll');  // Ensure .nojekyll file exists
  
  // Add and commit files
  execSync('git add .');
  try {
    execSync(`git commit -m "${commitMessage}"`);
  } catch (e) {
    console.log('ℹ️ Nothing to commit, working tree clean');
    process.exit(0);
  }
  
  // Add remote and push to GitHub
  console.log(`🚀 Adding remote repository and pushing to ${deployBranch} branch...`);
  execSync(`git remote add origin ${remote}`);
  
  // Get GitHub credentials if needed
  const username = process.env.GITHUB_USERNAME || execSync('git config user.name').toString().trim();
  
  // Check if GitHub token is available
  const token = process.env.GITHUB_TOKEN;
  let pushUrl = remote;
  
  if (token) {
    // Use token for authentication if available
    pushUrl = remote.replace('https://', `https://${token}@`);
  } else {
    console.log('ℹ️ No GitHub token found. Using regular authentication.');
    console.log('ℹ️ If this fails, you may need to provide GitHub credentials manually.');
  }
  
  try {
    execSync(`git push --force origin HEAD:${deployBranch}`);
  } catch (error) {
    console.error('❌ Failed to push with default remote. You may need to authenticate manually.');
    console.log('🔒 Falling back to manual deployment instructions...');
    throw error;
  }
  
  console.log('✅ Deployment completed successfully!');
  console.log(`🌐 Your site should be available at: https://ccatalao.github.io/polis/`);
} catch (error) {
  console.error('❌ Deployment failed with error:', error.message);
  console.error('Try deploying manually:');
  console.error(`1. cd ${buildDir}`);
  console.error(`2. git init`);
  console.error(`3. git add .`);
  console.error(`4. git commit -m "Deploy to GitHub Pages"`);
  console.error(`5. git push -f origin HEAD:${deployBranch}`);
  process.exit(1);
} 