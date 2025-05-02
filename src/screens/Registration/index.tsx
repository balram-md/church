import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Appearance,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Button, Snackbar, Chip } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {REACT_APP_BASE_URL, API_TOKEN} from '@env';
import {
  useGetAreaQuery,
  useGetChurchQuery,
  useGetCityQuery,
  useGetPostalCodeQuery,
  useGetStatesQuery,
  useRegisterUserMutation,
} from '../../redux/services/auth/register/registerApiSlice';
import {Dropdown} from 'react-native-element-dropdown';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Detect if the current mode is dark mode
const isDarkMode = Appearance.getColorScheme() === 'dark';

const EighteenYearsAgo = new Date();
EighteenYearsAgo.setFullYear(EighteenYearsAgo.getFullYear() - 18);

const RegistrationForm = () => {
  const navigation = useNavigation();
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [area, setArea] = useState(null);
  const [churchName, setChurchName] = useState(null);
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);
  const [openDobModal, setOpenDobModal] = useState(false);
  const [gender, setGender] = useState(null);
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);
  
  const {data: states} = useGetStatesQuery();
  const {data: cities} = useGetCityQuery({
    stateId: stateName ? stateName.value : null,
  }, { skip: !stateName });
  
  const {data: postalCodes} = useGetPostalCodeQuery({
    stateId: stateName ? stateName.value : null,
    cityName: cityName ? cityName.label : ''
  }, { skip: !stateName || !cityName });
  
  const {data: areas} = useGetAreaQuery({
    stateId: stateName ? stateName.value : null,
    cityName: cityName ? cityName.label : null,
    postCode: postalCode ? postalCode.label : null
  }, { skip: !stateName || !cityName || !postalCode });
  console.log('areas', JSON.stringify(areas));
  console.log('postalCode', JSON.stringify(postalCodes));
  const {data: churches} = useGetChurchQuery({
    stateId: stateName ? stateName.value : null,
    cityName: cityName ? cityName.label : null,
    area: area ? area.label : null,
    postCode: postalCode ? postalCode.label : null
  }, { skip: !stateName || !cityName || !postalCode || !area });
  
  const [registerUser, {isLoading}] = useRegisterUserMutation();
  console.log('area:',area);
  
  const [errors, setErrors] = useState({
    fullName: '',
    contactNo: '',
    email: '',
    dob: '',
    stateName: '',
    postalCode: '',
    cityName: '',
    area: '',
    churchName: '',
    gender: '',
    address: '',
    imageUri: '',
  });
  
  const [isFormValid, setIsFormValid] = useState(true);
  const [snackBarVisibility, setSnackBarVisibility] = React.useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const onDismissSnackBar = () => setSnackMessage('');

  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    }, response => {
      if (response.assets) {
        setImageUri(response.assets[0].uri);
        setErrors(prevErrors => ({...prevErrors, imageUri: ''}));
      }
    });
  };

  const handleConfirmDate = (date) => {
    const selectedDate = new Date(date);
    if (selectedDate > EighteenYearsAgo) {
      setErrors(prevErrors => ({ ...prevErrors, dob: 'You must be at least 18 years old' }));
    } else {
      setDob(selectedDate);
      setErrors(prevErrors => ({ ...prevErrors, dob: '' }));
    }
    setOpenDobModal(false);
  };

  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      contactNo: '',
      email: '',
      dob: '',
      stateName: '',
      cityName: '',
      area: '',
      churchName: '',
      gender: '',
      address: '',
      imageUri: '',
      postalCode: ''
    };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!contactNo.trim()) {
      newErrors.contactNo = 'Contact No is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(contactNo)) {
      newErrors.contactNo = 'Contact No must be a 10-digit number';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!dob) {
      newErrors.dob = 'Date of Birth is required';
      isValid = false;
    }

    if (!stateName) {
      newErrors.stateName = 'State is required';
      isValid = false;
    }

    if (!cityName) {
      newErrors.cityName = 'City is required';
      isValid = false;
    }

    if (!area) {
      newErrors.area = 'Area is required';
      isValid = false;
    }

    if (!churchName) {
      newErrors.churchName = 'Church is required';
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!imageUri) {
      newErrors.imageUri = 'Profile picture is required';
      isValid = false;
    }
    
    if (!postalCode) {
      newErrors.postalCode = 'Postal Code is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  }, [
    fullName,
    contactNo,
    email,
    dob,
    stateName,
    cityName,
    area,
    churchName,
    gender,
    address,
    imageUri,
    postalCode
  ]);

  const handleSubmit = async () => {
    if (validate()) {
      setIsFormValid(true);
      const formData = new FormData();
      const mid = await DeviceInfo.getUniqueId();
      const mip = await DeviceInfo.getIpAddress();
      
      formData.append('macID', mid.toString());
      formData.append('macIP', mip.toString());
      formData.append('mAS_CHC_FID', churchName?.value?.toString());
      formData.append('iND_Name', fullName);
      formData.append('iND_Mob', contactNo?.toString());
      formData.append('iND_Email', email);
      formData.append('iND_Address', address);
      formData.append('iND_DOB', dob.toDateString());
      formData.append('Gender', gender.label);
      formData.append('StateFid', stateName.value?.toString());
      formData.append('city', cityName.label);
      formData.append('area', area.label);
      formData.append('postcode', postalCode.value);
      
      if (imageUri) {
        formData.append('file', {
          uri: imageUri,
          name: `${fullName}.jpg`,
          type: 'image/jpeg'
        });
      }
      console.log('Form Data:', JSON.stringify(formData));
      try {
        const resp = await registerUser(formData).unwrap();
        setSnackMessage(resp?.message || 'Registration successful!');
        Alert.alert('Success', 'Registration successful!');
        navigation.replace("Login");
      } catch (error) {
        let errorMessage = 'Registration failed. Please try again.';
        if (error?.data?.title) {
          errorMessage = error.data.title;
        } else if (error?.error) {
          errorMessage = error.error;
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        }
        setSnackMessage(errorMessage);
      }
    } else {
      setIsFormValid(false);
      setSnackMessage('Please fill all required fields correctly');
    }
  };

  const handleChange = (setter, field) => value => {
    setter(value);
    setErrors(prevErrors => ({...prevErrors, [field]: ''}));
  };

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (!stateName) {
      setCityName(null);
      setPostalCode(null);
      setArea(null);
      setChurchName(null);
    }
  }, [stateName]);

  useEffect(() => {
    if (!cityName) {
      setPostalCode(null);
      setArea(null);
      setChurchName(null);
    }
  }, [cityName]);

  useEffect(() => {
    if (!postalCode) {
      setArea(null);
      setChurchName(null);
    }
  }, [postalCode]);

  useEffect(() => {
    if (!area) {
      setChurchName(null);
    }
  }, [area]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b5998" />
          <Text style={styles.loadingText}>Processing your registration...</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Account</Text>
          <Text style={styles.subHeaderText}>Join our community today</Text>
        </View>

        {/* Profile Picture Upload */}
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity onPress={handleImageUpload} style={styles.imageButton}>
            {imageUri ? (
              <>
                <Image source={{uri: imageUri}} style={styles.image} />
                <View style={styles.editIcon}>
                  <Icon name="edit" size={18} color="#fff" />
                </View>
              </>
            ) : (
              <View style={styles.defaultImage}>
                <Icon name="add-a-photo" size={30} color="#fff" />
                <Text style={styles.imageUploadText}>Add Profile Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.imageUri && (
            <Text style={styles.errorText}>{errors.imageUri}</Text>
          )}
        </View>

        {/* Personal Information Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="person-outline" size={20} color="#3b5998" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#777"
              value={fullName}
              onChangeText={handleChange(setFullName, 'fullName')}
            />
          </View>
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contact No"
              placeholderTextColor="#777"
              keyboardType="phone-pad"
              maxLength={10}
              value={contactNo}
              onChangeText={handleChange(setContactNo, 'contactNo')}
            />
          </View>
          {errors.contactNo && <Text style={styles.errorText}>{errors.contactNo}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={handleChange(setEmail, 'email')}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setOpenDobModal(true)}
          >
            <View style={styles.inputContainer}>
              <Icon name="event" size={20} color="#777" style={styles.inputIcon} />
              <Text style={[styles.datePickerText, !dob && { color: '#777' }]}>
                {dob ? dob.toLocaleDateString() : 'Select Date of Birth'}
              </Text>
              <Icon
                name="keyboard-arrow-down"
                size={20}
                color="#777"
                style={styles.dropdownIcon}
              />
            </View>
          </TouchableOpacity>
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
          
          <DatePicker
            modal
            open={openDobModal}
            date={dob || new Date(EighteenYearsAgo)}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={() => setOpenDobModal(false)}
            maximumDate={new Date(EighteenYearsAgo)}
            minimumDate={new Date(1900, 0, 1)}
            title="Select Date of Birth"
            confirmText="Confirm"
            cancelText="Cancel"
            theme={isDarkMode ? 'dark' : 'light'}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {[
              {label: 'Male', value: 'male', icon: 'male'},
              {label: 'Female', value: 'female', icon: 'female'},
              {label: 'Other', value: 'other', icon: 'transgender'},
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.genderButton,
                  gender?.value === item.value && styles.selectedGender,
                ]}
                onPress={() => handleChange(setGender, 'gender')(item)}
              >
                <FontAwesome
                  name={item.icon}
                  size={20}
                  color={gender?.value === item.value ? '#fff' : '#3b5998'}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender?.value === item.value && styles.selectedGenderText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        {/* Location Information Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="location-on" size={20} color="#3b5998" />
            <Text style={styles.sectionTitle}>Location Information</Text>
          </View>

          <Text style={styles.label}>State</Text>
          <Dropdown
            style={[styles.dropdown, errors.stateName && styles.errorBorder]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={states?.map(item => ({ label: item.name, value: item.id })) || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select State"
            searchPlaceholder="Search..."
            value={stateName}
            onChange={item => handleChange(setStateName, 'stateName')(item)}
            renderLeftIcon={() => (
              <Icon name="location-city" size={20} color="#777" style={styles.dropdownIcon} />
            )}
          />
          {errors.stateName && <Text style={styles.errorText}>{errors.stateName}</Text>}

          <Text style={styles.label}>City</Text>
          <Dropdown
            style={[styles.dropdown, errors.cityName && styles.errorBorder]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={cities?.map(item => ({ label: item.name, value: item.id })) || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            searchPlaceholder="Search..."
            value={cityName}
            onChange={item => handleChange(setCityName, 'cityName')(item)}
            disable={!stateName}
            renderLeftIcon={() => (
              <Icon name="location-city" size={20} color="#777" style={styles.dropdownIcon} />
            )}
          />
          {errors.cityName && <Text style={styles.errorText}>{errors.cityName}</Text>}

          <Text style={styles.label}>Postal Code</Text>
          <Dropdown
            style={[styles.dropdown, errors.postalCode && styles.errorBorder]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={postalCodes?.map(item => ({ label: item.name, value: item.id })) || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Postal Code"
            searchPlaceholder="Search..."
            value={postalCode}
            onChange={item => handleChange(setPostalCode, 'postalCode')(item)}
            disable={!cityName}
            renderLeftIcon={() => (
              <Icon name="markunread-mailbox" size={20} color="#777" style={styles.dropdownIcon} />
            )}
          />
          {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}

          <Text style={styles.label}>Area</Text>
          <Dropdown
            style={[styles.dropdown, errors.area && styles.errorBorder]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={areas?.map(item => ({ label: item.name, value: item.name })) || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Area"
            searchPlaceholder="Search..."
            value={area}
            onChange={item => handleChange(setArea, 'area')(item)}
            disable={!postalCode}
            renderLeftIcon={() => (
              <Icon name="map" size={20} color="#777" style={styles.dropdownIcon} />
            )}
          />
          {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}

          <Text style={styles.label}>Church</Text>
          <Dropdown
            style={[styles.dropdown, errors.churchName && styles.errorBorder]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={churches?.map(item => ({ label: item.name, value: item.id })) || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Church"
            searchPlaceholder="Search..."
            value={churchName}
            onChange={item => handleChange(setChurchName, 'churchName')(item)}
            disable={!area}
            renderLeftIcon={() => (
              <Icon name="church" size={20} color="#777" style={styles.dropdownIcon} />
            )}
          />
          {errors.churchName && <Text style={styles.errorText}>{errors.churchName}</Text>}

          <Text style={styles.label}>Address</Text>
          <View style={[styles.inputContainer, styles.multilineContainer, errors.address && styles.errorBorder]}>
            <Icon name="home" size={20} color="#777" style={{...styles.inputIcon, paddingVertical:12}} />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Full Address"
              placeholderTextColor="#777"
              multiline
              numberOfLines={4}
              value={address}
              onChangeText={handleChange(setAddress, 'address')}
            />
          </View>
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Register Now</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
        
        {!isFormValid && (
          <Text style={styles.formErrorText}>
            Please fill out all required fields correctly.
          </Text>
        )}
      </ScrollView>

      <Snackbar
        visible={!!snackMessage}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'OK',
          onPress: onDismissSnackBar,
          textColor: '#fff'
        }}
      >
        {snackMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    paddingHorizontal: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#2c3e50',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: isDarkMode ? '#aaa' : '#7f8c8d',
  },
  sectionContainer: {
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#2c3e50',
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: isDarkMode ? '#aaa' : '#7f8c8d',
    marginBottom: 8,
    marginTop: 12,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageButton: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3b5998',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#3b5998',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b5998',
    borderStyle: 'dashed',
  },
  imageUploadText: {
    marginTop: 10,
    color: isDarkMode ? '#aaa' : '#7f8c8d',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: isDarkMode ? '#252525' : '#f9f9f9',
  },
  multilineContainer: {
    alignItems: 'flex-start',
    minHeight: 100,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: isDarkMode ? '#fff' : '#000',
    fontSize: 16,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  datePickerButton: {
    marginBottom: 10,
  },
  datePickerText: {
    flex: 1,
    paddingVertical: 12,
    color: isDarkMode ? '#fff' : '#000',
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: isDarkMode ? '#444' : '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: isDarkMode ? '#252525' : '#f9f9f9',
  },
  errorBorder: {
    borderColor: '#ff4444',
  },
  placeholderStyle: {
    fontSize: 16,
    color: isDarkMode ? '#aaa' : '#777',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    backgroundColor: isDarkMode ? '#333' : '#fff',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b5998',
    backgroundColor: isDarkMode ? '#252525' : '#f9f9f9',
  },
  selectedGender: {
    backgroundColor: '#3b5998',
    borderColor: '#3b5998',
  },
  genderText: {
    marginLeft: 8,
    color: isDarkMode ? '#fff' : '#3b5998',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 16,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#3b5998',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
    
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 8,
  },
  formErrorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  snackbar: {
    backgroundColor: '#3b5998',
    marginBottom: 20,
  },
});

export default RegistrationForm;