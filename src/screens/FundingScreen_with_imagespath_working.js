import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator, Platform } from 'react-native';
import { Image } from 'expo-image';

// Import funding data
import fundingData from '../data/funding.json';

const FundingCard = ({ funding, onPress }) => {
  // Get image based on funding data with enhanced path handling
  const getImageSource = () => {
    try {
      // For web environment
      if (Platform.OS === 'web' && funding.imageUrl) {
        const imagePath = funding.imageUrl.fallback;
        
        if (imagePath) {
          // Get current URL details
          const origin = window.location.origin;
          
          // Check if we're in development mode (localhost)
          const isDevelopment = origin.includes('localhost');
          
          // Special handling for Expo development server
          if (isDevelopment) {
            // Extract the path to the asset, removing any leading slash
            const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
            
            // Make sure the path includes the "assets/" directory which is required by Expo
            const assetPath = cleanPath.startsWith('assets/') ? cleanPath : `assets/${cleanPath}`;
            
            // Format for Expo development asset server
            // Example: http://localhost:8084/assets/?unstable_path=.%2Fassets%2Fimages%2Ffunding%2Fdut.webp
            const assetServerPath = `${origin}/assets/?unstable_path=.%2F${encodeURIComponent(assetPath)}`;
            
            console.log(`Development mode detected, using asset server: ${assetServerPath}`);
            
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
          console.log(`Trying image URLs for ${funding.id}:`, possibleImageUrls);
          
          // Try to load the image with fallbacks
          return { 
            uri: possibleImageUrls[0],
            headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
          };
        }
      } 
      // For native platforms
      else if (funding.imageUrl?.webp) {
        return { uri: funding.imageUrl.webp };
      }
      
      // Fallback to a placeholder with the title
      return { 
        uri: `https://via.placeholder.com/400x300?text=${encodeURIComponent(funding.title)}`
      };
    } catch (error) {
      console.error(`Error loading image for funding ${funding.id}:`, error);
      return { 
        uri: `https://via.placeholder.com/400x300?text=Error`
      };
    }
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={getImageSource()}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
        onError={(error) => {
          console.error(`Image error for ${funding.id}:`, error);
        }}
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
        
        {funding.features && funding.features.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Características:</Text>
            {funding.features.map((feature, index) => (
              <Text key={index} style={styles.infoValue}>
                • {typeof feature === 'string' ? feature : feature.feature}
              </Text>
            ))}
          </View>
        )}
        
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

  useEffect(() => {
    // Load data from the imported JSON file
    const loadFundingData = () => {
      try {
        if (fundingData && fundingData.funding) {
          console.log(`Loaded ${fundingData.funding.length} funding opportunities`);
          setFundingOpportunities(fundingData.funding);
        } else {
          console.warn("No funding data available or invalid format");
          setFundingOpportunities([]);
        }
      } catch (error) {
        console.error("Error loading funding data:", error);
        setFundingOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    loadFundingData();
  }, []);

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
});

export default FundingScreen;
