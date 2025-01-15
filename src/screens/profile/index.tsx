import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useAppSelector } from '../../redux/hooks/hooks';

const UserProfile = ({ navigation }) => {
  const user = useAppSelector((state) => state.user);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('EditProfile')}>
              <IconButton
                icon="pencil"
                iconColor="#fff"
                size={24}
                onPress={() => navigation.navigate('EditProfile')}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.employeeName}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Personal Information" titleStyle={styles.cardTitle} />
          <Card.Content>
            {user.emailID && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user.emailID}</Text>
              </View>
            )}
            {user.mobileNo && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mobile:</Text>
                <Text style={styles.infoValue}>{user.mobileNo}</Text>
              </View>
            )}
            {user.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>{user.address}</Text>
              </View>
            )}
            {user.birthDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date of Birth:</Text>
                <Text style={styles.infoValue}>{formatDate(user.birthDate)}</Text>
              </View>
            )}
            {user.joiningDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Joining Date:</Text>
                <Text style={styles.infoValue}>{formatDate(user.joiningDate)}</Text>
              </View>
            )}
            {user.churchName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Church:</Text>
                <Text style={styles.infoValue}>{user.churchName}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  scrollView: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 50,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  userRole: {
    fontSize: 20,
    color: '#666',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#444',
  },
  infoValue: {
    color: '#555',
    fontSize: 16,
  },
});

export default UserProfile;
