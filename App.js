// =============================================================================
// App.js - Hoofdnavigatie setup voor Flora Trove
// =============================================================================
// Dit bestand definieert de navigatiestructuur van de app met React Navigation.
// Alle schermen worden hier geregistreerd en de globale state provider wordt ingesteld.

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

// Globale state provider voor coins, collectie, uitdagingen
import { AppProvider } from './context/AppContext';

// Import alle app schermen
import CameraScreen from './screens/CameraScreen'; // Plant foto herkenning
import ChallengesScreen from './screens/ChallengesScreen'; // Uitdagingen overzicht
import CollectionScreen from './screens/CollectionScreen'; // Verzamelde planten
import HomeScreen from './screens/HomeScreen'; // Startscherm
import PlantDetailScreen from './screens/PlantDetailScreen'; // Plant details
import ShopScreen from './screens/ShopScreen'; // Pot winkel

const Stack = createStackNavigator();

export default function App() {
    return (
        // AppProvider zorgt ervoor dat alle schermen toegang hebben tot globale state
        <AppProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,              // Elk scherm heeft eigen header
                        cardStyle: { backgroundColor: '#f8f5f0' }, // Consistente achtergrond
                        gestureEnabled: true,            // Swipe navigation
                        gestureDirection: 'horizontal',
                    }}
                >
                    {/* Startscherm - toont uitdagingen en navigatie */}
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: 'Flora Trove',
                            headerShown: false
                        }}
                    />

                    {/* Collectie - toont verzamelde planten op planken */}
                    <Stack.Screen
                        name="Collection"
                        component={CollectionScreen}
                        options={{
                            title: 'Your Collection',
                            headerShown: false
                        }}
                    />

                    {/* Uitdagingen - voortgang en beloningen */}
                    <Stack.Screen
                        name="Challenges"
                        component={ChallengesScreen}
                        options={{
                            title: 'Challenges',
                            headerShown: false
                        }}
                    />

                    {/* Camera - plantenherkenning via PlantNet API */}
                    <Stack.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            title: 'Take Picture',
                            headerShown: false
                        }}
                    />

                    {/* Winkel - koop nieuwe potten met coins */}
                    <Stack.Screen
                        name="Shop"
                        component={ShopScreen}
                        options={{
                            title: 'Buy New Pots',
                            headerShown: false
                        }}
                    />

                    {/* Plant detail - uitgebreide info over specifieke plant */}
                    <Stack.Screen
                        name="PlantDetail"
                        component={PlantDetailScreen}
                        options={{
                            title: 'Plant Details',
                            headerShown: false
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    );
}