import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { isAndroid, isIos } from '../../common/utils/helper/notification/config';


class PermissionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PermissionError';
  }
}
const requestUserPermission = async (): Promise<void> => {
  try {
    if (isAndroid) {
      await requestAndroidPermission();
    } else if (isIos) {
      await requestIOSPermission();
    }

    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
    throw new PermissionError('Error requesting permission');
  }
};


const requestAndroidPermission = async (): Promise<void> => {
  try {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log('androidPermissionResult',result)
    // if (result !== RESULTS.GRANTED) {
    //   Alert.alert(
    //     'Permission Denied',
    //     'You need to grant notification permission for this app to function properly.',
    //   );
    //   throw new PermissionError('Permission denied');
    // }
  } catch (error) {
    console.error('Error requesting Android permission:', error);
    throw new PermissionError('Error requesting Android permission');
  }
};

const requestIOSPermission = async (): Promise<void> => {
  try {
    const result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
    if (result !== RESULTS.GRANTED) {
      Alert.alert(
        'Permission Denied',
        'You need to grant notification permission for this app to function properly.',
      );
      throw new PermissionError('Permission denied');
    }
  } catch (error) {
    console.error('Error requesting iOS permission:', error);
    throw new PermissionError('Error requesting iOS permission');
  }
};

const checkPermission = async (): Promise<boolean> => {
  try {
    const permission = isAndroid
      ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
      : PERMISSIONS.IOS.REMINDERS;

    const result = await check(permission);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

const createNotificationChannel = (): void => {
  // Create notification channels here for Android
  // This is Android specific. It can be customized according to your app's needs
};

export {
  requestUserPermission,
  checkPermission,
  createNotificationChannel,
  PermissionError,
};
