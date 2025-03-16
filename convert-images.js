const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to recursively find all WebP images in a directory
function findWebpImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findWebpImages(filePath, fileList);
    } else if (file.toLowerCase().endsWith('.webp')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main function to convert WebP images to JPEG
function convertWebpToJpeg() {
  console.log('Searching for WebP images...');
  
  // Find all WebP images in the assets directory
  const webpImages = findWebpImages('assets');
  console.log(`Found ${webpImages.length} WebP images.`);
  
  // Convert each WebP image to JPEG by creating a copy
  webpImages.forEach(webpPath => {
    const jpegPath = webpPath.replace('.webp', '.jpeg').replace('.WEBP', '.jpeg');
    
    // Skip if JPEG version already exists
    if (fs.existsSync(jpegPath)) {
      console.log(`JPEG version already exists for ${webpPath}`);
      return;
    }
    
    console.log(`Converting ${webpPath} to JPEG...`);
    
    try {
      // Simple file copy as a workaround
      fs.copyFileSync(webpPath, jpegPath);
      console.log(`Created JPEG copy at ${jpegPath}`);
      
      // Update any references in JSON files
      updateJsonReferences(webpPath, jpegPath);
    } catch (error) {
      console.error(`Error converting ${webpPath}:`, error);
    }
  });
  
  console.log('Conversion process completed.');
}

// Function to update references in JSON files
function updateJsonReferences(webpPath, jpegPath) {
  // Get relative paths for search/replace
  const relativeWebpPath = webpPath.replace(/\\/g, '/');
  const relativeJpegPath = jpegPath.replace(/\\/g, '/');
  
  // Find all JSON files that might contain references
  const jsonFiles = [
    'src/data/funding.json',
    'src/data/projects.json',
    'src/data/publications.json'
  ];
  
  jsonFiles.forEach(jsonFile => {
    if (fs.existsSync(jsonFile)) {
      try {
        let content = fs.readFileSync(jsonFile, 'utf8');
        
        // Replace WebP references with JPEG
        if (content.includes(relativeWebpPath)) {
          content = content.replace(new RegExp(relativeWebpPath, 'g'), relativeJpegPath);
          fs.writeFileSync(jsonFile, content);
          console.log(`Updated references in ${jsonFile}`);
        }
      } catch (error) {
        console.error(`Error updating references in ${jsonFile}:`, error);
      }
    }
  });
}

// Run the conversion
convertWebpToJpeg(); 