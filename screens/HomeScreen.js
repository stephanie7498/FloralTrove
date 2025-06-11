import React from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppState } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
    const { coins, collection, challenges } = useAppState();

    const activeChallenges = challenges.filter(c => !c.completed).slice(0, 2);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/backgrounds/background_openingsscherm.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/TextAndSymbols/FloralTroveText.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.challengesSection}>
                        <View style={styles.challengesHeader}>
                            <Text style={styles.challengesIcon}>🎯</Text>
                            <Text style={styles.challengesTitle}>Your Challenges</Text>
                        </View>

                        {activeChallenges.map((challenge) => {
                            const progressPercentage = Math.min((challenge.progress / challenge.target) * 100, 100);

                            return (
                                <View key={challenge.id} style={styles.challengeCard}>
                                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                                    <Text style={styles.challengeProgress}>
                                        {challenge.progress}/{challenge.target}
                                    </Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: `${progressPercentage}%` }
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}

                        <TouchableOpacity
                            style={styles.viewAllButton}
                            onPress={() => navigation.navigate('Challenges')}
                        >
                            <Text style={styles.viewAllText}>View All Challenges</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.collectButton}
                            onPress={() => navigation.navigate('Camera')}
                        >
                            <Text style={styles.collectButtonText}>Collect now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.collectionButton}
                            onPress={() => navigation.navigate('Collection')}
                        >
                            <Text style={styles.collectionButtonText}>My Collection</Text>
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
        backgroundColor: '#4a7c4a',
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
        marginTop: 40,
    },
    logo: {
        width: 300,
        height: 120,
    },
    challengesSection: {
        flex: 1,
        marginBottom: 40,
    },
    challengesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center',
    },
    challengesIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    challengesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    challengeCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    challengeProgress: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
        opacity: 0.9,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    viewAllButton: {
        backgroundColor: 'rgba(74, 144, 226, 0.9)',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    viewAllText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionButtons: {
        gap: 15,
    },
    collectButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.95)',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    collectButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    collectionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(76, 175, 80, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    collectionButtonText: {
        color: '#2E7D32',
        fontSize: 20,
        fontWeight: 'bold',
    },
});