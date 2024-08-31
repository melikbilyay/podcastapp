import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const podcastsData = [
  { id: '1', title: 'Podcast 1', image: require('@/assets/images/icon.png'), category: 'İlişkiler' },
  { id: '2', title: 'Podcast 2', image: require('@/assets/images/icon.png'), category: 'Kişisel' },
  { id: '3', title: 'Podcast 3', image: require('@/assets/images/icon.png'), category: 'İlişkiler' },
  { id: '4', title: 'Podcast 4', image: require('@/assets/images/icon.png'), category: 'Sağlık' },
  { id: '5', title: 'Podcast 5', image: require('@/assets/images/icon.png'), category: 'Sağlık' },
  // Add more podcasts here
];
// Define types for podcast
type Podcast = {
  id: string;
  title: string;
  image: any; // Replace 'any' with the specific type if you have it, like 'number' for require statements
  category: string;

};

// Define types for navigation parameters
type PodcastItemProps = {
  item: Podcast;
  onPress: (podcast: Podcast) => void;

};

const categories = ['Tümü', 'İlişkiler', 'Kişisel', 'Sağlık'];

const PodcastItem: React.FC<PodcastItemProps> = ({ item, onPress }) => (
    <TouchableOpacity style={styles.podcastItem} onPress={() => onPress(item)}>
      <Image source={item.image} style={styles.podcastImage} />
      <ThemedText>{item.title}</ThemedText>
    </TouchableOpacity>
);

export default function PodcastsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigation = useNavigation();

  const filteredPodcasts = podcastsData
      .filter(podcast =>
          (selectedCategory === 'Tümü' || podcast.category === selectedCategory) &&
          podcast.title.toLowerCase().includes(search.toLowerCase())
      );

  const handlePress = (podcast: Podcast) => {
    navigation.navigate('podcastDetails', { podcast });
  };

  const handlePlay = () => {
    // Handle play action
    console.log('Play button pressed');
  };

  const handleShuffle = () => {
    // Handle shuffle action
    console.log('Shuffle button pressed');
  };

  return (
      <ThemedView style={styles.container}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search podcasts..."
            value={search}
            onChangeText={setSearch}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePlay}>
            <MaterialCommunityIcons name="play" size={24} color="#967d28" />
            <ThemedText style={styles.buttonText}>Play</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShuffle}>
            <MaterialCommunityIcons name="shuffle" size={24} color="#967d28" />
            <ThemedText style={styles.buttonText}>Shuffle</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          {categories.map(category => (
              <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
              >
                <ThemedText style={styles.categoryText}>{category}</ThemedText>
              </TouchableOpacity>
          ))}
        </View>

        <FlatList
            data={filteredPodcasts}
            renderItem={({ item }) => <PodcastItem item={item} onPress={handlePress} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
        />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#967d28',
    marginLeft: 10, // Space between icon and text
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 4,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedCategoryButton: {
    backgroundColor: '#F8F5ED',
  },
  categoryText: {
    color: '#967d28',
  },
  listContent: {
    paddingBottom: 20,
  },
  podcastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  podcastImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});
