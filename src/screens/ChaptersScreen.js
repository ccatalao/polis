import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the chapters data
import chaptersData from '../data/chapters.json';

// Hardcoded image paths for the main categories
const getCategoryImage = (categoryId) => {
  switch (categoryId) {
    case 'urbanism':
      return require('../../assets/images/publications/urbanism.webp');
    case 'planning':
      return require('../../assets/images/publications/planning.webp');
    case 'architecture':
      return require('../../assets/images/publications/architecture.webp');
    default:
      return require('../../assets/images/home/publicacoes.webp');
  }
};

const ChapterCard = ({ title, description, categoryId, imageUrl, onPress }) => {
  // Use the imageUrl if provided, otherwise fall back to the hardcoded image
  const imageSource = imageUrl 
    ? { uri: imageUrl.webp || imageUrl.fallback }
    : getCategoryImage(categoryId);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={imageSource}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
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
      const formattedChapters = Object.keys(chaptersData.chapters).map(key => ({
        id: key,
        ...chaptersData.chapters[key]
      }));
      setChapters(formattedChapters);
    } catch (error) {
      console.error('Error loading chapters data:', error);
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