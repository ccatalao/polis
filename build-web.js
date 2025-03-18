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
            // If we have no web directory, create a completely new index.html that loads directly
            console.log('⚠️ No web directory found, creating a direct-loading index.html...');
            
            // Create a more robust index.html with direct navigation links
            fs.writeFileSync('web-build/index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>Polis</title>
  <base href="/${repoName}/">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: #f8f9fa;
      color: #212529;
    }
    .app { 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 2rem;
      text-align: center;
    }
    h1 { 
      color: #0066cc; 
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .loading {
      margin: 2rem 0;
      font-size: 1.1rem;
    }
    .progress {
      width: 100%;
      height: 10px;
      background-color: #e9ecef;
      border-radius: 5px;
      margin: 1rem 0 2rem 0;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background-color: #0066cc;
      width: 0%;
      border-radius: 5px;
      transition: width 0.5s ease;
    }
    .reload-btn {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin: 1rem 0;
      font-weight: 500;
    }
    .reload-btn:hover {
      background-color: #0056b3;
    }
    .nav-links {
      margin: 2rem 0;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .nav-links h2 {
      margin-top: 0;
    }
    .nav-links a {
      display: block;
      padding: 0.75rem;
      margin: 0.5rem 0;
      background-color: #f1f8ff;
      color: #0366d6;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }
    .nav-links a:hover {
      background-color: #dbeeff;
    }
    .debug-info {
      margin-top: 2rem;
      font-size: 0.8rem;
      color: #6c757d;
      text-align: left;
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }
    .error-notification {
      margin-top: 1rem;
      color: #721c24;
      background-color: #f8d7da;
      padding: 1rem;
      border-radius: 4px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="app">
    <h1>Polis</h1>
    <div class="loading" id="loading-message">Carregando Polis...</div>
    <div class="progress">
      <div class="progress-bar" id="loading-bar"></div>
    </div>
    
    <button class="reload-btn" id="reload-btn">Force Refresh</button>
    
    <div id="error-notification" class="error-notification">
      Application failed to load automatically. Please try the direct links below.
    </div>
    
    <div class="nav-links">
      <h2>Direct Navigation Links</h2>
      <a href="/${repoName}/" id="home-link">Home</a>
      <a href="/${repoName}/funding" id="funding-link">Funding</a>
      <a href="/${repoName}/projects" id="projects-link">Projects</a>
      <a href="/${repoName}/publications" id="publications-link">Publications</a>
    </div>
    
    <div class="debug-info" id="debug-info">
      <p>Debug Information:</p>
      <div id="debug-content"></div>
    </div>
  </div>
  <script>
    // GitHub Pages cache-busting and routing fix
    (function() {
      // Add timestamp to log messages for debugging
      function log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = \`[\${timestamp}] \${message}\`;
        console.log(logMessage);
        
        const debugContent = document.getElementById('debug-content');
        if (debugContent) {
          const logElement = document.createElement('p');
          logElement.textContent = logMessage;
          debugContent.appendChild(logElement);
        }
      }
      
      // Force reload function
      function forceReload() {
        log('Force reloading page...');
        const timestamp = new Date().getTime();
        window.location.href = '/${repoName}/?t=' + timestamp + '&force=true';
      }
      
      // Handle reload button click
      const reloadBtn = document.getElementById('reload-btn');
      if (reloadBtn) {
        reloadBtn.addEventListener('click', forceReload);
      }
      
      // Update loading progress
      let progress = 0;
      const loadingBar = document.getElementById('loading-bar');
      const progressInterval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(progressInterval);
          log('Loading progress reached 100%');
          
          // Show error after full progress if still on loading page
          setTimeout(() => {
            const errorNotification = document.getElementById('error-notification');
            if (errorNotification && document.title === 'Polis') {
              errorNotification.style.display = 'block';
              log('Application failed to load, showing error message');
            }
          }, 2000);
        } else {
          progress += 5;
          if (loadingBar) {
            loadingBar.style.width = progress + '%';
          }
        }
      }, 500);
      
      // Log environment information
      const repoName = '${repoName}';
      log('Application startup - Repository: ' + repoName);
      log('Current path: ' + window.location.pathname);
      log('Host: ' + window.location.hostname);
      
      // Redirect to repository root if needed
      if (window.location.hostname.includes('github.io')) {
        if (window.location.pathname === '/') {
          log('Redirecting from root to repo path');
          const timestamp = new Date().getTime();
          window.location.replace('/' + repoName + '/?t=' + timestamp);
        }
      }
      
      // Update direct navigation links to include timestamps
      function updateLinks() {
        const timestamp = new Date().getTime();
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
          const currentHref = link.getAttribute('href');
          if (currentHref.indexOf('?') === -1) {
            link.setAttribute('href', currentHref + '?t=' + timestamp);
          }
        });
        
        log('Updated navigation links with timestamps');
      }
      
      // Initialize
      updateLinks();
      
      // Attempt to auto-redirect after a timeout
      setTimeout(forceReload, 10000);
    })();
  </script>
</body>
</html>
              `);
            console.log('✅ Created enhanced index.html file with direct navigation and debugging');
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
  <title>Page Not Found - Polis</title>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: #f8f9fa;
      color: #212529;
      text-align: center;
    }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 2rem;
    }
    h1 { 
      color: #0066cc; 
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .message {
      margin: 2rem 0;
      font-size: 1.1rem;
    }
    .btn {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin: 1rem 0;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
    }
    .btn:hover {
      background-color: #0056b3;
    }
    .debug-info {
      margin-top: 2rem;
      font-size: 0.8rem;
      color: #6c757d;
      text-align: left;
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }
    .nav-links {
      margin: 2rem 0;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      text-align: center;
    }
    .nav-links h2 {
      margin-top: 0;
    }
    .nav-links a {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      margin: 0.5rem;
      background-color: #f1f8ff;
      color: #0366d6;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }
    .nav-links a:hover {
      background-color: #dbeeff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Page Not Found</h1>
    <div class="message">
      <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
      <p>You will be redirected to the homepage in <span id="countdown">5</span> seconds...</p>
    </div>
    
    <a href="/${repoName}/?t=${new Date().getTime()}" class="btn" id="home-btn">Go to Homepage</a>
    
    <div class="nav-links">
      <h2>Direct Navigation Links</h2>
      <a href="/${repoName}/?t=${new Date().getTime()}" id="home-link">Home</a>
      <a href="/${repoName}/funding?t=${new Date().getTime()}" id="funding-link">Funding</a>
      <a href="/${repoName}/projects?t=${new Date().getTime()}" id="projects-link">Projects</a>
      <a href="/${repoName}/publications?t=${new Date().getTime()}" id="publications-link">Publications</a>
    </div>
    
    <div class="debug-info" id="debug-info">
      <p>Debug Information:</p>
      <div id="debug-content"></div>
    </div>
  </div>

  <script>
    // Single Page App 404 fix for GitHub Pages with debugging
    (function() {
      // Add timestamp to log messages for debugging
      function log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = \`[\${timestamp}] \${message}\`;
        console.log(logMessage);
        
        const debugContent = document.getElementById('debug-content');
        if (debugContent) {
          const logElement = document.createElement('p');
          logElement.textContent = logMessage;
          debugContent.appendChild(logElement);
        }
      }
      
      const repo = '${repoName || 'polis'}';
      const timestamp = new Date().getTime();
      const path = window.location.pathname;
      const search = window.location.search || '';
      
      log('404 Page - Current URL: ' + window.location.href);
      log('Repository name: ' + repo);
      
      // Store the intended path for apps that support it
      try {
        sessionStorage.setItem('redirectPath', path.replace('/' + repo, '') || '/');
        log('Stored redirectPath in sessionStorage: ' + path.replace('/' + repo, ''));
      } catch (e) {
        log('Error storing redirectPath: ' + e);
      }
      
      // Countdown and redirect
      let countdown = 5;
      const countdownElement = document.getElementById('countdown');
      
      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
          countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          log('Countdown finished, redirecting to home');
          window.location.href = '/' + repo + '/?t=' + timestamp + '&from=404';
        }
      }, 1000);
      
      // Update links with current timestamp
      function updateLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.indexOf(repo) > -1 && href.indexOf('?t=') === -1) {
            link.setAttribute('href', href + '?t=' + timestamp);
            log('Updated link: ' + href + ' → ' + link.getAttribute('href'));
          }
        });
      }
      
      updateLinks();
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync('web-build/404.html', notFoundHtml);
console.log('✅ Created 404.html for SPA routing on GitHub Pages');

console.log('🎉 Web build process completed successfully!');
console.log('📝 To deploy to GitHub Pages, run: npm run deploy'); 