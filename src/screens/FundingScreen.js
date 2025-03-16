import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the funding data
import fundingData from '../data/funding.json';

// Import image utilities
import { getImagePath } from '../utils/imageUtils';

const FundingCard = ({ item, onPress }) => {
  // Get the image source using the getImagePath utility
  const getImageSource = () => {
    try {
      // First try to use the imageUrl if it exists
      if (item.imageUrl) {
        return getImagePath(item.imageUrl);
      }
      
      // Fallback to constructing the path from the ID
      return getImagePath(`/images/funding/${item.id}.jpeg`);
    } catch (error) {
      console.error('Error loading funding image:', error);
      // Default image if there's an error
      return getImagePath('/images/funding/default.jpeg');
    }
  };

  const handleOpenLink = async () => {
    if (!item.url) {
      Alert.alert('Info', 'No link available for this funding opportunity.');
      return;
    }

    const canOpen = await Linking.canOpenURL(item.url);
    if (canOpen) {
      await Linking.openURL(item.url);
    } else {
      Alert.alert('Error', 'Cannot open this link.');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleOpenLink}>
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.image}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        {item.features && item.features.length > 0 && (
          <View style={styles.featuresContainer}>
            {item.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const FundingScreen = () => {
  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = async () => {
      try {
        // In a real app, this would be an API call
        setFunding(fundingData);
      } catch (error) {
        console.error('Error loading funding data:', error);
        Alert.alert('Error', 'Failed to load funding opportunities.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading funding opportunities...</Text>
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
        data={funding}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FundingCard item={item} />}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 160,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  featureItem: {
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#0277bd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default FundingScreen;
