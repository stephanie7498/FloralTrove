import React from 'react';
import {
    Image,
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
    const { challenges } = useAppContext();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('../assets/images/backgrounds/background_openingsscherm.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.header}>
                    <Image
                        source={require('../assets/images/TextAndSymbols/FloralTroveText.png')}
                        style={styles.titleImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.content}>
                    {/* Challenges section moved above buttons */}
                    <View style={styles.challengesSection}>
                        <Text style={styles.challengesSectionTitle}>🎯 Your Challenges</Text>
                        {challenges.map((challenge, index) => (
                            <View key={challenge.id} style={styles.challengeItem}>
                                <View style={styles.challengeInfo}>
                                    <Text style={styles.challengeItemTitle}>{challenge.title}</Text>
                                    <Text style={styles.challengeProgress}>
                                        {challenge.progress}/{challenge.target}
                                    </Text>
                                </View>
                                {challenge.completed && (
                                    <View style={styles.completedBadge}>
                                        <Text style={styles.completedText}>✓</Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.viewAllChallengesButton}
                            onPress={() => navigation.navigate('Challenges')}
                        >
                            <Text style={styles.viewAllChallengesText}>View All Challenges</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
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
        overflow: 'hidden',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    titleImage: {
        width: 650,
        height: 260,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonContainer: {
        gap: 10,
        marginTop: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    collectButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        minWidth: 220,
    },
    collectButtonText: {
        color: '#2E7D32',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        numberOfLines: 1,
        flexShrink: 0,
    },
    collectionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        minWidth: 220,
    },
    collectionButtonText: {
        color: '#2E7D32',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        numberOfLines: 1,
        flexShrink: 0,
    },
    challengesSection: {
        padding: 20,
        marginBottom: 15,
        marginHorizontal: 5,
    },
    challengesSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    challengeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
    },
    challengeInfo: {
        flex: 1,
    },
    challengeItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    challengeProgress: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    completedBadge: {
        backgroundColor: '#4CAF50',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewAllChallengesButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
        alignItems: 'center',
    },
    viewAllChallengesText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});