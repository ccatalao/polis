const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('📦 Building web app with Vite...');

// Clean existing web-build directory
console.log('🧹 Cleaning web-build directory...');
try {
  execSync('rm -rf web-build');
  console.log('✅ Removed existing web-build directory');
} catch (error) {
  console.warn('⚠️ Could not remove web-build directory:', error);
}

// Build the app using Vite
console.log('🔨 Building the app using Vite...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Successfully built the app with Vite');
  
  // Verify the build
  if (fs.existsSync('web-build/index.html')) {
    console.log('✅ Build verification passed: index.html exists');
    
    // No aggressive cache busting - rely on Vite's built-in hashing
    console.log('✅ Using Vite\'s built-in content hashing for cache control');
  } else {
    console.warn('⚠️ Build verification warning: index.html missing');
  }
  
  // Create a 404.html file for SPA routing
  if (fs.existsSync('web-build/index.html')) {
    fs.copyFileSync('web-build/index.html', 'web-build/404.html');
    console.log('✅ Created 404.html for SPA routing');
  }
  
  // Create .nojekyll file to prevent Jekyll processing
  fs.writeFileSync('web-build/.nojekyll', '');
  console.log('✅ Created .nojekyll file for GitHub Pages');
  
  // Copy the simplified service worker to the build directory
  fs.copyFileSync('web/public/sw.js', 'web-build/sw.js');
  console.log('✅ Copied simplified service worker to build directory');
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

console.log('🎉 Web build process completed successfully!');
console.log('📝 To deploy to GitHub Pages, run: npm run deploy'); 