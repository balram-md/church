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
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Button, Snackbar } from 'react-native-paper';
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
import DropdownComponent from '../../components/dropdown';
import DeviceInfo from 'react-native-device-info';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// Detect if the current mode is dark mode
const EighteenYearsAgo = new Date();
EighteenYearsAgo.setFullYear(EighteenYearsAgo.getFullYear() - 18);
const RegistrationForm = () => {
  const navigation =useNavigation();
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [postalCode,setPostalCode]=useState('');
  const [area, setArea] = useState('');
  const [churchName, setChurchName] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState();
  const [openDobModal, setOpenDobModal] = useState(false);
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
  const [registerUser,{isLoading}]=useRegisterUserMutation();

  const [errors, setErrors] = useState({
    fullName: '',
    contactNo: '',
    email: '',
    dob: '',
    stateName: '',
    postalCode:'',
    cityName: '',
    area: '',
    churchName: '',
    gender: '',
    address: '',
    imageUri: '',
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [snackBarVisibility, setSnackBarVisibility] = React.useState(false);
  const [snackMessage,setSnackMessage]=useState('')


  const onDismissSnackBar = () => setSnackMessage('');
  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.assets) {
        setImageUri(response.assets[0].uri);
        setErrors(prevErrors => ({...prevErrors, imageUri: ''}));
      }
    });
  };

  const formatDate = date => {
    return date ? date.toDateString() : 'Select Date of Birth';
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
      postalCode:''
    };

    if (!fullName) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!contactNo) {
      newErrors.contactNo = 'Contact No is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(contactNo)) {
      newErrors.contactNo = 'Contact No must be a 10-digit number';
      isValid = false;
    }

    if (!email) {
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

    if (!address) {
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
  ]);
  const handleConfirmDate = (date) => {
    
    const selectedDate = new Date(date);
    if (selectedDate > EighteenYearsAgo) {
      // If the selected date is within the last 18 years, it's invalid
      setErrors(prevErrors => ({ ...prevErrors, dob: 'You must be at least 18 years old' }));
    } else {
      setDob(selectedDate);
      setErrors(prevErrors => ({ ...prevErrors, dob: '' })); // Clear any previous errors
    }
    setOpenDobModal(false);
  };

  const handleSubmit = async() => {
    if (validate()) {

      setIsFormValid(true);
      const formData = new FormData();
      const mid = await DeviceInfo.getUniqueId();
      const mip = await DeviceInfo.getIpAddress();
      formData.append('macID',mid.toString());
      formData.append('macIP',mip.toString()),
      formData.append('mAS_CHC_FID',churchName?.value?.toString()),
      formData.append('iND_Name',fullName)
      formData.append('iND_Mob',contactNo?.toString())
      formData.append('iND_Email',email)
      formData.append('iND_Address',address)
      formData.append('iND_DOB', dob.toDateString());  // Ensure dob is a Date object
      formData.append('Gender',gender.label)
      formData.append('StateFid',stateName.value?.toString())
      formData.append('city',cityName.label),
      formData.append('area',area.label),
      formData.append('postcode',postalCode.value)
      formData.append('file', {
        uri: imageUri,
        name: `${fullName}.jpg`,
        type: 'image/jpeg'
      });
      
      
    try{
     const resp=await registerUser(formData).unwrap();
     setSnackMessage(resp?.message);
     navigation.replace("Login");
    }catch(error){
      if(error?.data?.title){
      setSnackMessage(error?.data?.title)
      }else if(error?.error){
        setSnackMessage(error?.error)
      }else if(error?.data?.message){
      setSnackMessage(error?.data?.message);
      }
    
    }

    } else {
      setIsFormValid(false);
    }
  };

  const handleChange = (setter, field) => value => {
    setter(value);
    setErrors(prevErrors => ({...prevErrors, [field]: ''}));
  };

  return (
    <View style={styles.container}>
   { isLoading&&<ActivityIndicator  style={{position:'absolute',alignSelf:'center',zIndex:999,backgroundColor:'rgba(0, 0, 135, 0.1)',width:'100%',height:'100%'}}>
      </ActivityIndicator>}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Registration Form</Text>

        <TouchableOpacity
          style={styles.imageUploadContainer}
          onPress={handleImageUpload}>
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.image} />
          ) : (
            <View style={styles.defaultImage}>
              <Icon name="camera-alt" size={30} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        {errors.imageUri ? (
          <Text style={styles.imageErrorText}>{errors.imageUri}</Text>
        ) : null}

        <TextInput 
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          value={fullName}
          onChangeText={handleChange(setFullName, 'fullName')}
        />
        {errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Contact No"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          keyboardType="phone-pad"
          value={contactNo}
          onChangeText={handleChange(setContactNo, 'contactNo')}
        />
        {errors.contactNo ? (
          <Text style={styles.errorText}>{errors.contactNo}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          keyboardType="email-address"
          value={email}
          onChangeText={handleChange(setEmail, 'email')}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setOpenDobModal(true)}>
          <View style={styles.datePickerContent}>
            <Text
              style={{...styles.datePickerText}}>
              {formatDate(dob)}
            </Text>
            <Icon
              name="keyboard-arrow-down"
              size={20}
              color={isDarkMode ? '#f0f8ff' : 'grey'}
            />
          </View>
        </TouchableOpacity>

        <DatePicker
      modal
      open={openDobModal}
      date={dob || new Date()}
      mode="date"
      onConfirm={handleConfirmDate}
      onCancel={() => {
        setOpenDobModal(false);
      }}
      maximumDate={new Date()} // Restrict future dates
      title="Select Date of Birth"
      confirmText="Confirm"
      cancelText="Cancel"
      theme={isDarkMode ? 'dark' : 'light'}
    />
        {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}

        <DropdownComponent
          search
          onChange={value => handleChange(setStateName, 'stateName')(value)}
          data={
            states
              ? states.map(item => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
          }
          value={stateName}
          style={pickerSelectStyles.inputAndroid}
          placeholder={'Select State'}
          selectedTextStyle={styles.dropdownText}
        />
        {errors.stateName ? (
          <Text style={styles.errorText}>{errors.stateName}</Text>
        ) : null}

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
          onChange={value => handleChange(setCityName, 'cityName')(value)}
          style={pickerSelectStyles.inputAndroid}
          value={cityName}
          placeholder={'Select City'}
          selectedTextStyle={styles.dropdownText}
        />
      
        {errors.cityName ? (
          <Text style={styles.errorText}>{errors.cityName}</Text>
        ) : null}
            <DropdownComponent
          search
          data={
            postalCodes
              ? postalCodes.map(item => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
          }
          onChange={value => handleChange(setPostalCode, 'postalCode')(value)}
          style={pickerSelectStyles.inputAndroid}
          value={postalCode}
          placeholder={'Select PostalCode'}
          selectedTextStyle={styles.dropdownText}
        />
        {errors.postalCode ? (
          <Text style={styles.errorText}>{errors.postalCode}</Text>
        ) : null}
        <DropdownComponent
          search
          data={
            areas
              ? areas.map(item => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
          }
          onChange={value => handleChange(setArea, 'area')(value)}
          style={pickerSelectStyles.inputAndroid}
          value={area}
          placeholder={'Select area'}
          selectedTextStyle={styles.dropdownText}
        />

        {errors.area ? (
          <Text style={styles.errorText}>{errors.area}</Text>
        ) : null}
        <DropdownComponent
          search
          data={
            churches
              ? churches.map(item => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
          }
          selectedTextStyle={styles.dropdownText}
          onChange={value => handleChange(setChurchName, 'churchName')(value)}
          style={pickerSelectStyles.inputAndroid}
          value={churchName}
          placeholder={'Select church'}
        />

        {errors.churchName ? (
          <Text style={styles.errorText}>{errors.churchName}</Text>
        ) : null}

        <DropdownComponent
          onChange={value => handleChange(setGender, 'gender')(value)}
          data={[
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Other', value: 'other'},
          ]}
          style={pickerSelectStyles.inputAndroid}
          placeholder={'Select Gender'}
          selectedTextStyle={styles.dropdownText}
          value={gender}
        />
        {errors.gender ? (
          <Text style={styles.errorText}>{errors.gender}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          multiline
          value={address}
          onChangeText={handleChange(setAddress, 'address')}
        />
        {errors.address ? (
          <Text style={styles.errorText}>{errors.address}</Text>
        ) : null}

   
       
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        {!isFormValid && (
          <Text style={{...styles.errorText,textAlign:'center'}}>
            Please fill out all required fields correctly.
          </Text>
        )}
      <Snackbar
        visible={snackMessage.length>0}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
          onPress: () => {
          setSnackMessage('');
          },
        }}>
      {snackMessage}
      </Snackbar>   
    </View>
  );
};

const isDarkMode = Appearance.getColorScheme() === 'dark';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f0f8ff',
  },
  scrollContainer: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#f0f8ff' : '#2e8b57',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    color: isDarkMode ? '#f0f8ff' : '#000',
    fontSize:14
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    borderRadius: 10,
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    marginBottom: 15,
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  datePickerText: {
    fontSize: 14,
    marginBottom: 5,
    color: isDarkMode ? '#f0f8ff' : '#000',
  },
  defaultImage: {
    width: 100,
    height: 100,
    backgroundColor: isDarkMode ? '#444' : '#ccc',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: isDarkMode ? '#3b5998' : '#4682b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '40%',
    margin: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: isDarkMode ? '#ff6b6b' : 'red',
    fontSize: 14,
    marginBottom: 15,
  },
  imageErrorText: {
    color: isDarkMode ? '#ff6b6b' : 'red',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dropdownText: {
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    color: isDarkMode ? '#f0f8ff' : '#000',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    borderRadius: 10,
    color: isDarkMode ? '#f0f8ff' : '#000',
    paddingRight: 30,
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    borderRadius: 10,
    color: isDarkMode ? '#f0f8ff' : '#000',
    paddingRight: 30,
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    marginBottom: 15,
  },
};

export default RegistrationForm;
