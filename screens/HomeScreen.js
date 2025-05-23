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
                source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80' }}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Flora{'\n'}Trove</Text>
                        <View style={styles.coinContainer}>
                            <Text style={styles.coinText}>🪙 {coins}</Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        {activeChallenge && (
                            <View style={styles.challengeCard}>
                                <Text style={styles.challengeTitle}>Challenge</Text>
                                <Text style={styles.challengeDescription}>{activeChallenge.title}</Text>
                                <View style={styles.progressContainer}>
                                    <Text style={styles.progressText}>
                                        {activeChallenge.progress}/{activeChallenge.target}
                                    </Text>
                                    <Text style={styles.rewardText}>🪙 {activeChallenge.reward}</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        lineHeight: 40,
    },
    coinContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 40,
        width: '90%',
        alignItems: 'center',
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 8,
    },
    challengeDescription: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    progressText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a7c4a',
    },
    rewardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f39c12',
    },
    collectButton: {
        backgroundColor: 'rgba(74, 124, 74, 0.9)',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    collectButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginBottom: 20,
    },
    navButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 24,
    },
});