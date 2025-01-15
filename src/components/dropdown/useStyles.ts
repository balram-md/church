import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: 'red',
      height:53
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 12,
      backgroundColor: '#fff',
    },
    placeholderStyle: {
      color: '#999',
  },
    selectedTextStyle: {
      fontSize: 16,
      color: 'black',
    },
    inputSearchStyle: {
      color:'black'
    },
    iconStyle: {
      fontSize: 20,
      color: '#888',
    },
    itemTextStyle: {
      fontSize: 16,
      color: 'black', // Default color for item text
    },

    dropdownSelectedText: {
      fontSize: 14,
      color: '#007bff',
    },
    dropdownPlaceholderText: {
      fontSize: 14,
      color: '#aaa',
    },
  });
};
export default useStyles;
