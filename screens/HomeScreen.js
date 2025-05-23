import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
    const { coins, challenges } = useAppContext();
    const activeChallenge = challenges.find(c => !c.completed);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.background}>
                {/* Temporary colored background instead of image */}
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Floral Trove</Text>
                        <View style={styles.coinContainer}>
                            <Text style={styles.coinText}>🪙 {coins}</Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        {activeChallenge && (
                            <View style={styles.challengeCard}>
                                <Text style={styles.challengeTitle}>Challenge</Text>
                                <Text style={styles.challengeText}>{activeChallenge.title}</Text>
                                <Text style={styles.challengeProgress}>
                                    {activeChallenge.progress}/{activeChallenge.target}
                                </Text>
                                <Text style={styles.challengeReward}>🪙 {activeChallenge.reward}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.mainButton}
                            onPress={() => navigation.navigate('Camera')}
                        >
                            <Text style={styles.buttonText}>📷 Take Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate('Collection')}
                        >
                            <Text style={styles.buttonText}>🌸 Your Collection</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate('Shop')}
                        >
                            <Text style={styles.buttonText}>🛒 Buy New Pots</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Point your camera at a flower and snap a picture
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        backgroundColor: '#87CEEB', // Sky blue placeholder
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    coinContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    coinText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a7c4a',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    challengeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 20,
        minWidth: 250,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 5,
    },
    challengeText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    challengeProgress: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a7c4a',
    },
    challengeReward: {
        fontSize: 16,
        color: '#f39c12',
        marginTop: 5,
    },
    mainButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: 'rgba(74, 124, 74, 0.8)',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});