import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Alert, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Header from './header';

const WebViewScreen = ({route}) => {
  const [webViewUrl, setWebViewUrl] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const webViewRef = useRef(null);
  const homeUrl = webViewUrl; // This will represent the home URL for comparison

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const userCredentials = await AsyncStorage.getItem('userCredentials');

        if (userCredentials) {
          const {loginId, password} = JSON.parse(userCredentials);

          // If route.params.url exists, use it; otherwise, default to the URL with credentials
          const routeUrl = route?.params?.url;
          const url = routeUrl
            ? routeUrl
            : `https://ekstasis.net/Home/AppCall/?username=${loginId}&password=${password}`;
          setWebViewUrl(url);
        }
      } catch (error) {
        console.error('Failed to load credentials from AsyncStorage:', error);
      }
    };

    fetchCredentials();
  }, [route?.params?.url]); // Add route.params.url as a dependency

  // Custom back action handler
  const handleBackButtonPress = () => {
    if (
      canGoBack &&
      currentUrl !== 'https://ekstasis.net/Leader/Leader/Dashboard'
    ) {
      webViewRef.current.goBack();
      return true; // Prevent default back action
    } else {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true; // Prevent default back action to show the alert
    }
  };

  // Use focus effect to attach/detach the BackHandler only when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );

      return () => backHandler.remove();
    }, [canGoBack, currentUrl, homeUrl]), // Dependencies include the state values
  );

  // Handle WebView navigation state changes
  const handleNavigationStateChange = navState => {
    setCanGoBack(navState.canGoBack); // Tracks if we can go back
    setCurrentUrl(navState.url); // Track the current URL for comparison
  };
console.log('webViewUrl',webViewUrl)
  return (
    <View style={{flex: 1}}>
      <Header />
      <WebView
      ref={webViewRef}
      source={{uri: webViewUrl}}
      onNavigationStateChange={handleNavigationStateChange}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('WebView error: ', JSON.stringify(nativeEvent));
        if (nativeEvent.description === 'net::ERR_CONNECTION_RESET') {
          Alert.alert(
            'Connection Reset',
            'The connection was reset. please retry or check your internet connection.',
            [
              { text: 'Retry', onPress: () => webViewRef.current?.reload() },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert('Error', 'Failed to load page. Please check your internet connection or try again later.');
        }
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('HTTP error: ', JSON.stringify(nativeEvent));
      }}










      />
    </View>
  );
};

export default WebViewScreen;
