import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/config/firebase";

const { width } = Dimensions.get('window');

// Default image URL for podcasts without images
const defaultImage = require('@/assets/images/icon.png');

interface CarouselItemType {
    id: string;
    title: string;
    image: any; // Use ImageSourcePropType if needed
}

interface PodcastCardType {
    id: string;
    title: string;
    image: any; // Use ImageSourcePropType if needed
}

const CarouselItem: React.FC<{ item: CarouselItemType }> = ({ item }) => (
    <View style={styles.sliderItem}>
        <Image
            source={{ uri: item.image }} // Ensure this is a valid image URL
            style={styles.sliderImage}
            resizeMode="cover"
        />
        <ThemedText style={styles.sliderText}>{item.id}</ThemedText>
    </View>
);

const PodcastCard: React.FC<{ item: PodcastCardType }> = ({ item }) => (
    <View style={styles.card}>
        <Image
            source={{ uri: item.image || defaultImage }} // Ensure this is a valid image URL
            style={styles.cardImage}
            resizeMode="cover"
        />
        <ThemedText style={styles.cardTitle}>{item.id}</ThemedText>
    </View>
);

export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    '(menu)/settings': undefined;
};

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [podcastData, setPodcastData] = useState<PodcastCardType[]>([]);

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'educationResources'));
                const podcasts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: data.id,
                        title: data.category, // Use this as title or adjust as needed
                        image: data.coverImageUrl || defaultImage, // Use coverImageUrl
                    } as PodcastCardType;
                });

                console.log('Fetched podcasts:', podcasts); // Debugging: Check fetched data

                // Ensure podcasts is not empty before setting state
                if (podcasts.length > 0) {
                    setPodcastData(podcasts);
                }
            } catch (error) {
                console.error("Error fetching podcasts:", error);
            }
        };

        fetchPodcasts();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('(menu)/settings')}
                >
                    <MaterialCommunityIcons name="dots-horizontal" size={30} color="black" />
                </TouchableOpacity>

                <Carousel
                    loop
                    width={width}
                    height={200}
                    autoPlay
                    data={podcastData}
                    renderItem={({ item }) => <CarouselItem item={item} />}
                    scrollAnimationDuration={1000}
                />

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText type="subtitle">Yeni Çıkan Podcastler</ThemedText>
                    <FlatList
                        data={podcastData}
                        renderItem={({ item }) => <PodcastCard item={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardListContainer}
                        ListEmptyComponent={<ThemedText>No podcasts available</ThemedText>} // For empty state
                    />
                </ThemedView>

                <View style={styles.divider} />

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText type="subtitle">Önerilen Podcastler</ThemedText>
                    <FlatList
                        data={podcastData}
                        renderItem={({ item }) => <PodcastCard item={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardListContainer}
                        ListEmptyComponent={<ThemedText>No recommended podcasts available</ThemedText>} // For empty state
                    />
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF9F4',
    },
    content: {
        flex: 1,
        padding: 16,
        marginTop: 30,
    },
    sliderItem: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sliderImage: {
        width: '100%',
        height: '80%',
        borderRadius: 8,
    },
    sliderText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginRight: 15,
        padding: 10,
        width: 150,
    },
    cardImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },
    cardTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    menuButton: {
        position: 'absolute',
        top: -30,
        right: 20,
        zIndex: 1000,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 20,
    },
    cardListContainer: {
        paddingVertical: 10,
    },
});
