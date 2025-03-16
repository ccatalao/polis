import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sobre o PolisPlan</Text>
        
        <Text style={styles.sectionTitle}>Missão</Text>
        <Text style={styles.paragraph}>
          O PolisPlan é uma aplicação móvel dedicada a fornecer informações e recursos sobre planeamento urbano, 
          desenvolvimento sustentável e políticas municipais em Palmela.
        </Text>
        
        <Text style={styles.sectionTitle}>Objetivos</Text>
        <Text style={styles.paragraph}>
          • Facilitar o acesso a informações sobre serviços municipais relacionados com urbanismo e ordenamento do território
        </Text>
        <Text style={styles.paragraph}>
          • Divulgar projetos europeus e oportunidades de financiamento para desenvolvimento urbano
        </Text>
        <Text style={styles.paragraph}>
          • Promover o acesso a publicações científicas e recursos académicos sobre planeamento urbano
        </Text>
        <Text style={styles.paragraph}>
          • Contribuir para políticas de desenvolvimento local mais eficazes e sustentáveis
        </Text>
        
        <Text style={styles.sectionTitle}>Desenvolvimento</Text>
        <Text style={styles.paragraph}>
          Esta aplicação foi desenvolvida como uma migração da versão web do PolisPlan para uma plataforma móvel, 
          utilizando React Native e Expo. O objetivo é proporcionar uma experiência mais acessível e adaptada às 
          necessidades dos utilizadores móveis.
        </Text>
        
        <Text style={styles.sectionTitle}>Contacto</Text>
        <Text style={styles.paragraph}>
          Para mais informações ou sugestões, entre em contacto através do email: info@polisplan.pt
        </Text>
        
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c3e50',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#333',
  },
  version: {
    marginTop: 30,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default AboutScreen;
