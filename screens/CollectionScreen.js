import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppActions, useAppState } from '../context/AppContext';

export default function CollectionScreen({ navigation }) {
    const { collection, coins } = useAppState();
    const { getPlantData, getPotData } = useAppActions();

    const plants = getPlantData();
    const pots = getPotData();

    // Direct image mapping for plants
    const getPlantImageDirect = (plantId, potId = 'basic') => {
        const imageMap = {
            cornflower: {
                basic: require('../assets/images/plants/cornflower_basic_pot.png'),
                round: require('../assets/images/plants/cornflower_round_pot.png'),
            },
            daisy: {
                basic: require('../assets/images/plants/daisy_basic_pot.png'),
                round: require('../assets/images/plants/daisy_round_pot.png'),
            },
            poppy: {
                basic: require('../assets/images/plants/poppy_basic_pot.png'),
                round: require('../assets/images/plants/poppy_round_pot.png'),
            }
        };

        if (imageMap[plantId] && imageMap[plantId][potId]) {
            return imageMap[plantId][potId];
        }

        // Fallback to basic pot if round not available
        if (imageMap[plantId] && imageMap[plantId]['basic']) {
            return imageMap[plantId]['basic'];
        }

        // Ultimate fallback - return a default image or null
        return null;
    };

    const getShelfItems = () => {
        const shelves = [[], [], []];
        collection.forEach((item, index) => {
            const shelfIndex = Math.floor(index / 3);
            if (shelfIndex < 3) {
                shelves[shelfIndex].push(item);
            }
        });
        return shelves;
    };

    const renderPlantInPot = (item) => {
        const plant = plants.find(p => p.id === item.plantId);
        const pot = pots.find(p => p.id === item.potId);

        if (!plant || !pot) return null;

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.plantContainer}
                onPress={() => navigation.navigate('PlantDetail', { item, plant, pot })}
            >
                <Image
                    source={getPlantImageDirect(item.plantId, item.potId)}
                    style={styles.plantInPotImage}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };

    const renderEmptySpot = (index) => (
        <View key={`empty-${index}`} style={styles.emptyPot}>
            <View style={styles.emptyPotContainer}>
                <Text style={styles.emptyPotText}>🪴</Text>
                <Text style={styles.emptyPotLabel}>Empty</Text>
            </View>
        </View>
    );

    const renderShelf = (shelfItems, shelfIndex) => (
        <View key={shelfIndex} style={styles.shelfContainer}>
            <View style={styles.shelfContent}>
                {Array.from({ length: 3 }).map((_, spotIndex) => {
                    const item = shelfItems[spotIndex];
                    return item ? renderPlantInPot(item) : renderEmptySpot(`${shelfIndex}-${spotIndex}`);
                })}
            </View>
            <View style={styles.shelfBoard} />
            <View style={styles.shelfSupportLeft} />
            <View style={styles.shelfSupportRight} />
        </View>
    );

    const shelves = getShelfItems();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Your collection</Text>
                <TouchableOpacity
                    style={styles.coinContainer}
                    onPress={() => navigation.navigate('Shop')}
                >
                    <Text style={styles.coinIcon}>🪙</Text>
                    <Text style={styles.coinText}>{coins}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.subHeader}>
                <TouchableOpacity
                    style={styles.challengesButton}
                    onPress={() => navigation.navigate('Challenges')}
                >
                    <Text style={styles.challengesIcon}>🎯</Text>
                    <Text style={styles.challengesText}>Challenges</Text>
                </TouchableOpacity>

                <View style={styles.collectionStats}>
                    <Text style={styles.statsText}>{collection.length} plants collected</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {collection.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Your collection is empty</Text>
                            <Text style={styles.emptySubtitle}>
                                Start collecting flowers to fill your shelves!{'\n\n'}
                                Look for these beautiful flowers:{'\n'}
                                🌾 Cornflowers - Blue wildflowers{'\n'}
                                🌼 Daisies - White with yellow centers{'\n'}
                                🌺 Poppies - Vibrant red blooms
                            </Text>
                            <TouchableOpacity
                                style={styles.collectButton}
                                onPress={() => navigation.navigate('Camera')}
                            >
                                <Text style={styles.collectButtonIcon}>📷</Text>
                                <Text style={styles.collectButtonText}>Start Collecting</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <View style={styles.collectionHeader}>
                                <Text style={styles.collectionTitle}>🌸 Your Flower Garden</Text>
                                <Text style={styles.collectionSubtitle}>
                                    Beautiful flowers displayed on handcrafted shelves
                                </Text>
                            </View>

                            <View style={styles.shelvesContainer}>
                                {shelves.map((shelfItems, index) => renderShelf(shelfItems, index))}
                            </View>

                            <View style={styles.collectionTips}>
                                <Text style={styles.tipsTitle}>💡 Collection Tips</Text>
                                <Text style={styles.tipsText}>
                                    • Tap any plant to see detailed information{'\n'}
                                    • Collect flowers in different pot types{'\n'}
                                    • Complete challenges to unlock new pots{'\n'}
                                    • Each flower type has different coin values
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.actionButtonIcon}>📷</Text>
                    <Text style={styles.actionButtonText}>Collect More</Text>
                </TouchableOpacity>

                {collection.length > 0 && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => navigation.navigate('Shop')}
                    >
                        <Text style={styles.actionButtonIcon}>🪴</Text>
                        <Text style={styles.actionButtonText}>Shop Pots</Text>
                    </TouchableOpacity>
                )}
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
    backIcon: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
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
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    challengesButton: {
        backgroundColor: '#4A90E2',
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
    challengesIcon: {
        fontSize: 16,
        marginRight: 5,
    },
    challengesText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    collectionStats: {
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statsText: {
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 25,
        paddingTop: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    collectButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 35,
        paddingVertical: 18,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    collectButtonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    collectButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    collectionHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    collectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
        textAlign: 'center',
    },
    collectionSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    shelvesContainer: {
        gap: 80,
    },
    shelfContainer: {
        height: 160,
        position: 'relative',
    },
    shelfContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
        paddingHorizontal: 30,
        zIndex: 2,
    },
    shelfBoard: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        height: 18,
        backgroundColor: '#8B4513',
        borderRadius: 9,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        borderTopWidth: 2,
        borderTopColor: '#A0522D',
        borderBottomWidth: 2,
        borderBottomColor: '#654321',
    },
    shelfSupportLeft: {
        position: 'absolute',
        bottom: 0,
        left: '15%',
        width: 12,
        height: 25,
        backgroundColor: '#654321',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    shelfSupportRight: {
        position: 'absolute',
        bottom: 0,
        right: '15%',
        width: 12,
        height: 25,
        backgroundColor: '#654321',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    plantContainer: {
        alignItems: 'center',
        zIndex: 3,
        marginHorizontal: 5,
    },
    plantInPotImage: {
        width: 80,
        height: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyPot: {
        alignItems: 'center',
        zIndex: 3,
        marginHorizontal: 5,
    },
    emptyPotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderStyle: 'dashed',
    },
    emptyPotText: {
        fontSize: 24,
        opacity: 0.3,
        marginBottom: 4,
    },
    emptyPotLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '500',
    },
    collectionTips: {
        backgroundColor: '#E3F2FD',
        padding: 20,
        borderRadius: 15,
        marginTop: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 10,
    },
    tipsText: {
        fontSize: 14,
        color: '#1976D2',
        lineHeight: 20,
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
        gap: 15,
    },
    actionButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 25,
        flex: 1,
        maxWidth: 150,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: '#FF9800',
    },
    actionButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});