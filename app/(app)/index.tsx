import { GlassView } from '@/components/GlassView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import type { Note, SortField } from '@/types/note';
import { formatRelativeTime } from '@/utils/dateFormat';
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

  const handleDeleteNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const success = deleteNote(id);
          if (success && session) {
            loadNotes(session);
          }
        },
      },
    ]);
  };

  const toggleSortDirection = () => {
    setSortBy({
      ...sortBy,
      direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const changeSortField = (field: SortField) => {
    setSortBy({
      field,
      direction: sortBy.field === field ? sortBy.direction : 'desc',
    });
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
      <GlassView style={styles.noteCard} intensity={40} tint="dark">
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.noteImage} resizeMode="cover" />
        )}
        <View style={styles.noteContent}>
          <View style={styles.noteTextContainer}>
            <ThemedText type="defaultSemiBold" style={styles.noteTitle} numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.noteText} numberOfLines={2}>
              {item.content}
            </ThemedText>
          </View>
          <ThemedText style={styles.noteDate}>{formatRelativeTime(item.updatedAt)}</ThemedText>
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

          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy.field === 'lastUpdate' && styles.sortButtonActive]}
              onPress={() => changeSortField('lastUpdate')}
            >
              <ThemedText
                style={[
                  styles.sortButtonText,
                  sortBy.field === 'lastUpdate' && styles.sortButtonTextActive,
                ]}
              >
                Last Update
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, sortBy.field === 'title' && styles.sortButtonActive]}
              onPress={() => changeSortField('title')}
            >
              <ThemedText
                style={[
                  styles.sortButtonText,
                  sortBy.field === 'title' && styles.sortButtonTextActive,
                ]}
              >
                Title
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortDirectionButton, styles.sortButtonActive]}
              onPress={toggleSortDirection}
            >
              <Ionicons
                name={sortBy.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                size={16}
                color={Colors.dark.primary}
              />
            </TouchableOpacity>
          </View>
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
        onPress={() => router.push('/(app)/create-note')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
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
  },
  sortContainer: {
    gap: Layout.spacing.sm,
  },
  sortLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  sortButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.dark.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sortButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sortDirectionButton: {
    width: 36,
    height: 36,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
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
  noteTextContainer: {
    marginBottom: Layout.spacing.sm,
  },
  noteTitle: {
    marginBottom: 4,
    color: Colors.dark.text,
  },
  noteText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
