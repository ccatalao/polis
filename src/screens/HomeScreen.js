import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

// Import images
const municipioImage = require('../../assets/images/home/municipio.webp');
const projectsImage = require('../../assets/images/home/projects.webp');
const fundingImage = require('../../assets/images/home/funding.webp');
const publicacoesImage = require('../../assets/images/home/publicacoes.webp');

const FeatureCard = ({ title, description, imageSource, onPress }) => {
  return (
    <View style={styles.featureCard}>
      <Image 
        source={imageSource} 
        style={styles.featureImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
        <TouchableOpacity style={styles.featureButton} onPress={onPress}>
          <Text style={styles.buttonText}>Ver mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Planeamento Urbano Informado</Text>
        <Text style={styles.heroSubtitle}>
          Um guia para políticas de desenvolvimento local mais eficazes e sustentáveis
        </Text>
      </View>

      <View style={styles.featuresGrid}>
        <FeatureCard
          title="Serviços Municipais"
          description="Aceda aos serviços e recursos municipais em matéria de urbanismo, ordenamento do território e habitação."
          imageSource={municipioImage}
          onPress={() => navigation.navigate('Municipio')}
        />

        <FeatureCard
          title="Projetos europeus"
          description="Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano."
          imageSource={projectsImage}
          onPress={() => navigation.navigate('Projects')}
        />

        <FeatureCard
          title="Financiamento"
          description="Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável."
          imageSource={fundingImage}
          onPress={() => navigation.navigate('Funding')}
        />

        <FeatureCard
          title="Publicações de acesso aberto"
          description="Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território."
          imageSource={publicacoesImage}
          onPress={() => navigation.navigate('Chapters')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    padding: 20,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  featuresGrid: {
    padding: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  featureContent: {
    padding: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  featureButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
