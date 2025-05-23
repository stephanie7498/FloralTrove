import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { AppProvider } from './context/AppContext';
import CameraScreen from './screens/CameraScreen';
import CollectionScreen from './screens/CollectionScreen';
import HomeScreen from './screens/HomeScreen';
import PlantDetailScreen from './screens/PlantDetailScreen';
import ShopScreen from './screens/ShopScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: '#f8f5f0' },
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: 'Flora Trove',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Collection"
                        component={CollectionScreen}
                        options={{
                            title: 'Your Collection',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            title: 'Take Picture',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Shop"
                        component={ShopScreen}
                        options={{
                            title: 'Buy New Pots',
                            headerShown: false
                        }}
                    />
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