import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from '../../redux/services/notification/notificationApiSlice';
import { useAppSelector } from '../../redux/hooks/hooks';
import { useNavigation } from '@react-navigation/native';

const NotificationList = () => {
  const { id, role } = useAppSelector((state) => state.user);
  const navigation=useNavigation();
  const { data: notificationsList } = useGetAllNotificationsQuery({ uType: role, id: id });
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
console.log(notificationsList)
  const handleStatusChange = async (notificationId, currentStatus,screenUrl) => {
    try {
      await updateNotificationStatus({
        notificationId,
        read: !currentStatus,
      });
      if(screenUrl){
        navigation.navigate('HomeScreen', {
            screen: 'Home', // The screen name inside the BottomTabNavigator
            params: { url: screenUrl }, // Optional: pass parameters to the WebViewScreen
        });
      }
    
    
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const renderNotificationItem = ({ item }) => {
    const notificationDate = new Date(item.createdAt * 1000);
    const formattedDate = notificationDate.toLocaleDateString();
    const formattedTime = notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { backgroundColor: item.read ? '#f9f9f9' : '#eaf3ff' },
        ]}
        onPress={() => handleStatusChange(item.notificationId, item.read,item?.screenName)}
      >
        <View style={styles.notificationHeader}>
          <Text style={[styles.title, item.read ? styles.read : styles.unread]}>{item.title}</Text>
          {!item.read && <View style={styles.unreadBadge} />}
        </View>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.date}>
          {formattedDate} - {formattedTime}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {notificationsList?.data?.length > 0 ? (
        <FlatList
          data={notificationsList.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
        />
      ) : (
        <Text style={styles.noNotifications}>No notifications available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff3b30',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  unread: {
    color: '#333',
  },
  read: {
    color: '#aaa',
  },
  body: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginTop: 20,
  },
});

export default NotificationList;
