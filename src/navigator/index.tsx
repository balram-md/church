// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChurchSplashScreen from '../screens/splash';
import LoginScreen from '../screens/login';
import RegistrationForm from '../screens/Registration';

import BottomTabNavigator from '../screens/home';
import UserProfile from '../screens/profile';
import EditProfile from '../screens/profile/editProfile';
import NotificationList from '../screens/notification';

function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
    console.log('RootNavigator');
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='LoginScreen'>
                <Stack.Screen name="Splash" component={ChurchSplashScreen} />
                <Stack.Screen name='Login' component={LoginScreen}/>
                <Stack.Screen name='Register' component={RegistrationForm}/>
                <Stack.Screen name='HomeScreen' component={BottomTabNavigator}/>
                <Stack.Screen name='Profile' component={UserProfile}/>
                <Stack.Screen name='EditProfile' component={EditProfile}/>
                <Stack.Screen name='notifications' component={NotificationList}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigator;