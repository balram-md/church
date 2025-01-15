/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {processNotification} from './src/common/utils/helper/notification/notificationHandler';
import notifee, {AndroidColor, EventType} from '@notifee/react-native';

// Function to handle background notifications
const handleBackgroundNotification = async notification => {
  console.log('Step 1: Entered handleBackgroundNotification', notification);

  try {
    await processNotification(notification);
    console.log('Step 2: Processed notification successfully.');
  } catch (error) {
    console.error('Error processing notification:', error);
  }
};
// Handle background/terminated notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  await handleBackgroundNotification(remoteMessage);
});

// Handle foreground notifications
messaging().onMessage(async remoteMessage => {
  console.log('Foreground message received:', remoteMessage);
  // Process the notification
  await processNotification(remoteMessage);
});

// Handle notifications when app is opened from a killed state
messaging()
  .getInitialNotification()
  .then(async remoteMessage => {
    if (remoteMessage) {
      console.log(
        'App opened from killed state with notification:',
        remoteMessage,
      );
      await processNotification(remoteMessage);
      // Navigate to the appropriate screen if needed
      // Example: Navigation to a specific screen (ensure you use the correct navigation setup)
      // navigation.navigate(remoteMessage.data.screen || 'DefaultScreen');
    }
  });

// Handle notifications when app is opened from the background
messaging().onNotificationOpenedApp(async remoteMessage => {
  console.log('Notification opened the app from background:', remoteMessage);
  await processNotification(remoteMessage);
  // Navigate to the appropriate screen if needed
  // Example: Navigation to a specific screen (ensure you use the correct navigation setup)
  // navigation.navigate(remoteMessage.data.screen || 'DefaultScreen');
});

AppRegistry.registerComponent(appName, () => App);
