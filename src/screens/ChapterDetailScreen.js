import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { Image } from 'expo-image';

// Image mapping for publications based on their ID
const getPublicationImage = (publicationId, categoryId) => {
  // Urbanism publications
  if (categoryId === 'urbanism') {
    switch (publicationId) {
      case 'articulo':
        return require('../../assets/images/publications/articulo.webp');
      case 'archive':
        return require('../../assets/images/publications/archive.webp');
      case 'buildings-cities':
        return require('../../assets/images/publications/buildings.webp');
      case 'cidades':
        return require('../../assets/images/publications/cidades.webp');
      case 'city-environment-interactions':
        return require('../../assets/images/publications/citty-environment-interactions.webp');
      case 'ciudades':
        return require('../../assets/images/publications/ciudades.webp');
      case 'computational-urban-science':
        return require('../../assets/images/publications/computational-urban-science.webp');
      case 'current-urban-studies':
        return require('../../assets/images/publications/current-urban-studies.webp');
      case 'frontiers-built-environment':
        return require('../../assets/images/publications/frontiers-built-environment.webp');
      case 'future-cities-environment':
        return require('../../assets/images/publications/future-cities-environment.webp');
      case 'iet-smart-cities':
        return require('../../assets/images/publications/smart-cities.webp');
      case 'international-urban-sustainable':
        return require('../../assets/images/publications/urban-sustainable.webp');
      case 'irspsd':
        return require('../../assets/images/publications/irspsd.webp');
      case 'urban-ecology':
        return require('../../assets/images/publications/urban-ecology.webp');
      case 'urban-management':
        return require('../../assets/images/publications/urban-management.webp');
      case 'urban-mobility':
        return require('../../assets/images/publications/urban-mobility.webp');
      case 'research-urbanism':
        return require('../../assets/images/publications/research-urbanism.webp');
      case 'resilient-cities':
        return require('../../assets/images/publications/resilient-cities.webp');
      case 'smart-construction':
        return require('../../assets/images/publications/smart-construction.webp');
      case 'urban-agriculture':
        return require('../../assets/images/publications/urban-agriculture.webp');
      case 'urban-governance':
        return require('../../assets/images/publications/urban-governance.webp');
      case 'urban-lifeline':
        return require('../../assets/images/publications/urban-lifeline.webp');
      case 'urban-planning':
        return require('../../assets/images/publications/urban-planning.webp');
      case 'urban-planning-transport':
        return require('../../assets/images/publications/urban-planning-transport.webp');
      case 'urban-science':
        return require('../../assets/images/publications/urban-science.webp');
      case 'urban-transcripts':
        return require('../../assets/images/publications/urban-transcripts.webp');
      case 'urban-transformations':
        return require('../../assets/images/publications/urban-transformations.webp');
      case 'urbana':
        return require('../../assets/images/publications/urbana.webp');
      case 'urbe':
        return require('../../assets/images/publications/urbe.webp');
      default:
        return require('../../assets/images/publications/urbanism.webp');
    }
  }
  
  // Planning publications
  else if (categoryId === 'planning') {
    switch (publicationId) {
      case 'blue-green-systems':
        return require('../../assets/images/publications/blue-green-systems.webp');
      case 'creative-practices':
        return require('../../assets/images/publications/creative-practices.webp');
      case 'spatial-development':
        return require('../../assets/images/publications/spatial-development.webp');
      case 'finisterra':
        return require('../../assets/images/publications/finisterra.webp');
      case 'urban-rural-planning':
        return require('../../assets/images/publications/urban-rural-planning.webp');
      case 'regional-development':
        return require('../../assets/images/publications/regional-development.webp');
      case 'public-space':
        return require('../../assets/images/publications/public-space.webp');
      case 'public-transportation':
        return require('../../assets/images/publications/public-transportation.webp');
      case 'spatial-information':
        return require('../../assets/images/publications/spatial-information.webp');
      case 'planext':
        return require('../../assets/images/publications/planext.webp');
      case 'regional-science-policy':
        return require('../../assets/images/publications/regional-practice.webp');
      case 'regional-studies':
        return require('../../assets/images/publications/regional-studies.webp');
      case 'scienze-territorio':
        return require('../../assets/images/publications/scienze-territorio.webp');
      case 'tema':
        return require('../../assets/images/publications/tema.webp');
      case 'territorial-identity':
        return require('../../assets/images/publications/territorial-identity.webp');
      default:
        return require('../../assets/images/publications/planning.webp');
    }
  }
  
  // Architecture publications
  else if (categoryId === 'architecture') {
    switch (publicationId) {
      case 'architecture-mps':
        return require('../../assets/images/publications/archicteture-mps.webp');
      case 'agathon':
        return require('../../assets/images/publications/agathon.webp');
      case 'cadernos-arte-publica':
        return require('../../assets/images/publications/arte-publlca.webp');
      case 'docomomo-journal':
        return require('../../assets/images/publications/docomomo.webp');
      case 'enq-enquiry':
        return require('../../assets/images/publications/enq.webp');
      case 'estudo-previo':
        return require('../../assets/images/publications/estudo-previo.webp');
      case 'field':
        return require('../../assets/images/publications/field.webp');
      case 'architecture-urbanism':
        return require('../../assets/images/publications/architecture-urbanism.webp');
      case 'revista-arquitectura':
        return require('../../assets/images/publications/revista-arquitectura.webp');
      default:
        return require('../../assets/images/publications/architecture.webp');
    }
  }
  
  // Default fallback
  return require('../../assets/images/home/publicacoes.webp');
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

  // Use the imageUrl if provided, otherwise fall back to the hardcoded image
  const imageSource = imageUrl 
    ? { uri: imageUrl.webp || imageUrl.fallback }
    : getPublicationImage(publicationId, categoryId);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={imageSource}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
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