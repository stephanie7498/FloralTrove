import React, { useState } from 'react';
import {
    ActivityIndicator,
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
    const [showInstructions, setShowInstructions] = useState(false);
    const [recognitionFailed, setRecognitionFailed] = useState(false);

    const { addPlantToCollection, getPlantData, getPlantImage } = useAppContext();
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
                        </View>

                        {isProcessing && (
                            <View style={styles.processingContainer}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.processingText}>Scanning...</Text>
                            </View>
                        )}

                        {recognitionFailed && (
                            <View style={styles.failureContainer}>
                                <Text style={styles.failureTitle}>Can't recognize flower.</Text>
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
                                <Text style={styles.modalPlantEmoji}>
                                    {getPlantImage(foundPlant.id, 'basic')}
                                </Text>
                            )}
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
                            Point your camera at a flower and snap a picture{'\n'}
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    infoButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    viewfinderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    viewfinder: {
        width: 200,
        height: 200,
        position: 'relative',
    },
    viewfinderCorner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#fff',
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
    },
    topRight: {
        top: 0,
        right: 0,
        left: 'auto',
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        top: 'auto',
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        top: 'auto',
        left: 'auto',
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    processingContainer: {
        position: 'absolute',
        alignItems: 'center',
        gap: 10,
    },
    processingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    failureContainer: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 15,
        gap: 15,
    },
    failureTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tryAgainButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
    },
    tryAgainText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomControls: {
        padding: 40,
        alignItems: 'center',
    },
    captureButton: {
        backgroundColor: 'rgba(74, 124, 74, 0.9)',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    captureButtonDisabled: {
        backgroundColor: 'rgba(128, 128, 128, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    captureIcon: {
        fontSize: 20,
    },
    captureText: {
        color: '#fff',
        fontSize: 18,
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
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        maxWidth: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a7c4a',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalPlant: {
        marginBottom: 25,
    },
    modalPlantEmoji: {
        fontSize: 60,
    },
    modalButtons: {
        gap: 12,
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#4a7c4a',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',
    },
    modalButtonSecondary: {
        backgroundColor: '#888',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    instructionsContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '85%',
        maxWidth: 320,
    },
    instructionsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 20,
    },
    instructionsText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 25,
    },
    okButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 15,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});