import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './HomeScreen';
import MobileVerificationScreen from './MobileVerificationScreen';
// import SplashScreen from './SplashScreen';

// Create a native stack navigator
const Stack = createNativeStackNavigator();

// Define the MainNavigation component
function MainNavigation() {
    // Return the JSX for the main navigation
    return (
        // Create a navigation container
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="MobileVerificationScreen" component={MobileVerificationScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Export the MainNavigation component as the default export
export default MainNavigation;