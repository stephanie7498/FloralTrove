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
import { useAppContext } from '../context/AppContext';

export default function CameraScreen({ navigation }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFoundModal, setShowFoundModal] = useState(false);
    const [foundPlant, setFoundPlant] = useState(null);
    const [foundPotId, setFoundPotId] = useState('basic');
    const [showInstructions, setShowInstructions] = useState(false);
    const [recognitionFailed, setRecognitionFailed] = useState(false);

    const { addPlantToCollection, getPlantData, getPlantImage, coins } = useAppContext();
    const plants = getPlantData();

    const simulatePlantDetection = () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setRecognitionFailed(false);

        setTimeout(() => {
            const success = Math.random() > 0.3;
            setIsProcessing(false);

            if (success) {
                const randomPlant = plants[Math.floor(Math.random() * plants.length)];
                const wasAdded = addPlantToCollection(randomPlant.id);

                if (wasAdded) {
                    setFoundPlant(randomPlant);
                    setFoundPotId('basic'); // Default pot for display
                    setShowFoundModal(true);
                } else {
                    setRecognitionFailed(true);
                }
            } else {
                setRecognitionFailed(true);
            }
        }, 2000);
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
                    {/* Top bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.coinContainer}
                            onPress={() => navigation.navigate('Shop')}
                        >
                            <Text style={styles.coinIcon}>🪙</Text>
                            <Text style={styles.coinText}>{coins}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.infoButton}
                            onPress={() => setShowInstructions(true)}
                        >
                            <Text style={styles.infoText}>How it works</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Center viewfinder */}
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
                                <Text style={styles.failureTitle}>Cannot recognize flower.</Text>
                                <TouchableOpacity
                                    style={styles.tryAgainButton}
                                    onPress={() => setRecognitionFailed(false)}
                                >
                                    <Text style={styles.tryAgainText}>Try again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Bottom controls */}
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

            {/* Found Plant Modal */}
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
                                    source={getPlantImage(foundPlant.id, foundPotId)}
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

            {/* Instructions Modal */}
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
                            Go to your collection or{'\n'}
                            collect more flowers!{'\n\n'}
                            Have fun!
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    coinContainer: {
        backgroundColor: 'rgba(255, 165, 0, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    coinIcon: {
        fontSize: 16,
        marginRight: 5,
        color: '#fff',
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    infoButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
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
        backgroundColor: '#fff',
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
        backgroundColor: 'rgba(76, 175, 80, 0.95)',
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
        backgroundColor: 'rgba(128, 128, 128, 0.7)',
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
        padding: 15,
    },
    modalPlantImage: {
        width: 100,
        height: 120,
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
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        lineHeight: 26,
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