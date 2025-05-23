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

export default function CollectionScreen({ navigation }) {
    const { collection, getPlantData, getPotData, coins } = useAppContext();
    const plants = getPlantData();
    const pots = getPotData();

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
                <View style={styles.potBase}>
                    <View style={styles.potRim} />
                    <View style={styles.soil} />
                    <View style={styles.plant}>
                        <Text style={styles.plantEmoji}>🌸</Text>
                        <View style={styles.stem} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptySpot = (index) => (
        <View key={`empty-${index}`} style={styles.emptyPot}>
            <View style={styles.potBase}>
                <View style={[styles.potRim, styles.emptyPotRim]} />
                <View style={[styles.soil, styles.emptySoil]} />
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
            <View style={styles.shelfSupport} />
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
                    <Text style={styles.backIcon}>✏️</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Your collection</Text>
                <View style={styles.coinContainer}>
                    <Text style={styles.coinText}>🪙 {coins}</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {collection.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Your collection is empty</Text>
                            <Text style={styles.emptySubtitle}>
                                Start collecting flowers to fill your shelves!
                            </Text>
                            <TouchableOpacity
                                style={styles.collectButton}
                                onPress={() => navigation.navigate('Camera')}
                            >
                                <Text style={styles.collectButtonText}>📷 Collect</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.shelvesContainer}>
                            {shelves.map((shelfItems, index) => renderShelf(shelfItems, index))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.actionButtonIcon}>📷</Text>
                    <Text style={styles.actionButtonText}>Collect</Text>
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
    backIcon: {
        fontSize: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    coinContainer: {
        backgroundColor: '#f39c12',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
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
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    collectButton: {
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    collectButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    shelvesContainer: {
        gap: 60,
    },
    shelfContainer: {
        height: 140,
        position: 'relative',
    },
    shelfContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 100,
        paddingHorizontal: 20,
        zIndex: 2,
    },
    shelfBoard: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 12,
        backgroundColor: '#8B4513',
        borderRadius: 6,
        zIndex: 1,
    },
    shelfSupport: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        marginLeft: -4,
        width: 8,
        height: 20,
        backgroundColor: '#654321',
        borderRadius: 4,
    },
    plantContainer: {
        alignItems: 'center',
        zIndex: 3,
    },
    emptyPot: {
        alignItems: 'center',
        zIndex: 3,
    },
    potBase: {
        position: 'relative',
        width: 60,
        height: 70,
    },
    potRim: {
        position: 'absolute',
        top: 0,
        left: 5,
        right: 5,
        height: 8,
        backgroundColor: '#8B4513',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#654321',
    },
    emptyPotRim: {
        backgroundColor: '#d0d0d0',
        borderColor: '#b0b0b0',
    },
    soil: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        bottom: 15,
        backgroundColor: '#8B4513',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 1,
        borderColor: '#654321',
        borderTopWidth: 0,
    },
    emptySoil: {
        backgroundColor: '#e0e0e0',
        borderColor: '#c0c0c0',
    },
    plant: {
        position: 'absolute',
        top: -10,
        left: '50%',
        marginLeft: -15,
        alignItems: 'center',
    },
    plantEmoji: {
        fontSize: 30,
        zIndex: 4,
    },
    stem: {
        width: 3,
        height: 20,
        backgroundColor: '#4a7c4a',
        marginTop: -5,
        zIndex: 1,
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
        backgroundColor: '#4a7c4a',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButtonIcon: {
        fontSize: 18,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});