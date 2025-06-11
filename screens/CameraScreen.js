import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppActions, useAppState } from '../context/AppContext';

export default function CameraScreen({ navigation }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFoundModal, setShowFoundModal] = useState(false);
    const [foundPlant, setFoundPlant] = useState(null);
    const [foundPotId, setFoundPotId] = useState('basic');
    const [showInstructions, setShowInstructions] = useState(false);
    const [recognitionFailed, setRecognitionFailed] = useState(false);

    const { collection } = useAppState();
    const { addPlantToCollection, getPlantData } = useAppActions();

    const getPlantImageDirect = (plantId, potId = 'basic') => {
        // For the found modal, prioritize GIFs to show animations
        if (plantId === 'cornflower') {
            return require('../assets/plantgifs/cornflower.gif');
        }
        if (plantId === 'poppy') {
            return require('../assets/plantgifs/poppy.gif');
        }

        // Fallback to static images for daisy or if needed
        const imageMap = {
            cornflower: {
                basic: require('../assets/images/plants/cornflower_basic_pot.png'),
                round: require('../assets/images/plants/cornflower_round_pot.png'),
            },
            daisy: {
                basic: require('../assets/images/plants/daisy_basic_pot.png'),
                round: require('../assets/images/plants/daisy_round_pot.png'),
            },
            poppy: {
                basic: require('../assets/images/plants/poppy_basic_pot.png'),
                round: require('../assets/images/plants/poppy_round_pot.png'),
            }
        };

        if (imageMap[plantId] && imageMap[plantId][potId]) {
            return imageMap[plantId][potId];
        }

        if (imageMap[plantId] && imageMap[plantId]['basic']) {
            return imageMap[plantId]['basic'];
        }

        return null;
    };

    const getCollectedPlantIds = () => {
        return collection.map(item => item.plantId);
    };

    const simulatePlantDetection = () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setRecognitionFailed(false);

        setTimeout(() => {
            // Increased success rate from 70% to 90%
            const success = Math.random() > 0.1;
            setIsProcessing(false);

            if (success) {
                const availablePlants = ['cornflower', 'daisy', 'poppy'];
                const collectedPlantIds = getCollectedPlantIds();
                const uncollectedPlants = availablePlants.filter(plantId => !collectedPlantIds.includes(plantId));

                if (uncollectedPlants.length === 0) {
                    setRecognitionFailed(true);
                    return;
                }

                const randomPlantId = uncollectedPlants[Math.floor(Math.random() * uncollectedPlants.length)];
                const plants = getPlantData();
                const randomPlant = plants.find(p => p.id === randomPlantId);

                if (randomPlant) {
                    const wasAdded = addPlantToCollection(randomPlantId);

                    if (wasAdded) {
                        setFoundPlant(randomPlant);
                        setFoundPotId('basic');
                        setShowFoundModal(true);
                    } else {
                        setRecognitionFailed(true);
                    }
                } else {
                    setRecognitionFailed(true);
                }
            } else {
                setRecognitionFailed(true);
            }
        }, 1500); // Reduced time from 2000ms to 1500ms for faster response
    };

    const closeFoundModal = () => {
        setShowFoundModal(false);
        setFoundPlant(null);
        setFoundPotId('basic');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/backgrounds/background_challenges.png')}
                style={styles.cameraView}
                resizeMode="cover"
            >
                <View style={styles.cameraOverlay}>
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.infoButton}
                            onPress={() => setShowInstructions(true)}
                        >
                            <Text style={styles.infoText}>How it works</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.viewfinderContainer}>
                        <View style={styles.viewfinder}>
                            <View style={styles.viewfinderCorner} />
                            <View style={[styles.viewfinderCorner, styles.topRight]} />
                            <View style={[styles.viewfinderCorner, styles.bottomLeft]} />
                            <View style={[styles.viewfinderCorner, styles.bottomRight]} />

                            {!isProcessing && !recognitionFailed && (
                                <View style={styles.centerText}>
                                    <Text style={styles.instructionText}>Point your camera at a</Text>
                                    <Text style={styles.instructionText}>flower and snap a picture</Text>
                                </View>
                            )}
                        </View>

                        {isProcessing && (
                            <View style={styles.processingContainer}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.processingText}>Scanning...</Text>
                            </View>
                        )}

                        {recognitionFailed && (
                            <View style={styles.failureContainer}>
                                <Text style={styles.failureTitle}>
                                    {getCollectedPlantIds().length >= 3 ?
                                        "All flowers collected!" :
                                        "Cannot recognize flower."
                                    }
                                </Text>
                                {getCollectedPlantIds().length >= 3 ? (
                                    <TouchableOpacity
                                        style={styles.tryAgainButton}
                                        onPress={() => navigation.navigate('Collection')}
                                    >
                                        <Text style={styles.tryAgainText}>View Collection</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.tryAgainButton}
                                        onPress={() => setRecognitionFailed(false)}
                                    >
                                        <Text style={styles.tryAgainText}>Try again</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    <View style={styles.bottomControls}>
                        <TouchableOpacity
                            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
                            onPress={simulatePlantDetection}
                            disabled={isProcessing}
                        >
                            <Text style={styles.captureIcon}>📷</Text>
                            <Text style={styles.captureText}>Take picture</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            <Modal
                visible={showFoundModal}
                transparent={true}
                animationType="fade"
                onRequestClose={closeFoundModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            You found a {foundPlant?.name}!
                        </Text>
                        <View style={styles.modalPlant}>
                            {foundPlant && (
                                <Image
                                    source={getPlantImageDirect(foundPlant.id, foundPotId)}
                                    style={styles.modalPlantImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                        <View style={styles.coinReward}>
                            <Text style={styles.coinRewardText}>+{foundPlant?.coins} coins! 🪙</Text>
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    closeFoundModal();
                                    navigation.navigate('Collection');
                                }}
                            >
                                <Text style={styles.modalButtonText}>To collection</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                                onPress={closeFoundModal}
                            >
                                <Text style={styles.modalButtonText}>Collect More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showInstructions}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowInstructions(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.instructionsContent}>
                        <Text style={styles.instructionsTitle}>How it works</Text>
                        <Text style={styles.instructionsText}>
                            Point your camera at a flower and snap a picture{'\n\n'}
                            Discover beautiful flowers like:{'\n'}
                            🌾 Cornflowers - Blue wildflowers (animated!){'\n'}
                            🌼 Daisies - White with yellow centers{'\n'}
                            🌺 Poppies - Vibrant red blooms (animated!){'\n\n'}
                            You can collect each flower only once!{'\n'}
                            Higher success rate - 90% chance to find flowers!{'\n'}
                            Some special flowers have animations!{'\n\n'}
                            Have fun exploring! 🌸
                        </Text>
                        <TouchableOpacity
                            style={styles.okButton}
                            onPress={() => setShowInstructions(false)}
                        >
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraView: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    backText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    infoButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    viewfinderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    viewfinder: {
        width: 250,
        height: 250,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewfinderCorner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#4CAF50',
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        left: 'auto',
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderLeftWidth: 0,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        top: 'auto',
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        top: 'auto',
        left: 'auto',
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
    },
    centerText: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 22,
    },
    processingContainer: {
        position: 'absolute',
        alignItems: 'center',
        gap: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 20,
    },
    processingText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    failureContainer: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'rgba(244, 67, 54, 0.95)',
        padding: 25,
        borderRadius: 20,
        gap: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    failureTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tryAgainButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 20,
    },
    tryAgainText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomControls: {
        padding: 40,
        alignItems: 'center',
    },
    captureButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.98)',
        paddingHorizontal: 35,
        paddingVertical: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    captureButtonDisabled: {
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    captureIcon: {
        fontSize: 24,
    },
    captureText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 35,
        borderRadius: 25,
        alignItems: 'center',
        width: '85%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 28,
    },
    modalPlant: {
        marginBottom: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    modalPlantImage: {
        width: 140,
        height: 160,
        borderRadius: 15,
    },
    coinReward: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        marginBottom: 25,
    },
    coinRewardText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalButtons: {
        gap: 15,
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    modalButtonSecondary: {
        backgroundColor: '#757575',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    instructionsContent: {
        backgroundColor: '#fff',
        padding: 35,
        borderRadius: 25,
        alignItems: 'center',
        width: '90%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    instructionsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 25,
    },
    instructionsText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    okButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 50,
        paddingVertical: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});