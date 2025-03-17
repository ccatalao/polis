import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

// Import screen components
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import ChaptersScreen from './src/screens/ChaptersScreen';
import ChapterDetailScreen from './src/screens/ChapterDetailScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import FundingScreen from './src/screens/FundingScreen';
import MunicipioScreen from './src/screens/MunicipioScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Fallback component in case the main app fails to render
const FallbackComponent = () => (
  <SafeAreaView style={styles.fallbackContainer}>
    <ScrollView contentContainerStyle={styles.fallbackContent}>
      <Text style={styles.fallbackTitle}>Polis</Text>
      <Text style={styles.fallbackSubtitle}>Planeamento Urbano Informado</Text>
      <Text style={styles.fallbackText}>
        Se estiver a ver esta mensagem, a aplicação está a carregar ou ocorreu um erro.
      </Text>
      <Text style={styles.fallbackText}>
        Por favor, tente recarregar a página ou contacte o suporte.
      </Text>
    </ScrollView>
  </SafeAreaView>
);

function ChaptersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChaptersList" component={ChaptersScreen} options={{ title: 'Publicações' }} />
      <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate initialization to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle errors in the app
  if (error) {
    console.error('App error:', error);
    return <FallbackComponent />;
  }

  // Show fallback while initializing
  if (!isReady) {
    return <FallbackComponent />;
  }

  // Simplified linking configuration
  const linking = {
    enabled: true,
    prefixes: [],
    config: {
      screens: {
        Home: '',
        About: 'about',
        Chapters: 'chapters',
        Projects: 'projects',
        Funding: 'funding',
        Municipio: 'municipio',
      },
    },
  };

  try {
    return (
      <NavigationContainer
        linking={linking}
        fallback={<FallbackComponent />}
      >
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'About') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              } else if (route.name === 'Chapters') {
                iconName = focused ? 'book' : 'book-outline';
              } else if (route.name === 'Projects') {
                iconName = focused ? 'briefcase' : 'briefcase-outline';
              } else if (route.name === 'Funding') {
                iconName = focused ? 'cash' : 'cash-outline';
              } else if (route.name === 'Municipio') {
                iconName = focused ? 'business' : 'business-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: 'gray',
            // Improve web display of tab bar
            tabBarStyle: Platform.OS === 'web' ? { 
              paddingTop: 10,
              height: 60,
              paddingBottom: 5
            } : {},
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
          <Tab.Screen name="About" component={AboutScreen} options={{ title: 'Sobre' }} />
          <Tab.Screen name="Chapters" component={ChaptersStack} options={{ title: 'Publicações', headerShown: false }} />
          <Tab.Screen name="Projects" component={ProjectsScreen} options={{ title: 'Projetos' }} />
          <Tab.Screen name="Funding" component={FundingScreen} options={{ title: 'Financiamento' }} />
          <Tab.Screen name="Municipio" component={MunicipioScreen} options={{ title: 'Serviços Municipais' }} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } catch (e) {
    setError(e);
    return <FallbackComponent />;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#3498db',
  },
  fallbackContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100vh',
  },
  fallbackTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  fallbackSubtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  fallbackText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
});
