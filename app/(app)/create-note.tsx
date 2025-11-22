import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateNote() {
  const { session } = useAuthStore();
  const { createNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Media library permission is required to pick images');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleImageOptions = () => {
    Alert.alert('Add Image', 'Choose an option', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Gallery', onPress: handlePickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRemoveImage = () => {
    setImageUri(undefined);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Validation Error', 'Please enter some content');
      return;
    }

    if (!session) {
      Alert.alert('Error', 'You must be logged in to create a note');
      return;
    }

    try {
      createNote(session, {
        title: title.trim(),
        content: content.trim(),
        imageUri,
      });
      // Refresh notes for current user
      const { loadNotes } = useNotesStore.getState();
      loadNotes(session);
      // Navigate back to previous screen
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Note</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addImageButton} onPress={handleImageOptions}>
            <Text style={styles.addImageText}>+ Add Image</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveButton: {
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    padding: 0,
  },
  addImageButton: {
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addImageText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
  },
});
