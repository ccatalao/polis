import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Image } from 'expo-image';

// Import the chapters data
import chaptersData from '../data/chapters.json';

// Get image source based on chapter data with enhanced path handling
const getImageSource = (categoryId, imageUrl) => {
  try {
    // For web environment
    if (Platform.OS === 'web' && imageUrl) {
      const imagePath = imageUrl.fallback;
      
      console.log(`[DEBUG] Category ${categoryId} - Full imageUrl object:`, JSON.stringify(imageUrl));
      console.log(`[DEBUG] Category ${categoryId} - Fallback path from JSON:`, imagePath);
      
      if (imagePath) {
        // Get current URL details
        const origin = window.location.origin;
        
        // Check if we're in development mode (localhost)
        const isDevelopment = origin.includes('localhost');
        
        // Special handling for Expo development server
        if (isDevelopment) {
          // Extract the path to the asset, removing any leading slash
          const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
          console.log(`[DEBUG] Original path: ${imagePath}, cleaned path: ${cleanPath}`);
          
          // IMPORTANT: Check if the path is malformed with duplicated nested paths like 'assets/./assets/'
          let assetPath = cleanPath;
          
          // First clean up any "./" references which might be causing issues
          assetPath = assetPath.replace(/\.\//g, '');
          
          // Check for duplicated assets/ in the path
          while (assetPath.includes('assets/assets/')) {
            // Fix by removing one instance of assets/
            assetPath = assetPath.replace('assets/assets/', 'assets/');
            console.log(`[DEBUG] Found duplicated assets/, fixed path: ${assetPath}`);
          }
          
          // If the path doesn't include 'assets/', add it as required by Expo
          if (!assetPath.startsWith('assets/')) {
            assetPath = `assets/${assetPath}`;
            console.log(`[DEBUG] Added assets/ prefix, new path: ${assetPath}`);
          } else {
            console.log(`[DEBUG] Path already has assets/ prefix: ${assetPath}`);
          }
          
          // Construct the final path with NO ./
          const assetServerPath = `${origin}/assets/?unstable_path=${encodeURIComponent(assetPath)}`;
          
          console.log(`Development mode detected, using asset server: ${assetServerPath}`);
          console.log(`[DEBUG] Final encoded path: ${assetServerPath}`);
          
          return { 
            uri: assetServerPath,
            headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' }
          };
        }
        
        // For production/GitHub Pages
        // Determine if we're on GitHub Pages or other deployment
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        // Get repository name from pathname if on GitHub Pages
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        let repoName = pathSegments.length > 0 ? pathSegments[0] : '';
        
        // Try multiple base URL formations for production
        const possibleBaseUrls = [
          // Original base URL construction
          pathSegments.length > 0 ? `${origin}/${pathSegments[0]}` : origin,
          
          // GitHub Pages with full path
          isGitHubPages ? `${origin}/${repoName}` : null,
          
          // Try with just the origin
          origin,
          
          // Try with explicit "polis" repo name for GitHub Pages
          isGitHubPages ? `${origin}/polis` : null
        ].filter(Boolean); // Remove null entries
        
        // Log our detection for debugging
        console.log(`Environment: Web (Production), GitHub Pages: ${isGitHubPages}, Repo Name: ${repoName}`);
        
        // Try to construct image URLs in different ways
        const possibleImageUrls = [];
        
        possibleBaseUrls.forEach(baseUrl => {
          // With the found base URL, try different path formations
          if (imagePath.startsWith('/')) {
            // For paths starting with "/", join them directly
            possibleImageUrls.push(`${baseUrl}${imagePath}`);
            
            // Also try without double slashes
            if (baseUrl.endsWith('/')) {
              possibleImageUrls.push(`${baseUrl}${imagePath.substring(1)}`);
            }
          } else {
            // For relative paths, ensure a slash between base and path
            possibleImageUrls.push(`${baseUrl}/${imagePath}`);
          }
          
          // Add variations with and without "assets" directory
          if (!imagePath.includes('assets/')) {
            possibleImageUrls.push(`${baseUrl}/assets/${imagePath}`);
          }
        });
        
        // Log all the URLs we're going to try
        console.log(`Trying image URLs for category ${categoryId}:`, possibleImageUrls);
        
        // Try to load the image with fallbacks
        return { 
          uri: possibleImageUrls[0],
          headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
        };
      }
    } 
    // For native platforms
    else if (imageUrl?.webp) {
      return { uri: imageUrl.webp };
    }
    
    // Default fallback image paths for each category (for native platforms)
    const fallbackImages = {
      'urbanism': require('../../assets/images/publications/urbanism.webp'),
      'planning': require('../../assets/images/publications/planning.webp'),
      'architecture': require('../../assets/images/publications/architecture.webp'),
      'default': require('../../assets/images/home/publicacoes.webp')
    };
    
    return fallbackImages[categoryId] || fallbackImages['default'];
  } catch (error) {
    console.error(`Error loading image for category ${categoryId}:`, error);
    return require('../../assets/images/home/publicacoes.webp');
  }
};

const ChapterCard = ({ title, description, categoryId, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={getImageSource(categoryId, imageUrl)}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
        onError={(error) => {
          console.error(`Image error for category ${categoryId}:`, error);
        }}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.readMore}>Ver publicações</Text>
      </View>
    </TouchableOpacity>
  );
};

const ChaptersScreen = ({ navigation }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load chapters from the imported JSON file
    try {
      if (chaptersData && chaptersData.chapters) {
        const formattedChapters = Object.keys(chaptersData.chapters).map(key => ({
          id: key,
          ...chaptersData.chapters[key]
        }));
        setChapters(formattedChapters);
        console.log(`Loaded ${formattedChapters.length} chapters`);
      } else {
        console.warn("No chapters data available or invalid format");
        setChapters([]);
      }
    } catch (error) {
      console.error('Error loading chapters data:', error);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChapterPress = (chapter) => {
    navigation.navigate('ChapterDetail', { chapter });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>A carregar publicações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChapterCard
            title={item.title}
            description={item.description}
            categoryId={item.id}
            imageUrl={item.imageUrl}
            onPress={() => handleChapterPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
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
  cardImage: {
    width: '100%',
    height: 150,
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
    marginBottom: 12,
  },
  readMore: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ChaptersScreen; 