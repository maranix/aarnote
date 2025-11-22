import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Request camera permission with proper error handling
 * @returns Promise<boolean> - true if permission granted
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to take photos for your notes.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return false;
    }

    return false;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    Alert.alert('Error', 'Failed to request camera permission');
    return false;
  }
};

/**
 * Request media library permission with proper error handling
 * @returns Promise<boolean> - true if permission granted
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert(
        'Photo Library Permission Required',
        'Please grant photo library access to add images to your notes.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return false;
    }

    return false;
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    Alert.alert('Error', 'Failed to request photo library permission');
    return false;
  }
};

/**
 * Check if camera permission is granted
 * @returns Promise<boolean>
 */
export const checkCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.getCameraPermissionsAsync();
  return status === 'granted';
};

/**
 * Check if media library permission is granted
 * @returns Promise<boolean>
 */
export const checkMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  return status === 'granted';
};
