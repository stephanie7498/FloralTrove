import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [coins, setCoins] = useState(100);
    const [collection, setCollection] = useState([]);
    const [unlockedPots, setUnlockedPots] = useState(['basic']);
    const [challenges, setChallenges] = useState([
        {
            id: 1,
            title: "Collect 3 different flowers",
            target: 3,
            progress: 0,
            reward: 50,
            completed: false
        },
        {
            id: 2,
            title: "Collect 5 flowers",
            target: 5,
            progress: 0,
            reward: 100,
            completed: false
        }
    ]);

    // Plant data
    const getPlantData = () => [
        {
            id: 'lily_valley',
            name: 'Lily of the Valley',
            rarity: 'uncommon',
            coins: 25,
            description: 'A delicate white flower that blooms in spring. Known for its sweet fragrance and bell-shaped flowers.'
        },
        {
            id: 'rose',
            name: 'Rose',
            rarity: 'common',
            coins: 15,
            description: 'The classic symbol of love and beauty. Roses come in many colors and have been cultivated for thousands of years.'
        },
        {
            id: 'daisy',
            name: 'Daisy',
            rarity: 'common',
            coins: 10,
            description: 'A cheerful white flower with a yellow center. Daisies are known for their simple beauty and resilience.'
        },
        {
            id: 'sunflower',
            name: 'Sunflower',
            rarity: 'rare',
            coins: 40,
            description: 'A tall, bright yellow flower that follows the sun. Sunflowers can grow up to 10 feet tall and produce edible seeds.'
        },
        {
            id: 'tulip',
            name: 'Tulip',
            rarity: 'uncommon',
            coins: 20,
            description: 'An elegant spring flower that comes in many colors. Originally from Turkey, tulips became famous in the Netherlands.'
        }
    ];

    // Pot data
    const getPotData = () => [
        {
            id: 'basic',
            name: 'Basic Clay Pot',
            price: 0,
            description: 'A simple clay pot for your plants.'
        },
        {
            id: 'decorative',
            name: 'Decorative Pot',
            price: 50,
            description: 'A beautiful decorated pot with patterns.'
        },
        {
            id: 'ceramic',
            name: 'Ceramic Pot',
            price: 75,
            description: 'A smooth, glazed ceramic pot.'
        },
        {
            id: 'terracotta',
            name: 'Terracotta Pot',
            price: 100,
            description: 'A traditional terracotta pot with excellent drainage.'
        }
    ];

    // Get plant image/emoji
    const getPlantImage = (plantId, potId) => {
        const plantEmojis = {
            lily_valley: '🤍',
            rose: '🌹',
            daisy: '🌼',
            sunflower: '🌻',
            tulip: '🌷'
        };
        return plantEmojis[plantId] || '🌸';
    };

    // Add plant to collection
    const addPlantToCollection = (plantId) => {
        const plants = getPlantData();
        const plant = plants.find(p => p.id === plantId);

        if (!plant) return false;

        // Check if plant already exists in collection
        const existsInCollection = collection.some(item => item.plantId === plantId);
        if (existsInCollection) {
            return false; // Already have this plant
        }

        // Get a random unlocked pot
        const availablePots = unlockedPots.length > 0 ? unlockedPots : ['basic'];
        const randomPot = availablePots[Math.floor(Math.random() * availablePots.length)];

        const newItem = {
            id: Date.now().toString(),
            plantId: plantId,
            potId: randomPot,
            discoveredAt: new Date().toISOString()
        };

        setCollection(prev => [...prev, newItem]);
        setCoins(prev => prev + plant.coins);

        // Update challenge progress
        setChallenges(prev => prev.map(challenge => {
            if (!challenge.completed) {
                const newProgress = challenge.progress + 1;
                if (newProgress >= challenge.target) {
                    setCoins(prevCoins => prevCoins + challenge.reward);
                    return { ...challenge, progress: newProgress, completed: true };
                }
                return { ...challenge, progress: newProgress };
            }
            return challenge;
        }));

        return true;
    };

    // Buy pot
    const buyPot = (potId) => {
        const pots = getPotData();
        const pot = pots.find(p => p.id === potId);

        if (!pot || unlockedPots.includes(potId) || coins < pot.price) {
            return false;
        }

        setCoins(prev => prev - pot.price);
        setUnlockedPots(prev => [...prev, potId]);
        return true;
    };

    const contextValue = {
        coins,
        collection,
        unlockedPots,
        challenges,
        getPlantData,
        getPotData,
        getPlantImage,
        addPlantToCollection,
        buyPot
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};