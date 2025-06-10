import React from 'react';
import {
    Alert,
    Image,
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
    const {
        coins,
        unlockedPots,
        activePotType,
        buyPot,
        getPotData,
        getPotImage,
        setActivePot,
        changeAllPots
    } = useAppContext();

    const pots = getPotData();

    const handleBuyPot = (pot) => {
        // Debug info
        console.log('=== DEBUG INFO ===');
        console.log('Pot being purchased:', pot);
        console.log('User coins:', coins);
        console.log('Pot price:', pot.price);
        console.log('Unlocked pots:', unlockedPots);
        console.log('Is pot already owned?', unlockedPots.includes(pot.id));
        console.log('Can afford?', coins >= pot.price);

        if (unlockedPots.includes(pot.id)) {
            Alert.alert("Already Owned", "You already own this pot!");
            return;
        }

        if (coins < pot.price) {
            Alert.alert(
                "Not Enough Coins",
                `You need ${pot.price} coins but you only have ${coins} coins.`
            );
            return;
        }

        // Direct purchase for testing
        const success = buyPot(pot.id);
        console.log('Purchase success:', success);

        if (success) {
            Alert.alert("Success!", `You bought the ${pot.name}!`);
        } else {
            Alert.alert("Failed", "Purchase failed for unknown reason.");
        }
    };

    const handleUsePot = (potId) => {
        Alert.alert(
            "Use This Pot",
            "What would you like to do?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Use for New Plants",
                    onPress: () => {
                        setActivePot(potId);
                        Alert.alert("Success!", "New plants will now appear in this pot type.");
                    }
                },
                {
                    text: "Change All Plants",
                    onPress: () => {
                        changeAllPots(potId);
                        Alert.alert("Success!", "All your plants are now in this pot type!");
                    }
                }
            ]
        );
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
                        <View style={styles.coinContainer}>
                            <Text style={styles.coinIcon}>🪙</Text>
                            <Text style={styles.coinText}>{coins}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <Text style={styles.subtitle}>Debug Info:</Text>
                            <Text style={styles.debugText}>Coins: {coins}</Text>
                            <Text style={styles.debugText}>Unlocked: {unlockedPots.join(', ')}</Text>
                            <Text style={styles.debugText}>Active: {activePotType}</Text>

                            <View style={styles.potsGrid}>
                                {pots.map((pot) => {
                                    const isOwned = unlockedPots.includes(pot.id);
                                    const canAfford = coins >= pot.price;
                                    const isActive = activePotType === pot.id;

                                    return (
                                        <View key={pot.id} style={styles.potItem}>
                                            <Image
                                                source={getPotImage(pot.id)}
                                                style={styles.potImage}
                                                resizeMode="contain"
                                            />

                                            <View style={styles.potInfo}>
                                                <Text style={styles.potName}>{pot.name}</Text>
                                                <Text style={styles.potPrice}>
                                                    {pot.price === 0 ? 'FREE' : `${pot.price} coins`}
                                                </Text>
                                                <Text style={styles.debugText}>
                                                    Owned: {isOwned ? 'Yes' : 'No'}
                                                </Text>
                                                <Text style={styles.debugText}>
                                                    Can afford: {canAfford ? 'Yes' : 'No'}
                                                </Text>
                                                {isActive && <Text style={styles.activeText}>ACTIVE</Text>}
                                            </View>

                                            {isOwned ? (
                                                <TouchableOpacity
                                                    style={styles.useButton}
                                                    onPress={() => handleUsePot(pot.id)}
                                                >
                                                    <Text style={styles.buttonText}>Use</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.buyButton,
                                                        !canAfford && styles.disabledButton
                                                    ]}
                                                    onPress={() => handleBuyPot(pot)}
                                                    disabled={!canAfford}
                                                >
                                                    <Text style={styles.buttonText}>
                                                        {pot.price === 0 ? 'Get' : 'Buy'}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    backButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
    },
    backText: { fontSize: 20, fontWeight: 'bold' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
    coinContainer: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIcon: { fontSize: 16, marginRight: 5 },
    coinText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    scrollView: { flex: 1 },
    content: { padding: 20 },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    debugText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    potsGrid: { marginTop: 20 },
    potItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    potImage: { width: 60, height: 60, marginRight: 15 },
    potInfo: { flex: 1 },
    potName: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
    potPrice: { fontSize: 16, color: '#FFA500', fontWeight: 'bold' },
    activeText: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold' },
    buyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
    },
    useButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
    },
    disabledButton: { backgroundColor: '#ccc' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});