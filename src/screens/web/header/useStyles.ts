import { StyleSheet } from 'react-native';
import { useAppTheme } from '../../../../theme';


const useSyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    scrollContainer: {
      flex: 1,
    },
    parentContainer: {
      padding: 20,
    },
    headerImageBackgroundView: {
      width: '100%',
    },
    headerImage: {
      objectFit: 'cover',
      resizeMode: 'contain',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    rowLeftContainer: {
      flexDirection: 'row',
      gap: 10,
      flex: 1,
      alignItems: 'center',
    },


    rowRightContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    userGreetContainer: {
      flexDirection: 'column',
      flex: 1,
    },
    greetText: {
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    weatherText: {
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    usernameText: {
      fontSize: 15,
      color: '#ffffff',
    },
    profileImage: {
      height: 30,
      width: 30,
      borderRadius: 25,
      resizeMode: 'cover',
    },
    searchBar: {
      borderRadius: 10,
      height: 50,
    },
    searchText: {
      flex: 1,
      alignSelf: 'center',
    },
    bellIconContainer: {
      position: 'relative',
    },
    notificationText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    notificationBadge: {
      position: 'absolute',
      top: -5,
      right: -10,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 3,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: 300,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    modalMessage: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      padding: 10,
      borderRadius: 5,
      minWidth: 100,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#ccc',
    },
    confirmButton: {
      backgroundColor: '#ff5a5f',
    },
    modalButtonText: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
  });
};
export default useSyles;









