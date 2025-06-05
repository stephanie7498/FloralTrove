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
                    <View style={[styles.potRim, pot.id === 'basic' ? styles.basicPot : styles.decorativePot]} />
                    <View style={[styles.soil, pot.id === 'basic' ? styles.basicSoil : styles.decorativeSoil]} />
                    <View style={styles.plant}>
                        <Text style={styles.plantEmoji}>{getPlantImage(item.plantId, item.potId)}</Text>
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
                    style={styles.challengesButton}
                    onPress={() => navigation.navigate('Challenges')}
                >
                    <Text style={styles.challengesIcon}>✓</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.subHeader}>
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
                                <Text style={styles.collectButtonIcon}>📷</Text>
                                <Text style={styles.collectButtonText}>Collect</Text>
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
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        letterSpacing: 0.5,
    },
    subHeader: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        alignItems: 'flex-end',
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
        padding: 25,
        paddingTop: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 120,
    },
    emptyTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 18,
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
    },
    emptyPot: {
        alignItems: 'center',
        zIndex: 3,
    },
    potBase: {
        position: 'relative',
        width: 70,
        height: 80,
    },
    potRim: {
        position: 'absolute',
        top: 0,
        left: 8,
        right: 8,
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
    emptyPotRim: {
        backgroundColor: '#E0E0E0',
        borderColor: '#BDBDBD',
    },
    soil: {
        position: 'absolute',
        top: 12,
        left: 10,
        right: 10,
        bottom: 18,
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
    emptySoil: {
        backgroundColor: '#F0F0F0',
        borderColor: '#D0D0D0',
    },
    plant: {
        position: 'absolute',
        top: -15,
        left: '50%',
        marginLeft: -20,
        alignItems: 'center',
    },
    plantEmoji: {
        fontSize: 35,
        zIndex: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    stem: {
        width: 4,
        height: 25,
        backgroundColor: '#4CAF50',
        marginTop: -8,
        zIndex: 1,
        borderRadius: 2,
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
    },
    actionButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    actionButtonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});