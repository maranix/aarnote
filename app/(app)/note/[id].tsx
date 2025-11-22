import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const note = notes.find((n) => n.id === id);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImageUri(note.imageUri);
    }
  }, [note]);

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

    if (!id) {
      Alert.alert('Error', 'Note ID is missing');
      return;
    }

    const success = updateNote({
      id,
      title: title.trim(),
      content: content.trim(),
      imageUri,
    });

    if (success) {
      setIsEditing(false);
      Alert.alert('Success', 'Note updated successfully');
    } else {
      Alert.alert('Error', 'Failed to update note');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (id) {
            const success = deleteNote(id);
            if (success) {
              // Refresh notes for current user
              const { loadNotes } = useNotesStore.getState();
              const currentUser = useAuthStore.getState().session;
              if (currentUser) loadNotes(currentUser);
              router.back();
            } else {
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        },
      },
    ]);
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Note not found</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Note' : 'Note'}</Text>
        <View style={styles.headerActions}>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, styles.deleteButton]}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          editable={isEditing}
          placeholderTextColor="#999"
        />

        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            {isEditing && (
              <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          isEditing && (
            <TouchableOpacity style={styles.addImageButton} onPress={handleImageOptions}>
              <Text style={styles.addImageText}>+ Add Image</Text>
            </TouchableOpacity>
          )
        )}

        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          editable={isEditing}
          placeholderTextColor="#999"
        />

        {!isEditing && (
          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              Created: {new Date(note.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.metadataText}>
              Updated: {new Date(note.updatedAt).toLocaleString()}
            </Text>
          </View>
        )}
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
    paddingHorizontal: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveButton: {
    fontWeight: '600',
  },
  deleteButton: {
    color: '#FF3B30',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
  metadata: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  metadataText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
});
