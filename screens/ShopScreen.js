import React from 'react';
import {
    Alert,
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
                    <View style={styles.potImage}>
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Buy new pots!</Text>
                <View style={styles.coinContainer}>
                    <Text style={styles.coinIcon}>🪙</Text>
                    <Text style={styles.coinText}>{coins}</Text>
                </View>
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
                    onPress={() => navigation.navigate('Collection')}
                >
                    <Text style={styles.actionButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f5f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    coinContainer: {
        backgroundColor: '#f39c12',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    coinIcon: {
        fontSize: 14,
    },
    coinText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    potsGrid: {
        gap: 15,
    },
    potItem: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    potDisplay: {
        marginRight: 15,
    },
    potImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    potEmoji: {
        fontSize: 30,
    },
    potInfo: {
        flex: 1,
    },
    potName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    potPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f39c12',
    },
    buyButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        minWidth: 60,
        alignItems: 'center',
    },
    buyButtonDisabled: {
        backgroundColor: '#ccc',
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
        backgroundColor: '#27ae60',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ownedText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    actionButton: {
        backgroundColor: '#888',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 20,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});