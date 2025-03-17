import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator, Platform } from 'react-native';
import { Image } from 'expo-image';

// Import projects data
import projectsData from '../data/projects.json';

// Get image source based on project data with enhanced path handling
const getImageSource = (project) => {
  try {
    // For web environment
    if (Platform.OS === 'web' && project.imageUrl) {
      const imagePath = project.imageUrl.fallback;
      
      if (imagePath) {
        // Get current URL details
        const origin = window.location.origin;
        
        // Check if we're in development mode (localhost)
        const isDevelopment = origin.includes('localhost');
        
        // Special handling for Expo development server
        if (isDevelopment) {
          // Extract the path to the asset, removing any leading slash
          const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
          
          // Make sure the path includes the "assets/" directory which is required by Expo
          const assetPath = cleanPath.startsWith('assets/') ? cleanPath : `assets/${cleanPath}`;
          
          // Format for Expo development asset server
          // Example: http://localhost:8084/assets/?unstable_path=.%2Fassets%2Fimages%2Fprojetos%2Furbact.webp
          const assetServerPath = `${origin}/assets/?unstable_path=.%2F${encodeURIComponent(assetPath)}`;
          
          console.log(`Development mode detected, using asset server: ${assetServerPath}`);
          
          return { 
            uri: assetServerPath,
            headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' }
          };
        }
        
        // For production/GitHub Pages
        // Determine if we're on GitHub Pages or other deployment
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        // Get repository name from pathname if on GitHub Pages
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        let repoName = pathSegments.length > 0 ? pathSegments[0] : '';
        
        // Try multiple base URL formations for production
        const possibleBaseUrls = [
          // Original base URL construction
          pathSegments.length > 0 ? `${origin}/${pathSegments[0]}` : origin,
          
          // GitHub Pages with full path
          isGitHubPages ? `${origin}/${repoName}` : null,
          
          // Try with just the origin
          origin,
          
          // Try with explicit "polis" repo name for GitHub Pages
          isGitHubPages ? `${origin}/polis` : null
        ].filter(Boolean); // Remove null entries
        
        // Log our detection for debugging
        console.log(`Environment: Web (Production), GitHub Pages: ${isGitHubPages}, Repo Name: ${repoName}`);
        
        // Try to construct image URLs in different ways
        const possibleImageUrls = [];
        
        possibleBaseUrls.forEach(baseUrl => {
          // With the found base URL, try different path formations
          if (imagePath.startsWith('/')) {
            // For paths starting with "/", join them directly
            possibleImageUrls.push(`${baseUrl}${imagePath}`);
            
            // Also try without double slashes
            if (baseUrl.endsWith('/')) {
              possibleImageUrls.push(`${baseUrl}${imagePath.substring(1)}`);
            }
          } else {
            // For relative paths, ensure a slash between base and path
            possibleImageUrls.push(`${baseUrl}/${imagePath}`);
          }
          
          // Add variations with and without "assets" directory
          if (!imagePath.includes('assets/')) {
            possibleImageUrls.push(`${baseUrl}/assets/${imagePath}`);
          }
        });
        
        // Log all the URLs we're going to try
        console.log(`Trying image URLs for ${project.id}:`, possibleImageUrls);
        
        // Try to load the image with fallbacks
        return { 
          uri: possibleImageUrls[0],
          headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
        };
      }
    } 
    // For native platforms
    else if (project.imageUrl?.webp) {
      return { uri: project.imageUrl.webp };
    }
    
    // Fallback to a placeholder with the title
    return { 
      uri: `https://via.placeholder.com/400x300?text=${encodeURIComponent(project.title)}`
    };
  } catch (error) {
    console.error(`Error loading image for project ${project.id}:`, error);
    return { 
      uri: `https://via.placeholder.com/400x300?text=Error`
    };
  }
};

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
      <Image
        source={getImageSource(project)}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
        onError={(error) => {
          console.error(`Image error for ${project.id}:`, error);
        }}
      />
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
          <Text key={index} style={styles.featureItem}>
            • {typeof feature === 'string' ? feature : feature.feature}
          </Text>
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
    // Load data from the imported JSON file
    const loadProjectsData = () => {
      try {
        if (projectsData && projectsData.projects) {
          console.log(`Loaded ${projectsData.projects.length} projects`);
          setProjects(projectsData.projects);
        } else {
          console.warn("No projects data available or invalid format");
          setProjects([]);
        }
      } catch (error) {
        console.error("Error loading projects data:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjectsData();
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
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default ProjectsScreen;
