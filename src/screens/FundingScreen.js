import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the funding data
import fundingData from '../data/funding.json';

// Import image utilities
import { getImagePath } from '../utils/imageUtils';

const FundingCard = ({ funding }) => {
  // Update image handling to properly resolve paths
  let imageSource;
  
  if (funding.imageUrl) {
    imageSource = getImagePath(funding.imageUrl);
  } else if (funding.id) {
    // If no imageUrl but has an id, construct the path
    imageSource = getImagePath(`/images/funding/${funding.id}.jpeg`);
  } else {
    // Fallback to the default image
    imageSource = getImagePath('/images/home/funding.jpeg');
  }

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

  return (
    <View style={styles.card}>
      <Image
        source={imageSource}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{funding.title}</Text>
        <Text style={styles.cardDescription}>{funding.description}</Text>
        
        {funding.features && funding.features.length > 0 && (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Recursos:</Text>
            {funding.features.map((feature, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => Linking.openURL(feature.featureURL)}
                style={styles.featureItem}
              >
                <Text style={styles.featureText}>• {feature.feature}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
          <Text style={styles.linkButtonText}>Visitar site</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FundingScreen = () => {
  const [fundingOpportunities, setFundingOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load funding data from the imported JSON file
    try {
      setFundingOpportunities(fundingData.funding);
    } catch (error) {
      console.error('Error loading funding data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oportunidades de Financiamento</Text>
        <Text style={styles.headerSubtitle}>
          Explore oportunidades de financiamento para projetos de desenvolvimento urbano e sustentável.
        </Text>
      </View>
      
      <FlatList
        data={fundingOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FundingCard funding={item} />
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
  header: {
    padding: 16,
    backgroundColor: '#3498db',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
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
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  featureItem: {
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#3498db',
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default FundingScreen;
