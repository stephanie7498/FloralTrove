// =============================================================================
// screens/ChallengesScreen.js - Uitdagingen overzicht
// =============================================================================
// Dit scherm toont alle uitdagingen met voortgang, beloningen en een gids
// voor het verzamelen van verschillende bloemen types.

import React, { useCallback, useMemo } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppSelectors, useAppState } from '../context/AppContext';

export default function ChallengesScreen({ navigation }) {
    // Context data
    const { coins, challenges } = useAppState();
    const { activeChallenges, completedChallenges: completedCount } = useAppSelectors();

    // =============================================================================
    // DERIVED DATA
    // =============================================================================

    /**
     * Bereken uitdaging statistieken
     */
    const challengeStats = useMemo(() => {
        const total = challenges.length;
        const completed = challenges.filter(c => c.completed).length;
        const totalReward = challenges
            .filter(c => c.completed)
            .reduce((sum, c) => sum + c.reward, 0);

        return { total, completed, totalReward };
    }, [challenges]);

    // =============================================================================
    // NAVIGATION HELPERS
    // =============================================================================

    const navigateBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const navigateToShop = useCallback(() => {
        navigation.navigate('Shop');
    }, [navigation]);

    const navigateToCamera = useCallback(() => {
        navigation.navigate('Camera');
    }, [navigation]);

    // =============================================================================
    // RENDER HELPERS
    // =============================================================================

    /**
     * Render individuele uitdaging card
     */
    const renderChallenge = useCallback((challenge) => {
        const progressPercentage = Math.min((challenge.progress / challenge.target) * 100, 100);
        const isCompleted = challenge.completed;

        return (
            <View key={challenge.id} style={styles.challengeCard}>
                {/* Challenge header met label en completed badge */}
                <View style={styles.challengeHeader}>
                    <Text style={styles.challengeLabel}>Challenge #{challenge.id}</Text>
                    {isCompleted && (
                        <View style={styles.completedBadge}>
                            <Text style={styles.completedText}>✓</Text>
                        </View>
                    )}
                </View>

                {/* Challenge titel */}
                <Text style={styles.challengeTitle}>{challenge.title}</Text>

                {/* Voortgangsbalk */}
                <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progressPercentage}%` },
                                isCompleted && styles.progressCompleted
                            ]}
                        />
                    </View>
                    <Text style={[
                        styles.progressText,
                        isCompleted && styles.progressTextCompleted
                    ]}>
                        {challenge.progress}/{challenge.target}
                        {isCompleted && ' ✨'}
                    </Text>
                </View>

                {/* Beloning sectie */}
                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>Reward:</Text>
                    <View style={[styles.rewardValue, isCompleted && styles.rewardValueClaimed]}>
                        <Text style={styles.coinIcon}>🪙</Text>
                        <Text style={[styles.rewardText, isCompleted && styles.rewardTextClaimed]}>
                            {challenge.reward}
                        </Text>
                        {isCompleted && <Text style={styles.claimedText}> Claimed!</Text>}
                    </View>
                </View>

                {/* Status bericht */}
                {isCompleted && (
                    <View style={styles.completedMessage}>
                        <Text style={styles.completedMessageText}>Challenge Completed! 🎉</Text>
                    </View>
                )}

                {!isCompleted && (
                    <View style={styles.progressHint}>
                        <Text style={styles.progressHintText}>
                            {challenge.target - challenge.progress} more flower{challenge.target - challenge.progress === 1 ? '' : 's'} to go!
                        </Text>
                    </View>
                )}
            </View>
        );
    }, []);

    // =============================================================================
    // RENDER
    // =============================================================================

    return (
        <SafeAreaView style={styles.container}>
            {/* Header met navigatie en coins */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={navigateBack}
                    accessibilityLabel="Go back"
                >
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Challenges</Text>
                <TouchableOpacity
                    style={styles.coinContainer}
                    onPress={navigateToShop}
                    accessibilityLabel={`${coins} coins, tap to visit shop`}
                >
                    <Text style={styles.coinIcon}>🪙</Text>
                    <Text style={styles.coinText}>{coins}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.subtitle}>Complete challenges to earn coins!</Text>

                    {/* Statistieken overzicht */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{challengeStats.completed}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{challengeStats.total - challengeStats.completed}</Text>
                            <Text style={styles.statLabel}>Remaining</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{challengeStats.totalReward}</Text>
                            <Text style={styles.statLabel}>🪙 Earned</Text>
                        </View>
                    </View>

                    {/* Actieve uitdagingen sectie */}
                    {activeChallenges.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>🎯 Active Challenges</Text>
                            <View style={styles.challengesList}>
                                {activeChallenges.map(challenge => renderChallenge(challenge))}
                            </View>
                        </View>
                    )}

                    {/* Voltooide uitdagingen sectie */}
                    {completedCount > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>✅ Completed Challenges</Text>
                            <View style={styles.challengesList}>
                                {challenges.filter(c => c.completed).map(challenge => renderChallenge(challenge))}
                            </View>
                        </View>
                    )}

                    {/* Bloemen verzamel gids */}
                    <View style={styles.guideContainer}>
                        <Text style={styles.guideTitle}>🌸 Flower Collection Guide</Text>
                        <Text style={styles.guideSubtitle}>We can identify these 4 flower types:</Text>
                        <View style={styles.flowerGuide}>
                            <View style={styles.flowerItem}>
                                <Text style={styles.flowerEmoji}>🌾</Text>
                                <View style={styles.flowerInfo}>
                                    <Text style={styles.flowerName}>Cornflower</Text>
                                    <Text style={styles.flowerDesc}>Blue wildflower - 40 coins (animated!)</Text>
                                </View>
                            </View>
                            <View style={styles.flowerItem}>
                                <Text style={styles.flowerEmoji}>🌼</Text>
                                <View style={styles.flowerInfo}>
                                    <Text style={styles.flowerName}>Daisy</Text>
                                    <Text style={styles.flowerDesc}>White petals, yellow center - 50 coins</Text>
                                </View>
                            </View>
                            <View style={styles.flowerItem}>
                                <Text style={styles.flowerEmoji}>🌺</Text>
                                <View style={styles.flowerInfo}>
                                    <Text style={styles.flowerName}>Poppy</Text>
                                    <Text style={styles.flowerDesc}>Vibrant red bloom - 75 coins (animated!)</Text>
                                </View>
                            </View>
                            <View style={styles.flowerItem}>
                                <Text style={styles.flowerEmoji}>🌻</Text>
                                <View style={styles.flowerInfo}>
                                    <Text style={styles.flowerName}>Yellow Daisy</Text>
                                    <Text style={styles.flowerDesc}>Bright yellow flowers - 55 coins</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Tips voor gebruikers */}
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipTitle}>💡 Pro Tips</Text>
                        <Text style={styles.tipText}>
                            • Find flowers in your garden or local park{'\n'}
                            • High success rate when scanning the 4 supported flowers{'\n'}
                            • Each flower can only be collected once{'\n'}
                            • Cornflowers and Poppies have special animations!{'\n'}
                            • Poppies are worth the most coins (75){'\n'}
                            • Yellow Daisies are common and worth good coins (55){'\n'}
                            • Use your coins to buy beautiful new pots{'\n'}
                            • Complete challenges for bonus coin rewards!{'\n'}
                            • Take photos in good lighting for better recognition{'\n'}
                            • Collect all 4 flower types to complete your collection
                        </Text>
                    </View>

                    {/* Motivatie bericht als alle uitdagingen voltooid */}
                    {activeChallenges.length === 0 && completedCount === challenges.length && (
                        <View style={styles.motivationContainer}>
                            <Text style={styles.motivationTitle}>🏆 All Challenges Complete!</Text>
                            <Text style={styles.motivationText}>
                                Amazing work! You've completed all available challenges.
                                Keep collecting flowers to grow your beautiful collection!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom action button */}
            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={navigateToCamera}
                    accessibilityLabel="Start collecting flowers"
                >
                    <Text style={styles.actionButtonIcon}>📷</Text>
                    <Text style={styles.actionButtonText}>Start Collecting</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F3F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        letterSpacing: 0.5,
    },
    coinContainer: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
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
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 25,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minWidth: 80,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 15,
    },
    challengesList: {
        gap: 20,
    },
    challengeCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    challengeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90E2',
        textTransform: 'uppercase',
        letterSpacing: 1,
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
    challengeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        lineHeight: 24,
    },
    progressSection: {
        marginBottom: 20,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 6,
    },
    progressCompleted: {
        backgroundColor: '#4CAF50',
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A90E2',
        textAlign: 'center',
    },
    progressTextCompleted: {
        color: '#4CAF50',
    },
    progressHint: {
        backgroundColor: '#E3F2FD',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    progressHintText: {
        fontSize: 14,
        color: '#1976D2',
        textAlign: 'center',
        fontWeight: '500',
    },
    rewardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    rewardValue: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFA500',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    rewardValueClaimed: {
        backgroundColor: '#4CAF50',
    },
    rewardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    rewardTextClaimed: {
        color: '#fff',
    },
    claimedText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    completedMessage: {
        marginTop: 15,
        backgroundColor: '#E8F5E8',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    completedMessageText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        textAlign: 'center',
    },
    guideContainer: {
        backgroundColor: '#FFF3E0',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    guideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 10,
    },
    guideSubtitle: {
        fontSize: 14,
        color: '#E65100',
        marginBottom: 15,
        fontWeight: '500',
    },
    flowerGuide: {
        gap: 12,
    },
    flowerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 12,
        borderRadius: 10,
    },
    flowerEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    flowerInfo: {
        flex: 1,
    },
    flowerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 2,
    },
    flowerDesc: {
        fontSize: 14,
        color: '#BF360C',
    },
    tipContainer: {
        backgroundColor: '#E3F2FD',
        padding: 20,
        borderRadius: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
        marginBottom: 20,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 10,
    },
    tipText: {
        fontSize: 14,
        color: '#1976D2',
        lineHeight: 22,
    },
    motivationContainer: {
        backgroundColor: '#FFF3E0',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF9800',
    },
    motivationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 10,
        textAlign: 'center',
    },
    motivationText: {
        fontSize: 16,
        color: '#E65100',
        textAlign: 'center',
        lineHeight: 22,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    actionButtonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});