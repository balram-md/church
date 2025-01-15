import notifee, {
  AndroidImportance,
  AndroidStyle,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

// Define the notification data type
type NotificationData = {
  type: string;
  title: string;
  body: string;
  triggerTime?: number;
  [key: string]: any; // Additional properties that may vary by notification type
};

// Function to handle unknown notifications
const handleUnknownNotification = async (data: NotificationData) => {
  console.log('Handling unknown notification type:', data);

  await notifee.displayNotification({
    title: data.title || 'Unknown Notification',
    body: data.body || 'No additional information provided.',
    android: {
      channelId: 'default',
      sound: 'default',
      importance: AndroidImportance.DEFAULT,
      style: {
        type: AndroidStyle.BIGTEXT,
        text: data.body || 'Unknown notification received.',
      },
    },
  });
};

// Main function to handle incoming notifications based on type
const handleNotification = async (data: NotificationData) => {
  handleUnknownNotification(data);
};

// This function is exported to be used when a notification is received
const processNotification = async (message: any) => {
  console.log('Processing notification:', message);
  const data = message.data as NotificationData;

  await handleNotification(data);
};

export {processNotification};
