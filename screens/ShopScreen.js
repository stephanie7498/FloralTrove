import React from 'react';
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ShopScreen({ navigation }) {
    const { coins, unlockedPots, buyPot, getPotData } = useAppContext();
    const pots = getPotData();

    const handleBuyPot = (pot) => {
        if (unlockedPots.includes(pot.id)) {
            Alert.alert("Already Owned", "You already own this pot!");
            return;
        }

        if (coins < pot.price) {
            Alert.alert(
                "Not Enough Coins",
                `You need ${pot.price} coins to buy this pot. You have ${coins} coins.`
            );
            return;
        }

        Alert.alert(
            "Buy Pot",
            `Buy ${pot.name} for ${pot.price} coins?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Buy",
                    onPress: () => {
                        const success = buyPot(pot.id);
                        if (success) {
                            Alert.alert(
                                "Purchase Successful!",
                                `You bought ${pot.name}! Now you can use it for your plants.`
                            );
                        }
                    }
                }
            ]
        );
    };

    const renderPotItem = (pot, index) => {
        const isOwned = unlockedPots.includes(pot.id);
        const canAfford = coins >= pot.price;

        return (
            <View key={pot.id} style={styles.potItem}>
                <View style={styles.potDisplay}>
                    <View style={[styles.potImageContainer, { backgroundColor: getPotColor(pot.id) }]}>
                        <Text style={styles.potEmoji}>🪴</Text>
                    </View>
                </View>

                <View style={styles.potInfo}>
                    <Text style={styles.potName}>{pot.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.coinIcon}>🪙</Text>
                        <Text style={styles.potPrice}>{pot.price}</Text>
                    </View>
                </View>

                {isOwned ? (
                    <View style={styles.ownedBadge}>
                        <Text style={styles.ownedText}>✓</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.buyButton,
                            !canAfford && styles.buyButtonDisabled
                        ]}
                        onPress={() => handleBuyPot(pot)}
                        disabled={!canAfford}
                    >
                        <Text style={[
                            styles.buyButtonText,
                            !canAfford && styles.buyButtonTextDisabled
                        ]}>
                            Buy
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const getPotColor = (potId) => {
        const colors = {
            basic: '#D2691E',
            decorative: '#CD853F',
            ceramic: '#F5DEB3',
            terracotta: '#D2691E',
            premium: '#DAA520',
            deluxe: '#B8860B'
        };
        return colors[potId] || '#E0E0E0';
    };

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
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Buy new pots!</Text>
                        <TouchableOpacity
                            style={styles.coinContainer}
                            onPress={() => navigation.navigate('Challenges')}
                        >
                            <Text style={styles.coinIcon}>🪙</Text>
                            <Text style={styles.coinText}>{coins}</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <View style={styles.potsGrid}>
                                {pots.map((pot, index) => renderPotItem(pot, index))}
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.bottomActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.actionButtonText}>Back</Text>
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 25,
    },
    potsGrid: {
        gap: 20,
    },
    potItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: 25,
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
    potDisplay: {
        marginRight: 20,
    },
    potImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#8B4513',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    potEmoji: {
        fontSize: 32,
    },
    potInfo: {
        flex: 1,
    },
    potName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    potPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFA500',
    },
    buyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 20,
        minWidth: 80,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyButtonTextDisabled: {
        color: '#999',
    },
    ownedBadge: {
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    ownedText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 25,
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
        paddingHorizontal: 45,
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
});