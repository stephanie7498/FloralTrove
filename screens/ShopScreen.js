import React from 'react';
import {
    Alert,
    Image,
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

    const renderPot = (pot) => {
        const isOwned = unlockedPots.includes(pot.id);
        const canAfford = coins >= pot.price;

        return (
            <View key={pot.id} style={styles.potCard}>
                <Image source={pot.image} style={styles.potImage} />
                <Text style={styles.potName}>{pot.name}</Text>

                {pot.price === 0 ? (
                    <Text style={styles.freeText}>Free</Text>
                ) : (
                    <Text style={styles.potPrice}>🪙 {pot.price}</Text>
                )}

                {isOwned ? (
                    <View style={styles.ownedButton}>
                        <Text style={styles.ownedButtonText}>✓ Owned</Text>
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
                            {canAfford ? 'Buy' : 'Not enough coins'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Buy New Pots</Text>
                <View style={styles.coinContainer}>
                    <Text style={styles.coinText}>🪙 {coins}</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.subtitle}>
                        Choose different pots for your flower collection
                    </Text>

                    <View style={styles.potsGrid}>
                        {pots.map(pot => renderPot(pot))}
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 How it works</Text>
                        <Text style={styles.infoText}>
                            • Buy pots to display your flowers in different styles{'\n'}
                            • Each pot gives your flowers a unique look{'\n'}
                            • Earn coins by discovering new flowers{'\n'}
                            • Complete challenges for bonus coins
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Collection')}
                >
                    <Text style={styles.actionButtonText}>🌸 Collection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.actionButtonText}>📷 Collect More</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a7c4a',
    },
    coinContainer: {
        backgroundColor: '#f39c12',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
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
        padding: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    potsGrid: {
        gap: 20,
        marginBottom: 30,
    },
    potCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    potImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    potName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 10,
    },
    potPrice: {
        fontSize: 16,
        color: '#f39c12',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    freeText: {
        fontSize: 16,
        color: '#27ae60',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    buyButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        minWidth: 120,
    },
    buyButtonDisabled: {
        backgroundColor: '#ccc',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buyButtonTextDisabled: {
        color: '#999',
    },
    ownedButton: {
        backgroundColor: '#27ae60',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        minWidth: 120,
    },
    ownedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoBox: {
        backgroundColor: '#e8f5e8',
        padding: 20,
        borderRadius: 15,
        borderLeft: 5,
        borderLeftColor: '#4a7c4a',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        flex: 0.4,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});