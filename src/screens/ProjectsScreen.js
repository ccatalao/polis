import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the projects data
import projectsData from '../data/projects.json';

// Import image utilities
import { getImagePath } from '../utils/imageUtils';

const ProjectCard = ({ item, onPress }) => {
  // Get the image source using hardcoded paths for testing
  const getImageSource = () => {
    try {
      // Use hardcoded paths for testing
      const imageMap = {
        'cordis': 'https://ccatalao.github.io/polis/assets/images/projects/cordis.jpeg',
        'espon': 'https://ccatalao.github.io/polis/assets/images/projects/espon.jpeg',
        'jpi-urban': 'https://ccatalao.github.io/polis/assets/images/projects/jpi-urban.jpeg',
        'keep-eu': 'https://ccatalao.github.io/polis/assets/images/projects/keep-eu.jpeg',
        'uia': 'https://ccatalao.github.io/polis/assets/images/projects/uia.jpeg',
        'urbact': 'https://ccatalao.github.io/polis/assets/images/projects/urbact.jpeg'
      };
      
      // Log the item ID for debugging
      console.log('Project item ID:', item.id);
      
      // Return the hardcoded image path if available
      if (item.id && imageMap[item.id]) {
        console.log('Using hardcoded image path:', imageMap[item.id]);
        return imageMap[item.id];
      }
      
      // Fallback to the default image
      console.log('Using default image path');
      return 'https://ccatalao.github.io/polis/assets/images/home/projects.jpeg';
    } catch (error) {
      console.error('Error loading project image:', error);
      // Default image if there's an error
      return 'https://ccatalao.github.io/polis/assets/images/home/projects.jpeg';
    }
  };

  const handleOpenLink = async () => {
    if (!item.url) {
      Alert.alert('Info', 'No link available for this project.');
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

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = async () => {
      try {
        // In a real app, this would be an API call
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects data:', error);
        Alert.alert('Error', 'Failed to load projects.');
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
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProjectCard item={item} />}
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

export default ProjectsScreen;
