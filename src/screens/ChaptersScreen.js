import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the chapters data
import chaptersData from '../data/chapters.json';

// Import image utility
import { getImagePath } from '../utils/imageUtils';

const ChapterCard = ({ item, onPress }) => {
  // Get the image source using the getImagePath utility
  const getCategoryImage = () => {
    try {
      // Use hardcoded paths for testing
      const imageMap = {
        'urbanism': 'https://ccatalao.github.io/polis/assets/images/publications/urbanism.jpeg',
        'urban-science': 'https://ccatalao.github.io/polis/assets/images/publications/urban-science.jpeg',
        'urban-planning': 'https://ccatalao.github.io/polis/assets/images/publications/urban-planning.jpeg'
      };
      
      // Log the item ID for debugging
      console.log('Chapter item ID:', item.id);
      
      // Return the hardcoded image path if available
      if (item.id && imageMap[item.id]) {
        console.log('Using hardcoded image path:', imageMap[item.id]);
        return { uri: imageMap[item.id] };
      }
      
      // Fallback to the default image
      console.log('Using default image path');
      return { uri: 'https://ccatalao.github.io/polis/assets/images/home/publicacoes.jpeg' };
    } catch (error) {
      console.error('Error loading category image:', error);
      // Default image if there's an error
      return { uri: 'https://ccatalao.github.io/polis/assets/images/home/publicacoes.jpeg' };
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={getCategoryImage()}
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
      </View>
    </TouchableOpacity>
  );
};

const ChaptersScreen = ({ navigation }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = async () => {
      try {
        // In a real app, this would be an API call
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error loading chapters data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChapterPress = (chapter) => {
    navigation.navigate('ChapterDetail', {
      chapter: chapter,
      publications: chapter.content
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading publications...</Text>
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
            item={item} 
            onPress={() => handleChapterPress(item)}
          />
        )}
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

export default ChaptersScreen; 