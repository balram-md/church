import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './permissions';

class FCMError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'FCMError';
  }
}

const registerAppWithFCM = async () => {
  try {
    requestUserPermission()
    await messaging().registerDeviceForRemoteMessages();
  } catch (error) {
    console.error('Error registering app with FCM:', error);
    throw new FCMError('Error registering app with FCM');
  }
};

const getToken = async () => {
  try {
    let token = null;
    if (messaging().isDeviceRegisteredForRemoteMessages) {
      token = await messaging().getToken();
    }
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw new FCMError('Error getting FCM token');
  }
};

export {registerAppWithFCM, getToken, FCMError};
