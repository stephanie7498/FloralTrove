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

export default function PlantDetailScreen({ route, navigation }) {
    const { item, plant, pot } = route.params;
    const { getPlantImage, coins } = useAppContext();

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
                            <View style={styles.potBase}>
                                <View style={[styles.potRim, pot.id === 'basic' ? styles.basicPot : styles.decorativePot]} />
                                <View style={[styles.soil, pot.id === 'basic' ? styles.basicSoil : styles.decorativeSoil]} />
                                <View style={styles.plant}>
                                    <Text style={styles.plantEmoji}>
                                        {getPlantImage(item.plantId, item.potId)}
                                    </Text>
                                    <View style={styles.stem} />
                                </View>
                            </View>
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
                            {plant.id === 'lily_valley' && (
                                <>
                                    <Text style={styles.factItem}>• Native to cool regions of Northern Hemisphere</Text>
                                    <Text style={styles.factItem}>• Blooms in late spring with sweet fragrance</Text>
                                    <Text style={styles.factItem}>• Symbol of humility and sweetness</Text>
                                    <Text style={styles.factItem}>• All parts of the plant are poisonous</Text>
                                </>
                            )}
                            {plant.id === 'rose' && (
                                <>
                                    <Text style={styles.factItem}>• Over 300 species and thousands of cultivars</Text>
                                    <Text style={styles.factItem}>• Symbol of love and beauty across cultures</Text>
                                    <Text style={styles.factItem}>• Rose hips are rich in vitamin C</Text>
                                    <Text style={styles.factItem}>• Can live for over 100 years</Text>
                                </>
                            )}
                            {plant.id === 'daisy' && (
                                <>
                                    <Text style={styles.factItem}>• Name comes from 'day's eye'</Text>
                                    <Text style={styles.factItem}>• Closes petals at night and in rain</Text>
                                    <Text style={styles.factItem}>• Symbol of innocence and purity</Text>
                                    <Text style={styles.factItem}>• Edible flowers used in salads</Text>
                                </>
                            )}
                            {plant.id === 'sunflower' && (
                                <>
                                    <Text style={styles.factItem}>• Can grow up to 10 feet tall</Text>
                                    <Text style={styles.factItem}>• Flowers follow the sun throughout the day</Text>
                                    <Text style={styles.factItem}>• Seeds are a healthy snack rich in vitamin E</Text>
                                    <Text style={styles.factItem}>• Native to North and Central America</Text>
                                </>
                            )}
                            {plant.id === 'tulip' && (
                                <>
                                    <Text style={styles.factItem}>• Originally from Central Asia</Text>
                                    <Text style={styles.factItem}>• Became famous during Dutch Tulip Mania</Text>
                                    <Text style={styles.factItem}>• Bloom for only 3-7 days each year</Text>
                                    <Text style={styles.factItem}>• Come in almost every color except true blue</Text>
                                </>
                            )}
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
    potBase: {
        position: 'relative',
        width: 100,
        height: 120,
    },
    potRim: {
        position: 'absolute',
        top: 0,
        left: 10,
        right: 10,
        height: 12,
        borderRadius: 25,
        borderWidth: 2,
    },
    basicPot: {
        backgroundColor: '#D2691E',
        borderColor: '#8B4513',
    },
    decorativePot: {
        backgroundColor: '#CD853F',
        borderColor: '#A0522D',
    },
    soil: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        bottom: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderWidth: 2,
        borderTopWidth: 0,
    },
    basicSoil: {
        backgroundColor: '#8B4513',
        borderColor: '#654321',
    },
    decorativeSoil: {
        backgroundColor: '#A0522D',
        borderColor: '#8B4513',
    },
    plant: {
        position: 'absolute',
        top: -20,
        left: '50%',
        marginLeft: -25,
        alignItems: 'center',
    },
    plantEmoji: {
        fontSize: 50,
        zIndex: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    stem: {
        width: 6,
        height: 30,
        backgroundColor: '#4CAF50',
        marginTop: -10,
        zIndex: 1,
        borderRadius: 3,
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