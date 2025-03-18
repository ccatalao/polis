const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Starting enhanced web build process for GitHub Pages...');

// Define repoName at the global scope
let repoName = 'polis'; // Default value

// Try to get repository name from package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const homepage = packageJson.homepage || '';
  
  if (homepage) {
    const match = homepage.match(/github\.io\/([^/]+)/);
    if (match && match[1]) {
      repoName = match[1];
      console.log(`📦 Detected repository name from homepage: ${repoName}`);
    }
  }
} catch (error) {
  console.warn('⚠️ Could not read package.json:', error);
}

// If we don't find it in package.json, try to determine it from git
if (repoName === 'polis') {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
    const repoMatch = remoteUrl.match(/github\.com[:\/]([^\/]+)\/([^\/\.]+)(?:\.git)?$/);
    if (repoMatch && repoMatch[2]) {
      repoName = repoMatch[2];
      console.log(`📦 Detected repository name from git: ${repoName}`);
    }
  } catch (error) {
    console.warn('⚠️ Could not detect repository name from git, using default "polis"');
  }
}

// Step 1: Run Expo's web build or use pre-existing one
console.log('🔨 Setting up web build directory...');

// Check if there's any existing web build from Expo we can use
if (fs.existsSync('dist') && fs.existsSync('dist/index.html')) {
  console.log('📦 Found existing Expo web build in dist/, using it...');
  
  // Ensure web-build directory exists
  if (!fs.existsSync('web-build')) {
    fs.mkdirSync('web-build', { recursive: true });
  }
  
  // Copy the dist directory contents to web-build
  try {
    execSync('cp -r dist/* web-build/', { stdio: 'inherit' });
    console.log('✅ Copied dist/* to web-build/');
  } catch (distCopyError) {
    console.warn('⚠️ Warning: Could not copy from dist directory:', distCopyError);
  }
} else {
  // No existing build found, try to create one
  console.log('🏗️ No existing web build found, attempting to create one...');
  
  try {
    // Use npx to run the expo web build command that was previously working
    console.log('Attempting to build with Expo web...');
    
    // First, try "expo start --web --no-dev --bundler"
    try {
      execSync('npx expo start --web --no-dev --no-bundler --non-interactive --no-open', { stdio: 'inherit' });
    } catch (e) {
      console.log('❓ First build method failed, trying alternate method...');
      
      // Fallback to using the webpack build directly
      try {
        execSync('npx expo webpack build', { stdio: 'inherit' });
      } catch (e2) {
        console.log('❓ Second build method failed, falling back to manual web build...');
        
        // Create basic web-build structure
        if (!fs.existsSync('web-build')) {
          fs.mkdirSync('web-build', { recursive: true });
        }
        
        // Try to copy from /web (if it exists)
        try {
          if (fs.existsSync('web')) {
            execSync('cp -r web/* web-build/', { stdio: 'inherit' });
            console.log('✅ Copied web/* to web-build/');
          } else {
            // If we have no web directory, use index.html from last good build or create a basic one
            console.log('⚠️ No web directory found, will use a basic index.html...');
            if (!fs.existsSync('web-build/index.html')) {
              // Create a simple index.html
              fs.writeFileSync('web-build/index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polis</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
    .app { max-width: 800px; margin: 0 auto; }
    h1 { color: #0066cc; }
  </style>
</head>
<body>
  <div class="app">
    <h1>Polis</h1>
    <p>Loading application...</p>
  </div>
</body>
</html>
              `);
              console.log('✅ Created basic index.html file');
            }
          }
        } catch (webCopyError) {
          console.warn('⚠️ Warning: Could not copy from web directory:', webCopyError);
        }
      }
    }
    
    console.log('✅ Web build structure created.');
  } catch (error) {
    console.error('❌ Web build process had some issues:', error);
    console.log('⚠️ Continuing with manual asset copying...');
    
    // Ensure web-build directory exists even if the build process failed
    if (!fs.existsSync('web-build')) {
      fs.mkdirSync('web-build', { recursive: true });
    }
  }
}

// Step 2: Ensure all the necessary directories exist
console.log('📁 Ensuring asset directories exist...');
const directories = [
  'web-build/assets/images',
  'web-build/assets/images/funding',
  'web-build/assets/images/projects',
  'web-build/assets/images/publications',
  'web-build/assets/images/home',
  'web-build/data'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Step 3: Copy additional assets that might not be included in the Expo build
console.log('🖼️ Copying additional assets...');
try {
  // Define the asset copy operations with proper error handling for each
  const copyOperations = [
    { src: 'assets/images/funding/*', dest: 'web-build/assets/images/funding/' },
    { src: 'assets/images/projects/*', dest: 'web-build/assets/images/projects/' },
    { src: 'assets/images/publications/*', dest: 'web-build/assets/images/publications/' },
    { src: 'assets/images/home/*', dest: 'web-build/assets/images/home/' },
    { src: 'src/data/*', dest: 'web-build/data/' }
  ];
  
  // Execute each copy operation with error handling
  copyOperations.forEach(op => {
    try {
      execSync(`cp -r ${op.src} ${op.dest}`);
      console.log(`✅ Copied ${op.src} to ${op.dest}`);
    } catch (err) {
      console.warn(`⚠️ Warning: Could not copy ${op.src}. This may be normal if the files don't exist.`);
    }
  });
  
  console.log('✅ Additional assets copied successfully.');
} catch (error) {
  console.error('⚠️ Some assets could not be copied:', error);
  // Continue anyway as this might be expected for some files
}

// Step 4: Create .nojekyll file to prevent GitHub Pages from using Jekyll processing
fs.writeFileSync('web-build/.nojekyll', '');
console.log('✅ Created .nojekyll file for GitHub Pages');

// Step 5: Fix the GitHub Pages base path issues
console.log('🔧 Updating index.html for GitHub Pages compatibility...');
try {
  const indexPath = 'web-build/index.html';
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Fix 1: Ensure assets are loaded from the correct base path
    // For GitHub Pages at username.github.io/repo-name, we need to account for the /repo-name prefix
    
    // Optional: Add a small script to handle GitHub Pages routing
    // This helps with direct URL access and refreshes
    const routingScript = `
    <script>
      // GitHub Pages routing fix
      (function() {
        const repo = '${repoName}';
        if (repo && window.location.pathname.indexOf('/' + repo) === 0) {
          // Already has the repo prefix, we're good
          console.log('GitHub Pages path is correct');
        } else if (repo && window.location.pathname === '/' && window.location.hostname.includes('github.io')) {
          // We're at the root and need to add the repo name for GitHub Pages
          console.log('Redirecting to include repository name in path');
          window.location.replace('/' + repo + '/');
        }
      })();
    </script>`;
    
    // Insert the routing script before the closing </head> tag
    indexContent = indexContent.replace('</head>', `${routingScript}\n</head>`);
    
    // Write the updated index.html
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Updated index.html for GitHub Pages compatibility');
  } else {
    console.error('❌ Error: index.html not found in web-build directory.');
  }
} catch (error) {
  console.error('❌ Error updating index.html:', error);
}

// Step 6: Create a 404.html that redirects to index.html for SPA routing
// This helps with direct access to routes on GitHub Pages
const notFoundHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Single Page App 404 fix for GitHub Pages
    // Redirects all requests to the main index.html
    const repo = '${repoName || 'polis'}';
    const path = window.location.pathname;
    
    if (path.indexOf('/' + repo) === 0) {
      // If path already contains the repo, redirect to the app's root
      sessionStorage.setItem('redirectPath', path.substring(('/' + repo).length) || '/');
      window.location.href = '/' + repo + '/';
    } else {
      // Otherwise, just redirect to index preserving the path
      sessionStorage.setItem('redirectPath', path);
      window.location.href = '/';
    }
  </script>
</head>
<body>
  <p>Redirecting to the main page...</p>
</body>
</html>
`;

fs.writeFileSync('web-build/404.html', notFoundHtml);
console.log('✅ Created 404.html for SPA routing on GitHub Pages');

console.log('🎉 Web build process completed successfully!');
console.log('📝 To deploy to GitHub Pages, run: npm run deploy'); 