import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ChallengesScreen({ navigation }) {
    const { coins, challenges } = useAppContext();

    const renderChallenge = (challenge) => {
        const progressPercentage = (challenge.progress / challenge.target) * 100;

        return (
            <View key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                    <Text style={styles.challengeLabel}>Challenge</Text>
                    {challenge.completed && (
                        <View style={styles.completedBadge}>
                            <Text style={styles.completedText}>✓</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.challengeTitle}>{challenge.title}</Text>

                <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progressPercentage}%` },
                                challenge.completed && styles.progressCompleted
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {challenge.progress}/{challenge.target}
                    </Text>
                </View>

                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>Reward:</Text>
                    <View style={styles.rewardValue}>
                        <Text style={styles.coinIcon}>🪙</Text>
                        <Text style={styles.rewardText}>{challenge.reward}</Text>
                    </View>
                </View>

                {challenge.completed && (
                    <View style={styles.completedMessage}>
                        <Text style={styles.completedMessageText}>Challenge Completed! 🎉</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Challenges</Text>
                <TouchableOpacity
                    style={styles.coinContainer}
                    onPress={() => navigation.navigate('Shop')}
                >
                    <Text style={styles.coinIcon}>🪙</Text>
                    <Text style={styles.coinText}>{coins}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.subtitle}>Complete challenges to earn coins!</Text>

                    <View style={styles.challengesList}>
                        {challenges.map(challenge => renderChallenge(challenge))}
                    </View>

                    <View style={styles.tipContainer}>
                        <Text style={styles.tipTitle}>💡 Tips</Text>
                        <Text style={styles.tipText}>
                            • Find flowers in your garden or local park{'\n'}
                            • Different flowers give different coin rewards{'\n'}
                            • Use your coins to buy beautiful new pots{'\n'}
                            • Complete challenges for bonus rewards!
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Camera')}
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
        marginBottom: 30,
        fontWeight: '500',
    },
    challengesList: {
        gap: 20,
        marginBottom: 30,
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
    rewardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
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
    tipContainer: {
        backgroundColor: '#E3F2FD',
        padding: 20,
        borderRadius: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
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