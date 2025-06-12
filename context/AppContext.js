import React, { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
    coins: 100,
    collection: [],
    challenges: [
        {
            id: 1,
            title: "First Discovery",
            target: 1,
            progress: 0,
            reward: 50,
            completed: false
        },
        {
            id: 2,
            title: "Flower Enthusiast",
            target: 5,
            progress: 0,
            reward: 100,
            completed: false
        },
        {
            id: 3,
            title: "Garden Explorer",
            target: 10,
            progress: 0,
            reward: 200,
            completed: false
        },
        {
            id: 4,
            title: "Botanical Expert",
            target: 15,
            progress: 0,
            reward: 300,
            completed: false
        },
        {
            id: 5,
            title: "Master Collector",
            target: 20,
            progress: 0,
            reward: 500,
            completed: false
        }
    ],
    unlockedPots: ['basic'],
    activePotType: 'basic'
};

const plantData = [
    {
        id: 'cornflower',
        name: 'Cornflower',
        description: 'A beautiful blue wildflower, also known as Bachelor\'s Button. Native to Europe and traditionally a symbol of delicacy and grace.',
        rarity: 'common',
        coins: 40,
        emoji: '🌾'
    },
    {
        id: 'daisy',
        name: 'Daisy',
        description: 'A cheerful white flower with a bright yellow center, symbolizing innocence and purity. The name comes from "day\'s eye".',
        rarity: 'common',
        coins: 50,
        emoji: '🌼'
    },
    {
        id: 'poppy',
        name: 'Poppy',
        description: 'A vibrant red bloom that\'s a symbol of remembrance and peace. These flowers are short-lived but spectacular.',
        rarity: 'uncommon',
        coins: 75,
        emoji: '🌺'
    },
    {
        id: 'blaussilene',
        name: 'Bladder Campion',
        description: 'A delicate white flower with inflated sepals, commonly found in meadows and grasslands. Known for its distinctive balloon-like calyx.',
        rarity: 'common',
        coins: 45,
        emoji: '🤍'
    },
    {
        id: 'gele_ganzenbloem',
        name: 'Yellow Daisy',
        description: 'A bright yellow flower that brings sunshine to any garden. These cheerful blooms are perfect for attracting pollinators.',
        rarity: 'common',
        coins: 55,
        emoji: '🌻'
    },
    {
        id: 'knoopkruid',
        name: 'Knapweed',
        description: 'A purple thistle-like flower with distinctive knobby flower heads. These hardy plants are important for wildlife and pollinators.',
        rarity: 'uncommon',
        coins: 65,
        emoji: '💜'
    },
    {
        id: 'rode_klaver',
        name: 'Red Clover',
        description: 'A vibrant red-purple clover flower that\'s both beautiful and beneficial. These nitrogen-fixing plants enrich the soil naturally.',
        rarity: 'common',
        coins: 40,
        emoji: '🍀'
    }
];

const potData = [
    {
        id: 'basic',
        name: 'Basic Clay Pot',
        description: 'A simple terracotta pot perfect for starting your collection.',
        price: 0,
        unlocked: true
    },
    {
        id: 'round',
        name: 'Round Ceramic Pot',
        description: 'A beautiful round ceramic pot with smooth curves and elegant design.',
        price: 200,
        unlocked: false
    }
];

const actionTypes = {
    ADD_PLANT: 'ADD_PLANT',
    ADD_COINS: 'ADD_COINS',
    SPEND_COINS: 'SPEND_COINS',
    UPDATE_CHALLENGE: 'UPDATE_CHALLENGE',
    COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
    BUY_POT: 'BUY_POT',
    SET_ACTIVE_POT: 'SET_ACTIVE_POT',
    CHANGE_ALL_POTS: 'CHANGE_ALL_POTS'
};

function appReducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD_PLANT: {
            const plant = plantData.find(p => p.id === action.plantId);
            if (!plant) return state;

            // Check if plant is already in collection
            const plantAlreadyExists = state.collection.some(item => item.plantId === action.plantId);
            if (plantAlreadyExists) {
                return state; // Don't add duplicate plants
            }

            const newItem = {
                id: Date.now().toString(),
                plantId: action.plantId,
                potId: action.potId || state.activePotType,
                discoveredAt: new Date().toISOString()
            };

            const updatedChallenges = state.challenges.map(challenge => {
                if (!challenge.completed) {
                    const newProgress = challenge.progress + 1;
                    const isCompleted = newProgress >= challenge.target;
                    return {
                        ...challenge,
                        progress: newProgress,
                        completed: isCompleted
                    };
                }
                return challenge;
            });

            let coinsToAdd = plant.coins;
            const newlyCompletedChallenges = updatedChallenges.filter(
                (challenge, index) =>
                    challenge.completed && !state.challenges[index].completed
            );
            coinsToAdd += newlyCompletedChallenges.reduce((sum, challenge) => sum + challenge.reward, 0);

            return {
                ...state,
                collection: [...state.collection, newItem],
                coins: state.coins + coinsToAdd,
                challenges: updatedChallenges
            };
        }

        case actionTypes.ADD_COINS:
            return {
                ...state,
                coins: state.coins + action.amount
            };

        case actionTypes.SPEND_COINS:
            return {
                ...state,
                coins: Math.max(0, state.coins - action.amount)
            };

        case actionTypes.BUY_POT: {
            const pot = potData.find(p => p.id === action.potId);
            if (!pot || state.unlockedPots.includes(action.potId) || state.coins < pot.price) {
                return state;
            }

            return {
                ...state,
                coins: state.coins - pot.price,
                unlockedPots: [...state.unlockedPots, action.potId]
            };
        }

        case actionTypes.SET_ACTIVE_POT:
            return {
                ...state,
                activePotType: action.potId
            };

        case actionTypes.CHANGE_ALL_POTS:
            return {
                ...state,
                collection: state.collection.map(item => ({
                    ...item,
                    potId: action.potId
                })),
                activePotType: action.potId
            };

        default:
            return state;
    }
}

const AppStateContext = createContext();
const AppDispatchContext = createContext();

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const actions = useMemo(() => ({
        addPlantToCollection: (plantId, potId) => {
            const plant = plantData.find(p => p.id === plantId);
            if (!plant) return false;

            dispatch({
                type: actionTypes.ADD_PLANT,
                plantId,
                potId: potId || state.activePotType
            });
            return true;
        },

        addCoins: (amount) => {
            dispatch({
                type: actionTypes.ADD_COINS,
                amount
            });
        },

        spendCoins: (amount) => {
            if (state.coins >= amount) {
                dispatch({
                    type: actionTypes.SPEND_COINS,
                    amount
                });
                return true;
            }
            return false;
        },

        buyPot: (potId) => {
            const pot = potData.find(p => p.id === potId);
            if (!pot || state.unlockedPots.includes(potId) || state.coins < pot.price) {
                return false;
            }

            dispatch({
                type: actionTypes.BUY_POT,
                potId
            });
            return true;
        },

        setActivePot: (potId) => {
            if (state.unlockedPots.includes(potId)) {
                dispatch({
                    type: actionTypes.SET_ACTIVE_POT,
                    potId
                });
                return true;
            }
            return false;
        },

        changeAllPots: (potId) => {
            if (state.unlockedPots.includes(potId)) {
                dispatch({
                    type: actionTypes.CHANGE_ALL_POTS,
                    potId
                });
                return true;
            }
            return false;
        },

        getPlantData: () => plantData,
        getPotData: () => potData,

        getPlantImage: (plantId, potId) => {
            const plant = plantData.find(p => p.id === plantId);
            return plant ? plant.emoji : '🌸';
        },

        getPotImage: (potId) => {
            const potEmojis = {
                basic: '🪴',
                round: '🏺'
            };
            return potEmojis[potId] || '🪴';
        }
    }), [state]);

    const selectors = useMemo(() => ({
        activeChallenges: state.challenges.filter(c => !c.completed),
        completedChallenges: state.challenges.filter(c => c.completed).length,
        availablePots: potData.filter(pot => !state.unlockedPots.includes(pot.id)),
        canAffordPot: (potId) => {
            const pot = potData.find(p => p.id === potId);
            return pot ? state.coins >= pot.price : false;
        }
    }), [state]);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={{ actions, selectors }}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppProvider');
    }
    return context;
}

export function useAppActions() {
    const context = useContext(AppDispatchContext);
    if (!context) {
        throw new Error('useAppActions must be used within AppProvider');
    }
    return context.actions;
}

export function useAppSelectors() {
    const context = useContext(AppDispatchContext);
    if (!context) {
        throw new Error('useAppSelectors must be used within AppProvider');
    }
    return context.selectors;
}

export function useAppContext() {
    const state = useAppState();
    const { actions } = useAppActions();

    return {
        ...state,
        ...actions
    };
}