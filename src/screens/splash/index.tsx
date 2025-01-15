import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLoginMutation} from '../../redux/services/auth/login/LoginApiSlice';
import {ActivityIndicator, Snackbar} from 'react-native-paper';
import {useLazyGetUserDetailsQuery} from '../../redux/services/user/userApiSlice';
import {useAppDispatch} from '../../redux/hooks/hooks';
import {setUser} from '../../redux/slices/user';

const ChurchSplashScreen = ({navigation}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity
  const [
    login,
    {isLoading: isLoggingIn, isSuccess: isLoginSuccess, isError: isLoginError},
  ] = useLoginMutation();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [
    getUserDetails,
    {isFetching: isFetchingUser, data: userData, isError: isUserError},
  ] = useLazyGetUserDetailsQuery();
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Fade-in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds for the animation
      useNativeDriver: true,
    }).start();

    const checkCredentials = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('userCredentials');
        if (storedCredentials) {
          setCredentials(JSON.parse(storedCredentials));
        } else {
          navigation.replace('Login'); // Navigate to login if no credentials are found
        }
      } catch (error) {
        console.error('Error retrieving credentials:', error);
        navigation.replace('Login'); // Navigate to login on error
      }
    };

    checkCredentials();
  }, [fadeAnim, navigation]);

  useEffect(() => {
    if (credentials) {
      const performLogin = async () => {
        try {
          await login(credentials).unwrap();
          // Proceed to fetch user details after login
          const fetchUserDetails = async () => {
            try {
              const response = await getUserDetails().unwrap();
              if (response?.data) {
                dispatch(setUser(response.data));
              }
              // Navigate to home after successfully fetching user details
              navigation.replace('HomeScreen');
            } catch (error) {
              const errorMessage =
                error?.data?.message ||
                'Failed to fetch user details. Please try again.';
              setSnackbarMessage(errorMessage);
              setVisible(true);
              console.error('Error fetching user details:', error);
              // Optionally, navigate to login if user details fetch fails
              navigation.replace('Login');
            }
          };

          fetchUserDetails();
        } catch (error) {
          const errorMessage =
            error?.data?.message || 'Login failed. Please try again.';
          setSnackbarMessage(errorMessage);
          setVisible(true);
          console.error('Error during login:', error);
          navigation.replace('Login'); // Navigate to login on failure
        }
      };

      performLogin();
    }
  }, [credentials, login, getUserDetails, navigation]);

  return (
    <LinearGradient colors={['#e0f7fa', '#ffffff']} style={styles.container}>
      <Animated.View style={{...styles.logoContainer, opacity: fadeAnim}}>
        <Image
          source={require('../../assets/images/church.png')} // Make sure to put the correct path for your image asset
          style={styles.logo}
        />
        <Text style={styles.title}>Church Connect</Text>
        <Text style={styles.subtitle}>Connecting with Faith</Text>
        {isLoggingIn && <ActivityIndicator animating={true} color="#00796b" />}
      </Animated.View>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={styles.errorSnackbar}>
        {snackbarMessage}
      </Snackbar>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'PlayfairDisplay-Regular', // Include a custom font if needed
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontFamily: 'Merriweather-Regular',
  },
  errorSnackbar: {
    backgroundColor: '#d32f2f', // Red for error
  },
});

export default ChurchSplashScreen;
