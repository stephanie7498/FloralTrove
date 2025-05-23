import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function CameraScreen({ navigation }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { addPlantToCollection, getPlantData } = useAppContext();
    const plants = getPlantData();

    const simulatePlantDetection = () => {
        setIsProcessing(true);

        // Mock AI recognition - randomly select a plant
        setTimeout(() => {
            const randomPlant = plants[Math.floor(Math.random() * plants.length)];
            const success = Math.random() > 0.3; // 70% success rate

            setIsProcessing(false);

            if (success) {
                const wasAdded = addPlantToCollection(randomPlant.id);

                if (wasAdded) {
                    Alert.alert(
                        "Success! 🌸",
                        `You found a ${randomPlant.name}! Added to your collection. (+${randomPlant.coins} coins)`,
                        [
                            { text: "To Collection", onPress: () => navigation.navigate('Collection') },
                            { text: "Find More", onPress: () => { } }
                        ]
                    );
                } else {
                    Alert.alert(
                        "Already Found!",
                        `You already have a ${randomPlant.name} in your collection.`,
                        [{ text: "OK" }]
                    );
                }
            } else {
                Alert.alert(
                    "No Flower Detected",
                    "Try again! Make sure you're pointing at a flower.",
                    [{ text: "Try Again" }]
                );
            }
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>🌸 Flower Scanner</Text>
                    <Text style={styles.subtitle}>
                        Simulate finding flowers in nature
                    </Text>
                </View>

                <View style={styles.scanArea}>
                    <View style={styles.viewfinder}>
                        <Text style={styles.viewfinderText}>
                            {isProcessing ? "🔍 Scanning..." : "📱 Tap to Scan"}
                        </Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.scanButton, isProcessing && styles.scanButtonDisabled]}
                        onPress={simulatePlantDetection}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <Text style={styles.scanButtonText}>🔍 Simulate Scan</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Back to Home</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        💡 This simulates finding flowers with your camera
                    </Text>
                    <Text style={styles.instructionText}>
                        🎯 70% chance of finding a flower
                    </Text>
                    <Text style={styles.instructionText}>
                        🪙 Earn coins for each discovery
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    scanArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewfinder: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: '#4a7c4a',
        borderStyle: 'dashed',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewfinderText: {
        fontSize: 18,
        color: '#4a7c4a',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controls: {
        alignItems: 'center',
        gap: 20,
    },
    scanButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        minWidth: 200,
        alignItems: 'center',
    },
    scanButtonDisabled: {
        backgroundColor: '#888',
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#888',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    instructions: {
        marginTop: 30,
        alignItems: 'center',
        gap: 5,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});