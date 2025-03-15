import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Mock data for projects
const mockProjectsData = [
  {
    "id": "urbact",
    "title": "URBACT",
    "description": "Programa europeu de cooperação territorial que promove o desenvolvimento urbano sustentável e integrado em cidades da Europa.",
    "url": "https://urbact.eu/",
    "features": [
      "Intercâmbio de conhecimentos e boas práticas entre cidades europeias",
      "Desenvolvimento de soluções para desafios urbanos comuns",
      "Capacitação de profissionais urbanos e decisores locais"
    ]
  },
  {
    "id": "uia",
    "title": "Urban Innovative Actions",
    "description": "Iniciativa da União Europeia que fornece recursos para testar novas soluções para desafios urbanos.",
    "url": "https://uia-initiative.eu/en",
    "features": [
      "Financiamento para projetos urbanos inovadores",
      "Abordagem de desafios urbanos complexos",
      "Partilha de conhecimentos e experiências entre cidades europeias"
    ]
  }
];

const ProjectCard = ({ project, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{project.title}</Text>
        <Text style={styles.cardDescription}>{project.description}</Text>
        <Text style={styles.viewDetails}>Ver detalhes</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProjectDetailModal = ({ project, visible, onClose }) => {
  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(project.url);
      
      if (supported) {
        await Linking.openURL(project.url);
      } else {
        Alert.alert("Erro", `Não foi possível abrir o link: ${project.url}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link");
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{project.title}</Text>
        <Text style={styles.modalDescription}>{project.description}</Text>
        
        <Text style={styles.featuresTitle}>Características:</Text>
        {project.features.map((feature, index) => (
          <Text key={index} style={styles.featureItem}>• {feature}</Text>
        ))}
        
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

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Simulate loading data from a file
    setTimeout(() => {
      setProjects(mockProjectsData);
      setLoading(false);
    }, 1000);
    
    // In a real app, we would load the data from a JSON file
  }, []);

  const handleProjectPress = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>A carregar projetos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projetos Europeus</Text>
        <Text style={styles.headerSubtitle}>
          Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano.
        </Text>
      </View>
      
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => handleProjectPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
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
    marginBottom: 12,
    lineHeight: 20,
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
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
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

export default ProjectsScreen;
