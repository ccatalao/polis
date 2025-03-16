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
        return require('../../assets/images/publications/urbanism.jpeg');
      case 'planning':
        return require('../../assets/images/publications/planning.jpeg');
      case 'architecture':
        return require('../../assets/images/publications/architecture.jpeg');
      default:
        return require('../../assets/images/home/publicacoes.jpeg');
    }
  } catch (error) {
    console.error(`Error loading image for category ${categoryId}:`, error);
    return require('../../assets/images/home/publicacoes.jpeg');
  }
};

// Function to get the correct image for each publication
const getPublicationImage = (publicationId) => {
  try {
    // Map of publication IDs to their image paths
    const publicationImages = {
      'articulo': require('../../assets/images/publications/articulo.jpeg'),
      'archive': require('../../assets/images/publications/archive.jpeg'),
      'buildings-cities': require('../../assets/images/publications/buildings.jpeg'),
      'cidades': require('../../assets/images/publications/cidades.jpeg'),
      'city-environment-interactions': require('../../assets/images/publications/citty-environment-interactions.jpeg'),
      'ciudades': require('../../assets/images/publications/ciudades.jpeg'),
      'computational-urban-science': require('../../assets/images/publications/computational-urban-science.jpeg'),
      'current-urban-studies': require('../../assets/images/publications/current-urban-studies.jpeg'),
      'frontiers-built-environment': require('../../assets/images/publications/frontiers-built-environment.jpeg'),
      'future-cities-environment': require('../../assets/images/publications/future-cities-environment.jpeg'),
      'iet-smart-cities': require('../../assets/images/publications/smart-cities.jpeg'),
      'international-urban-sustainable': require('../../assets/images/publications/urban-sustainable.jpeg'),
      'irspsd': require('../../assets/images/publications/irspsd.jpeg'),
      'urban-ecology': require('../../assets/images/publications/urban-ecology.jpeg'),
      'urban-management': require('../../assets/images/publications/urban-management.jpeg'),
      'urban-mobility': require('../../assets/images/publications/urban-mobility.jpeg'),
      'research-urbanism': require('../../assets/images/publications/research-urbanism.jpeg'),
      'resilient-cities': require('../../assets/images/publications/resilient-cities.jpeg'),
      'smart-construction': require('../../assets/images/publications/smart-construction.jpeg'),
      'urban-agriculture': require('../../assets/images/publications/urban-agriculture.jpeg'),
      'urban-governance': require('../../assets/images/publications/urban-governance.jpeg'),
      'urban-lifeline': require('../../assets/images/publications/urban-lifeline.jpeg'),
      'urban-planning': require('../../assets/images/publications/urban-planning.jpeg'),
      'urban-planning-transport': require('../../assets/images/publications/urban-planning-transport.jpeg'),
      'urban-science': require('../../assets/images/publications/urban-science.jpeg'),
      'urban-transcripts': require('../../assets/images/publications/urban-transcripts.jpeg'),
      'urban-transformations': require('../../assets/images/publications/urban-transformations.jpeg'),
      'urbana': require('../../assets/images/publications/urbana.jpeg'),
      'urbe': require('../../assets/images/publications/urbe.jpeg'),
      'blue-green-systems': require('../../assets/images/publications/blue-green-systems.jpeg'),
      'creative-practices': require('../../assets/images/publications/creative-practices.jpeg'),
      'spatial-development': require('../../assets/images/publications/spatial-development.jpeg'),
      'finisterra': require('../../assets/images/publications/finisterra.jpeg'),
      'urban-rural-planning': require('../../assets/images/publications/urban-rural-planning.jpeg'),
      'regional-development': require('../../assets/images/publications/regional-development.jpeg'),
      'public-space': require('../../assets/images/publications/public-space.jpeg'),
      'public-transportation': require('../../assets/images/publications/public-transportation.jpeg'),
      'spatial-information': require('../../assets/images/publications/spatial-information.jpeg'),
      'planext': require('../../assets/images/publications/planext.jpeg'),
      'regional-science-policy': require('../../assets/images/publications/regional-practice.jpeg'),
      'regional-studies': require('../../assets/images/publications/regional-studies.jpeg'),
      'scienze-territorio': require('../../assets/images/publications/scienze-territorio.jpeg'),
      'tema': require('../../assets/images/publications/tema.jpeg'),
      'territorial-identity': require('../../assets/images/publications/territorial-identity.jpeg'),
      'architecture-mps': require('../../assets/images/publications/archicteture-mps.jpeg'),
      'agathon': require('../../assets/images/publications/agathon.jpeg'),
      'cadernos-arte-publica': require('../../assets/images/publications/arte-publlca.jpeg'),
      'docomomo-journal': require('../../assets/images/publications/docomomo.jpeg'),
      'enq-enquiry': require('../../assets/images/publications/enq.jpeg'),
      'estudo-previo': require('../../assets/images/publications/estudo-previo.jpeg'),
      'field': require('../../assets/images/publications/field.jpeg'),
      'architecture-urbanism': require('../../assets/images/publications/architecture-urbanism.jpeg'),
      'revista-arquitectura': require('../../assets/images/publications/revista-arquitectura.jpeg')
    };
    
    return publicationImages[publicationId] || require('../../assets/images/home/publicacoes.jpeg');
  } catch (error) {
    console.error(`Error loading image for publication ${publicationId}:`, error);
    return require('../../assets/images/home/publicacoes.jpeg');
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