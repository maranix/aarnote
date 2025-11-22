import { GlassView } from '@/components/GlassView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import { requestCameraPermission, requestMediaLibraryPermission } from '@/utils/permissions';
import { Ionicons } from '@expo/vector-icons';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateNote() {
  const insets = useSafeAreaInsets();
  const { session } = useAuthStore();
  const { createNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
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

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      createNote(session, {
        title: title.trim(),
        content: content.trim(),
        imageUri,
      });
      const { loadNotes } = useNotesStore.getState();
      loadNotes(session);
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

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
          <ThemedText type="subtitle">New Note</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton} disabled={isSaving}>
            <ThemedText style={[styles.saveText, isSaving && styles.disabledText]}>
              {isSaving ? 'Saving...' : 'Save'}
            </ThemedText>
          </TouchableOpacity>
        </GlassView>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={Colors.dark.textSecondary}
              selectionColor={Colors.dark.primary}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                <GlassView style={styles.removeImageButton} intensity={40}>
                  <TouchableOpacity onPress={handleRemoveImage} style={styles.removeTouchArea}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </GlassView>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleImageOptions}
                activeOpacity={0.7}
              >
                <Ionicons name="image-outline" size={24} color={Colors.dark.primary} />
                <ThemedText style={styles.addImageText}>Add Cover Image</ThemedText>
              </TouchableOpacity>
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
              placeholderTextColor={Colors.dark.textSecondary}
              selectionColor={Colors.dark.primary}
            />
          </Animated.View>
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
    minWidth: 60,
    padding: 4,
  },
  saveText: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  disabledText: {
    opacity: 0.5,
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
});
