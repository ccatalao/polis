import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Mock data for funding opportunities
const mockFundingData = [
  {
    "id": "horizon-europe",
    "title": "Horizon Europe",
    "description": "Programa de investigação e inovação da UE para 2021-2027, com um orçamento de 95,5 mil milhões de euros.",
    "url": "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en",
    "deadline": "Várias datas ao longo do ano",
    "eligibility": "Organizações de investigação, universidades, indústria, PMEs, organizações não governamentais e outros grupos sociais e económicos."
  },
  {
    "id": "life",
    "title": "Programa LIFE",
    "description": "Instrumento financeiro da UE dedicado ao ambiente e à ação climática, com um orçamento de 5,4 mil milhões de euros para 2021-2027.",
    "url": "https://cinea.ec.europa.eu/programmes/life_en",
    "deadline": "Convites anuais, geralmente na primavera",
    "eligibility": "Entidades públicas e privadas, incluindo autoridades locais, ONGs e empresas privadas."
  }
];

const FundingCard = ({ funding, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{funding.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{funding.description}</Text>
        <Text style={styles.deadline}>Prazo: {funding.deadline}</Text>
        <Text style={styles.viewDetails}>Ver detalhes</Text>
      </View>
    </TouchableOpacity>
  );
};

const FundingDetailModal = ({ funding, visible, onClose }) => {
  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(funding.url);
      
      if (supported) {
        await Linking.openURL(funding.url);
      } else {
        Alert.alert("Erro", `Não foi possível abrir o link: ${funding.url}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link");
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{funding.title}</Text>
        <Text style={styles.modalDescription}>{funding.description}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Prazo:</Text>
          <Text style={styles.infoValue}>{funding.deadline}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Elegibilidade:</Text>
          <Text style={styles.infoValue}>{funding.eligibility}</Text>
        </View>
        
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
            <Text style={styles.linkButtonText}>Visitar site</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const FundingScreen = () => {
  const [fundingOpportunities, setFundingOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Simulate loading data from a file
    setTimeout(() => {
      setFundingOpportunities(mockFundingData);
      setLoading(false);
    }, 1000);
    
    // In a real app, we would load the data from a JSON file
  }, []);

  const handleFundingPress = (funding) => {
    setSelectedFunding(funding);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>A carregar oportunidades de financiamento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oportunidades de Financiamento</Text>
        <Text style={styles.headerSubtitle}>
          Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável.
        </Text>
      </View>
      
      <FlatList
        data={fundingOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FundingCard
            funding={item}
            onPress={() => handleFundingPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      
      {selectedFunding && (
        <FundingDetailModal
          funding={selectedFunding}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
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
    marginBottom: 8,
    lineHeight: 20,
  },
  deadline: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 12,
    fontWeight: '500',
  },
  viewDetails: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },
  infoSection: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FundingScreen;
