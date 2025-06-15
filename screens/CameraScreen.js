// =============================================================================
// screens/CameraScreen.js - Plant foto herkenning scherm
// =============================================================================
// Dit scherm beheert foto selectie (camera/bibliotheek), PlantNet API calls,
// en toont resultaten van plant identificatie met success/failure feedback.

import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import PlantNetAPI from '../services/PlantNetAPI';

export default function CameraScreen({ navigation }) {
    // =============================================================================
    // COMPONENT STATE
    // =============================================================================

    const [isProcessing, setIsProcessing] = useState(false);           // API call in progress
    const [showFoundModal, setShowFoundModal] = useState(false);       // Success modal zichtbaar
    const [foundPlant, setFoundPlant] = useState(null);               // Succesvol geïdentificeerde plant
    const [foundPotId, setFoundPotId] = useState('basic');            // Pot type voor nieuwe plant
    const [showInstructions, setShowInstructions] = useState(false);   // Instructies modal
    const [recognitionFailed, setRecognitionFailed] = useState(false); // Herkenning mislukt
    const [identificationResult, setIdentificationResult] = useState(null); // API resultaat data

    // Context data
    const { collection } = useAppState();
    const { addPlantToCollection, getPlantData } = useAppActions();

    // =============================================================================
    // AFBEELDING HELPERS
    // =============================================================================

    /**
     * Haal juiste afbeelding op voor plant (prioriteit aan GIFs in found modal)
     * @param {string} plantId - Plant identifier
     * @param {string} potId - Pot type identifier  
     * @returns {Object} - React Native image require object
     */
    const getPlantImageDirect = (plantId, potId = 'basic') => {
        // Voor found modal: gebruik GIFs waar beschikbaar
        if (plantId === 'cornflower') {
            return require('../assets/plantgifs/cornflower.gif');
        }
        if (plantId === 'poppy') {
            return require('../assets/plantgifs/poppy.gif');
        }

        // Static images voor bestaande planten
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
            },
            gele_ganzenbloem: {
                basic: require('../assets/images/plants/gele_ganzenbloem_basic_pot.png'),
                round: require('../assets/images/plants/gele_ganzenbloem_round_pot.png'),
            }
        };

        // Fallback logica
        if (imageMap[plantId] && imageMap[plantId][potId]) {
            return imageMap[plantId][potId];
        }

        if (imageMap[plantId] && imageMap[plantId]['basic']) {
            return imageMap[plantId]['basic'];
        }

        // Voor nieuwe planten zonder afbeeldingen: basic pot als fallback
        return require('../assets/images/pots/basic_pot.png');
    };

    /**
     * Haal lijst van al verzamelde plant IDs op
     * @returns {Array} - Array van plant IDs in collectie
     */
    const getCollectedPlantIds = () => {
        return collection.map(item => item.plantId);
    };

    // =============================================================================
    // FOTO SELECTIE FUNCTIONALITEIT
    // =============================================================================

    /**
     * Hoofdfunctie: start foto selectie en identificatie proces
     * Beheert camera/bibliotheek keuze en permissies
     */
    const takePictureAndIdentify = async () => {
        if (isProcessing) return;

        try {
            // Vraag permissies voor camera en fotobibliotheek
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            // Camera beschikbaar (echte device)
            if (cameraStatus === 'granted') {
                Alert.alert(
                    "Select Photo Source",
                    "Choose how you want to add a photo for plant identification:",
                    [
                        {
                            text: "Take Photo",
                            onPress: async () => {
                                try {
                                    const result = await ImagePicker.launchCameraAsync({
                                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                        allowsEditing: true,
                                        aspect: [1, 1],
                                        quality: 0.8,
                                    });
                                    if (!result.canceled) {
                                        processImage(result.assets[0].uri);
                                    }
                                } catch (error) {
                                    // Camera gefaald (waarschijnlijk simulator), val terug op bibliotheek
                                    console.log('📱 Camera not available, using photo library...');
                                    launchPhotoLibrary();
                                }
                            }
                        },
                        {
                            text: "Choose from Library",
                            onPress: () => launchPhotoLibrary()
                        },
                        {
                            text: "Cancel",
                            style: "cancel"
                        }
                    ]
                );
            } else if (libraryStatus === 'granted') {
                // Alleen fotobibliotheek beschikbaar (simulator)
                launchPhotoLibrary();
            } else {
                Alert.alert(
                    'Permissions Required',
                    'Please allow photo access to identify plants.',
                    [{ text: 'OK' }]
                );
            }

        } catch (error) {
            console.error('❌ Error during image selection:', error);
            Alert.alert(
                'Error',
                'Could not access camera or photo library. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    /**
     * Start fotobibliotheek voor afbeelding selectie
     */
    const launchPhotoLibrary = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                processImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('❌ Error launching photo library:', error);
            Alert.alert(
                'Error',
                'Could not access photo library. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // =============================================================================
    // PLANT IDENTIFICATIE PROCES
    // =============================================================================

    /**
     * Verwerk geselecteerde afbeelding en start plant identificatie
     * @param {string} imageUri - URI van geselecteerde afbeelding
     */
    const processImage = async (imageUri) => {
        console.log('📸 Image selected:', imageUri);

        // Vraag gebruiker toestemming voor PlantNet API
        const hasPermission = await PlantNetAPI.requestPermission();
        if (!hasPermission) {
            Alert.alert(
                'Identification Cancelled',
                'Photo was not sent for identification. You can try selecting another picture.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Reset state en start processing
        setIsProcessing(true);
        setRecognitionFailed(false);
        setIdentificationResult(null);

        try {
            // Start plant identificatie via PlantNet API
            console.log('🔍 Starting plant identification...');
            const identificationResult = await PlantNetAPI.identifyPlant(imageUri, ['flower', 'leaf']);

            setIdentificationResult(identificationResult);
            setIsProcessing(false);

            if (identificationResult.success && identificationResult.plantId) {
                // Succesvol geïdentificeerd - controleer duplicaten
                const collectedPlantIds = getCollectedPlantIds();
                if (collectedPlantIds.includes(identificationResult.plantId)) {
                    Alert.alert(
                        'Already Collected! 🌸',
                        `You already have a ${identificationResult.plantId} in your collection!\n\nTry finding a different type of flower.`,
                        [{ text: 'OK' }]
                    );
                    return;
                }

                // Voeg plant toe aan collectie
                const plants = getPlantData();
                const plant = plants.find(p => p.id === identificationResult.plantId);

                if (plant) {
                    const wasAdded = addPlantToCollection(identificationResult.plantId);

                    if (wasAdded) {
                        // Toon success modal
                        setFoundPlant(plant);
                        setFoundPotId('basic');
                        setShowFoundModal(true);

                        console.log(`✅ Successfully identified: ${plant.name} (${identificationResult.confidence.toFixed(1)}% confidence)`);
                    } else {
                        setRecognitionFailed(true);
                    }
                } else {
                    setRecognitionFailed(true);
                }
            } else {
                // Herkenning mislukt - toon gedetailleerde foutmelding
                let failureMessage = 'Could not identify this plant.';

                if (identificationResult.scientificName) {
                    failureMessage = `Found "${identificationResult.scientificName}" but this plant is not in our collection yet.\n\nWe currently collect: Cornflowers, Daisies, Poppies, and Yellow Daisies.`;
                } else if (identificationResult.confidence > 0) {
                    failureMessage = `Plant detected but confidence too low (${identificationResult.confidence.toFixed(1)}%).\n\nTry selecting a clearer photo with good lighting.`;
                }

                Alert.alert(
                    'Plant Not Recognized 🔍',
                    failureMessage,
                    [
                        { text: 'Try Again', style: 'default' },
                        {
                            text: 'View Collection Guide',
                            style: 'default',
                            onPress: () => setShowInstructions(true)
                        }
                    ]
                );
                setRecognitionFailed(true);
            }

        } catch (error) {
            console.error('❌ Error during plant identification:', error);
            setIsProcessing(false);

            // Gebruiksvriendelijke foutmeldingen
            let errorMessage = 'Something went wrong during plant identification.';

            if (error.message?.includes('network') || error.message?.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.message?.includes('API')) {
                errorMessage = 'Plant identification service is temporarily unavailable. Please try again later.';
            }

            Alert.alert(
                'Identification Failed',
                errorMessage,
                [{ text: 'OK' }]
            );
            setRecognitionFailed(true);
        }
    };

    // =============================================================================
    // MODAL MANAGEMENT
    // =============================================================================

    /**
     * Sluit success modal en reset state
     */
    const closeFoundModal = () => {
        setShowFoundModal(false);
        setFoundPlant(null);
        setFoundPotId('basic');
    };

    // =============================================================================
    // RENDER
    // =============================================================================

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/backgrounds/background_challenges.png')}
                style={styles.cameraView}
                resizeMode="cover"
            >
                <View style={styles.cameraOverlay}>
                    {/* Header met back button en info */}
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

                    {/* Camera viewfinder gebied */}
                    <View style={styles.viewfinderContainer}>
                        <View style={styles.viewfinder}>
                            {/* Viewfinder hoeken */}
                            <View style={styles.viewfinderCorner} />
                            <View style={[styles.viewfinderCorner, styles.topRight]} />
                            <View style={[styles.viewfinderCorner, styles.bottomLeft]} />
                            <View style={[styles.viewfinderCorner, styles.bottomRight]} />

                            {/* Default instructie tekst */}
                            {!isProcessing && !recognitionFailed && (
                                <View style={styles.centerText}>
                                    <Text style={styles.instructionText}>Tap 'Select Photo' to take</Text>
                                    <Text style={styles.instructionText}>or choose a flower image</Text>
                                </View>
                            )}
                        </View>

                        {/* Processing indicator */}
                        {isProcessing && (
                            <View style={styles.processingContainer}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.processingText}>Identifying plant...</Text>
                                <Text style={styles.processingSubtext}>Using PlantNet AI 🤖</Text>
                            </View>
                        )}

                        {/* Failure state */}
                        {recognitionFailed && (
                            <View style={styles.failureContainer}>
                                <Text style={styles.failureTitle}>
                                    {getCollectedPlantIds().length >= 4 ?
                                        "All flowers collected!" :
                                        "Cannot recognize flower."
                                    }
                                </Text>
                                {getCollectedPlantIds().length >= 4 ? (
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

                    {/* Bottom controls */}
                    <View style={styles.bottomControls}>
                        <TouchableOpacity
                            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
                            onPress={takePictureAndIdentify}
                            disabled={isProcessing}
                        >
                            <Text style={styles.captureIcon}>📸</Text>
                            <Text style={styles.captureText}>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            {/* Success Modal - toont gevonden plant */}
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

                        {/* Plant afbeelding */}
                        <View style={styles.modalPlant}>
                            {foundPlant && (
                                <View style={styles.modalPlantContainer}>
                                    <Image
                                        source={getPlantImageDirect(foundPlant.id, foundPotId)}
                                        style={styles.modalPlantImage}
                                        resizeMode="contain"
                                    />
                                    {/* Emoji overlay voor planten zonder custom afbeelding */}
                                    {!['cornflower', 'daisy', 'poppy', 'gele_ganzenbloem'].includes(foundPlant.id) && (
                                        <View style={styles.modalPlantEmojiOverlay}>
                                            <Text style={styles.modalPlantEmojiText}>{foundPlant.emoji}</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Coin reward */}
                        <View style={styles.coinReward}>
                            <Text style={styles.coinRewardText}>+{foundPlant?.coins} coins! 🪙</Text>
                        </View>

                        {/* AI confidence indicator */}
                        {identificationResult && (
                            <View style={styles.confidenceContainer}>
                                <Text style={styles.confidenceText}>
                                    🤖 AI Confidence: {identificationResult.confidence.toFixed(1)}%
                                </Text>
                            </View>
                        )}

                        {/* Action buttons */}
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

            {/* Instructions Modal - uitleg over hoe de app werkt */}
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
                            Take or select a clear photo of a flower for AI identification{'\n\n'}
                            📸 How it works:{'\n'}
                            • Tap 'Select Photo' to choose image source{'\n'}
                            • Take new photo OR choose from library{'\n'}
                            • Select a clear, well-lit flower image{'\n'}
                            • We'll ask permission to identify it{'\n'}
                            • PlantNet AI will identify the species{'\n\n'}
                            🌸 We can find:{'\n'}
                            🌾 Cornflowers - Blue wildflowers{'\n'}
                            🌼 Daisies - White with yellow centers{'\n'}
                            🌺 Poppies - Vibrant red blooms{'\n'}
                            🌻 Yellow Daisy - Bright yellow flowers{'\n\n'}
                            💡 Tips for best results:{'\n'}
                            • Use good lighting (natural light works best){'\n'}
                            • Get close to the flower{'\n'}
                            • Make sure the flower is clearly visible{'\n'}
                            • Avoid blurry photos{'\n'}
                            • Try different images if first attempt fails{'\n\n'}
                            📱 Works on simulator: Choose photos from your library!{'\n\n'}
                            🔒 Privacy: Your photo is sent to PlantNet (France) for identification. This helps botanical research!
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
    processingSubtext: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
        opacity: 0.8,
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
    modalPlantContainer: {
        position: 'relative',
    },
    modalPlantImage: {
        width: 140,
        height: 160,
        borderRadius: 15,
    },
    modalPlantEmojiOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    modalPlantEmojiText: {
        fontSize: 20,
    },
    coinReward: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        marginBottom: 15,
    },
    coinRewardText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confidenceContainer: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 25,
    },
    confidenceText: {
        color: '#1976D2',
        fontSize: 14,
        fontWeight: '600',
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
        maxHeight: '80%',
    },
    instructionsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 25,
    },
    instructionsText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',
        lineHeight: 20,
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