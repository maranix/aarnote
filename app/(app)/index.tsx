import { GlassView } from '@/components/GlassView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import type { Note } from '@/types/note';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Home() {
  const insets = useSafeAreaInsets();
  const { signOut, session } = useAuthStore();
  const { notes, loadNotes, deleteNote, sortBy, setSortBy } = useNotesStore();

  useEffect(() => {
    if (session) {
      loadNotes(session);
    }
  }, [session, loadNotes]);

  const handleDeleteNote = (noteId: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const success = deleteNote(noteId);
          if (success) {
            if (session) loadNotes(session);
          }
        },
      },
    ]);
  };

  const renderNote = ({ item, index }: { item: Note; index: number }) => (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(index * 100).springify()}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
      onPress={() => router.push({ pathname: '/(app)/note/[id]' as any, params: { id: item.id } })}
      onLongPress={() => handleDeleteNote(item.id)}
      activeOpacity={0.8}
    >
      <GlassView style={styles.noteCard} intensity={20}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.noteImage} resizeMode="cover" />
        )}
        <View style={styles.noteContent}>
          <ThemedText type="defaultSemiBold" style={styles.noteTitle} numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.noteText} numberOfLines={2}>
            {item.content}
          </ThemedText>
          <ThemedText style={styles.noteDate}>
            {new Date(item.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </ThemedText>
        </View>
      </GlassView>
    </AnimatedTouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <GlassView style={[styles.header, { paddingTop: insets.top }]} intensity={80} tint="dark">
        <View style={styles.headerTop}>
          <ThemedText type="largeTitle">My Notes</ThemedText>
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.sortContainer}>
          <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'lastUpdate' && styles.sortButtonActive]}
            onPress={() => setSortBy('lastUpdate')}
          >
            <ThemedText
              style={[
                styles.sortButtonText,
                sortBy === 'lastUpdate' && styles.sortButtonTextActive,
              ]}
            >
              Last Update
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
            onPress={() => setSortBy('title')}
          >
            <ThemedText
              style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}
            >
              Title
            </ThemedText>
          </TouchableOpacity>
        </View>
      </GlassView>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={Colors.dark.icon} />
            <ThemedText style={styles.emptyText}>No notes yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Tap the + button to create your first note
            </ThemedText>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => router.push({ pathname: '/(app)/create-note' as any })}
        activeOpacity={0.8}
      >
        <GlassView style={styles.fabGlass} intensity={60} tint="light">
          <Ionicons name="add" size={32} color={Colors.dark.text} />
        </GlassView>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  signOutButton: {
    padding: 8,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginRight: 4,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.dark.surfaceHighlight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortButtonActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    borderColor: Colors.dark.primary,
  },
  sortButtonText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: Colors.dark.primary,
  },
  listContent: {
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
    paddingBottom: 100,
  },
  noteCard: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  noteImage: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  noteContent: {
    padding: Layout.spacing.md,
  },
  noteTitle: {
    marginBottom: 4,
    color: Colors.dark.text,
  },
  noteText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 34,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabGlass: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary, // Fallback or tint
  },
});
