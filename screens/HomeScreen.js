import React from 'react';
import {
    ImageBackground,
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
            <ImageBackground
                source={require('../assets/images/backgrounds/background_openingsscherm.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Flora</Text>
                            <Text style={styles.title}>Trove</Text>
                        </View>
                        <View style={styles.coinContainer}>
                            <Text style={styles.coinIcon}>🪙</Text>
                            <Text style={styles.coinText}>{coins}</Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        {activeChallenge && (
                            <View style={styles.challengeCard}>
                                <Text style={styles.challengeLabel}>Challenge</Text>
                                <Text style={styles.challengeTitle}>{activeChallenge.title}</Text>
                                <View style={styles.progressContainer}>
                                    <Text style={styles.progressText}>
                                        {activeChallenge.progress}/{activeChallenge.target}
                                    </Text>
                                    <View style={styles.rewardContainer}>
                                        <Text style={styles.coinIcon}>🪙</Text>
                                        <Text style={styles.rewardText}>{activeChallenge.reward}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.collectButton}
                            onPress={() => navigation.navigate('Camera')}
                        >
                            <Text style={styles.collectButtonText}>Collect now</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomNav}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Collection')}
                        >
                            <Text style={styles.navIcon}>📚</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Camera')}
                        >
                            <Text style={styles.navIcon}>📷</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Shop')}
                        >
                            <Text style={styles.navIcon}>🛒</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 40,
        marginBottom: 40,
    },
    titleContainer: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#4A90E2',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        lineHeight: 45,
        letterSpacing: 1,
    },
    coinContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    coinIcon: {
        fontSize: 16,
        marginRight: 5,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: 24,
        borderRadius: 20,
        marginBottom: 50,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    challengeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A90E2',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    challengeTitle: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    progressText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFA500',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    rewardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    collectButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.95)',
        paddingHorizontal: 45,
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    collectButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50,
        marginBottom: 30,
        marginTop: 50,
    },
    navButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        padding: 18,
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    navIcon: {
        fontSize: 28,
    },
});