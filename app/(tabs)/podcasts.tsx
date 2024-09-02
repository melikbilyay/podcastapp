import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/config/firebase"; // Firestore için Firebase config dosyanızda 'db' referansı olması gerekir.
import { Audio } from 'expo-av';

type Podcast = {
  id: string;
  title?: string; // Title is now optional to handle missing titles
  image: string; // Image URL from Firestore
  url: string; // Video or audio URL
  category: string;
};

type PodcastItemProps = {
  item: Podcast;
  onPress: (podcast: Podcast) => void;
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const categories = ['Tümü', 'İlişkiler', 'Kişisel', 'Sağlık'];

const PodcastItem: React.FC<PodcastItemProps> = ({ item, onPress }) => (
    <TouchableOpacity style={styles.podcastItem} onPress={() => onPress(item)}>
      <Image source={{ uri: item.image }} style={styles.podcastImage} />
      <ThemedText>{capitalize(item.id || 'No Title')}</ThemedText>
    </TouchableOpacity>
);

export default function PodcastsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const navigation = useNavigation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    // Firestore'dan tüm mp4 dosyalarını ve bilgileri çek
    const fetchPodcasts = async () => {
      try {
        const collectionRef = collection(db, 'educationResources');
        const querySnapshot = await getDocs(collectionRef);

        if (!querySnapshot.empty) {
          const fetchedPodcasts = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: data.id,
              title: data.title || 'No Title', // Fallback title
              image: data.coverImageUrl,
              url: data.videoUrl,
              category: data.category || 'Tümü',
            };
          });
          setPodcasts(fetchedPodcasts);
        } else {
          console.log("No documents found!");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchPodcasts();
  }, []);

  const filteredPodcasts = podcasts.filter(podcast =>
      (selectedCategory === 'Tümü' || podcast.category === selectedCategory) &&
      podcast.title && podcast.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = async (podcast: Podcast) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: podcast.url },
        { shouldPlay: true }
    );
    setSound(newSound);
    navigation.navigate('PlayerScreen', { podcast });
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
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#967d28',
    marginLeft: 10,
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
    elevation: 1,
    shadowColor: '#000',
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
    elevation: 1,
    shadowColor: '#000',
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
