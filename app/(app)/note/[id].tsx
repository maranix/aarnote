import { GlassView } from '@/components/GlassView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import { formatDateTime } from '@/utils/dateFormat';
import { requestCameraPermission, requestMediaLibraryPermission } from '@/utils/permissions';
import { Ionicons } from '@expo/vector-icons';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const insets = useSafeAreaInsets();

  if (!note) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <GlassView style={[styles.header, { paddingTop: insets.top }]} intensity={80} tint="dark">
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </GlassView>
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={64} color={Colors.dark.icon} />
          <ThemedText style={styles.errorText}>Note not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <GlassView style={[styles.header, { paddingTop: insets.top }]} intensity={80} tint="dark">
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {isEditing ? (
              <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
                <ThemedText style={styles.saveText}>Done</ThemedText>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={24} color={Colors.dark.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={24} color={Colors.dark.error} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </GlassView>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              editable={isEditing}
              placeholderTextColor={Colors.dark.textSecondary}
              selectionColor={Colors.dark.primary}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                {isEditing && (
                  <GlassView style={styles.removeImageButton} intensity={40}>
                    <TouchableOpacity onPress={handleRemoveImage} style={styles.removeTouchArea}>
                      <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </GlassView>
                )}
              </View>
            ) : (
              isEditing && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImageOptions}
                  activeOpacity={0.7}
                >
                  <Ionicons name="image-outline" size={24} color={Colors.dark.primary} />
                  <ThemedText style={styles.addImageText}>Add Cover Image</ThemedText>
                </TouchableOpacity>
              )
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TextInput
              style={styles.contentInput}
              placeholder="Start writing..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              editable={isEditing}
              placeholderTextColor={Colors.dark.textSecondary}
              selectionColor={Colors.dark.primary}
            />
          </Animated.View>

          {!isEditing && (
            <Animated.View entering={FadeIn.delay(400)} style={styles.metadata}>
              <ThemedText style={styles.metadataText}>
                Last updated {formatDateTime(note.updatedAt)}
              </ThemedText>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  saveText: {
    color: Colors.dark.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Layout.spacing.lg,
    padding: 0,
    fontFamily: 'System',
  },
  addImageButton: {
    height: 60,
    backgroundColor: Colors.dark.surfaceHighlight,
    borderRadius: Layout.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTouchArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentInput: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
    fontFamily: 'System',
    textAlignVertical: 'top',
  },
  metadata: {
    marginTop: Layout.spacing.xl,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    marginBottom: 40,
  },
  metadataText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.text,
    marginTop: 16,
  },
});
