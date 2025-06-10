import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppActions, useAppSelectors, useAppState } from '../context/AppContext';

export default function ShopScreen({ navigation }) {
    const [selectedPot, setSelectedPot] = useState(null);
    const [showPotModal, setShowPotModal] = useState(false);

    // Optimized context usage
    const { coins, unlockedPots } = useAppState();
    const { buyPot, getPotData } = useAppActions();
    const { canAffordPot } = useAppSelectors();

    // Direct image mapping for pots
    const getPotImageDirect = (potId) => {
        const imageMap = {
            basic: require('../assets/images/pots/basic_pot.png'),
            round: require('../assets/images/pots/round_pot.png'),
        };

        return imageMap[potId] || imageMap['basic']; // fallback to basic pot
    };

    // Memoize pot data to prevent unnecessary recalculations
    const pots = useMemo(() => getPotData(), [getPotData]);

    // Separate available and owned pots
    const { availablePotsList, ownedPotsList } = useMemo(() => {
        const available = pots.filter(pot => !unlockedPots.includes(pot.id));
        const owned = pots.filter(pot => unlockedPots.includes(pot.id));
        return {
            availablePotsList: available,
            ownedPotsList: owned
        };
    }, [pots, unlockedPots]);

    // Calculate shop statistics
    const shopStats = useMemo(() => {
        const totalPots = pots.length;
        const ownedCount = unlockedPots.length;
        const availableCount = totalPots - ownedCount;
        const completionPercentage = Math.round((ownedCount / totalPots) * 100);

        return { totalPots, ownedCount, availableCount, completionPercentage };
    }, [pots, unlockedPots]);

    // Navigation callbacks
    const navigateBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const navigateToChallenges = useCallback(() => {
        navigation.navigate('Challenges');
    }, [navigation]);

    // Handle pot purchase with improved UX
    const handleBuyPot = useCallback(async (pot) => {
        if (unlockedPots.includes(pot.id)) {
            Alert.alert("Already Owned", "You already own this pot!");
            return;
        }

        if (!canAffordPot(pot.id)) {
            Alert.alert(
                "Not Enough Coins 💰",
                `You need ${pot.price} coins to buy this pot.\nYou currently have ${coins} coins.\n\nTip: Complete challenges to earn more coins!`,
                [
                    { text: "OK", style: "default" },
                    {
                        text: "View Challenges",
                        style: "default",
                        onPress: navigateToChallenges
                    }
                ]
            );
            return;
        }

        Alert.alert(
            "Confirm Purchase 🛒",
            `Buy ${pot.name} for ${pot.price} coins?\n\n${pot.description}`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: `Buy for ${pot.price} 🪙`,
                    style: "default",
                    onPress: () => {
                        const success = buyPot(pot.id);
                        if (success) {
                            Alert.alert(
                                "Purchase Successful! 🎉",
                                `You bought ${pot.name}!\n\nThis pot will now be available for your plants.`,
                                [{ text: "Awesome!", style: "default" }]
                            );
                        } else {
                            Alert.alert(
                                "Purchase Failed",
                                "Something went wrong. Please try again.",
                                [{ text: "OK", style: "default" }]
                            );
                        }
                    }
                }
            ]
        );
    }, [unlockedPots, canAffordPot, coins, buyPot, navigateToChallenges]);

    // Show pot details modal
    const showPotDetails = useCallback((pot) => {
        setSelectedPot(pot);
        setShowPotModal(true);
    }, []);

    const closePotModal = useCallback(() => {
        setShowPotModal(false);
        setSelectedPot(null);
    }, []);

    // Get pot rarity indicator
    const getPotRarity = useCallback((price) => {
        if (price === 0) return { rarity: 'Free', color: '#4CAF50', icon: '🎁' };
        if (price <= 500) return { rarity: 'Common', color: '#2196F3', icon: '⭐' };
        if (price <= 1000) return { rarity: 'Rare', color: '#FF9800', icon: '✨' };
        return { rarity: 'Legendary', color: '#9C27B0', icon: '💎' };
    }, []);

    const renderPotItem = useCallback((pot) => {
        const isOwned = unlockedPots.includes(pot.id);
        const canAfford = canAffordPot(pot.id);
        const rarity = getPotRarity(pot.price);

        return (
            <TouchableOpacity
                key={pot.id}
                style={[
                    styles.potItem,
                    isOwned && styles.potItemOwned
                ]}
                onPress={() => showPotDetails(pot)}
                accessibilityLabel={`${pot.name}, ${pot.price} coins${isOwned ? ', owned' : ''}`}
            >
                <View style={styles.potDisplay}>
                    <Image
                        source={getPotImageDirect(pot.id)}
                        style={[
                            styles.potImage,
                            isOwned && styles.potImageOwned
                        ]}
                        resizeMode="contain"
                    />
                    {isOwned && (
                        <View style={styles.ownedOverlay}>
                            <Text style={styles.ownedIcon}>✓</Text>
                        </View>
                    )}
                </View>

                <View style={styles.potInfo}>
                    <View style={styles.potHeader}>
                        <Text style={[styles.potName, isOwned && styles.potNameOwned]}>
                            {pot.name}
                        </Text>
                        <View style={[styles.rarityBadge, { backgroundColor: rarity.color }]}>
                            <Text style={styles.rarityIcon}>{rarity.icon}</Text>
                            <Text style={styles.rarityText}>{rarity.rarity}</Text>
                        </View>
                    </View>

                    <Text style={styles.potDescription} numberOfLines={2}>
                        {pot.description}
                    </Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.coinIcon}>🪙</Text>
                        <Text style={[styles.potPrice, isOwned && styles.potPriceOwned]}>
                            {pot.price === 0 ? 'Free' : pot.price}
                        </Text>
                    </View>
                </View>

                {isOwned ? (
                    <View style={styles.ownedBadge}>
                        <Text style={styles.ownedText}>✓</Text>
                        <Text style={styles.ownedLabel}>Owned</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.buyButton,
                            !canAfford && styles.buyButtonDisabled
                        ]}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleBuyPot(pot);
                        }}
                        disabled={!canAfford}
                        accessibilityLabel={canAfford ? `Buy ${pot.name}` : `Cannot afford ${pot.name}`}
                    >
                        <Text style={[
                            styles.buyButtonText,
                            !canAfford && styles.buyButtonTextDisabled
                        ]}>
                            {canAfford ? 'Buy' : 'Need More'}
                        </Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    }, [unlockedPots, canAffordPot, getPotImageDirect, getPotRarity, showPotDetails, handleBuyPot]);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/backgrounds/background_shop.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={navigateBack}
                            accessibilityLabel="Go back"
                        >
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Pot Shop 🪴</Text>
                        <TouchableOpacity
                            style={styles.coinContainer}
                            onPress={navigateToChallenges}
                            accessibilityLabel={`${coins} coins, tap for challenges`}
                        >
                            <Text style={styles.coinIcon}>🪙</Text>
                            <Text style={styles.coinText}>{coins}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Shop Statistics */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{shopStats.ownedCount}</Text>
                            <Text style={styles.statLabel}>Owned</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{shopStats.availableCount}</Text>
                            <Text style={styles.statLabel}>Available</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{shopStats.completionPercentage}%</Text>
                            <Text style={styles.statLabel}>Complete</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            {/* Available Pots Section */}
                            {availablePotsList.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>🛒 Available Pots</Text>
                                    <View style={styles.potsGrid}>
                                        {availablePotsList.map(pot => renderPotItem(pot))}
                                    </View>
                                </View>
                            )}

                            {/* Owned Pots Section */}
                            {ownedPotsList.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>✅ Your Collection</Text>
                                    <View style={styles.potsGrid}>
                                        {ownedPotsList.map(pot => renderPotItem(pot))}
                                    </View>
                                </View>
                            )}

                            {/* Shop Complete Message */}
                            {availablePotsList.length === 0 && (
                                <View style={styles.completionContainer}>
                                    <Text style={styles.completionTitle}>🎉 Collection Complete!</Text>
                                    <Text style={styles.completionText}>
                                        Congratulations! You own all available pots.
                                        Keep collecting flowers to fill them all!
                                    </Text>
                                </View>
                            )}

                            {/* Tips Section */}
                            <View style={styles.tipContainer}>
                                <Text style={styles.tipTitle}>💡 Shopping Tips</Text>
                                <Text style={styles.tipText}>
                                    • Complete challenges to earn more coins{'\n'}
                                    • Different pots have different rarities{'\n'}
                                    • Collect flowers to fill your new pots{'\n'}
                                    • Each pot type changes how your flowers look{'\n'}
                                    • Free pots are perfect for starting your collection!
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.bottomActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={navigateBack}
                            accessibilityLabel="Back to previous screen"
                        >
                            <Text style={styles.actionButtonText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            {/* Pot Details Modal */}
            <Modal
                visible={showPotModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closePotModal}
                accessibilityViewIsModal={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedPot && (
                            <>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={closePotModal}
                                        accessibilityLabel="Close details"
                                    >
                                        <Text style={styles.closeButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalPotDisplay}>
                                    <Image
                                        source={getPotImageDirect(selectedPot.id)}
                                        style={styles.modalPotImage}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Text style={styles.modalPotName}>{selectedPot.name}</Text>
                                <Text style={styles.modalPotDescription}>{selectedPot.description}</Text>

                                <View style={styles.modalPotStats}>
                                    <View style={styles.modalStat}>
                                        <Text style={styles.modalStatLabel}>Price</Text>
                                        <Text style={styles.modalStatValue}>
                                            🪙 {selectedPot.price === 0 ? 'Free' : selectedPot.price}
                                        </Text>
                                    </View>
                                    <View style={styles.modalStat}>
                                        <Text style={styles.modalStatLabel}>Rarity</Text>
                                        <Text style={styles.modalStatValue}>
                                            {getPotRarity(selectedPot.price).rarity}
                                        </Text>
                                    </View>
                                </View>

                                {!unlockedPots.includes(selectedPot.id) && (
                                    <TouchableOpacity
                                        style={[
                                            styles.modalBuyButton,
                                            !canAffordPot(selectedPot.id) && styles.modalBuyButtonDisabled
                                        ]}
                                        onPress={() => {
                                            closePotModal();
                                            handleBuyPot(selectedPot);
                                        }}
                                        disabled={!canAffordPot(selectedPot.id)}
                                    >
                                        <Text style={styles.modalBuyButtonText}>
                                            {canAffordPot(selectedPot.id) ?
                                                `Buy for ${selectedPot.price} 🪙` :
                                                'Not Enough Coins'
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {unlockedPots.includes(selectedPot.id) && (
                                    <View style={styles.modalOwnedBadge}>
                                        <Text style={styles.modalOwnedText}>✓ You own this pot!</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
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
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 20,
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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
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
    potsGrid: {
        gap: 15,
    },
    potItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    potItemOwned: {
        backgroundColor: 'rgba(232, 245, 233, 0.98)',
        borderColor: '#4CAF50',
    },
    potDisplay: {
        marginRight: 15,
        position: 'relative',
    },
    potImage: {
        width: 60,
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    potImageOwned: {
        opacity: 0.8,
    },
    ownedOverlay: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#4CAF50',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    ownedIcon: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    potInfo: {
        flex: 1,
    },
    potHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    potName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        flex: 1,
        marginRight: 10,
    },
    potNameOwned: {
        color: '#2E7D32',
    },
    rarityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    rarityIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    rarityText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    potDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 18,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    potPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFA500',
    },
    potPriceOwned: {
        color: '#4CAF50',
    },
    buyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        minWidth: 70,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buyButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buyButtonTextDisabled: {
        color: '#999',
    },
    ownedBadge: {
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    ownedText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ownedLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    completionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    completionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 10,
        textAlign: 'center',
    },
    completionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    tipContainer: {
        backgroundColor: 'rgba(227, 242, 253, 0.95)',
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
        lineHeight: 20,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButton: {
        backgroundColor: '#757575',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 25,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    modalHeader: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#f0f0f0',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    modalPotDisplay: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalPotImage: {
        width: 100,
        height: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalPotName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        textAlign: 'center',
        marginBottom: 15,
    },
    modalPotDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    modalPotStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
    },
    modalStat: {
        alignItems: 'center',
    },
    modalStatLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    modalStatValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    modalBuyButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    modalBuyButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    modalBuyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOwnedBadge: {
        backgroundColor: '#E8F5E8',
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    modalOwnedText: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: 'bold',
    },
});