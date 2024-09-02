import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio, Video } from 'expo-av';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayerScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { podcast } = route.params as { podcast: Podcast };

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [isAudio, setIsAudio] = useState<boolean>(true);

    const soundRef = useRef<Audio.Sound | null>(null);
    const videoRef = useRef<Video | null>(null);

    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        const fileType = podcast.url.split('.').pop();
        setIsAudio(fileType === 'mp3');

        if (isAudio) {
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
        }

        return () => {
            sound?.unloadAsync();
        };
    }, [podcast.url, isAudio]);

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
            if (isAudio && soundRef.current) {
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
        if (isAudio) {
            if (isPlaying) {
                await soundRef.current?.pauseAsync();
            } else {
                await soundRef.current?.playAsync();
            }
        } else {
            if (isPlaying) {
                await videoRef.current?.pauseAsync();
            } else {
                await videoRef.current?.playAsync();
            }
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = async (value: number) => {
        if (isAudio) {
            await soundRef.current?.setPositionAsync(value);
        } else {
            await videoRef.current?.setPositionAsync(value);
        }
        setProgress(value);
    };

    const handleSkip = async (direction: 'next' | 'previous') => {
        console.log(`Skipping ${direction}`);
    };

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <MaterialCommunityIcons name="arrow-left" size={32} color="#967d28" />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
                <Image source={{ uri: podcast.image }} style={styles.podcastImage} />
                <ThemedText style={styles.title}>{podcast.id}</ThemedText>

                {isAudio ? (
                    <>
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
                ) : (
                    <Video
                        ref={videoRef}
                        source={{ uri: podcast.url }}
                        style={styles.video}
                        resizeMode="contain"
                        useNativeControls
                        shouldPlay={isPlaying}
                        onPlaybackStatusUpdate={status => {
                            if (status.isLoaded) {
                                setProgress(status.positionMillis);
                                setDuration(status.durationMillis);
                                setIsPlaying(status.isPlaying);
                            }
                        }}
                    />
                )}

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
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF9F4',
    },
    backButton: {
        position: 'absolute',
        top: 35,
        left: 10,
        padding: 10,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podcastImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#967d28',
        marginBottom: 20,
    },
    slider: {
        width: '90%',
        height: 40,
        marginBottom: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    progressText: {
        color: '#967d28',
    },
    video: {
        width: '100%',
        height: 300, // Adjust the height as needed
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '90%',
    },
});

export default PlayerScreen;
