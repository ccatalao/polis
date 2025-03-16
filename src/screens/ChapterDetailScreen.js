import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { Image } from 'expo-image';

// Image mapping for publications based on their ID
const getPublicationImage = (publicationId, categoryId) => {
  // Use the passed getPublicationImage function if available
  if (typeof getPublicationImageFromProps === 'function') {
    return getPublicationImageFromProps(publicationId);
  }
  
  // Urbanism publications
  if (categoryId === 'urbanism') {
    switch (publicationId) {
      case 'articulo':
        return require('../../assets/images/publications/articulo.jpeg');
      case 'archive':
        return require('../../assets/images/publications/archive.jpeg');
      case 'buildings-cities':
        return require('../../assets/images/publications/buildings.jpeg');
      case 'cidades':
        return require('../../assets/images/publications/cidades.jpeg');
      case 'city-environment-interactions':
        return require('../../assets/images/publications/citty-environment-interactions.jpeg');
      case 'ciudades':
        return require('../../assets/images/publications/ciudades.jpeg');
      case 'computational-urban-science':
        return require('../../assets/images/publications/computational-urban-science.jpeg');
      case 'current-urban-studies':
        return require('../../assets/images/publications/current-urban-studies.jpeg');
      case 'frontiers-built-environment':
        return require('../../assets/images/publications/frontiers-built-environment.jpeg');
      case 'future-cities-environment':
        return require('../../assets/images/publications/future-cities-environment.jpeg');
      case 'iet-smart-cities':
        return require('../../assets/images/publications/smart-cities.jpeg');
      case 'international-urban-sustainable':
        return require('../../assets/images/publications/urban-sustainable.jpeg');
      case 'irspsd':
        return require('../../assets/images/publications/irspsd.jpeg');
      case 'urban-ecology':
        return require('../../assets/images/publications/urban-ecology.jpeg');
      case 'urban-management':
        return require('../../assets/images/publications/urban-management.jpeg');
      case 'urban-mobility':
        return require('../../assets/images/publications/urban-mobility.jpeg');
      case 'research-urbanism':
        return require('../../assets/images/publications/research-urbanism.jpeg');
      case 'resilient-cities':
        return require('../../assets/images/publications/resilient-cities.jpeg');
      case 'smart-construction':
        return require('../../assets/images/publications/smart-construction.jpeg');
      case 'urban-agriculture':
        return require('../../assets/images/publications/urban-agriculture.jpeg');
      case 'urban-governance':
        return require('../../assets/images/publications/urban-governance.jpeg');
      case 'urban-lifeline':
        return require('../../assets/images/publications/urban-lifeline.jpeg');
      case 'urban-planning':
        return require('../../assets/images/publications/urban-planning.jpeg');
      case 'urban-planning-transport':
        return require('../../assets/images/publications/urban-planning-transport.jpeg');
      case 'urban-science':
        return require('../../assets/images/publications/urban-science.jpeg');
      case 'urban-transcripts':
        return require('../../assets/images/publications/urban-transcripts.jpeg');
      case 'urban-transformations':
        return require('../../assets/images/publications/urban-transformations.jpeg');
      case 'urbana':
        return require('../../assets/images/publications/urbana.jpeg');
      case 'urbe':
        return require('../../assets/images/publications/urbe.jpeg');
      default:
        return require('../../assets/images/publications/urbanism.jpeg');
    }
  }
  
  // Planning publications
  else if (categoryId === 'planning') {
    switch (publicationId) {
      case 'blue-green-systems':
        return require('../../assets/images/publications/blue-green-systems.jpeg');
      case 'creative-practices':
        return require('../../assets/images/publications/creative-practices.jpeg');
      case 'spatial-development':
        return require('../../assets/images/publications/spatial-development.jpeg');
      case 'finisterra':
        return require('../../assets/images/publications/finisterra.jpeg');
      case 'urban-rural-planning':
        return require('../../assets/images/publications/urban-rural-planning.jpeg');
      case 'regional-development':
        return require('../../assets/images/publications/regional-development.jpeg');
      case 'public-space':
        return require('../../assets/images/publications/public-space.jpeg');
      case 'public-transportation':
        return require('../../assets/images/publications/public-transportation.jpeg');
      case 'spatial-information':
        return require('../../assets/images/publications/spatial-information.jpeg');
      case 'planext':
        return require('../../assets/images/publications/planext.jpeg');
      case 'regional-science-policy':
        return require('../../assets/images/publications/regional-practice.jpeg');
      case 'regional-studies':
        return require('../../assets/images/publications/regional-studies.jpeg');
      case 'scienze-territorio':
        return require('../../assets/images/publications/scienze-territorio.jpeg');
      case 'tema':
        return require('../../assets/images/publications/tema.jpeg');
      case 'territorial-identity':
        return require('../../assets/images/publications/territorial-identity.jpeg');
      default:
        return require('../../assets/images/publications/planning.jpeg');
    }
  }
  
  // Architecture publications
  else if (categoryId === 'architecture') {
    switch (publicationId) {
      case 'architecture-mps':
        return require('../../assets/images/publications/archicteture-mps.jpeg');
      case 'agathon':
        return require('../../assets/images/publications/agathon.jpeg');
      case 'cadernos-arte-publica':
        return require('../../assets/images/publications/arte-publlca.jpeg');
      case 'docomomo-journal':
        return require('../../assets/images/publications/docomomo.jpeg');
      case 'enq-enquiry':
        return require('../../assets/images/publications/enq.jpeg');
      case 'estudo-previo':
        return require('../../assets/images/publications/estudo-previo.jpeg');
      case 'field':
        return require('../../assets/images/publications/field.jpeg');
      case 'architecture-urbanism':
        return require('../../assets/images/publications/architecture-urbanism.jpeg');
      case 'revista-arquitectura':
        return require('../../assets/images/publications/revista-arquitectura.jpeg');
      default:
        return require('../../assets/images/publications/architecture.jpeg');
    }
  }
  
  // Default fallback
  return require('../../assets/images/home/publicacoes.jpeg');
};

const PublicationCard = ({ title, description, url, publicationId, getPublicationImage }) => {
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

  // Use the getPublicationImage function passed from ChaptersScreen
  const imageSource = getPublicationImage(publicationId);

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
  const { chapter, getPublicationImage } = route.params;
  
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
            getPublicationImage={getPublicationImage}
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