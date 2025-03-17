import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator, Platform, Button, ScrollView } from 'react-native';
import { Image } from 'expo-image';

// Import funding data
import fundingData from '../data/funding.json';

// Enhanced debugging function to log image paths
const logImageAttempt = (funding, path, success = false) => {
  console.log(`[Image Debug] Attempting to load image for funding ${funding.id}`);
  console.log(`[Image Debug] Path: ${path}`);
  console.log(`[Image Debug] Success: ${success}`);
};

// Hardcoded image paths for GitHub Pages deployment
const getImageSource = (funding) => {
  // Check if we're in a web environment and on GitHub Pages
  const isWeb = Platform.OS === 'web';
  const isGitHubPages = isWeb && window.location.hostname.includes('github.io');
  
  try {
    // Log environment information
    console.log(`[Image Debug] Environment: ${isWeb ? 'Web' : 'Native'}`);
    console.log(`[Image Debug] GitHub Pages: ${isGitHubPages}`);
    console.log(`[Image Debug] Funding ID: ${funding.id}`);
    
    if (isGitHubPages) {
      // Use hardcoded paths for GitHub Pages
      const baseUrl = 'https://carlosalves.dev/polis';
      
      // IMPORTANT: Based on the 404 errors, we need to check if the images are in a different location
      // The errors show that the images are not found at the expected paths
      
      // First try: Use the standard path structure with different extensions
      const standardPaths = [
        `${baseUrl}/images/funding/${funding.id}.jpeg`,
        `${baseUrl}/images/funding/${funding.id}.jpg`,
        `${baseUrl}/images/funding/${funding.id}.png`,
        `${baseUrl}/images/funding/${funding.id}.webp`
      ];
      
      // Second try: Check if images might be in the assets directory instead
      const assetsPaths = [
        `${baseUrl}/assets/images/funding/${funding.id}.jpeg`,
        `${baseUrl}/assets/images/funding/${funding.id}.jpg`,
        `${baseUrl}/assets/images/funding/${funding.id}.webp`
      ];
      
      // Third try: Check if images might be using a different naming convention
      const alternativePaths = [
        // Try with capitalized first letter
        `${baseUrl}/images/funding/${funding.id.charAt(0).toUpperCase() + funding.id.slice(1)}.jpeg`,
        // Try with a completely different path structure (home directory)
        `${baseUrl}/images/home/financiamento.webp`,
        // Try with a different ID mapping
        funding.id === 'dut' ? `${baseUrl}/images/funding/DUT.jpeg` : null,
        funding.id === 'life' ? `${baseUrl}/images/funding/LIFE.jpeg` : null,
        funding.id === 'erdf' ? `${baseUrl}/images/funding/FEDER.jpeg` : null,
        funding.id === 'new-european-bauhaus' ? `${baseUrl}/images/funding/bauhaus.jpeg` : null,
        funding.id === 'interreg' ? `${baseUrl}/images/funding/INTERREG.jpeg` : null,
        funding.id === 'investeu' ? `${baseUrl}/images/funding/InvestEU.jpeg` : null,
        funding.id === 'jtf' ? `${baseUrl}/images/funding/JTF.jpeg` : null
      ].filter(Boolean); // Remove null entries
      
      // Combine all possible paths
      const allPaths = [...standardPaths, ...assetsPaths, ...alternativePaths];
      
      // Log the paths we're trying
      console.log(`[Image Debug] Trying paths for ${funding.id}:`, allPaths);
      
      // Return a placeholder image with all fallback paths
      // We'll use a placeholder image from a CDN that definitely exists
      return { 
        uri: `https://via.placeholder.com/400x300?text=${funding.title.replace(/\s+/g, '+')}`,
        fallbackPaths: allPaths
      };
    } else {
      // Use the imageUrl from the data if available
      if (funding.imageUrl) {
        const imagePath = isWeb ? funding.imageUrl.fallback : funding.imageUrl.webp;
        console.log(`[Image Debug] Using imageUrl from data: ${imagePath}`);
        
        // For web, we need to fix the path issue
        if (isWeb) {
          // The debug logs show that paths starting with / are failing
          // Let's create fallback paths with different formats
          const fallbackPaths = [
            // Try with public URL prefix
            `${window.location.origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`,
            // Try without leading slash
            imagePath.startsWith('/') ? imagePath.substring(1) : imagePath,
            // Try with different extensions
            imagePath.replace('.jpeg', '.jpg'),
            imagePath.replace('.jpeg', '.webp'),
            imagePath.replace('.jpeg', '.png'),
            // Try with absolute path to assets folder
            `${window.location.origin}/assets/images/funding/${funding.id}.jpeg`,
            `${window.location.origin}/assets/images/funding/${funding.id}.jpg`,
            // Try with public folder
            `/public${imagePath}`,
            // Try with direct path to static folder
            `/static/media/funding/${funding.id}.jpeg`,
            `/static/media/funding/${funding.id}.jpg`
          ];
          
          // Start with a reliable placeholder image
          return { 
            uri: `https://via.placeholder.com/400x300?text=${funding.title.replace(/\s+/g, '+')}`,
            fallbackPaths 
          };
        }
        
        return { uri: imagePath };
      } else {
        // Return a placeholder image if no valid source is found
        console.log(`[Image Debug] No image URL available for funding ${funding.id}, using placeholder`);
        return { 
          uri: `https://via.placeholder.com/400x300?text=${funding.title.replace(/\s+/g, '+')}` 
        };
      }
    }
  } catch (error) {
    console.error(`[Image Debug] Error loading image for funding ${funding.id}:`, error);
    // Return a placeholder image in case of error
    return { 
      uri: `https://via.placeholder.com/400x300?text=Error+Loading+Image` 
    };
  }
};

// Simple mapping for funding images
const getFundingImage = (fundingId) => {
  switch (fundingId) {
    case 'dut':
      return require('../../assets/images/funding/dut.webp');
    case 'life':
      return require('../../assets/images/funding/life.webp');
    case 'erdf':
      return require('../../assets/images/funding/feder.webp');
    case 'new-european-bauhaus':
      return require('../../assets/images/funding/bauhaus.webp');
    case 'interreg':
      return require('../../assets/images/funding/interreg.webp');
    case 'investeu':
      return require('../../assets/images/funding/investeu.webp');
    default:
      return require('../../assets/images/home/funding.webp');
  }
};

const FundingCard = ({ funding, onPress }) => {
  // Use direct image reference instead of URI
  const imageSource = getFundingImage(funding.id);
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={imageSource}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{funding.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{funding.description}</Text>
        {funding.deadline && <Text style={styles.deadline}>Prazo: {funding.deadline}</Text>}
        <Text style={styles.viewDetails}>Ver detalhes</Text>
      </View>
    </TouchableOpacity>
  );
};

const FundingDetailModal = ({ funding, visible, onClose }) => {
  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(funding.url);
      
      if (supported) {
        await Linking.openURL(funding.url);
      } else {
        Alert.alert("Erro", `Não foi possível abrir o link: ${funding.url}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link");
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{funding.title}</Text>
        <Text style={styles.modalDescription}>{funding.description}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Prazo:</Text>
          <Text style={styles.infoValue}>{funding.deadline}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Elegibilidade:</Text>
          <Text style={styles.infoValue}>{funding.eligibility}</Text>
        </View>
        
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
            <Text style={styles.linkButtonText}>Visitar site</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const FundingScreen = () => {
  const [fundingOpportunities, setFundingOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [imagePathsInfo, setImagePathsInfo] = useState({});
  const [siteStructure, setSiteStructure] = useState(null);
  const [checkingStructure, setCheckingStructure] = useState(false);

  useEffect(() => {
    // Load data from the imported JSON file
    if (fundingData && fundingData.funding) {
      setFundingOpportunities(fundingData.funding);
    } else {
      // If no data is available, set an empty array
      setFundingOpportunities([]);
    }
    setLoading(false);
  }, []);

  // Function to check image paths
  const checkImagePaths = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert("Debug Info", "Image path checking is only available in web environment");
      return;
    }

    const results = {};
    
    // Check for each funding item
    for (const funding of fundingOpportunities) {
      results[funding.id] = { checked: [], available: [] };
      
      // Generate possible paths
      const baseUrl = window.location.hostname.includes('github.io') 
        ? 'https://carlosalves.dev/polis' 
        : '';
        
      const possiblePaths = [
        `${baseUrl}/images/funding/${funding.id}.jpeg`,
        `${baseUrl}/images/funding/${funding.id}.jpg`,
        `${baseUrl}/images/funding/${funding.id}.png`,
        `${baseUrl}/images/funding/${funding.id}.webp`,
        `${baseUrl}/assets/images/funding/${funding.id}.jpeg`,
        `${baseUrl}/assets/images/funding/${funding.id}.jpg`,
        `${baseUrl}/assets/images/funding/${funding.id}.webp`
      ];
      
      // Add paths from the data
      if (funding.imageUrl) {
        if (funding.imageUrl.fallback) possiblePaths.push(funding.imageUrl.fallback);
        if (funding.imageUrl.webp) possiblePaths.push(funding.imageUrl.webp);
      }
      
      // Check each path
      for (const path of possiblePaths) {
        results[funding.id].checked.push(path);
        
        try {
          // Create a promise to check if the image exists
          const exists = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = path.startsWith('http') ? path : (
              path.startsWith('/') ? `${window.location.origin}${path}` : `${window.location.origin}/${path}`
            );
          });
          
          if (exists) {
            results[funding.id].available.push(path);
          }
        } catch (error) {
          console.error(`Error checking path ${path}:`, error);
        }
      }
    }
    
    setImagePathsInfo(results);
    console.log("Image paths check results:", results);
  };

  // Function to check if a URL exists (for web only)
  const checkUrlExists = async (url) => {
    if (Platform.OS !== 'web') return false;
    
    try {
      // For images, we use the Image approach
      if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        return await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
      } 
      // For other resources, try a HEAD request
      else {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      }
    } catch (error) {
      console.error(`Error checking URL ${url}:`, error);
      return false;
    }
  };

  // Function to check the site structure
  const checkSiteStructure = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert("Debug Info", "Site structure checking is only available in web environment");
      return;
    }

    setCheckingStructure(true);
    
    try {
      const baseUrl = window.location.hostname.includes('github.io') 
        ? 'https://carlosalves.dev/polis' 
        : window.location.origin;
      
      // Check common directories
      const directories = [
        '/images',
        '/images/funding',
        '/images/projetos',
        '/assets',
        '/assets/images',
        '/assets/images/funding',
        '/assets/images/home',
        '/static',
        '/static/media',
        '/public',
        '/public/images'
      ];
      
      const structure = {
        baseUrl,
        directories: {},
        commonImageFormats: {},
        imagesInDOM: []
      };
      
      // Check if directories exist
      for (const dir of directories) {
        const url = `${baseUrl}${dir}`;
        structure.directories[dir] = await checkUrlExists(url);
      }
      
      // Check which image formats are supported
      const testFormats = ['jpeg', 'jpg', 'png', 'webp'];
      for (const format of testFormats) {
        // Try with a known image ID
        const url = `${baseUrl}/images/funding/dut.${format}`;
        structure.commonImageFormats[format] = await checkUrlExists(url);
      }
      
      // Try to detect the actual image paths for a few funding items
      structure.detectedPaths = {};
      
      for (const id of ['dut', 'life', 'erdf']) {
        structure.detectedPaths[id] = { found: false, path: null };
        
        // Try different combinations
        const combinations = [
          // Different directories
          { dir: '/images/funding/', ext: 'jpeg' },
          { dir: '/images/funding/', ext: 'jpg' },
          { dir: '/images/funding/', ext: 'png' },
          { dir: '/images/funding/', ext: 'webp' },
          { dir: '/assets/images/funding/', ext: 'jpeg' },
          { dir: '/assets/images/funding/', ext: 'jpg' },
          { dir: '/assets/images/funding/', ext: 'webp' },
          // Try with capitalized ID
          { dir: '/images/funding/', ext: 'jpeg', capitalize: true },
          // Try with different ID format
          { dir: '/images/home/', ext: 'webp', altId: 'financiamento' },
          // Try static media folder
          { dir: '/static/media/', ext: 'jpeg' },
          { dir: '/static/media/', ext: 'jpg' },
          // Try public folder
          { dir: '/public/images/funding/', ext: 'jpeg' },
          { dir: '/public/images/funding/', ext: 'jpg' }
        ];
        
        for (const combo of combinations) {
          const testId = combo.capitalize ? id.charAt(0).toUpperCase() + id.slice(1) : 
                        (combo.altId ? combo.altId : id);
          const url = `${baseUrl}${combo.dir}${testId}.${combo.ext}`;
          
          const exists = await checkUrlExists(url);
          if (exists) {
            structure.detectedPaths[id] = { found: true, path: url };
            break;
          }
        }
      }
      
      // NEW: Scan the DOM for all images to see what's actually loaded
      if (typeof document !== 'undefined') {
        const allImages = document.querySelectorAll('img');
        structure.imagesInDOM = Array.from(allImages).map(img => ({
          src: img.src,
          width: img.width,
          height: img.height,
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        }));
      }
      
      // NEW: Check if there are any images in the public folder
      try {
        const response = await fetch(`${baseUrl}/asset-manifest.json`);
        if (response.ok) {
          const manifest = await response.json();
          structure.assetManifest = manifest;
        }
      } catch (error) {
        console.error("Error fetching asset manifest:", error);
      }
      
      setSiteStructure(structure);
      console.log("Site structure check results:", structure);
    } catch (error) {
      console.error("Error checking site structure:", error);
      Alert.alert("Error", "Failed to check site structure: " + error.message);
    } finally {
      setCheckingStructure(false);
    }
  };

  const handleFundingPress = (funding) => {
    setSelectedFunding(funding);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>A carregar oportunidades de financiamento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <View style={styles.debugContainer}>
          <Button 
            title={debugMode ? "Hide Debug Info" : "Show Debug Info"} 
            onPress={() => setDebugMode(!debugMode)} 
          />
          {debugMode && (
            <View style={styles.debugButtonsRow}>
              <Button 
                title="Check Image Paths" 
                onPress={checkImagePaths} 
                color="#ff9800"
              />
              <Button 
                title={checkingStructure ? "Checking..." : "Check Site Structure"} 
                onPress={checkSiteStructure} 
                disabled={checkingStructure}
                color="#9c27b0"
              />
            </View>
          )}
        </View>
      )}
      
      {debugMode && siteStructure && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Site Structure Debug Info:</Text>
          <ScrollView style={styles.debugScroll}>
            <Text style={styles.debugItemTitle}>Base URL: {siteStructure.baseUrl}</Text>
            
            <Text style={styles.debugItemSubtitle}>Directories:</Text>
            {Object.entries(siteStructure.directories).map(([dir, exists]) => (
              <Text key={dir} style={exists ? styles.debugPath : styles.debugNoPath}>
                {dir}: {exists ? '✓ Exists' : '✗ Not Found'}
              </Text>
            ))}
            
            <Text style={styles.debugItemSubtitle}>Supported Image Formats:</Text>
            {Object.entries(siteStructure.commonImageFormats).map(([format, supported]) => (
              <Text key={format} style={supported ? styles.debugPath : styles.debugNoPath}>
                .{format}: {supported ? '✓ Supported' : '✗ Not Supported'}
              </Text>
            ))}
            
            <Text style={styles.debugItemSubtitle}>Detected Image Paths:</Text>
            {Object.entries(siteStructure.detectedPaths).map(([id, info]) => (
              <Text key={id} style={info.found ? styles.debugPath : styles.debugNoPath}>
                {id}: {info.found ? `✓ Found at ${info.path}` : '✗ Not Found'}
              </Text>
            ))}
            
            {siteStructure.imagesInDOM && siteStructure.imagesInDOM.length > 0 && (
              <>
                <Text style={styles.debugItemSubtitle}>Images Found in DOM:</Text>
                {siteStructure.imagesInDOM.map((img, index) => (
                  <View key={index} style={styles.debugImageItem}>
                    <Text style={styles.debugPath}>
                      Source: {img.src}
                    </Text>
                    <Text style={styles.debugPath}>
                      Size: {img.width}x{img.height} (Natural: {img.naturalWidth}x{img.naturalHeight})
                    </Text>
                    <Text style={styles.debugPath}>
                      Loaded: {img.complete && img.naturalWidth > 0 ? '✓' : '✗'}
                    </Text>
                  </View>
                ))}
              </>
            )}
            
            {siteStructure.assetManifest && (
              <>
                <Text style={styles.debugItemSubtitle}>Asset Manifest:</Text>
                <Text style={styles.debugPath}>
                  {JSON.stringify(siteStructure.assetManifest, null, 2)}
                </Text>
              </>
            )}
          </ScrollView>
          
          <View style={styles.debugButtonsRow}>
            <Button 
              title="Fix Image Paths" 
              onPress={() => {
                // Force reload all images with placeholder images
                setFundingOpportunities(prev => {
                  return prev.map(item => ({
                    ...item,
                    imageUrl: {
                      ...item.imageUrl,
                      fallback: `https://via.placeholder.com/400x300?text=${item.title.replace(/\s+/g, '+')}`,
                      webp: `https://via.placeholder.com/400x300?text=${item.title.replace(/\s+/g, '+')}`
                    }
                  }));
                });
                Alert.alert("Images Fixed", "All images have been replaced with placeholders.");
              }}
              color="#4caf50"
            />
          </View>
        </View>
      )}
      
      {debugMode && Object.keys(imagePathsInfo).length > 0 && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Image Paths Debug Info:</Text>
          <ScrollView style={styles.debugScroll}>
            {Object.entries(imagePathsInfo).map(([id, info]) => (
              <View key={id} style={styles.debugItem}>
                <Text style={styles.debugItemTitle}>Funding ID: {id}</Text>
                <Text style={styles.debugItemSubtitle}>Available Paths:</Text>
                {info.available.length > 0 ? (
                  info.available.map((path, index) => (
                    <Text key={index} style={styles.debugPath}>{path}</Text>
                  ))
                ) : (
                  <Text style={styles.debugNoPath}>No available paths found</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      <FlatList
        data={fundingOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FundingCard
            funding={item}
            onPress={() => handleFundingPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      
      {selectedFunding && (
        <FundingDetailModal
          funding={selectedFunding}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  deadline: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 12,
    fontWeight: '500',
  },
  viewDetails: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },
  infoSection: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  debugContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  debugInfo: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
    maxHeight: 300,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugScroll: {
    maxHeight: 250,
  },
  debugItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  debugItemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugItemSubtitle: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  debugPath: {
    fontSize: 12,
    color: '#2ecc71',
    marginLeft: 10,
  },
  debugNoPath: {
    fontSize: 12,
    color: '#e74c3c',
    marginLeft: 10,
  },
  debugButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  imageError: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 10,
  },
  debugImageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
});

export default FundingScreen;
