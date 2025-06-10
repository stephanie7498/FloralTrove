import React, { createContext, useContext, useMemo, useReducer } from 'react';

// Initial state
const initialState = {
    coins: 100, // Starting coins
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
    unlockedPots: ['basic'], // Start with basic pot
    activePotType: 'basic'
};

// Plant data
const plantData = [
    {
        id: 'lily_valley',
        name: 'Lily of the Valley',
        description: 'A delicate spring flower with bell-shaped white blooms and a sweet fragrance.',
        rarity: 'uncommon',
        coins: 75,
        emoji: '🔔'
    },
    {
        id: 'rose',
        name: 'Rose',
        description: 'The classic symbol of love and beauty, with layered petals and thorny stems.',
        rarity: 'common',
        coins: 50,
        emoji: '🌹'
    },
    {
        id: 'daisy',
        name: 'Daisy',
        description: 'A cheerful white flower with a bright yellow center, symbolizing innocence.',
        rarity: 'common',
        coins: 40,
        emoji: '🌼'
    },
    {
        id: 'sunflower',
        name: 'Sunflower',
        description: 'A tall, bright yellow flower that follows the sun across the sky.',
        rarity: 'uncommon',
        coins: 80,
        emoji: '🌻'
    },
    {
        id: 'tulip',
        name: 'Tulip',
        description: 'An elegant spring bulb flower with cup-shaped blooms in many colors.',
        rarity: 'rare',
        coins: 120,
        emoji: '🌷'
    }
];

// Pot data
const potData = [
    {
        id: 'basic',
        name: 'Basic Clay Pot',
        description: 'A simple terracotta pot perfect for starting your collection.',
        price: 0,
        unlocked: true
    },
    {
        id: 'decorative',
        name: 'Decorative Ceramic Pot',
        description: 'A beautiful glazed ceramic pot with elegant patterns.',
        price: 200,
        unlocked: false
    },
    {
        id: 'premium',
        name: 'Premium Garden Pot',
        description: 'A high-quality pot with drainage holes and decorative rim.',
        price: 500,
        unlocked: false
    },
    {
        id: 'deluxe',
        name: 'Deluxe Designer Pot',
        description: 'An exclusive designer pot with gold accents and perfect craftsmanship.',
        price: 1000,
        unlocked: false
    }
];

// Action types
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

// Reducer
function appReducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD_PLANT: {
            const plant = plantData.find(p => p.id === action.plantId);
            if (!plant) return state;

            const newItem = {
                id: Date.now().toString(),
                plantId: action.plantId,
                potId: action.potId || state.activePotType,
                discoveredAt: new Date().toISOString()
            };

            // Update challenges
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

            // Calculate coins to add (plant coins + completed challenge rewards)
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

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider component
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Actions
    const actions = useMemo(() => ({
        addPlantToCollection: (plantId, potId) => {
            // Check if plant exists
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
            // Return pot emoji based on pot type
            const potEmojis = {
                basic: '🪴',
                decorative: '🏺',
                premium: '🏺',
                deluxe: '🏆'
            };
            return potEmojis[potId] || '🪴';
        }
    }), [state]);

    // Selectors
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

// Hooks
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

// Combined hook for backward compatibility
export function useAppContext() {
    const state = useAppState();
    const { actions } = useAppActions();

    return {
        ...state,
        ...actions
    };
}