import React, { useCallback, useMemo } from 'react';
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
import { useAppSelectors, useAppState } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
    // Optimized context usage - only get what we need
    const { challenges } = useAppState();
    const { activeChallenges, completedChallenges: completedCount } = useAppSelectors();

    // Memoized challenge summary
    const challengeSummary = useMemo(() => {
        const active = activeChallenges.slice(0, 3); // Show max 3 challenges
        const totalProgress = challenges.reduce((sum, challenge) =>
            sum + (challenge.progress / challenge.target), 0
        );
        const averageProgress = challenges.length > 0 ?
            Math.round((totalProgress / challenges.length) * 100) : 0;

        return { active, averageProgress };
    }, [challenges, activeChallenges]);

    // Memoized navigation functions
    const navigateToCamera = useCallback(() => {
        navigation.navigate('Camera');
    }, [navigation]);

    const navigateToCollection = useCallback(() => {
        navigation.navigate('Collection');
    }, [navigation]);

    const navigateToChallenges = useCallback(() => {
        navigation.navigate('Challenges');
    }, [navigation]);

    const renderChallengeItem = useCallback((challenge) => {
        const progressPercentage = Math.min((challenge.progress / challenge.target) * 100, 100);

        return (
            <View key={challenge.id} style={styles.challengeItem}>
                <View style={styles.challengeInfo}>
                    <Text style={styles.challengeItemTitle} numberOfLines={1}>
                        {challenge.title}
                    </Text>
                    <View style={styles.progressContainer}>
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
                </View>
                {challenge.completed && (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓</Text>
                    </View>
                )}
            </View>
        );
    }, []);

    const getWelcomeMessage = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning! 🌅";
        if (hour < 17) return "Good afternoon! ☀️";
        return "Good evening! 🌙";
    }, []);

    const getMotivationalMessage = useMemo(() => {
        if (completedCount === challenges.length && challenges.length > 0) {
            return "Amazing! All challenges completed! 🏆";
        }
        if (completedCount > 0) {
            return `Great progress! ${completedCount} challenge${completedCount === 1 ? '' : 's'} completed! 🎉`;
        }
        return "Ready to start your flower collection journey? 🌸";
    }, [completedCount, challenges.length]);

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
                    {/* Welcome Section */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeMessage}>{getWelcomeMessage}</Text>
                        <Text style={styles.motivationalMessage}>{getMotivationalMessage}</Text>
                    </View>

                    {/* Quick Stats */}
                    {challenges.length > 0 && (
                        <View style={styles.statsSection}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{completedCount}</Text>
                                <Text style={styles.statLabel}>Completed</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{activeChallenges.length}</Text>
                                <Text style={styles.statLabel}>Active</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{challengeSummary.averageProgress}%</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                        </View>
                    )}

                    {/* Challenges Preview */}
                    {challengeSummary.active.length > 0 && (
                        <View style={styles.challengesSection}>
                            <View style={styles.challengesSectionHeader}>
                                <Text style={styles.challengesSectionTitle}>🎯 Your Challenges</Text>
                                <TouchableOpacity
                                    style={styles.viewAllButton}
                                    onPress={navigateToChallenges}
                                    accessibilityLabel="View all challenges"
                                >
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.challengesList}>
                                {challengeSummary.active.map(challenge => renderChallengeItem(challenge))}
                            </View>
                        </View>
                    )}

                    {/* Empty State for Challenges */}
                    {challenges.length === 0 && (
                        <View style={styles.emptyChallengesSection}>
                            <Text style={styles.emptyChallengesTitle}>🎯 Ready for Challenges?</Text>
                            <Text style={styles.emptyChallengesText}>
                                Complete exciting challenges to earn coins and grow your collection!
                            </Text>
                            <TouchableOpacity
                                style={styles.viewChallengesButton}
                                onPress={navigateToChallenges}
                            >
                                <Text style={styles.viewChallengesButtonText}>View Challenges</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Main Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.collectButton}
                            onPress={navigateToCamera}
                            accessibilityLabel="Start collecting flowers"
                        >
                            <Text style={styles.collectButtonIcon}>📷</Text>
                            <Text style={styles.collectButtonText}>Collect now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.collectionButton}
                            onPress={navigateToCollection}
                            accessibilityLabel="View my collection"
                        >
                            <Text style={styles.collectionButtonIcon}>🌸</Text>
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
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    titleImage: {
        width: 650,
        height: 260,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    welcomeMessage: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    motivationalMessage: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 15,
        borderRadius: 15,
        backdropFilter: 'blur(10px)',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    challengesSection: {
        padding: 20,
        marginBottom: 15,
        marginHorizontal: 5,
    },
    challengesSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    challengesSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    viewAllButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    viewAllText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    challengesList: {
        gap: 12,
    },
    challengeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    challengeInfo: {
        flex: 1,
        marginRight: 10,
    },
    challengeItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    challengeProgress: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        minWidth: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 3,
    },
    completedBadge: {
        backgroundColor: '#4CAF50',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    completedText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyChallengesSection: {
        alignItems: 'center',
        padding: 30,
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        marginBottom: 20,
    },
    emptyChallengesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    emptyChallengesText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    viewChallengesButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    viewChallengesButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        gap: 15,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    collectButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
        minWidth: 250,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    collectButtonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    collectButtonText: {
        color: '#2E7D32',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    collectionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        minWidth: 250,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    collectionButtonIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    collectionButtonText: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});