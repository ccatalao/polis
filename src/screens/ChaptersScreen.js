import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the chapters data
import chaptersData from '../data/chapters.json';

// Function to get the correct image for each category
const getCategoryImage = (categoryId) => {
  try {
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
  } catch (error) {
    console.error(`Error loading image for category ${categoryId}:`, error);
    return require('../../assets/images/home/publicacoes.webp');
  }
};

// Function to get the correct image for each publication
const getPublicationImage = (publicationId) => {
  try {
    // Map of publication IDs to their image paths
    const publicationImages = {
      'articulo': require('../../assets/images/publications/articulo.webp'),
      'archive': require('../../assets/images/publications/archive.webp'),
      'buildings-cities': require('../../assets/images/publications/buildings.webp'),
      'cidades': require('../../assets/images/publications/cidades.webp'),
      'city-environment-interactions': require('../../assets/images/publications/citty-environment-interactions.webp'),
      'ciudades': require('../../assets/images/publications/ciudades.webp'),
      'computational-urban-science': require('../../assets/images/publications/computational-urban-science.webp'),
      'current-urban-studies': require('../../assets/images/publications/current-urban-studies.webp'),
      'frontiers-built-environment': require('../../assets/images/publications/frontiers-built-environment.webp'),
      'future-cities-environment': require('../../assets/images/publications/future-cities-environment.webp'),
      'iet-smart-cities': require('../../assets/images/publications/smart-cities.webp'),
      'international-urban-sustainable': require('../../assets/images/publications/urban-sustainable.webp'),
      'irspsd': require('../../assets/images/publications/irspsd.webp'),
      'urban-ecology': require('../../assets/images/publications/urban-ecology.webp'),
      'urban-management': require('../../assets/images/publications/urban-management.webp'),
      'urban-mobility': require('../../assets/images/publications/urban-mobility.webp'),
      'research-urbanism': require('../../assets/images/publications/research-urbanism.webp'),
      'resilient-cities': require('../../assets/images/publications/resilient-cities.webp'),
      'smart-construction': require('../../assets/images/publications/smart-construction.webp'),
      'urban-agriculture': require('../../assets/images/publications/urban-agriculture.webp'),
      'urban-governance': require('../../assets/images/publications/urban-governance.webp'),
      'urban-lifeline': require('../../assets/images/publications/urban-lifeline.webp'),
      'urban-planning': require('../../assets/images/publications/urban-planning.webp'),
      'urban-planning-transport': require('../../assets/images/publications/urban-planning-transport.webp'),
      'urban-science': require('../../assets/images/publications/urban-science.webp'),
      'urban-transcripts': require('../../assets/images/publications/urban-transcripts.webp'),
      'urban-transformations': require('../../assets/images/publications/urban-transformations.webp'),
      'urbana': require('../../assets/images/publications/urbana.webp'),
      'urbe': require('../../assets/images/publications/urbe.webp'),
      'blue-green-systems': require('../../assets/images/publications/blue-green-systems.webp'),
      'creative-practices': require('../../assets/images/publications/creative-practices.webp'),
      'spatial-development': require('../../assets/images/publications/spatial-development.webp'),
      'finisterra': require('../../assets/images/publications/finisterra.webp'),
      'urban-rural-planning': require('../../assets/images/publications/urban-rural-planning.webp'),
      'regional-development': require('../../assets/images/publications/regional-development.webp'),
      'public-space': require('../../assets/images/publications/public-space.webp'),
      'public-transportation': require('../../assets/images/publications/public-transportation.webp'),
      'spatial-information': require('../../assets/images/publications/spatial-information.webp'),
      'planext': require('../../assets/images/publications/planext.webp'),
      'regional-science-policy': require('../../assets/images/publications/regional-practice.webp'),
      'regional-studies': require('../../assets/images/publications/regional-studies.webp'),
      'scienze-territorio': require('../../assets/images/publications/scienze-territorio.webp'),
      'tema': require('../../assets/images/publications/tema.webp'),
      'territorial-identity': require('../../assets/images/publications/territorial-identity.webp'),
      'architecture-mps': require('../../assets/images/publications/archicteture-mps.webp'),
      'agathon': require('../../assets/images/publications/agathon.webp'),
      'cadernos-arte-publica': require('../../assets/images/publications/arte-publlca.webp'),
      'docomomo-journal': require('../../assets/images/publications/docomomo.webp'),
      'enq-enquiry': require('../../assets/images/publications/enq.webp'),
      'estudo-previo': require('../../assets/images/publications/estudo-previo.webp'),
      'field': require('../../assets/images/publications/field.webp'),
      'architecture-urbanism': require('../../assets/images/publications/architecture-urbanism.webp'),
      'revista-arquitectura': require('../../assets/images/publications/revista-arquitectura.webp')
    };
    
    return publicationImages[publicationId] || require('../../assets/images/home/publicacoes.webp');
  } catch (error) {
    console.error(`Error loading image for publication ${publicationId}:`, error);
    return require('../../assets/images/home/publicacoes.webp');
  }
};

const ChapterCard = ({ title, description, categoryId, imageUrl, onPress }) => {
  // Use the category image function instead of trying to load from URL
  const imageSource = getCategoryImage(categoryId);

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
    // Pass the getPublicationImage function to the detail screen
    navigation.navigate('ChapterDetail', { 
      chapter,
      getPublicationImage 
    });
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