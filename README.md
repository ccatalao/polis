# Polis - Planeamento Urbano Informado

## 1. Description of the App

### Purpose
Polis is a comprehensive urban planning information platform designed to provide access to resources, services, and knowledge related to urban planning and development. The application serves as a centralized hub for various stakeholders including urban planners, municipal officials, researchers, and citizens interested in urban development.

### Specific Objectives
- Provide access to open-access academic publications related to urban planning, architecture, and territorial planning
- Showcase European urban development projects and funding opportunities
- Offer information about municipal services related to urban planning and housing
- Create a user-friendly interface that works seamlessly on both web and mobile platforms
- Facilitate knowledge sharing and resource discovery in the field of urban planning

## 2. Methodology / Approach for Development, Production and Deployment

### Development Approach
The project follows a hybrid approach that leverages React Native for cross-platform compatibility while optimizing the web experience through custom web implementations:

1. **Initial Development**: Started with React Native and Expo for rapid prototyping and cross-platform compatibility
2. **Web Optimization**: Created a custom web version using HTML, CSS, and JavaScript for better performance on web browsers
3. **Component-Based Architecture**: Used reusable components to maintain consistency across the application
4. **Data-Driven Design**: Implemented JSON-based data structures to easily update content without code changes
5. **Progressive Enhancement**: Ensured core functionality works across all platforms with enhanced features where supported

### Production Workflow
1. **Local Development**: Development and testing in local environment
2. **Version Control**: Git-based workflow with feature branches and regular commits
3. **Testing**: Manual testing on both web and mobile platforms
4. **Build Process**: Separate build processes for web and mobile versions
5. **Deployment**: Web version deployed to GitHub Pages, mobile version built using Expo

### Deployment Strategy
- **Web Version**: Deployed to GitHub Pages using the `gh-pages` package
- **Mobile Version**: Built using Expo's build services for iOS and Android
- **Continuous Updates**: Regular updates to both platforms through the established deployment pipelines

## 3. Web Version and App Version

### Web Version
The web version is optimized for browser-based access and features:

- **Custom HTML/CSS Implementation**: Enhanced web experience with custom styling and layout
- **Responsive Design**: Adapts to different screen sizes from desktop to mobile
- **Client-Side Routing**: Uses hash-based routing for navigation without page reloads
- **Static Hosting**: Hosted on GitHub Pages for reliable and free hosting
- **Progressive Web App (PWA) Features**: Can be installed on devices and works offline
- **Direct Data Access**: Loads JSON data directly from the file system

Key technologies:
- HTML5, CSS3, JavaScript
- Font Awesome for icons
- Client-side routing
- JSON for data storage

### Mobile Version
Instead of using a native mobile app approach with Expo, we opted for a mobile-optimized web application:

- **Mobile-First Design**: UI optimized for mobile screen sizes and touch interactions
- **Progressive Web App**: Can be installed on home screens and accessed offline
- **Lightweight Implementation**: Faster loading and less resource-intensive than a native app
- **Cross-Platform by Default**: Works on any mobile device with a modern browser
- **Simplified Deployment**: Single deployment process for both desktop and mobile users
- **Direct Updates**: Updates immediately available to all users without app store approval

Key technologies:
- Responsive HTML/CSS
- Mobile-optimized JavaScript
- Client-side data handling
- Media queries for device adaptation
- Touch-friendly UI components

### Shared Aspects
Both desktop and mobile web versions share:
- Common codebase with responsive design principles
- Same data sources (JSON files)
- Consistent visual design and branding
- Unified deployment process
- GitHub Pages hosting

## 4. Coding Methodology

### Architecture
- **Component-Based**: Organized around reusable UI components
- **Screen-Based Organization**: Screens represent different views in the application
- **Data-UI Separation**: Clear separation between data (JSON) and presentation (components)
- **Web-First Approach**: Optimized for web browsers with responsive design for mobile
- **Progressive Enhancement**: Core functionality works on all browsers with enhanced features where supported

### Coding Standards
- **ES6+ JavaScript**: Modern JavaScript syntax and features
- **Functional Components**: React functional components with hooks
- **Consistent Styling**: Consistent approach to styling across components
- **Error Handling**: Comprehensive error handling with fallback components
- **Platform-Specific Code**: Conditional code for platform-specific features

### Data Management
- **JSON Data Files**: Content stored in structured JSON files
- **Local Assets**: Images and other assets stored locally in the project
- **Dynamic Loading**: Content loaded dynamically based on user navigation
- **Fallback Mechanisms**: Fallback options for missing data or failed loads

## 5. App File Structure

```
polis/
├── assets/                  # Static assets
│   ├── fonts/               # Custom fonts
│   └── images/              # Images used in the app
│       ├── home/            # Home screen images
│       ├── publications/    # Publication images
│       └── ...              # Other image categories
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   ├── data/                # JSON data files
│   ├── screens/             # Screen components
│   └── styles/              # Shared styles
├── web/                     # Web-specific files
│   └── pwa/                 # Progressive Web App assets
├── web-build/               # Built web version
│   ├── assets/              # Compiled assets
│   ├── data/                # JSON data for web
│   ├── images/              # Images for web
│   └── static/              # Static files
├── dist/                    # Distribution folder for GitHub Pages
├── App.js                   # Main application component
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

### Key Files and Directories
- **App.js**: Main application entry point
- **src/screens/**: Contains all screen components
- **src/components/**: Reusable UI components
- **src/data/**: JSON data files that power the application
- **assets/images/**: Image assets organized by category
- **web-build/**: The built web version ready for deployment
- **dist/**: The distribution folder for GitHub Pages deployment

## 6. Most Used Commands

### Development Commands

#### Running Local Development Server
```bash
# Navigate to project directory
cd ~/Dev/polis

# Install dependencies (if not already installed)
npm install

# Start the Expo development server (not used in our current approach)
# npm start

# Start the web development server with Expo
npm run web

# Build the web version for local testing
npm run build:web

# Serve the built web version locally using serve
npx serve web-build

# Serve the built web version locally on a specific port (e.g., 3000)
npx serve -p 3000 web-build

# Serve the built web version locally with a specific host (for testing on other devices)
npx serve -l tcp://0.0.0.0:3000 web-build
```

The `npx serve web-build` command is particularly useful for testing the production build locally before deployment. It serves the static files from the `web-build` directory, simulating how they will behave when deployed to GitHub Pages.

### Build Commands

#### Building the Web Version
```bash
# Navigate to project directory
cd ~/Dev/polis

# Build the web version using Expo's web builder
expo build:web

# Alternative command for building the web version
npm run build:web

# Clean and prepare the dist directory for GitHub Pages deployment
# This command:
# 1. Removes the existing dist directory
# 2. Creates a new dist directory
# 3. Copies all files from web-build to dist
# 4. Creates a .nojekyll file to prevent GitHub Pages from using Jekyll
npm run predeploy

# Examine the contents of the dist directory
ls -la dist/

# Check the size of the build
du -sh dist/
```

The build process creates optimized static files in the `web-build` directory. The `predeploy` script then prepares these files for GitHub Pages deployment by copying them to the `dist` directory and adding a `.nojekyll` file to ensure proper handling by GitHub Pages.

### Deployment Commands

#### Deploying to GitHub Pages

### Building and Deploying the Web App

To deploy the application to GitHub Pages, use the following commands:

```bash
# Clean build and deploy (recommended)
npm run deploy:clean

# OR, if you already have a built version
npm run deploy
```

The deployment process:
1. Builds the web app using Vite
2. Initializes a git repository in the `web-build` directory
3. Adds all files to the repository
4. Commits the changes
5. Forces a push to the `gh-pages` branch of the GitHub repository

### Troubleshooting Deployment Issues

If you encounter issues with the deployment, you can try:

1. **Manual Deployment**:
   ```bash
   cd ~/Dev/polis
   npm run build:web
   cd web-build
   git init
   git add .
   git commit -m "Deploy to GitHub Pages"
   git remote add origin https://github.com/ccatalao/polis.git
   git push -f origin HEAD:gh-pages
   ```

2. **Check your GitHub repository settings**:
   - Go to your repository's "Settings" > "Pages"
   - Make sure the "Source" is set to the `gh-pages` branch
   - Verify the site is published at: https://ccatalao.github.io/polis/

3. **Common Issues**:
   - Missing files in the deployed version: Check the `web-build` directory contents before deploying
   - Styling differences: Ensure all CSS files are correctly linked and loaded
   - White screen: Check the browser console for errors related to JavaScript loading or path issues

### Local Testing

Before deploying, you can test the production build locally with:

```bash
# Build the web app
npm run build:web

# Serve the built app locally
npx serve web-build
```

This will serve the app on http://localhost:3000, allowing you to verify everything works correctly before deploying to GitHub Pages.

### Git Commands

#### Basic Git Operations
```bash
# Navigate to project directory
cd ~/Dev/polis

# Check the status of your repository
git status

# Add specific files to staging
git add src/screens/HomeScreen.js src/data/chapters.json

# Add all changed files to staging
git add .

# Commit changes with a descriptive message
git commit -m "Fix publication images in mobile web view"

# Push changes to the remote repository (GitHub)
git push origin master

# Pull the latest changes from the remote repository
git pull origin master

# View commit history
git log
git log --oneline --graph --decorate

# View changes in a specific file
git diff src/screens/HomeScreen.js
```

#### Branch Management
```bash
# Create a new branch and switch to it
git checkout -b feature/new-publication-section

# Switch to an existing branch
git checkout master

# List all branches
git branch

# List all remote branches
git branch -r

# Merge a branch into the current branch
git merge feature/new-publication-section

# Delete a branch after merging
git branch -d feature/new-publication-section

# Force delete a branch (even if not merged)
git branch -D feature/abandoned-feature
```

#### Advanced Git Operations
```bash
# Stash changes temporarily
git stash

# Apply stashed changes
git stash apply

# Create a tag for a release
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags to remote
git push --tags

# Amend the last commit (before pushing)
git commit --amend -m "Updated commit message"

# Reset to a specific commit (careful, this can lose work)
git reset --hard HEAD~1
```

These Git commands help maintain version control for your project, allowing you to track changes, collaborate with others, and manage different versions of your code.

### Other Useful Commands

#### Package Management
```bash
# Navigate to project directory
cd ~/Dev/polis

# Install all dependencies defined in package.json
npm install

# Install a specific package and add it to dependencies
npm install --save package-name

# Install a specific package version
npm install --save package-name@1.2.3

# Install a development dependency
npm install --save-dev package-name

# Update all packages to their latest versions according to package.json
npm update

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Remove a package
npm uninstall package-name
```

#### Project Maintenance
```bash
# Clean npm cache (useful for troubleshooting)
npm cache clean --force

# List all npm scripts defined in package.json
npm run

# Check for security vulnerabilities in dependencies
npm audit

# Fix security vulnerabilities automatically when possible
npm audit fix

# View detailed information about a package
npm info package-name

# Check node and npm versions
node -v
npm -v
```

#### File Operations
```bash
# Create a new directory
mkdir -p src/components/new-component

# Copy files or directories
cp -r src/components/existing-component src/components/new-component

# Move or rename files
mv src/old-name.js src/new-name.js

# Remove files
rm src/unused-file.js

# Remove directories
rm -rf dist/
```

These commands help with managing dependencies, maintaining your project, and performing common file operations during development.

## Conclusion

The Polis application successfully implements a hybrid approach to development, creating both a web version and a mobile app from a shared codebase. By leveraging React Native, Expo, and custom web implementations, the project achieves cross-platform compatibility while optimizing for each platform's strengths.

The data-driven architecture allows for easy content updates without code changes, making the application maintainable and extensible. The deployment strategy using GitHub Pages for web and Expo for mobile ensures reliable and cost-effective hosting.

This documentation provides a comprehensive overview of the project's structure, methodology, and commands, enabling future developers to understand, maintain, and extend the application. 

Various Commands:

git add . && git commit -m "Commit all changes" && git push origin main

npx serve web-build

cd ~/Dev/polis && npm run deploygit add . && git commit -m "Commit all changes" && git push origin main

npx serve web-build

cd ~/Dev/polis && npm run deploy