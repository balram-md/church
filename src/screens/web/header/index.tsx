import React, {useEffect, useState, useCallback} from 'react';
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import {
  useNavigation,
  useTheme,
  useFocusEffect,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStyles from './useStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import useHeader from './useHeader';

import greetUser from './greeting';
import { baseApi } from '../../../redux/services/BaseApiSlice';
import { REACT_APP_BASE_URL } from '@env';
import { useGetCountQuery } from '../../../redux/services/notification/notificationApiSlice';
import { useAppSelector } from '../../../redux/hooks/hooks';

const images = {
  sunny: require('../../../assets/images/webView/sunny.webp'),
  cloudy: require('../../../assets/images/webView/cloudy.jpg'),
  rainy: require('../../../assets/images/webView/rainy.jpg'),
  scatterd: require('../../../assets/images/webView/scattered-cloud.jpg'),
  snowy: require('../../../assets/images/webView/cloudy.jpg'),
  defaultBackground: require('../../../assets/images/webView/cloudy.jpg'),
};

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();
  const {role,id}=useAppSelector((state)=>state.user)
  const theme = useTheme();
  const {userDetails} = useHeader();
  const {message} = greetUser();
  const navigation = useNavigation();
  // State for controlling logout modal visibility
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const {data:ntfCount}=useGetCountQuery({uType:role,id});
  console.log('ntfCount',ntfCount)
  const handleLogout = async () => {
    // Hide the modal and proceed with logout
    setLogoutModalVisible(false);
    baseApi.util.resetApiState();
    await AsyncStorage.clear();
    navigation.replace('Login');
  };
  const [weather, setWeather] = useState<any>(null);
  const [backgroundImage, setBackgroundImage] = useState(
    images.defaultBackground,
  );
  const [notificationCount, setNotificationCount] = useState(0);
  // Handle showing the modal
  const showLogoutConfirmation = () => {
    setLogoutModalVisible(true);
  };
  const fetchWeather = async (location: string) => {
    const API_KEY = '3192dfcf1643de07950bd30f3f729e36';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    try {
      const response = await fetch(
        `${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather:', error); // Log weather fetch error
    }
  };

  const getBackgroundImage = (weather: any) => {
    if (!weather || !weather.weather || weather.weather.length === 0) {
      return images.defaultBackground;
    }
    const weatherCondition = weather.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case 'clear':
        return images.sunny;
      case 'clouds':
        return images.cloudy;
      case 'rain':
        return images.rainy;
      case 'snow':
        return images.snowy;
      default:
        return images.defaultBackground;
    }
  };

  const fetchNotificationCount = async () => {
    const TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';
    const employee = userDetails?.id;

    if (!employee) {
      console.error('EmployeeId is missing.');
      return;
    }

    let API_URL = REACT_APP_BASE_URL;
    if (userDetails?.role === 'Leader') {
      API_URL = `${REACT_APP_BASE_URL}/api/Count`;
    } else if (userDetails?.role === 'Individual') {
      API_URL = `${REACT_APP_BASE_URL}/api/CountNotification`;
    }

    if (!API_URL) {
      console.error('Role not recognized or API URL is missing.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        console.log('notification Data',data)
        setNotificationCount(data.count);
      } else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching notification count:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      // fetchNotificationCount();
    }, []),
  );

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeather('pune'); // Replace with the desired location
      setWeather(data);
      setBackgroundImage(getBackgroundImage(data));
    };

    getWeather();
    // fetchNotificationCount(); // Fetch notification count on component mount
  }, []);

  return (
    <ImageBackground
      blurRadius={7}
      style={styles.headerImageBackgroundView}
      imageStyle={styles.headerImage}
      source={backgroundImage}>
      <View style={styles.parentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.rowLeftContainer}>
            <View style={styles.userGreetContainer}>
              <Text style={styles.greetText}>{message}</Text>
              <Text style={styles.usernameText}>
                {userDetails.employeeName ? userDetails?.employeeName : 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.rowRightContainer}>
            <TouchableOpacity
              onPress={showLogoutConfirmation}
              style={styles.logoutButton}>
              <Icon name="sign-out" size={26} color="#fff" />
            </TouchableOpacity>
    
        </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.weatherContainer}>
            {weather ? (
              <View>
                <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
                <Text style={styles.weatherText}>
                  {weather.weather[0].description}
                </Text>
              </View>
            ) : (
              <Text style={styles.loadingText}>Loading...</Text>
            )}
          </View>

          <View style={styles.bellIconContainer}>
            <Icon
              name="bell"
              size={22}
              color={'#ffffff'}
              onPress={() =>
                navigation.navigate("notifications")
              }
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{ntfCount?ntfCount?.data:0}</Text>
            </View>
          </View>
        </View>
         {/* Logout Confirmation Modal */}
         <Modal
          animationType="fade"
          transparent={true}
          visible={isLogoutModalVisible}
          onRequestClose={() => setLogoutModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Logout</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setLogoutModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogout}>
                  <Text style={styles.modalButtonText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};


export default Header;
