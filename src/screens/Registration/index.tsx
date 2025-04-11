import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Appearance,
} from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useGetAreaQuery,
  useGetChurchQuery,
  useGetCityQuery,
  useGetPostalCodeQuery,
  useGetStatesQuery,
  useRegisterUserMutation,
} from '../../redux/services/auth/register/registerApiSlice';
import DropdownComponent from '../../components/dropdown';
import DeviceInfo from 'react-native-device-info';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Detect if the current mode is dark mode
const isDarkMode = Appearance.getColorScheme() === 'dark';
const EighteenYearsAgo = new Date();
EighteenYearsAgo.setFullYear(EighteenYearsAgo.getFullYear() - 18);

const RegistrationForm = () => {
  const navigation = useNavigation();
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [postalCode,setPostalCode]=useState('');
  const [area, setArea] = useState('');
  const [churchName, setChurchName] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState();
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const {data: states} = useGetStatesQuery();
  const {data: cities} = useGetCityQuery({
    stateId: stateName ? stateName.value : null,
  });
  const {data: postalCodes} = useGetPostalCodeQuery({
    stateId: stateName ? stateName.value : null,
    cityName:cityName?cityName.label:''
  });
  const {data: areas} = useGetAreaQuery({
    stateId: stateName ? stateName.value : null,
    cityName: cityName ? cityName.label : null,
    postCode:postalCode?postalCode.label:null
  });
  const {data: churches} = useGetChurchQuery({
    stateId: stateName ? stateName.value : null,
    cityName: cityName ? cityName.label : null,
    area:area?area.label:null,
    postCode:postalCode?postalCode.label:null
  });
  // State variables
  const [formData, setFormData] = useState({
    stateName: '',
    cityName: '',
    postalCode: '',
    area: '',
    churchName: '',
    fullName: '',
    contactNo: '',
    email: '',
    dob: null,
    gender: '',
    address: '',
    imageUri: null
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [openDobModal, setOpenDobModal] = useState(false);

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  // Handle image upload
  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.assets) {
        handleChange('imageUri', response.assets[0].uri);
      }
    });
  };

  // Format date for display
  const formatDate = date => {
    return date ? date.toLocaleDateString() : 'Select Date of Birth';
  };

  // Validate form
  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!formData.contactNo) {
      newErrors.contactNo = 'Contact No is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Contact No must be 10 digits';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
      isValid = false;
    } else if (formData.dob > EighteenYearsAgo) {
      newErrors.dob = 'You must be at least 18 years old';
      isValid = false;
    }

    if (!formData.stateName) {
      newErrors.stateName = 'State is required';
      isValid = false;
    }

    if (!formData.cityName) {
      newErrors.cityName = 'City is required';
      isValid = false;
    }

    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal Code is required';
      isValid = false;
    }

    if (!formData.area) {
      newErrors.area = 'Area is required';
      isValid = false;
    }

    if (!formData.churchName) {
      newErrors.churchName = 'Church is required';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.imageUri) {
      newErrors.imageUri = 'Profile picture is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  // Handle form submission
  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        // Your submission logic here
        // const resp = await registerUser(formData).unwrap();
        // setSnackMessage(resp?.message);
        // navigation.replace("Login");
        
        // Simulate API call
        setTimeout(() => {
          setSnackMessage('Registration successful!');
          setIsLoading(false);
          navigation.replace("Login");
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        setSnackMessage(error?.data?.title || error?.error || error?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator 
          style={styles.loader}
          size="large"
          color={isDarkMode ? '#3b5998' : '#4682b4'}
        />
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Create Your Account</Text>
          <Text style={styles.subHeaderText}>Join our community in just a few simple steps</Text>
        </View>

        {/* Profile Picture Upload */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity
            style={styles.imageUploadContainer}
            onPress={handleImageUpload}>
            {formData.imageUri ? (
              <Image source={{uri: formData.imageUri}} style={styles.image} />
            ) : (
              <View style={styles.defaultImage}>
                <Icon name="add-a-photo" size={30} color="#fff" />
                <Text style={styles.imageUploadText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.imageUri && (
            <Text style={styles.errorText}>{errors.imageUri}</Text>
          )}
        </View>

        {/* Personal Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput 
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Contact No"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            keyboardType="phone-pad"
            value={formData.contactNo}
            onChangeText={(text) => handleChange('contactNo', text)}
          />
          {errors.contactNo && (
            <Text style={styles.errorText}>{errors.contactNo}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setOpenDobModal(true)}>
            <View style={styles.datePickerContent}>
              <Text style={styles.datePickerText}>
                {formatDate(formData.dob)}
              </Text>
              <Icon
                name="calendar-today"
                size={20}
                color={isDarkMode ? '#f0f8ff' : '#666'}
              />
            </View>
          </TouchableOpacity>
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

          <DropdownComponent
            onChange={(value) => handleChange('gender', value)}
            data={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
              {label: 'Other', value: 'other'},
            ]}
            style={pickerSelectStyles.inputAndroid}
            placeholder={'Select Gender'}
            selectedTextStyle={styles.dropdownText}
            value={formData.gender}
          />
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender}</Text>
          )}
        </View>

        {/* Location Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          
          <DropdownComponent
            search
            onChange={(value) => handleChange('stateName', value)}
            data={states
              ? states.map(item => ({
                  label: item.name,
                  value: item.id,
                }))
              : []}
            value={formData.stateName}
            style={pickerSelectStyles.inputAndroid}
            placeholder={'Select State'}
            selectedTextStyle={styles.dropdownText}
          />
          {errors.stateName && (
            <Text style={styles.errorText}>{errors.stateName}</Text>
          )}

          <DropdownComponent
            search
            data={
              cities
                ? cities.map(item => ({
                    label: item.name,
                    value: item.id,
                  }))
                : []
            }
            onChange={(value) => handleChange('cityName', value)}
            style={pickerSelectStyles.inputAndroid}
            value={formData.cityName}
            placeholder={'Select City'}
            selectedTextStyle={styles.dropdownText}
          />
          {errors.cityName && (
            <Text style={styles.errorText}>{errors.cityName}</Text>
          )}

          <DropdownComponent
            search
            data={postalCodes || []}
            onChange={(value) => handleChange('postalCode', value)}
            style={pickerSelectStyles.inputAndroid}
            value={formData.postalCode}
            placeholder={'Select Postal Code'}
            selectedTextStyle={styles.dropdownText}
          />
          {errors.postalCode && (
            <Text style={styles.errorText}>{errors.postalCode}</Text>
          )}

          <DropdownComponent
            search
            data={areas || []}
            onChange={(value) => handleChange('area', value)}
            style={pickerSelectStyles.inputAndroid}
            value={formData.area}
            placeholder={'Select Area'}
            selectedTextStyle={styles.dropdownText}
          />
          {errors.area && (
            <Text style={styles.errorText}>{errors.area}</Text>
          )}

          <DropdownComponent
            search
            data={churches || []}
            selectedTextStyle={styles.dropdownText}
            onChange={(value) => handleChange('churchName', value)}
            style={pickerSelectStyles.inputAndroid}
            value={formData.churchName}
            placeholder={'Select Church'}
          />
          {errors.churchName && (
            <Text style={styles.errorText}>{errors.churchName}</Text>
          )}

          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Full Address"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isLoading}>
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Processing...' : 'Complete Registration'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <DatePicker
        modal
        open={openDobModal}
        date={formData.dob || new Date()}
        mode="date"
        onConfirm={(date) => {
          handleChange('dob', date);
          setOpenDobModal(false);
        }}
        onCancel={() => setOpenDobModal(false)}
        maximumDate={new Date()}
        title="Select Date of Birth"
        confirmText="Confirm"
        cancelText="Cancel"
        theme={isDarkMode ? 'dark' : 'light'}
      />

      <Snackbar
        visible={!!snackMessage}
        onDismiss={() => setSnackMessage('')}
        action={{
          label: 'OK',
          onPress: () => setSnackMessage(''),
        }}
        style={styles.snackbar}
        duration={3000}>
        {snackMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f9ff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#f0f8ff' : '#2e8b57',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 14,
    color: isDarkMode ? '#aaa' : '#666',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: isDarkMode ? '#000' : '#ddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#f0f8ff' : '#2e8b57',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: isDarkMode ? '#252525' : '#fff',
    color: isDarkMode ? '#f0f8ff' : '#000',
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#252525' : '#fff',
    marginBottom: 8,
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  datePickerText: {
    fontSize: 15,
    color: isDarkMode ? '#f0f8ff' : '#000',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  defaultImage: {
    width: 120,
    height: 120,
    backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDarkMode ? '#444' : '#ccc',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: isDarkMode ? '#3b5998' : '#4682b4',
  },
  imageUploadText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: isDarkMode ? '#3b5998' : '#4682b4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  dropdownText: {
    backgroundColor: isDarkMode ? '#252525' : '#fff',
    color: isDarkMode ? '#f0f8ff' : '#000',
  },
  snackbar: {
    backgroundColor: isDarkMode ? '#333' : '#555',
    marginBottom: 20,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 8,
    color: isDarkMode ? '#f0f8ff' : '#000',
    paddingRight: 30,
    backgroundColor: isDarkMode ? '#252525' : '#fff',
    marginBottom: 8,
  },
  inputAndroid: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 8,
    color: isDarkMode ? '#f0f8ff' : '#000',
    paddingRight: 30,
    backgroundColor: isDarkMode ? '#252525' : '#fff',
    marginBottom: 8,
  },
};

export default RegistrationForm;