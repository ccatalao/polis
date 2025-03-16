import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { Image } from 'expo-image';
import { getImagePath } from '../utils/imageUtils';

const PublicationCard = ({ publication, onPress }) => {
  // Get the image source using the getImagePath utility
  const getPublicationImage = () => {
    try {
      // First try to use the imageUrl if it exists
      if (publication.imageUrl) {
        return getImagePath(publication.imageUrl);
      }
      
      // Fallback to constructing the path from the ID
      if (publication.id) {
        return getImagePath(`/images/publications/${publication.id}.jpeg`);
      }
      
      // Default image if no ID or imageUrl
      return getImagePath('/images/home/publicacoes.jpeg');
    } catch (error) {
      console.error('Error loading publication image:', error);
      return getImagePath('/images/home/publicacoes.jpeg');
    }
  };

  const handlePress = async () => {
    if (!publication.url) {
      Alert.alert('Info', 'No link available for this publication.');
      return;
    }

    const canOpen = await Linking.canOpenURL(publication.url);
    if (canOpen) {
      await Linking.openURL(publication.url);
    } else {
      Alert.alert('Error', 'Cannot open this link.');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={getPublicationImage()}
          style={styles.image}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{publication.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {publication.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ChapterDetailScreen = ({ route }) => {
  const { chapter, publications } = route.params;

  if (!publications || publications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No publications available for this category.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={publications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PublicationCard publication={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 160,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ChapterDetailScreen; 