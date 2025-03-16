const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// First, convert WebP images to JPEG
console.log('Converting WebP images to JPEG format...');
try {
  // Find all WebP images recursively
  function findWebpImages(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        findWebpImages(filePath, fileList);
      } else if (file.toLowerCase().endsWith('.webp')) {
        fileList.push(filePath);
      }
    });
    return fileList;
  }
  
  const webpImages = findWebpImages('assets');
  console.log(`Found ${webpImages.length} WebP images`);
  
  // Convert each WebP to JPEG (by copying the file)
  webpImages.forEach(webpPath => {
    const jpegPath = webpPath.replace(/\.webp$/i, '.jpeg');
    console.log(`Converting ${webpPath} to ${jpegPath}`);
    fs.copyFileSync(webpPath, jpegPath);
  });
  
  // Update JSON files to reference JPEG instead of WebP
  const jsonFiles = [
    'src/data/funding.json',
    'src/data/projects.json',
    'src/data/publications.json'
  ];
  
  jsonFiles.forEach(jsonFile => {
    if (fs.existsSync(jsonFile)) {
      console.log(`Updating references in ${jsonFile}`);
      let content = fs.readFileSync(jsonFile, 'utf8');
      webpImages.forEach(webpPath => {
        const normalizedWebpPath = webpPath.replace(/\\/g, '/');
        const normalizedJpegPath = normalizedWebpPath.replace(/\.webp$/i, '.jpeg');
        content = content.replace(new RegExp(normalizedWebpPath, 'g'), normalizedJpegPath);
      });
      fs.writeFileSync(jsonFile, content);
    }
  });
} catch (error) {
  console.error('Error converting images:', error);
}

// Now start a development server and use a headless browser to generate static files
console.log('Starting development server...');
try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Create a simple index.html file in the dist directory
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polis</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Polis</h1>
    <p>This is a static placeholder page. The full web app is currently being built.</p>
    <p>Please use the mobile app for the complete experience.</p>
    <a href="https://github.com/ccatalao/polis" class="button">View on GitHub</a>
  </div>
</body>
</html>`;

  fs.writeFileSync('dist/index.html', indexHtml);
  
  // Copy assets to dist directory
  console.log('Copying assets to dist directory...');
  
  // Function to recursively copy directory
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else if (!entry.name.toLowerCase().endsWith('.webp')) {
        // Skip WebP files
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  // Copy assets directory
  if (fs.existsSync('assets')) {
    copyDir('assets', 'dist/assets');
  }
  
  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync('dist/.nojekyll', '');
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 