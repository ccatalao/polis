import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Mock data for municipal services
const mockMunicipioData = [
  {
    "id": "reabilitacao-urbana",
    "title": "Reabilitação Urbana",
    "description": "Palmela incentiva a reabilitação urbana para revitalizar centros urbanos e áreas degradadas, visando renovar e reabitar espaços com maior concentração populacional.",
    "url": "https://www.cm-palmela.pt/viver/reabilitacao-urbana",
    "features": [
      {
        "feature": "Reabilitação do Centro Histórico de Palmela",
        "featureURL": "https://www.cm-palmela.pt/viver/reabilitacao-urbana/aru-centro-historico-de-palmela"
      },
      {
        "feature": "Reabilitação Urbana do Pinhal Novo",
        "featureURL": "https://www.cm-palmela.pt/viver/reabilitacao-urbana/aru-pinhal-novo"
      },
      {
        "feature": "Incentivos à reabilitação urbana",
        "featureURL": "https://www.cm-palmela.pt/viver/reabilitacao-urbana/programa-de-incentivo-a-reabilitacao-urbana"
      }
    ]
  },
  {
    "id": "planos-municipais",
    "title": "Planos Municipais de Ordenamento do Território",
    "description": "Acesso público a documentos e legislação territorial, incluindo o Plano Diretor Municipal, Planos de Urbanização e Pormenor, e Medidas Preventivas.",
    "url": "https://www.cm-palmela.pt/viver/planeamento-e-gestao-urbanistica/planos-municipais-de-ordenamento-do-territorio",
    "features": [
      {
        "feature": "Plano Diretor Municipal",
        "featureURL": "https://www.cm-palmela.pt/viver/planeamento-e-gestao-urbanistica/planos-municipais-de-ordenamento-do-territorio/plano-diretor-municipal"
      },
      {
        "feature": "Estudos de ordenamento do território",
        "featureURL": "https://www.cm-palmela.pt/viver/planeamento-e-gestao-urbanistica/planos-municipais-de-ordenamento-do-territorio/estudos"
      }
    ]
  }
];

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

  return (
    <View style={styles.card}>
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

  useEffect(() => {
    // Simulate loading data from a file
    setTimeout(() => {
      setServices(mockMunicipioData);
      setLoading(false);
    }, 1000);
    
    // In a real app, we would load the data from a JSON file
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>A carregar serviços municipais...</Text>
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
