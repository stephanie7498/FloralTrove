import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

const PLANTS_DATA = [
    {
        id: 'lily_valley',
        name: 'Lily of the Valley',
        description: 'Delicate white bell-shaped flowers',
        rarity: 'common',
        coins: 50
    },
    {
        id: 'rose',
        name: 'Rose',
        description: 'Classic beautiful flowering plant',
        rarity: 'uncommon',
        coins: 100
    },
    {
        id: 'daisy',
        name: 'Daisy',
        description: 'Simple white petals with yellow center',
        rarity: 'common',
        coins: 75
    }
];

const POTS_DATA = [
    {
        id: 'basic',
        name: 'Basic Pot',
        price: 0,
        image: null,
        unlocked: true
    },
    {
        id: 'medium',
        name: 'Medium Pot',
        price: 500,
        image: null,
        unlocked: false
    },
    {
        id: 'premium',
        name: 'Premium Pot',
        price: 1500,
        image: null,
        unlocked: false
    }
];

export const AppProvider = ({ children }) => {
    const [coins, setCoins] = useState(200);
    const [collection, setCollection] = useState([]);
    const [unlockedPots, setUnlockedPots] = useState(['basic']);
    const [challenges, setChallenges] = useState([
        { id: 1, title: 'Identify 3 flowers', progress: 0, target: 3, reward: 50, completed: false }
    ]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedCoins = await AsyncStorage.getItem('coins');
            const savedCollection = await AsyncStorage.getItem('collection');
            const savedPots = await AsyncStorage.getItem('unlockedPots');
            const savedChallenges = await AsyncStorage.getItem('challenges');

            if (savedCoins) setCoins(parseInt(savedCoins));
            if (savedCollection) setCollection(JSON.parse(savedCollection));
            if (savedPots) setUnlockedPots(JSON.parse(savedPots));
            if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
        } catch (error) {
            console.log('Error loading data:', error);
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('coins', coins.toString());
            await AsyncStorage.setItem('collection', JSON.stringify(collection));
            await AsyncStorage.setItem('unlockedPots', JSON.stringify(unlockedPots));
            await AsyncStorage.setItem('challenges', JSON.stringify(challenges));
        } catch (error) {
            console.log('Error saving data:', error);
        }
    };

    useEffect(() => {
        saveData();
    }, [coins, collection, unlockedPots, challenges]);

    const addPlantToCollection = (plantId, potId = 'basic') => {
        const plant = PLANTS_DATA.find(p => p.id === plantId);
        if (!plant) return false;

        const existingIndex = collection.findIndex(
            item => item.plantId === plantId && item.potId === potId
        );

        if (existingIndex === -1) {
            const newItem = {
                id: `${plantId}_${potId}_${Date.now()}`,
                plantId,
                potId,
                discoveredAt: new Date().toISOString()
            };

            setCollection(prev => [...prev, newItem]);
            setCoins(prev => prev + plant.coins);

            setChallenges(prev => prev.map(challenge => {
                if (challenge.id === 1 && !challenge.completed) {
                    const newProgress = challenge.progress + 1;
                    const completed = newProgress >= challenge.target;
                    if (completed) {
                        setCoins(currentCoins => currentCoins + challenge.reward);
                    }
                    return { ...challenge, progress: newProgress, completed };
                }
                return challenge;
            }));

            return true;
        }
        return false;
    };

    const buyPot = (potId) => {
        const pot = POTS_DATA.find(p => p.id === potId);
        if (!pot || unlockedPots.includes(potId) || coins < pot.price) {
            return false;
        }

        setCoins(prev => prev - pot.price);
        setUnlockedPots(prev => [...prev, potId]);
        return true;
    };

    const getPlantData = () => PLANTS_DATA;
    const getPotData = () => POTS_DATA;

    const getPlantImage = (plantId, potId) => {
        return '🌸';
    };

    const value = {
        coins,
        collection,
        unlockedPots,
        challenges,
        addPlantToCollection,
        buyPot,
        getPlantData,
        getPotData,
        getPlantImage,
        setCoins,
        setCollection,
        setUnlockedPots,
        setChallenges
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};