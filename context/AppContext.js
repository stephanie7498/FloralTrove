// =============================================================================
// context/AppContext.js - Globale state management
// =============================================================================
// Dit bestand beheert alle app-brede state: coins, collectie, uitdagingen, potten.
// Gebruikt React's useReducer voor complexe state updates en Context API voor toegang.

import React, { createContext, useContext, useMemo, useReducer } from 'react';

// =============================================================================
// INITIËLE STATE EN DATA DEFINITIES
// =============================================================================

// Startwaarden bij eerste gebruik van de app
const initialState = {
    coins: 100,                    // Startkapitaal voor gebruiker
    collection: [],                // Array van verzamelde planten (leeg bij start)
    challenges: [                  // Voorgedefinieerde uitdagingen met voortgang
        {
            id: 1,
            title: "First Discovery",
            target: 1,             // Doel: 1 plant vinden
            progress: 0,           // Huidige voortgang
            reward: 50,            // Beloning in coins
            completed: false
        },
        {
            id: 2,
            title: "Flower Enthusiast",
            target: 2,
            progress: 0,
            reward: 75,
            completed: false
        },
        {
            id: 3,
            title: "Garden Explorer",
            target: 3,
            progress: 0,
            reward: 150,
            completed: false
        },
        {
            id: 4,
            title: "Master Collector",
            target: 4,             // Alle 4 ondersteunde bloemen
            progress: 0,
            reward: 300,           // Grootste beloning
            completed: false
        }
    ],
    unlockedPots: ['basic'],       // Beschikbare pot types (basic is altijd gratis)
    activePotType: 'basic'         // Huidige actieve pot voor nieuwe planten
};

// Ondersteunde planten data - moet overeenkomen met PlantNet API mapping
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
        id: 'gele_ganzenbloem',
        name: 'Yellow Daisy',
        description: 'A bright yellow flower that brings sunshine to any garden. These cheerful blooms are perfect for attracting pollinators.',
        rarity: 'common',
        coins: 55,
        emoji: '🌻'
    }
];

// Pot types die gekocht kunnen worden in de winkel
const potData = [
    {
        id: 'basic',
        name: 'Basic Clay Pot',
        description: 'A simple terracotta pot perfect for starting your collection.',
        price: 0,              // Gratis pot
        unlocked: true
    },
    {
        id: 'round',
        name: 'Round Ceramic Pot',
        description: 'A beautiful round ceramic pot with smooth curves and elegant design.',
        price: 200,            // Kost 200 coins
        unlocked: false
    }
];

// =============================================================================
// STATE MANAGEMENT SETUP
// =============================================================================

// Action types voor reducer
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

// Hoofdreducer functie - beheert alle state updates
function appReducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD_PLANT: {
            const plant = plantData.find(p => p.id === action.plantId);
            if (!plant) return state;

            // Voorkom duplicaten in collectie
            const plantAlreadyExists = state.collection.some(item => item.plantId === action.plantId);
            if (plantAlreadyExists) {
                return state;
            }

            // Maak nieuw collectie item met timestamp
            const newItem = {
                id: Date.now().toString(),
                plantId: action.plantId,
                potId: action.potId || state.activePotType,
                discoveredAt: new Date().toISOString()
            };

            // Update uitdagingen voortgang
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

            // Bereken totale coins: plant waarde + voltooide uitdaging beloningen
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
            // Controleer geldigheid: pot bestaat, niet al gekocht, genoeg coins
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
            // Update alle planten in collectie naar nieuwe pot
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

// =============================================================================
// CONTEXT PROVIDERS EN HOOKS
// =============================================================================

const AppStateContext = createContext();
const AppDispatchContext = createContext();

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Action creators - functies voor state updates
    const actions = useMemo(() => ({
        // Voeg plant toe aan collectie
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

        // Coin management
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

        // Pot management
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

        // Helper functies voor data toegang
        getPlantData: () => plantData,
        getPotData: () => potData,

        // Image helpers (fallback emojis)
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

    // Selector functies voor derived state
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

// Custom hooks voor context toegang
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

// Legacy hook voor backwards compatibility
export function useAppContext() {
    const state = useAppState();
    const { actions } = useAppActions();

    return {
        ...state,
        ...actions
    };
}