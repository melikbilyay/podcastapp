import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MiniPlayer from './MiniPlayer';  // Adjust the path as needed

const PlayerScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { podcast } = route.params as { podcast: Podcast };

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [showMiniPlayer, setShowMiniPlayer] = useState(false);

    const soundRef = useRef<Audio.Sound | null>(null);
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                { uri: podcast.url },
                { shouldPlay: isPlaying }
            );
            setSound(sound);
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate(status => {
                if (status.isLoaded) {
                    setProgress(status.positionMillis);
                    setDuration(status.durationMillis);
                    setIsPlaying(status.isPlaying);
                }
            });
        };

        loadSound();

        return () => {
            sound?.unloadAsync();
        };
    }, [podcast.url]);

    useEffect(() => {
        const loadPlaybackState = async () => {
            try {
                const savedProgress = await AsyncStorage.getItem('playbackProgress');
                const savedIsPlaying = await AsyncStorage.getItem('isPlaying');

                if (savedProgress !== null) {
                    setProgress(parseFloat(savedProgress));
                }
                if (savedIsPlaying !== null) {
                    setIsPlaying(JSON.parse(savedIsPlaying));
                }
            } catch (error) {
                console.error('Failed to load playback state:', error);
            }
        };

        loadPlaybackState();

        return () => {
            const savePlaybackState = async () => {
                try {
                    await AsyncStorage.setItem('playbackProgress', progress.toString());
                    await AsyncStorage.setItem('isPlaying', JSON.stringify(isPlaying));
                } catch (error) {
                    console.error('Failed to save playback state:', error);
                }
            };

            savePlaybackState();
        };
    }, [progress, isPlaying]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (soundRef.current) {
                soundRef.current.getStatusAsync().then(status => {
                    if (status.isLoaded) {
                        const seconds = status.positionMillis / 1000;
                        const min = Math.floor(seconds / 60);
                        const sec = Math.floor(seconds % 60);
                        setCurrTime({ min, sec });
                    }
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sound]);

    const togglePlayPause = async () => {
        if (isPlaying) {
            await soundRef.current?.pauseAsync();
            setIsPlaying(false);
        } else {
            await soundRef.current?.playAsync();
            setIsPlaying(true);
        }
    };

    const handleSeek = async (value: number) => {
        await soundRef.current?.setPositionAsync(value);
        setProgress(value);
    };

    const handleSkip = async (direction: 'next' | 'previous') => {
        console.log(`Skipping ${direction}`);
    };

    const handlePanResponderMove = (e: any, gestureState: any) => {
        if (gestureState.dy > 100) {
            setShowMiniPlayer(true);   // Show mini player
            navigation.navigate('(tabs)');  // Navigate to index screen or home screen
        }
    };

    const handleMiniPlayerTap = () => {
        setShowMiniPlayer(false);   // Hide mini player
        navigation.navigate('PlayerScreen');  // Navigate back to the main player screen
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: handlePanResponderMove,
            onPanResponderRelease: () => pan.flattenOffset(),
        })
    ).current;

    return (
        <ThemedView style={styles.container} {...panResponder.panHandlers}>
            {/* Main Player */}
            {!showMiniPlayer && (
                <>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={32} color="#967d28" />
                    </TouchableOpacity>
                    <Image source={podcast.image} style={styles.podcastImage} />
                    <ThemedText style={styles.title}>{podcast.title}</ThemedText>

                    <View style={styles.controls}>
                        <TouchableOpacity onPress={() => handleSkip('previous')}>
                            <MaterialCommunityIcons name="skip-previous" size={32} color="#967d28" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={togglePlayPause}>
                            <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={32} color="#967d28" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSkip('next')}>
                            <MaterialCommunityIcons name="skip-next" size={32} color="#967d28" />
                        </TouchableOpacity>
                    </View>

                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={progress}
                        onValueChange={handleSeek}
                        minimumTrackTintColor="#967d28"
                        maximumTrackTintColor="#ddd"
                        thumbTintColor="#967d28"
                    />
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currTime.min}:{currTime.sec < 10 ? `0${currTime.sec}` : currTime.sec}
                        </Text>
                        <Text style={styles.progressText}>
                            {Math.floor(duration / 60000)}:{Math.floor((duration % 60000) / 1000).toFixed(0).padStart(2, '0')}
                        </Text>
                    </View>
                </>
            )}

            {/* Mini Player */}
            {showMiniPlayer && (
                <MiniPlayer
                    podcast={podcast}
                    isPlaying={isPlaying}
                    onPlayPause={togglePlayPause}
                    onTap={handleMiniPlayerTap}
                />
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF9F4',
        padding: 10,
    },
    backButton: {
        marginBottom: 10,
    },
    podcastImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#967d28',
        marginBottom: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        color: '#967d28',
    },
});

export default PlayerScreen;
