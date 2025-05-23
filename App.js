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
                        headerStyle: {
                            backgroundColor: '#4a7c4a',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Floral Trove' }}
                    />
                    <Stack.Screen
                        name="Collection"
                        component={CollectionScreen}
                        options={{ title: 'Your Collection' }}
                    />
                    <Stack.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{ title: 'Take Picture' }}
                    />
                    <Stack.Screen
                        name="Shop"
                        component={ShopScreen}
                        options={{ title: 'Buy New Pots' }}
                    />
                    <Stack.Screen
                        name="PlantDetail"
                        component={PlantDetailScreen}
                        options={{ title: 'Plant Details' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    );
}