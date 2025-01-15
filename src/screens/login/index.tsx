import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    Card,
    Snackbar,
    ActivityIndicator,
} from 'react-native-paper';
import Metrics from '../../../theme/metrics/screen';
import { useNavigation } from '@react-navigation/native';
import { useAddFCMMutation, useLoginMutation } from '../../redux/services/auth/login/LoginApiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initializeMessaging from '../../common/utils/helper/notification/FCM';
import { setUser } from '../../redux/slices/user';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { useLazyGetUserDetailsQuery } from '../../redux/services/user/userApiSlice';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('');
    const [getUserDetails, { isFetching: isFetchingUser, data: userData, isError: isUserError }] = useLazyGetUserDetailsQuery();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [addFCMToken, addFCMTokenResult] = useAddFCMMutation();

    const registerFCMServices = async () => {
        try {
            const { permissionGranted, token, error } = await initializeMessaging();
            if (token) {
                console.log('fcmToken', token);
                await addFCMToken({ fcmTokens: token });
            }
        } catch (error) {
            console.error('An error occurred while registering FCM services:', error);
        }
    };

    const handleLogin = async () => {
        if (!loginId || !password) {
            setSnackbarMessage('Please fill in both fields');
            setSnackbarType('error');
            setVisible(true);
            return;
        }
    
        try {
            const payload = { loginId, password };
            const response = await login(payload).unwrap();
    
            // Handle FCM registration
            try {
                await registerFCMServices();
            } catch (fcmError) {
                console.error('Failed to register FCM token:', fcmError);
            }
    
            const fetchUserDetails = async () => {
                try {
                    const response = await getUserDetails().unwrap();
                    if (response?.data) {
                        const user = response.data;
                        // Dispatch user details to the Redux store
                        dispatch(setUser(user));
    
                        // Handle user profile image, and any other user data you might need
                        if (user.photo) {
                            // Optional: You can set this to display the user's profile image in the app
                            console.log('User profile image:', user.photo);
                        }
                    }
                } catch (error) {
                    const errorMessage =
                        error?.data?.message ||
                        'Failed to fetch user details. Please try again.';
                    setSnackbarMessage(errorMessage);
                    setSnackbarType('error');
                    setVisible(true);
                    console.error('Error fetching user details:', error);
                }
            };
    
            await fetchUserDetails();
    
            // Store the credentials locally
            await AsyncStorage.setItem('userCredentials', JSON.stringify(payload));
    
            setSnackbarMessage('Login successful!');
            setSnackbarType('success');
            setVisible(true);
    
            // Navigate to the home screen
            navigation.replace('HomeScreen');
        } catch (error) {
            const errorMessage = error?.data?.message || 'Login failed. Please try again.';
            console.log('Login error:', errorMessage);
    
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
            setVisible(true);
        }
    };
    

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Use 'padding' for iOS and default for Android
        >
            <ScrollView
                contentContainerStyle={styles.scrollView}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/login_image.jpeg')}
                            style={styles.logo}
                            resizeMode="cover"
                        />
                    </View>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.title}>Login</Text>
                            <TextInput
                                label="Login ID"
                                mode="outlined"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={loginId}
                                onChangeText={setLoginId}
                            />
                            <TextInput
                                label="Password"
                                mode="outlined"
                                style={styles.input}
                                secureTextEntry={false}
                                value={password}
                                onChangeText={setPassword}
                            />

                            {isLoading ? (
                                <ActivityIndicator animating={true} color="#00796b" />
                            ) : (
                                <Button
                                    mode="contained"
                                    style={styles.button}
                                    onPress={handleLogin}
                                >
                                    Login
                                </Button>
                            )}

                            <Button
                                mode="text"
                                style={styles.registerButton}
                                onPress={() => navigation.navigate('Register')}
                            >
                                New Registration
                            </Button>
                        </Card.Content>
                    </Card>

                    <Snackbar
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        duration={3000}
                        style={snackbarType === 'error' ? styles.errorSnackbar : styles.successSnackbar}
                    >
                        {snackbarMessage}
                    </Snackbar>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        height: Metrics.screenWidth * 0.8,
        justifyContent: 'center',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        overflow: 'hidden',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    card: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#b0bec5',
        top: '-5%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#00796b',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginBottom: 8,
        backgroundColor: '#00796b',
    },
    registerButton: {
        marginTop: 16,
        color: '#00796b',
    },
    errorSnackbar: {
        backgroundColor: '#d32f2f',
    },
    successSnackbar: {
        backgroundColor: '#388e3c',
    },
});

export default LoginScreen;
