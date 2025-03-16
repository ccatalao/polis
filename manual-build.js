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
    'src/data/municipio.json',
    'src/data/chapters.json'
  ];
  
  jsonFiles.forEach(jsonFile => {
    if (fs.existsSync(jsonFile)) {
      console.log(`Updating references in ${jsonFile}`);
      let content = fs.readFileSync(jsonFile, 'utf8');
      
      // Replace .webp with .jpeg in all image paths
      content = content.replace(/\.webp/g, '.jpeg');
      
      // Fix image paths for GitHub Pages deployment
      // For web deployment, we need to use absolute paths starting with /
      content = content.replace(/"\.\/images\//g, '"/images/');
      
      fs.writeFileSync(jsonFile, content);
    }
  });
} catch (error) {
  console.error('Error converting images:', error);
}

// Now create the static site
console.log('Creating static site...');
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
  console.log('Copying assets to dist directory...');
  if (fs.existsSync('assets')) {
    copyDir('assets', 'dist/assets');
  }
  
  // Copy data files to dist directory
  console.log('Copying data files to dist directory...');
  if (fs.existsSync('src/data')) {
    copyDir('src/data', 'dist/data');
  }
  
  // Copy screens files to dist directory
  console.log('Copying screens files to dist directory...');
  if (fs.existsSync('src/screens')) {
    copyDir('src/screens', 'dist/screens');
  }
  
  // Copy utils files to dist directory
  console.log('Copying utils files to dist directory...');
  if (fs.existsSync('src/utils')) {
    copyDir('src/utils', 'dist/utils');
  }
  
  // Create a debug.js file to help with debugging
  const debugJs = `
  // Debug script to help with image path issues
  console.log('Debug script loaded');
  
  // Log the current URL
  console.log('Current URL:', window.location.href);
  
  // Check if we're on GitHub Pages
  if (window.location.href.includes('github.io')) {
    console.log('Running on GitHub Pages');
    
    // Log the structure of the assets directory
    fetch('/polis/assets/images/funding/dut.jpeg')
      .then(response => {
        console.log('Funding image fetch response:', response.status);
        return response;
      })
      .catch(error => console.error('Error fetching funding image:', error));
      
    fetch('/polis/assets/images/projects/cordis.jpeg')
      .then(response => {
        console.log('Projects image fetch response:', response.status);
        return response;
      })
      .catch(error => console.error('Error fetching projects image:', error));
      
    fetch('/polis/assets/images/publications/urbanism.jpeg')
      .then(response => {
        console.log('Publications image fetch response:', response.status);
        return response;
      })
      .catch(error => console.error('Error fetching publications image:', error));
  }
  `;
  
  fs.writeFileSync('dist/debug.js', debugJs);
  
  // Add the debug script to the index.html file
  const indexHtmlWithDebug = fs.readFileSync('dist/index.html', 'utf8')
    .replace('</body>', '<script src="debug.js"></script></body>');
  fs.writeFileSync('dist/index.html', indexHtmlWithDebug);
  
  // Create a test-images.html file to directly test image loading
  const testImagesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polis - Image Test</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    h1, h2 {
      color: #333;
    }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .image-item {
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 4px;
    }
    .image-item img {
      width: 100%;
      height: auto;
      display: block;
    }
    .image-item p {
      margin: 10px 0 0;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Polis - Image Test Page</h1>
  <p>This page tests direct image loading from GitHub Pages.</p>
  
  <h2>Funding Images</h2>
  <div class="image-grid">
    <div class="image-item">
      <img src="/polis/assets/images/funding/dut.jpeg" alt="DUT">
      <p>dut.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/funding/bauhaus.jpeg" alt="Bauhaus">
      <p>bauhaus.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/funding/feder.jpeg" alt="Feder">
      <p>feder.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/funding/interreg.jpeg" alt="Interreg">
      <p>interreg.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/funding/life.jpeg" alt="Life">
      <p>life.jpeg</p>
    </div>
  </div>
  
  <h2>Project Images</h2>
  <div class="image-grid">
    <div class="image-item">
      <img src="/polis/assets/images/projects/cordis.jpeg" alt="Cordis">
      <p>cordis.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/projects/espon.jpeg" alt="Espon">
      <p>espon.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/projects/jpi-urban.jpeg" alt="JPI Urban">
      <p>jpi-urban.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/projects/keep-eu.jpeg" alt="Keep EU">
      <p>keep-eu.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/projects/urbact.jpeg" alt="Urbact">
      <p>urbact.jpeg</p>
    </div>
  </div>
  
  <h2>Publication Images</h2>
  <div class="image-grid">
    <div class="image-item">
      <img src="/polis/assets/images/publications/urbanism.jpeg" alt="Urbanism">
      <p>urbanism.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/publications/urban-science.jpeg" alt="Urban Science">
      <p>urban-science.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/publications/urban-planning.jpeg" alt="Urban Planning">
      <p>urban-planning.jpeg</p>
    </div>
  </div>
  
  <h2>Home Images</h2>
  <div class="image-grid">
    <div class="image-item">
      <img src="/polis/assets/images/home/funding.jpeg" alt="Funding">
      <p>funding.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/home/projects.jpeg" alt="Projects">
      <p>projects.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/home/publicacoes.jpeg" alt="Publicacoes">
      <p>publicacoes.jpeg</p>
    </div>
    <div class="image-item">
      <img src="/polis/assets/images/home/municipio.jpeg" alt="Municipio">
      <p>municipio.jpeg</p>
    </div>
  </div>
  
  <script>
    // Log any image loading errors
    document.querySelectorAll('img').forEach(img => {
      img.onerror = function() {
        console.error('Failed to load image:', this.src);
        this.style.border = '2px solid red';
        this.style.padding = '10px';
        this.style.backgroundColor = '#ffeeee';
      };
      
      img.onload = function() {
        console.log('Successfully loaded image:', this.src);
      };
    });
  </script>
</body>
</html>`;

  fs.writeFileSync('dist/test-images.html', testImagesHtml);
  
  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync('dist/.nojekyll', '');
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 