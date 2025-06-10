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
import { useAppState } from '../context/AppContext';

export default function PlantDetailScreen({ route, navigation }) {
    const { item, plant, pot } = route.params;
    const { coins } = useAppState();

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return '#27ae60';
            case 'uncommon': return '#f39c12';
            case 'rare': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const getRarityIcon = (rarity) => {
        switch (rarity) {
            case 'common': return '🟢';
            case 'uncommon': return '🟡';
            case 'rare': return '🔴';
            default: return '⚪';
        }
    };

    const getPlantFacts = (plantId) => {
        const facts = {
            cornflower: [
                "• Also known as Bachelor's Button",
                "• Native to Europe and originally a wildflower",
                "• Traditional symbol of delicacy and grace",
                "• Edible flowers often used in salads",
                "• Can bloom from spring until first frost",
                "• Attracts butterflies and beneficial insects"
            ],
            daisy: [
                "• Name comes from 'day's eye'",
                "• Closes petals at night and in rain",
                "• Symbol of innocence and purity",
                "• Edible flowers used in salads and teas",
                "• Can bloom almost year-round in mild climates",
                "• One of the most recognizable flowers worldwide"
            ],
            poppy: [
                "• Symbol of remembrance and peace",
                "• Self-seeding annual that spreads naturally",
                "• Blooms are short-lived but spectacular",
                "• Seeds are used in cooking and baking",
                "• Can grow in poor soil conditions",
                "• Attracts bees and other pollinators"
            ],
            lily_valley: [
                "• Native to cool regions of Northern Hemisphere",
                "• Blooms in late spring with sweet fragrance",
                "• Symbol of humility and sweetness",
                "• All parts of the plant are poisonous",
                "• Used in traditional perfumery",
                "• Prefers shaded woodland areas"
            ],
            rose: [
                "• Over 300 species and thousands of cultivars",
                "• Symbol of love and beauty across cultures",
                "• Rose hips are rich in vitamin C",
                "• Can live for over 100 years",
                "• Used in perfumes, cosmetics, and cooking",
                "• National flower of several countries"
            ]
        };
        return facts[plantId] || [
            "• A beautiful flower in your collection",
            "• Each flower has its own unique characteristics",
            "• Collecting flowers brings joy and knowledge",
            "• Take care of your plants and they'll thrive"
        ];
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
                <Text style={styles.title}>Plant Details</Text>
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
                    <View style={styles.plantDisplay}>
                        <View style={styles.plantContainer}>
                            <Image
                                source={getPlantImageDirect(item.plantId, item.potId)}
                                style={styles.plantDetailImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.plantName}>{plant.name}</Text>
                        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(plant.rarity) }]}>
                            <Text style={styles.rarityIcon}>{getRarityIcon(plant.rarity)}</Text>
                            <Text style={styles.rarityText}>{plant.rarity.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>📖 Description</Text>
                        <Text style={styles.description}>{plant.description}</Text>
                    </View>

                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>ℹ️ Details</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>🪴 Pot Type:</Text>
                                <Text style={styles.detailValue}>{pot.name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>💰 Coin Value:</Text>
                                <View style={styles.coinValueContainer}>
                                    <Text style={styles.detailCoinIcon}>🪙</Text>
                                    <Text style={styles.detailValue}>{plant.coins}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>📅 Discovered:</Text>
                                <Text style={styles.detailValue}>{formatDate(item.discoveredAt)}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>✨ Rarity:</Text>
                                <View style={styles.rarityContainer}>
                                    <Text style={styles.rarityEmoji}>{getRarityIcon(plant.rarity)}</Text>
                                    <Text style={[styles.detailValue, { color: getRarityColor(plant.rarity) }]}>
                                        {plant.rarity}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.factsSection}>
                        <Text style={styles.sectionTitle}>🌱 Fun Facts</Text>
                        <View style={styles.factsList}>
                            {getPlantFacts(plant.id).map((fact, index) => (
                                <Text key={index} style={styles.factItem}>{fact}</Text>
                            ))}
                        </View>
                    </View>

                    {/* Collection Progress */}
                    <View style={styles.progressSection}>
                        <Text style={styles.sectionTitle}>📊 Collection Progress</Text>
                        <View style={styles.progressContent}>
                            <View style={styles.progressItem}>
                                <Text style={styles.progressLabel}>Your {plant.name}s</Text>
                                <Text style={styles.progressValue}>1 collected</Text>
                            </View>
                            <View style={styles.progressItem}>
                                <Text style={styles.progressLabel}>Pot Type</Text>
                                <Text style={styles.progressValue}>{pot.name}</Text>
                            </View>
                            <View style={styles.progressItem}>
                                <Text style={styles.progressLabel}>Discovery Date</Text>
                                <Text style={styles.progressValue}>
                                    {new Date(item.discoveredAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Care Tips */}
                    <View style={styles.careSection}>
                        <Text style={styles.sectionTitle}>💡 Care Tips</Text>
                        <View style={styles.careTips}>
                            <View style={styles.careItem}>
                                <Text style={styles.careIcon}>💧</Text>
                                <Text style={styles.careText}>Keep soil moist but not waterlogged</Text>
                            </View>
                            <View style={styles.careItem}>
                                <Text style={styles.careIcon}>☀️</Text>
                                <Text style={styles.careText}>Most flowers prefer bright, indirect light</Text>
                            </View>
                            <View style={styles.careItem}>
                                <Text style={styles.careIcon}>🌡️</Text>
                                <Text style={styles.careText}>Maintain moderate temperature (65-75°F)</Text>
                            </View>
                            <View style={styles.careItem}>
                                <Text style={styles.careIcon}>✂️</Text>
                                <Text style={styles.careText}>Remove dead flowers to encourage new blooms</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Collection')}
                >
                    <Text style={styles.actionButtonIcon}>🌸</Text>
                    <Text style={styles.actionButtonText}>Collection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.actionButtonIcon}>📷</Text>
                    <Text style={styles.actionButtonText}>Find More</Text>
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
        padding: 20,
    },
    plantDisplay: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    plantContainer: {
        marginBottom: 20,
    },
    plantDetailImage: {
        width: 150,
        height: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    plantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 15,
        textAlign: 'center',
    },
    rarityBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    rarityIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    rarityText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    infoSection: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 26,
    },
    detailsSection: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    detailsGrid: {
        gap: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    coinValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailCoinIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    rarityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rarityEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    factsSection: {
        backgroundColor: '#E8F5E8',
        padding: 25,
        borderRadius: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    factsList: {
        gap: 12,
    },
    factItem: {
        fontSize: 15,
        color: '#2E7D32',
        lineHeight: 22,
        fontWeight: '500',
    },
    progressSection: {
        backgroundColor: '#E3F2FD',
        padding: 25,
        borderRadius: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#4A90E2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    progressContent: {
        gap: 15,
    },
    progressItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(74, 144, 226, 0.2)',
    },
    progressLabel: {
        fontSize: 16,
        color: '#1976D2',
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 16,
        color: '#1976D2',
        fontWeight: 'bold',
    },
    careSection: {
        backgroundColor: '#FFF3E0',
        padding: 25,
        borderRadius: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#FF9800',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    careTips: {
        gap: 15,
    },
    careItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 15,
        borderRadius: 12,
    },
    careIcon: {
        fontSize: 20,
        marginRight: 15,
        width: 25,
        textAlign: 'center',
    },
    careText: {
        fontSize: 15,
        color: '#E65100',
        fontWeight: '500',
        flex: 1,
        lineHeight: 20,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 25,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        gap: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 25,
        flex: 1,
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
        backgroundColor: '#757575',
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