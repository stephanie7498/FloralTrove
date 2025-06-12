import React, { useState } from 'react';
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppActions, useAppState } from '../context/AppContext';

export default function CollectionScreen({ navigation }) {
    const { collection, coins, unlockedPots } = useAppState();
    const { getPlantData, getPotData, changeAllPots } = useAppActions();
    const [showPotSelector, setShowPotSelector] = useState(false);

    const plants = getPlantData();
    const pots = getPotData();

    // Debug logging
    console.log('CollectionScreen - Collection:', collection);
    console.log('CollectionScreen - Plants data:', plants);
    console.log('CollectionScreen - Pots data:', pots);

    const getPotImageDirect = (potId) => {
        const imageMap = {
            basic: require('../assets/images/pots/basic_pot.png'),
            round: require('../assets/images/pots/round_pot.png'),
        };

        return imageMap[potId] || imageMap['basic'];
    };

    const getPlantImageDirect = (plantId, potId = 'basic') => {
        // For collection display, always use static images with pot types to show pot variations
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
            // TODO: Add new plant images when they're properly added to the project:
            // blaussilene, gele_ganzenbloem, knoopkruid, rode_klaver
        };

        if (imageMap[plantId] && imageMap[plantId][potId]) {
            return imageMap[plantId][potId];
        }

        if (imageMap[plantId] && imageMap[plantId]['basic']) {
            return imageMap[plantId]['basic'];
        }

        // Fallback for new plants - use a basic pot image
        return require('../assets/images/pots/basic_pot.png');
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

    const handleChangePots = (newPotId) => {
        changeAllPots(newPotId);
        setShowPotSelector(false);
    };

    const renderPlantInPot = (item) => {
        const plant = plants.find(p => p.id === item.plantId);
        const pot = pots.find(p => p.id === item.potId);

        if (!plant || !pot) {
            console.log('Missing plant or pot data:', { plant, pot, item });
            return null;
        }

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.plantContainer}
                onPress={() => {
                    console.log('Navigating to PlantDetail with:', { item, plant, pot });
                    navigation.navigate('PlantDetail', {
                        item: {
                            id: item.id,
                            plantId: item.plantId,
                            potId: item.potId,
                            discoveredAt: item.discoveredAt
                        },
                        plant: {
                            id: plant.id,
                            name: plant.name,
                            description: plant.description,
                            rarity: plant.rarity,
                            coins: plant.coins,
                            emoji: plant.emoji
                        },
                        pot: {
                            id: pot.id,
                            name: pot.name,
                            description: pot.description,
                            price: pot.price
                        }
                    });
                }}
            >
                <View style={styles.plantImageContainer}>
                    <Image
                        source={getPlantImageDirect(item.plantId, item.potId)}
                        style={styles.plantInPotImage}
                        resizeMode="contain"
                    />
                </View>
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
    const currentPotName = collection.length > 0 ?
        pots.find(p => p.id === collection[0].potId)?.name || 'Basic Clay Pot' :
        'Basic Clay Pot';

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

            {collection.length > 0 && unlockedPots.length > 1 && (
                <View style={styles.potSelectorSection}>
                    <Text style={styles.potSelectorLabel}>Current pot style: {currentPotName}</Text>
                    <TouchableOpacity
                        style={styles.changePotButton}
                        onPress={() => setShowPotSelector(true)}
                    >
                        <Text style={styles.changePotIcon}>🔄</Text>
                        <Text style={styles.changePotText}>Change All Pots</Text>
                    </TouchableOpacity>
                </View>
            )}

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
                                🌺 Poppies - Vibrant red blooms{'\n'}
                                🤍 Bladder Campion - White with inflated sepals{'\n'}
                                🌻 Yellow Daisy - Bright yellow flowers{'\n'}
                                💜 Knapweed - Purple thistle-like flowers{'\n'}
                                🍀 Red Clover - Red-purple clover flowers
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
                                    • Buy new pots in the shop{'\n'}
                                    • Use "Change All Pots" to switch pot styles{'\n'}
                                    • Complete challenges to unlock new pots{'\n'}
                                    • Each flower type has different coin values{'\n'}
                                    • Some flowers have special animations in details!{'\n'}
                                    • Collect all 7 flower types to complete the collection
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

            <Modal
                visible={showPotSelector}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPotSelector(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choose Pot Style</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowPotSelector(false)}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            This will change all plants in your collection to the selected pot style.
                        </Text>

                        <View style={styles.potOptions}>
                            {unlockedPots.map(potId => {
                                const pot = pots.find(p => p.id === potId);
                                if (!pot) return null;

                                const isCurrentPot = collection.length > 0 && collection[0].potId === potId;

                                return (
                                    <TouchableOpacity
                                        key={potId}
                                        style={[
                                            styles.potOption,
                                            isCurrentPot && styles.potOptionSelected
                                        ]}
                                        onPress={() => handleChangePots(potId)}
                                        disabled={isCurrentPot}
                                    >
                                        <View style={styles.potPreviewContainer}>
                                            <Image
                                                source={getPotImageDirect(potId)}
                                                style={styles.potPreviewImage}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <Text style={styles.potOptionName}>{pot.name}</Text>
                                        {isCurrentPot && (
                                            <Text style={styles.currentPotLabel}>Current</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
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
    potSelectorSection: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    potSelectorLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    changePotButton: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    changePotIcon: {
        fontSize: 14,
        marginRight: 5,
    },
    changePotText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
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
    },
    shelfSupportRight: {
        position: 'absolute',
        bottom: 0,
        right: '15%',
        width: 12,
        height: 25,
        backgroundColor: '#654321',
        borderRadius: 6,
    },
    plantContainer: {
        alignItems: 'center',
        zIndex: 3,
        marginHorizontal: 5,
    },
    plantImageContainer: {
        backgroundColor: 'transparent',
    },
    plantInPotImage: {
        width: 85,
        height: 105,
        borderRadius: 8,
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
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
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
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 25,
        textAlign: 'center',
        lineHeight: 20,
    },
    potOptions: {
        gap: 15,
    },
    potOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    potOptionSelected: {
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
    },
    potPreviewContainer: {
        marginRight: 15,
    },
    potPreviewImage: {
        width: 40,
        height: 40,
    },
    potOptionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        flex: 1,
    },
    currentPotLabel: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
});