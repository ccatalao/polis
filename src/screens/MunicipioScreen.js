import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import the municipio data
import municipioData from '../data/municipio.json';

// Function to get the correct image path
const getMunicipioImage = (imageUrl) => {
  if (!imageUrl) return null;
  
  // For the deployed site, we need to adjust the path
  const imagePath = imageUrl.fallback || imageUrl.webp;
  if (imagePath.startsWith('/')) {
    return '.' + imagePath; // Add a dot to make it relative to the current directory
  }
  return imagePath;
};

const ServiceCard = ({ service }) => {
  const handleOpenLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Erro", `Não foi possível abrir o link: ${url}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link");
    }
  };

  // Get the image source
  const imageSource = service.imageUrl ? getMunicipioImage(service.imageUrl) : null;

  return (
    <View style={styles.card}>
      {imageSource && (
        <Image
          source={imageSource}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{service.title}</Text>
        <Text style={styles.cardDescription}>{service.description}</Text>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Serviços disponíveis:</Text>
          {service.features.map((feature, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.featureItem}
              onPress={() => handleOpenLink(feature.featureURL)}
            >
              <Text style={styles.featureText}>• {feature.feature}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => handleOpenLink(service.url)}
        >
          <Text style={styles.linkButtonText}>Visitar site</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MunicipioScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Load data from the imported JSON file
      if (municipioData && municipioData.municipio) {
        setServices(municipioData.municipio);
        setLoading(false);
      } else {
        setError('Dados não encontrados');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>A carregar serviços municipais...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>Por favor, tente novamente mais tarde.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serviços Municipais</Text>
        <Text style={styles.headerSubtitle}>
          Aceda aos serviços e recursos municipais em matéria de urbanismo, ordenamento do território e habitação.
        </Text>
      </View>
      
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard service={item} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    height: 180,
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

export default MunicipioScreen;
