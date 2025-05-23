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
import { useAppContext } from '../context/AppContext';

export default function PlantDetailScreen({ route, navigation }) {
    const { item, plant, pot } = route.params;
    const { getPlantImage } = useAppContext();

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
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.plantDisplay}>
                        <Image
                            source={getPlantImage(item.plantId, item.potId)}
                            style={styles.plantInPotImage}
                        />
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.plantName}>{plant.name}</Text>

                        <View style={styles.rarityContainer}>
                            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(plant.rarity) }]}>
                                <Text style={styles.rarityText}>{plant.rarity.toUpperCase()}</Text>
                            </View>
                        </View>

                        <Text style={styles.description}>{plant.description}</Text>

                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Pot Type</Text>
                                <Text style={styles.detailValue}>{pot.name}</Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Coin Value</Text>
                                <Text style={styles.detailValue}>🪙 {plant.coins}</Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Discovered</Text>
                                <Text style={styles.detailValue}>{formatDate(item.discoveredAt)}</Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Rarity</Text>
                                <Text style={[styles.detailValue, { color: getRarityColor(plant.rarity) }]}>
                                    {plant.rarity}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.factsCard}>
                        <Text style={styles.factsTitle}>🌱 Plant Facts</Text>
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
                                    <Text style={styles.factItem}>• Name comes from days eye</Text>
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
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    plantDisplay: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    plantInPotImage: {
        width: 150,
        height: 180,
        resizeMode: 'contain',
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    plantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4a7c4a',
        textAlign: 'center',
        marginBottom: 15,
    },
    rarityContainer: {
        alignItems: 'center',
        marginBottom: 20,
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
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    detailsGrid: {
        gap: 15,
    },
    detailItem: {
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
    factsCard: {
        backgroundColor: '#e8f5e8',
        padding: 25,
        borderRadius: 20,
        borderLeft: 5,
        borderLeftColor: '#4a7c4a',
    },
    factsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a7c4a',
        marginBottom: 15,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 10,
    },
    actionButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        flex: 1,
    },
    secondaryButton: {
        backgroundColor: '#888',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});