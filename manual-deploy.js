#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const buildDir = 'web-build';
const deployBranch = 'gh-pages';
const remote = 'origin';
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
  
  // Try to fetch existing gh-pages branch
  console.log(`🔍 Trying to fetch existing ${deployBranch} branch...`);
  try {
    execSync(`git fetch "${process.cwd()}/.." ${deployBranch}`, { timeout: 60000 });
    execSync(`git checkout -b ${deployBranch} FETCH_HEAD`);
    console.log(`✅ Successfully fetched ${deployBranch} branch`);
  } catch (e) {
    console.log(`ℹ️ No existing ${deployBranch} branch found or fetch failed, creating new branch...`);
    execSync(`git checkout --orphan ${deployBranch}`);
    execSync('git rm -rf .');
  }
  
  // Copy build files to temporary directory
  console.log('📋 Copying build files...');
  execSync(`cp -R "${process.cwd()}/../${buildDir}/"* .`);
  
  // Add and commit files
  execSync('git add .');
  try {
    execSync(`git commit -m "${commitMessage}"`);
  } catch (e) {
    console.log('ℹ️ Nothing to commit, working tree clean');
    process.exit(0);
  }
  
  // Push to GitHub with increased timeout
  console.log(`🚀 Pushing to ${remote}/${deployBranch}...`);
  execSync(`git push --force "${process.cwd()}/.." ${deployBranch}:${deployBranch}`, { timeout: 120000 });
  
  // Verify remote update
  process.chdir('..');
  execSync(`git fetch ${remote} ${deployBranch}:refs/remotes/${remote}/${deployBranch}`, { timeout: 60000 });
  
  // Cleanup temporary directory
  console.log('🧹 Cleaning up...');
  execSync(`rm -rf "${tempDir}"`);
  
  console.log('✅ Deployment completed successfully!');
  console.log(`🌐 Your site should be available at: ${JSON.parse(fs.readFileSync('package.json')).homepage}`);
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