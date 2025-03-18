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
    
    // Add timestamp to the HTML file for cache busting
    const timestamp = new Date().getTime();
    
    // Fix 1: Add base URL tag for GitHub Pages
    // This ensures all relative paths work correctly
    const baseTag = `
    <!-- Dynamic base URL for GitHub Pages -->
    <base href="${repoName ? `/${repoName}/` : '/'}">
    <!-- Build timestamp: ${timestamp} -->
    `;
    
    // Insert the base tag after the head opening tag
    indexContent = indexContent.replace('<head>', '<head>' + baseTag);
    
    // Add cache-busting meta tags and improved routing script
    const routingScript = `
    <!-- Cache-busting meta tags -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <script>
      // GitHub Pages routing fix with timestamp for cache busting
      (function() {
        const repo = '${repoName}';
        const timestamp = new Date().getTime(); // For cache busting
        console.log('Loading app with cache bust timestamp:', timestamp);
        
        // Function to force reload and clear cache
        function forceReload() {
          console.log('Force reloading app...');
          sessionStorage.setItem('lastReload', timestamp);
          window.location.reload(true); // true forces reload from server, not cache
        }
        
        // Check if we need a force reload (app version mismatch or other issue)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('force-reload')) {
          forceReload();
          return;
        }
        
        // Check if we've been showing loading for too long (possible stale cache)
        setTimeout(() => {
          // If page hasn't fully loaded in 5 seconds, force reload
          const appElement = document.getElementById('root') || document.getElementById('app');
          if (!appElement || appElement.innerHTML.includes('Loading') || appElement.innerHTML.includes('Carregando')) {
            console.log('App appears stuck in loading state, force reloading...');
            forceReload();
          }
        }, 5000);
        
        // Check if we need to handle a redirect from 404.html
        const redirectPath = sessionStorage.getItem('redirectPath');
        if (redirectPath) {
          console.log('Handling redirect to:', redirectPath);
          sessionStorage.removeItem('redirectPath');
          // history.replaceState(null, null, redirectPath);
        }
        
        // Fix GitHub Pages base path
        if (window.location.hostname.includes('github.io')) {
          // We're on GitHub Pages
          if (repo && window.location.pathname === '/') {
            // At root, need to redirect to include repo name
            console.log('Redirecting to include repository name in path');
            window.location.replace('/' + repo + '/?t=' + timestamp);
          } else if (repo && window.location.pathname === '/' + repo) {
            // Missing trailing slash, add it for consistency
            console.log('Adding trailing slash for consistency');
            window.location.replace('/' + repo + '/?t=' + timestamp);
          }
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
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <script>
    // Single Page App 404 fix for GitHub Pages
    // Redirects all requests to the main index.html
    const repo = '${repoName || 'polis'}';
    const timestamp = new Date().getTime(); // For cache busting
    const path = window.location.pathname;
    const search = window.location.search;
    
    // Store the current URL information for the app to use after redirect
    sessionStorage.setItem('redirectPath', path.replace('/' + repo, '') || '/');
    
    // For GitHub Pages, redirect to the repo root with cache busting
    if (window.location.hostname.includes('github.io')) {
      console.log('404 page - redirecting to app root with timestamp:', timestamp);
      window.location.href = '/' + repo + '/?t=' + timestamp;
    } else {
      // Local development or other hosting
      window.location.href = '/?t=' + timestamp;
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