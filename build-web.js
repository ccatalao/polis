const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create web-build directory if it doesn't exist
if (!fs.existsSync('web-build')) {
  fs.mkdirSync('web-build', { recursive: true });
}

// Create directories for assets
const directories = [
  'web-build/assets',
  'web-build/assets/images',
  'web-build/assets/images/funding',
  'web-build/assets/images/projects',
  'web-build/assets/images/publications',
  'web-build/assets/images/home'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy assets
console.log('Copying assets...');
try {
  // Copy images
  execSync('cp -r assets/images/funding/* web-build/assets/images/funding/');
  execSync('cp -r assets/images/projects/* web-build/assets/images/projects/');
  execSync('cp -r assets/images/publications/* web-build/assets/images/publications/');
  execSync('cp -r assets/images/home/* web-build/assets/images/home/');
  
  // Copy other assets
  execSync('cp -r assets/icon.png web-build/assets/');
  execSync('cp -r assets/splash.png web-build/assets/');
  execSync('cp -r assets/adaptive-icon.png web-build/assets/');
  execSync('cp -r assets/favicon.png web-build/assets/');
  
  console.log('Assets copied successfully.');
} catch (error) {
  console.error('Error copying assets:', error);
}

// Create a simple index.html file
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polis</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #root {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #09f;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading Polis...</p>
    </div>
  </div>
  <script>
    // Redirect to GitHub Pages
    window.location.href = 'https://ccatalao.github.io/polis';
  </script>
</body>
</html>
`;

fs.writeFileSync('web-build/index.html', indexHtml);
console.log('Created index.html');

// Create .nojekyll file to prevent GitHub Pages from using Jekyll
fs.writeFileSync('web-build/.nojekyll', '');
console.log('Created .nojekyll file');

// Copy data files
console.log('Copying data files...');
if (!fs.existsSync('web-build/data')) {
  fs.mkdirSync('web-build/data', { recursive: true });
}

try {
  execSync('cp -r src/data/* web-build/data/');
  console.log('Data files copied successfully.');
} catch (error) {
  console.error('Error copying data files:', error);
}

console.log('Web build completed successfully!'); 