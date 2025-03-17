import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';

// Get image source based on publication data with enhanced path handling
const getImageSource = (publicationId, categoryId, imageUrl) => {
  try {
    // For web environment
    if (Platform.OS === 'web' && imageUrl) {
      const imagePath = imageUrl.fallback;
      
      console.log(`[DEBUG] Publication ${publicationId} - Full imageUrl object:`, JSON.stringify(imageUrl));
      console.log(`[DEBUG] Publication ${publicationId} - Fallback path from JSON:`, imagePath);
      
      if (imagePath) {
        // Get current URL details
        const origin = window.location.origin;
        
        // Check if we're in development mode (localhost)
        const isDevelopment = origin.includes('localhost');
        
        // Special handling for Expo development server
        if (isDevelopment) {
          // Extract the path to the asset, removing any leading slash
          const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
          console.log(`[DEBUG] Publication ${publicationId} - Original path: ${imagePath}, cleaned path: ${cleanPath}`);
          
          // IMPORTANT: Check if the path is malformed with duplicated nested paths like 'assets/./assets/'
          let assetPath = cleanPath;
          
          // First clean up any "./" references which might be causing issues
          assetPath = assetPath.replace(/\.\//g, '');
          
          // Check for duplicated assets/ in the path
          while (assetPath.includes('assets/assets/')) {
            // Fix by removing one instance of assets/
            assetPath = assetPath.replace('assets/assets/', 'assets/');
            console.log(`[DEBUG] Publication ${publicationId} - Found duplicated assets/, fixed path: ${assetPath}`);
          }
          
          // If the path doesn't include 'assets/', add it as required by Expo
          if (!assetPath.startsWith('assets/')) {
            assetPath = `assets/${assetPath}`;
            console.log(`[DEBUG] Publication ${publicationId} - Added assets/ prefix, new path: ${assetPath}`);
          } else {
            console.log(`[DEBUG] Publication ${publicationId} - Path already has assets/ prefix: ${assetPath}`);
          }
          
          // Construct the final path with NO ./
          const assetServerPath = `${origin}/assets/?unstable_path=${encodeURIComponent(assetPath)}`;
          
          console.log(`Development mode detected, using asset server for publication ${publicationId}: ${assetServerPath}`);
          console.log(`[DEBUG] Publication ${publicationId} - Final encoded path: ${assetServerPath}`);
          
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
        console.log(`Trying image URLs for publication ${publicationId}:`, possibleImageUrls);
        
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
    
    // Default hardcoded fallbacks for native platforms
    // These lookups will only be used if no imageUrl is provided
    try {
      // Default category-level fallbacks
      const fallbackCategoryImages = {
        'urbanism': require('../../assets/images/publications/urbanism.webp'),
        'planning': require('../../assets/images/publications/planning.webp'),
        'architecture': require('../../assets/images/publications/architecture.webp'),
        'default': require('../../assets/images/home/publicacoes.webp')
      };
      
      // Use the hardcoded publication-specific image if available
      if (categoryId === 'urbanism') {
        // Urbanism publications
        switch (publicationId) {
          case 'articulo': return require('../../assets/images/publications/articulo.webp');
          case 'archive': return require('../../assets/images/publications/archive.webp');
          case 'buildings-cities': return require('../../assets/images/publications/buildings.webp');
          case 'cidades': return require('../../assets/images/publications/cidades.webp');
          case 'city-environment-interactions': return require('../../assets/images/publications/citty-environment-interactions.webp');
          case 'ciudades': return require('../../assets/images/publications/ciudades.webp');
          case 'computational-urban-science': return require('../../assets/images/publications/computational-urban-science.webp');
          case 'current-urban-studies': return require('../../assets/images/publications/current-urban-studies.webp');
          case 'frontiers-built-environment': return require('../../assets/images/publications/frontiers-built-environment.webp');
          case 'future-cities-environment': return require('../../assets/images/publications/future-cities-environment.webp');
          case 'iet-smart-cities': return require('../../assets/images/publications/smart-cities.webp');
          case 'international-urban-sustainable': return require('../../assets/images/publications/urban-sustainable.webp');
          case 'irspsd': return require('../../assets/images/publications/irspsd.webp');
          case 'urban-ecology': return require('../../assets/images/publications/urban-ecology.webp');
          case 'urban-management': return require('../../assets/images/publications/urban-management.webp');
          case 'urban-mobility': return require('../../assets/images/publications/urban-mobility.webp');
          case 'research-urbanism': return require('../../assets/images/publications/research-urbanism.webp');
          case 'resilient-cities': return require('../../assets/images/publications/resilient-cities.webp');
          case 'smart-construction': return require('../../assets/images/publications/smart-construction.webp');
          case 'urban-agriculture': return require('../../assets/images/publications/urban-agriculture.webp');
          case 'urban-governance': return require('../../assets/images/publications/urban-governance.webp');
          case 'urban-lifeline': return require('../../assets/images/publications/urban-lifeline.webp');
          case 'urban-planning': return require('../../assets/images/publications/urban-planning.webp');
          case 'urban-planning-transport': return require('../../assets/images/publications/urban-planning-transport.webp');
          case 'urban-science': return require('../../assets/images/publications/urban-science.webp');
          case 'urban-transcripts': return require('../../assets/images/publications/urban-transcripts.webp');
          case 'urban-transformations': return require('../../assets/images/publications/urban-transformations.webp');
          case 'urbana': return require('../../assets/images/publications/urbana.webp');
          case 'urbe': return require('../../assets/images/publications/urbe.webp');
        }
      } else if (categoryId === 'planning') {
        // Planning publications
        switch (publicationId) {
          case 'blue-green-systems': return require('../../assets/images/publications/blue-green-systems.webp');
          case 'creative-practices': return require('../../assets/images/publications/creative-practices.webp');
          case 'spatial-development': return require('../../assets/images/publications/spatial-development.webp');
          case 'finisterra': return require('../../assets/images/publications/finisterra.webp');
          case 'urban-rural-planning': return require('../../assets/images/publications/urban-rural-planning.webp');
          case 'regional-development': return require('../../assets/images/publications/regional-development.webp');
          case 'public-space': return require('../../assets/images/publications/public-space.webp');
          case 'public-transportation': return require('../../assets/images/publications/public-transportation.webp');
          case 'spatial-information': return require('../../assets/images/publications/spatial-information.webp');
          case 'planext': return require('../../assets/images/publications/planext.webp');
          case 'regional-science-policy': return require('../../assets/images/publications/regional-practice.webp');
          case 'regional-studies': return require('../../assets/images/publications/regional-studies.webp');
          case 'scienze-territorio': return require('../../assets/images/publications/scienze-territorio.webp');
          case 'tema': return require('../../assets/images/publications/tema.webp');
          case 'territorial-identity': return require('../../assets/images/publications/territorial-identity.webp');
        }
      } else if (categoryId === 'architecture') {
        // Architecture publications
        switch (publicationId) {
          case 'architecture-mps': return require('../../assets/images/publications/archicteture-mps.webp');
          case 'agathon': return require('../../assets/images/publications/agathon.webp');
          case 'cadernos-arte-publica': return require('../../assets/images/publications/arte-publlca.webp');
          case 'docomomo-journal': return require('../../assets/images/publications/docomomo.webp');
          case 'enq-enquiry': return require('../../assets/images/publications/enq.webp');
          case 'estudo-previo': return require('../../assets/images/publications/estudo-previo.webp');
          case 'field': return require('../../assets/images/publications/field.webp');
          case 'architecture-urbanism': return require('../../assets/images/publications/architecture-urbanism.webp');
          case 'revista-arquitectura': return require('../../assets/images/publications/revista-arquitectura.webp');
        }
      }
      
      // If no specific publication image found, use the category fallback
      return fallbackCategoryImages[categoryId] || fallbackCategoryImages['default'];
      
    } catch (specificError) {
      console.error(`Error loading specific image for publication ${publicationId}:`, specificError);
      return require('../../assets/images/home/publicacoes.webp');
    }
  } catch (error) {
    console.error(`Error loading image for publication ${publicationId}:`, error);
    return require('../../assets/images/home/publicacoes.webp');
  }
};

const PublicationCard = ({ title, description, url, publicationId, categoryId, imageUrl }) => {
  const handlePress = async () => {
    // Check if the link can be opened
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Erro",
        `Não foi possível abrir o link: ${url}`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={getImageSource(publicationId, categoryId, imageUrl)}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
        onError={(error) => {
          console.error(`Image error for publication ${publicationId}:`, error);
        }}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <Text style={styles.linkText}>Visitar site</Text>
      </View>
    </TouchableOpacity>
  );
};

const ChapterDetailScreen = ({ route, navigation }) => {
  const { chapter } = route.params;
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: chapter.title
    });
  }, [navigation, chapter]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{chapter.title}</Text>
        <Text style={styles.description}>{chapter.description}</Text>
      </View>
      
      <FlatList
        data={chapter.content}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PublicationCard
            title={item.title}
            description={item.description}
            url={item.url}
            publicationId={item.id}
            categoryId={chapter.id}
            imageUrl={item.imageUrl}
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
  header: {
    padding: 16,
    backgroundColor: '#3498db',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
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
    lineHeight: 20,
  },
  linkText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ChapterDetailScreen; 