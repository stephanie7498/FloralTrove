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
    const { collection, getPlantData, getPotData, getPlantImage, coins } = useAppContext();
    const plants = getPlantData();
    const pots = getPotData();

    const getShelfItems = () => {
        const shelves = [[], [], []]; // 3 shelves

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
                <View style={styles.placeholderPlant}>
                    <Text style={styles.placeholderEmoji}>🌸</Text>
                </View>
                <Text style={styles.plantName}>{plant.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderShelf = (shelfItems, shelfIndex) => (
        <View key={shelfIndex} style={styles.shelfContainer}>
            <View style={styles.shelfPlaceholder} />
            <View style={styles.shelfContent}>
                {shelfItems.map(item => renderPlantInPot(item))}
                {shelfItems.length < 3 && (
                    Array.from({ length: 3 - shelfItems.length }).map((_, index) => (
                        <View key={`empty-${index}`} style={styles.emptySpot} />
                    ))
                )}
            </View>
        </View>
    );

    const shelves = getShelfItems();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.background}>
                {/* Temporary colored background */}
                <View style={styles.header}>
                    <Text style={styles.title}>Your Collection</Text>
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
                                    Go take pictures of flowers to start collecting!
                                </Text>
                                <TouchableOpacity
                                    style={styles.collectButton}
                                    onPress={() => navigation.navigate('Camera')}
                                >
                                    <Text style={styles.collectButtonText}>📷 Start Collecting</Text>
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
                        <Text style={styles.actionButtonText}>📷 Collect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Shop')}
                    >
                        <Text style={styles.actionButtonText}>🛒 Shop</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        backgroundColor: '#98FB98', // Light green placeholder
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
        gap: 40,
    },
    shelfContainer: {
        position: 'relative',
        height: 120,
    },
    shelfPlaceholder: {
        width: '100%',
        height: 20,
        backgroundColor: '#8B4513',
        position: 'absolute',
        bottom: 0,
        borderRadius: 5,
    },
    shelfContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 100,
        paddingHorizontal: 20,
    },
    plantContainer: {
        alignItems: 'center',
        width: 80,
    },
    placeholderPlant: {
        width: 70,
        height: 80,
        backgroundColor: '#DEB887',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8B4513',
    },
    placeholderEmoji: {
        fontSize: 30,
    },
    plantName: {
        fontSize: 12,
        color: '#4a7c4a',
        textAlign: 'center',
        marginTop: 5,
        fontWeight: '500',
    },
    emptySpot: {
        width: 80,
        height: 60,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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