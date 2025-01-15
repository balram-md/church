import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Button,
  Platform,
} from 'react-native';
import {useAppSelector, useAppDispatch} from '../../../redux/hooks/hooks';
import {setUser} from '../../../redux/slices/user';
import {useUpdateUserDetailsMutation} from '../../../redux/services/user/userApiSlice';
import DatePicker from 'react-native-date-picker';
import * as ImagePicker from 'react-native-image-picker';
import {Snackbar,Text} from 'react-native-paper';

const EditProfile = ({navigation}) => {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateUserDetailsMutation();

  // Local state for form fields
  const [formData, setFormData] = useState({
    photo: user.photo,
    employeeName: user.employeeName,
    emailID: user.emailID,
    mobileNo: user.mobileNo,
    address: user.address,
    birthDate: user.birthDate || '',
    joiningDate: user.joiningDate || '',
    churchName: user.churchName,
  });

  // State for DatePicker and ImagePicker
  const [openBirthDatePicker, setOpenBirthDatePicker] = useState(false);
  const [openJoiningDatePicker, setOpenJoiningDatePicker] = useState(false);

  // State for loading, error, and Snackbar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = async () => {
    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.employeeName);
    formDataToSend.append('mobile', formData.mobileNo);
    formDataToSend.append('email', formData.emailID);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('dob', formData.birthDate);
    formDataToSend.append('type', user.role); // Assuming 'type' is static for this case

    if (formData.photo) {
      formDataToSend.append('file', {
        uri: formData.photo,
        type: 'image/jpeg', // or the correct MIME type
        name: 'profile.jpg', // or the correct file name
      });
    }

    setLoading(true);
    try {
      await updateProfile(formDataToSend).unwrap();
      dispatch(setUser(formData)); // Update Redux store
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarVisible(true);
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Something went wrong!');
      setSnackbarMessage('Failed to update profile. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.assets) {
        setFormData(prev => ({
          ...prev,
          photo: response.assets[0].uri,
        }));
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <Image source={{uri: formData.photo}} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleImagePicker}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input]}
            placeholder="Name"
            value={formData.employeeName}
            onChangeText={text => handleInputChange('employeeName', text)}
            placeholderTextColor={formData.employeeName ? '#000' : '#aaa'}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Email"
            value={formData.emailID}
            onChangeText={text => handleInputChange('emailID', text)}
            placeholderTextColor={formData.emailID ? '#000' : '#aaa'}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Mobile"
            value={formData.mobileNo}
            onChangeText={text => handleInputChange('mobileNo', text)}
            placeholderTextColor={formData.mobileNo ? '#000' : '#aaa'}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Address"
            value={formData.address}
            onChangeText={text => handleInputChange('address', text)}
            placeholderTextColor={formData.address ? '#000' : '#aaa'}
          />

          <TouchableOpacity
            style={[
              styles.datePickerButton,
              !formData.birthDate && styles.disabledInput,
            ]}
            onPress={() => setOpenBirthDatePicker(true)}
            disabled={!formData.birthDate}>
            <Text style={styles.datePickerText}>
              {formData.birthDate || 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openBirthDatePicker}
            date={
              formData.birthDate ? new Date(formData.birthDate) : new Date()
            }
            mode="date"
            onConfirm={date => {
              setOpenBirthDatePicker(false);
              setFormData(prev => ({
                ...prev,
                birthDate: date.toISOString().split('T')[0],
              }));
            }}
            onCancel={() => setOpenBirthDatePicker(false)}
          />
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              !formData.joiningDate && styles.disabledInput,
            ]}
            onPress={() => setOpenJoiningDatePicker(true)}
            disabled={!formData.joiningDate}>
            <Text style={styles.datePickerText}>
              {formData.joiningDate || 'No joining date'}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openJoiningDatePicker}
            date={
              formData.joiningDate ? new Date(formData.joiningDate) : new Date()
            }
            mode="date"
            onConfirm={date => {
              setOpenJoiningDatePicker(false);
              setFormData(prev => ({
                ...prev,
                joiningDate: date.toISOString().split('T')[0],
              }));
            }}
            onCancel={() => setOpenJoiningDatePicker(false)}
          />
          <TextInput
            style={[styles.input, !formData.churchName && styles.disabledInput]}
            placeholder="Church"
            value={formData.churchName}
            onChangeText={text => handleInputChange('churchName', text)}
            editable={false} // Disable if field is not used
            placeholderTextColor={formData.churchName ? '#000' : '#aaa'}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            color="#007bff"
            disabled={loading}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            color="#888"
          />
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Close',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
        duration={Snackbar.DURATION_SHORT}>
        {snackbarMessage}
      </Snackbar>
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007bff',
    marginBottom: 8,
  },
  changePhotoButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    color:'#000'
  },
  disabledInput: {
    backgroundColor: '#fff', // Light gray for disabled fields
    opacity: 0.6, // Make disabled fields appear faded
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EditProfile;
