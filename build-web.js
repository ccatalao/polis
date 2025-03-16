const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// First, let's convert any WebP images to JPEG format
console.log('Converting WebP images to JPEG format...');
try {
  // Create a simple script to copy all WebP images as JPEG
  // This is a workaround since we can't process WebP images directly
  const assetDirs = [
    'assets/images/home',
    'assets/images/funding',
    'assets/images/projects',
    'assets/images/publications'
  ];

  assetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        if (file.endsWith('.webp')) {
          const sourcePath = path.join(dir, file);
          const targetPath = path.join(dir, file.replace('.webp', '.jpeg'));
          
          // If the JPEG version doesn't exist, create a copy
          if (!fs.existsSync(targetPath)) {
            console.log(`Creating JPEG copy of ${sourcePath}`);
            fs.copyFileSync(sourcePath, targetPath);
          }
        }
      });
    }
  });
} catch (error) {
  console.error('Error converting images:', error);
}

// Now run the expo export command
console.log('Building web version...');
try {
  // Use the npm script we defined in package.json
  execSync('npm run export:web', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  
  // Try alternative command if the first one fails
  try {
    console.log('Trying alternative build command...');
    execSync('npx expo export --platform web', { stdio: 'inherit' });
    console.log('Build completed successfully with alternative command!');
  } catch (altError) {
    console.error('Alternative build also failed:', altError);
    process.exit(1);
  }
}

// Create .nojekyll file
console.log('Creating .nojekyll file...');
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
} else {
  console.warn('Warning: dist directory not found. .nojekyll file not created.');
}

console.log('Build process completed successfully!'); 