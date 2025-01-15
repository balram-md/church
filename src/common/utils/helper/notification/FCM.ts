import messaging from '@react-native-firebase/messaging';
import {
  FCMError,
  registerAppWithFCM,
} from '../../../../redux/firebase/FCMService';
import {
  PermissionError,
  requestUserPermission,
  checkPermission,
} from '../../../../redux/firebase/permissions';

const handleFirebaseMessage = async (message: any) => {
  // Process the received message
  console.log('Received Firebase message:', message);
};

type ErrorType = FCMError | PermissionError | Error;

const initializeMessaging = async (): Promise<{
  permissionGranted: boolean;
  token: string | null;
  error: ErrorType | null;
}> => {
  try {
    await registerAppWithFCM();
    await requestUserPermission();
    const permissionStatus = await checkPermission();
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const deviceToken = await messaging().getToken();
    return {
      permissionGranted: permissionStatus,
      token: deviceToken,
      error: null,
    };
  } catch (error: any) {
    const errorType =
      error instanceof PermissionError
        ? error
        : error instanceof FCMError
        ? error
        : new Error('Unknown error');
    return {
      permissionGranted: false,
      token: '',
      error: errorType,
    };
  }
};

export default initializeMessaging;

export {handleFirebaseMessage, initializeMessaging};
