import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PlantDetailScreen({ route, navigation }) {
    const { item, plant, pot } = route.params;

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
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.plantDisplay}>
                        <View style={styles.plantContainer}>
                            <View style={styles.potBase}>
                                <View style={styles.potRim} />
                                <View style={styles.soil} />
                                <View style={styles.plant}>
                                    <Text style={styles.plantEmoji}>🌸</Text>
                                    <View style={styles.stem} />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.plantName}>{plant.name}</Text>
                        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(plant.rarity) }]}>
                            <Text style={styles.rarityText}>{plant.rarity.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{plant.description}</Text>
                    </View>

                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Details</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Pot Type:</Text>
                                <Text style={styles.detailValue}>{pot.name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Coin Value:</Text>
                                <Text style={styles.detailValue}>🪙 {plant.coins}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Discovered:</Text>
                                <Text style={styles.detailValue}>{formatDate(item.discoveredAt)}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Rarity:</Text>
                                <Text style={[styles.detailValue, { color: getRarityColor(plant.rarity) }]}>
                                    {plant.rarity}
                                </Text>
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
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Collection')}
                >
                    <Text style={styles.actionButtonText}>🌸 Back to Collection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.actionButtonText}>📷 Find More</Text>
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
    },
    headerSpacer: {
        width: 40,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    plantContainer: {
        marginBottom: 20,
    },
    potBase: {
        position: 'relative',
        width: 80,
        height: 100,
    },
    potRim: {
        position: 'absolute',
        top: 0,
        left: 8,
        right: 8,
        height: 10,
        backgroundColor: '#8B4513',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#654321',
    },
    soil: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        bottom: 20,
        backgroundColor: '#8B4513',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderWidth: 1,
        borderColor: '#654321',
        borderTopWidth: 0,
    },
    plant: {
        position: 'absolute',
        top: -15,
        left: '50%',
        marginLeft: -20,
        alignItems: 'center',
    },
    plantEmoji: {
        fontSize: 40,
        zIndex: 4,
    },
    stem: {
        width: 4,
        height: 25,
        backgroundColor: '#4a7c4a',
        marginTop: -8,
        zIndex: 1,
    },
    plantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 10,
    },
    rarityBadge: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    rarityText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    detailsSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    detailsGrid: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    factsSection: {
        backgroundColor: '#e8f5e8',
        padding: 20,
        borderRadius: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#4a7c4a',
    },
    factsList: {
        gap: 8,
    },
    factItem: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 10,
    },
    actionButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#888',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});